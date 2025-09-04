import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Meeting, useEvents } from '../contexts/EventContext';
import { FaPlayCircle, FaVideo, FaCalendarAlt } from 'react-icons/fa';
import EventModal from '../features/event/EventModal';
import AcceleratorOptions from '../pages/accelerator'
import { logErrorToServer } from '../logFront/logger';
import LoginToCalenderPage from '../features/auth/LoginToCalenderPage';
import {useUserRoleByEmail} from '../hooks/useUsers'
import { useCohorts } from '../hooks/useCohort';
import { Cohort } from '@base-project/shared';
export function isEventUpcoming(startTime: string): boolean {
    const now = new Date(); // עכשיו, לפי הדפדפן
    const eventStart = new Date(startTime); // זמן התחלת האירוע

    return now <= eventStart; // true אם האירוע עוד לא התחיל
}
function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('he-IL', {
        timeZone: 'Asia/Jerusalem',
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
}

const LoadingDots: React.FC = () => {
  return (
    <div className="flex justify-center items-center gap-3 py-10">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="dot"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
      <style>{`
        .dot {
          width: 12px;
          height: 12px;
          background-color: white;
          border-radius: 50%;
          transform: scale(1);
          animation: pulseScale 1.2s infinite ease-in-out;
        }
        @keyframes pulseScale {
          0%, 100% {
            transform: scale(0.8);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.8);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export const Accelerator: React.FC<{}> = () => {
    let userEmail=localStorage.getItem("userEmail");
    const {role, loading,error}=useUserRoleByEmail(userEmail!);
    const [isModalOpen, setModalOpen] = useState(false);
    const { allEvents, setAllEvents } = useEvents();
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(allEvents[currentIndex] || null);
    const token = localStorage.getItem('jwtToken');
    const FaPlayCircleIcon = FaPlayCircle as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
    const FaCalendarAltIcon = FaCalendarAlt as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
    const FaVideotIcon = FaVideo as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
    const [allcohort, setAllcohort ] = useState<Cohort[]>([]);
    const { data: cohorts, loading: loadCohorts, error: errorCohorts } = useCohorts();
    const [generalAccessToken, setGeneralAccessToken] = useState(localStorage.getItem('googleCalendarAccessToken'));

const getNextMeetings = useCallback(() => {
    axios.post('http://localhost:3001/api/zoom/All', {}, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => {
        const events: Meeting[] = response.data.data;

        // סינון רק אירועים שעוד לא התחילו
        const upcomingEvents = events.filter(e => isEventUpcoming(e.start_time));

        setAllEvents(upcomingEvents);
        if (upcomingEvents.length > 0) {
            setCurrentIndex(0);
            setCurrentMeeting(upcomingEvents[0]);
        }
        else{
            setCurrentMeeting(null);
        }
    })
    .catch((error) => {
        logErrorToServer('trying connect to server', 'ERROR', error.message, 'error fetching the meeting');
    });
}, [token,setAllEvents]);


    const checkEndMeetingTime = useCallback(() => {
    if (!currentMeeting || !allEvents || allEvents.length === 0) {
        setCurrentMeeting(null);
        return; // No current meeting to check
    }
    
    const now = new Date();
    const endTime = new Date(currentMeeting.end_time);
    
    if (endTime < now) {
        setCurrentIndex((prevIndex) => {
            const nextIndex = prevIndex + 1;
            if (nextIndex < allEvents.length) {
                setCurrentMeeting(allEvents[nextIndex]);
                return nextIndex;
            }
            setCurrentMeeting(null); // No more meetings
            return prevIndex; // לא מעדכן אם אין עוד פגישות
        });
    }
}, [currentMeeting, allEvents]);

    useEffect(() => {

        const interval = setInterval(() => {

            checkEndMeetingTime();
        }
            , 60000);
        return () => clearInterval(interval);
    }, [currentMeeting,checkEndMeetingTime,getNextMeetings]); // ← הופך את הקוד לדינמי ומעודכן

useEffect(() => {
    if (!loading && role === 'admin') {
        const token = localStorage.getItem('googleCalendarAccessToken');
        const expiry = localStorage.getItem('googleCalendarAccessTokenExpiry');
        const now = Date.now();

        if (!token || !expiry || now > parseInt(expiry)) {
            // אין טוקן בכלל או שהוא פג תוקף
            setGeneralAccessToken(null);
        } else {
            setGeneralAccessToken(token);
        }
    } else {
        setGeneralAccessToken(null); // אם לא מנהל, נוודא שהטוקן לא מוגדר
    }
}, [role, loading]); // הוספת loading כדי לוודא שהכל נטען לפני הבדיקה



    useEffect(() => {
        
    }, [userEmail]);

    useEffect(() => {
        window.scrollTo(0, 0);

        getNextMeetings(); 
        cohorts ? setAllcohort(cohorts.slice(0, 5)) : setAllcohort([]);
    }, [getNextMeetings,cohorts]);

    return (
        <>
        {(loading||error||loadCohorts||errorCohorts)?(<LoadingDots />):
        (<>{(role==='admin'&&generalAccessToken==null) && 
        (
                            <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        background: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                    }}
                >
                    <LoginToCalenderPage onLogin={setGeneralAccessToken}/>
         </div>

        )}
        
        <AcceleratorOptions/>
        <div style={containerStyle}>
            <div style={cardStyle}>
                {currentMeeting ? (
                    <>
                        <h1 style={headerStyle}><strong style={boldLabel}>Current Cohort:</strong> {currentMeeting?.title}</h1>

                        <p><strong style={boldLabel}>Focus:</strong>  {currentMeeting.title}</p>
                        <p><strong style={boldLabel}>Next Meeting:</strong> {formatDate(currentMeeting?.start_time)}</p>
                        <p><strong style={boldLabel}>Topic:</strong> {currentMeeting.description}</p>
                        <Link to="/zoom" state={{ allEvents }}>
                            <button style={buttonStyle}>
                                <FaVideotIcon style={iconStyle} />
                                Join Live Meeting (Via Zoom API)
                            </button>
                        </Link>
                        <p style={{
                            color: '#ccc',
                            fontSize: '14px',
                            marginTop: '10px',
                            textAlign: 'center', // מרכז את הטקסט
                        }}>
                            Requires Zoom account and API integration for full functionality.
                        </p>
                    </>
                ) : (
                    <h3 style={{ color: 'white' }}>No upcoming meetings found.</h3>
                )}
            </div>
            <div style={cardStyle}>     
                <h1 style={headerStyle}>Upcoming & Past Cohorts</h1>
                {allcohort ? allcohort.map((cohort: any, index: number) => (
                    <div key={index}>
                        <p style={paragraphStyle}>
                            <strong>{cohort.name}</strong>: {cohort.description}
                            <strong>
                                {cohort.isActive ? `(View Recordings)` : `(Inactive)`}
                            </strong>
                        </p>
                    </div>
                )) : (
                    <p style={{ color: 'white' }}>No cohorts available.</p>
                )
                }
                <Link to="/meetings-calendar">
                    <button style={buttonStyle}>
                        <FaCalendarAltIcon style={iconStyle} />
                        View Cohort Schedule
                    </button>
                </Link>
                <button style={buttonStyle} onClick={() => setModalOpen(true)}>
                    <FaPlayCircleIcon style={iconStyle} />
                    Access Past Recordings
                </button>
            </div>

            {isModalOpen && (
                <EventModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
            )}
        </div>
        </>)}
        </>
    );
};
export default Accelerator;
//
// :art: עיצוב inline
//
const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'stretch', // שומר על גובה שווה לשני הדיבים
    gap: '40px',
    margin: '40px',
    padding: '40px',
    borderRadius: '16px',
    flexWrap: 'wrap',
    // ביטול הרקע הכחול:
    // backgroundColor: '#0A2342',
};
const cardStyle: React.CSSProperties = {
    // backgroundColor: '#081C36',
    color: '#FFFFFF',
    border: '2px solid hsl(var(--primary))',

    borderRadius: '12px',
    padding: '30px',
    width: '650px',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
};
const buttonStyle: React.CSSProperties = {
    backgroundColor: 'hsl(var(--primary))',

    color: '#fff',
    border: 'none',
    padding: '14px 20px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    marginTop: '20px',
    cursor: 'pointer',
};
const headerStyle: React.CSSProperties = {
    color: '#fff',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
};
const paragraphStyle: React.CSSProperties = {
    color: '#eee',
    marginBottom: '10px',
    fontSize: '16px',
};
const iconStyle: React.CSSProperties = {
    color: 'white',
    fontSize: '18px',
};
const boldLabel: React.CSSProperties = {
    color: '#fff',
    fontWeight: 'bold',
};
