import {useCallback, useEffect, useState} from "react";
import Calendar from "./calendar/MeetingsInCalendar";
import EventModal from "./EventModal";
import { EventRegistration } from "@base-project/shared/src/models/EventRegistration";
import { CohortEvent } from "@base-project/shared/src/models/CohortEvent";
import axios from "axios";
import { Button } from "./UI/Button/button";
import { useNavigate } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./UI/tooltip";
import { AlertTriangle, ArrowLeft, CalendarX } from "lucide-react";


const LoadingDots: React.FC = () => (
    <div className="flex justify-center items-center gap-3 py-10">
        {[0, 1, 2].map((i) => (
            <span key={i} className="dot" style={{ animationDelay: `${i * 0.3}s` }} />
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
const NoEventsMessage: React.FC = () => (
    <div className="flex flex-col items-center justify-center gap-4 py-16 bg-white/5 rounded-lg shadow-inner border border-white/10">
        <CalendarX className="w-12 h-12 text-gray-400 mb-2" />
        <span className="text-lg text-gray-300 font-semibold">
            You don't have any events for the next month
        </span>
        <span className="text-sm text-gray-400">
            Check back soon or explore other opportunities!
        </span>
    </div>
);
export const MyAccelarator = () => {
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    // const [date, setDate] = useState<Date>(new Date());
    // const [registrations, setRegistrations] = useState<EventRegistration[] | null>(null);
    const [events, setEvents] = useState<CohortEvent[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isOpenCalendar, setOpenCalendar] = useState<boolean>(false);
    const [event, setEvent] = useState<CohortEvent[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [noEvents, setNoEvents] = useState<boolean>(false);
    const navigate = useNavigate();
    const openModal = () => setModalOpen(true);
    const closeModal = (updatedEvents: CohortEvent[]) => {
        setModalOpen(false);
        setEvent(null);
        setEvents(updatedEvents)
    };
    const fetchRegistrations = async () => {
        setLoading(true);
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`http://localhost:3001/api/eventsregistration/getbyuserid/${userId}`);
            // setRegistrations(response.data);
            return response.data;
        } catch (err) {
            setError('Failed to fetch the events. Please try again later.');
            // alert('Error: ' + err);
            console.log('Error: ' + err);
        } finally {
            setLoading(false);
        }
    }
    // const fetchMeetings = async () => {
    //     try {
    //         const registrations = await fetchRegistrations();
    //         if (registrations) {
    //             const promises = registrations.map(async (event: EventRegistration) => {
    //                 const eventId = event.eventId;
    //                 // if (events) {
    //                 const response = await axios.get(`http://localhost:3001/api/cohortevent/getbyid/${eventId}`);
    //                 return response.data;
    //                 // }
    //             });
    //             //         setData(data => [...(data || []), ...results.filter(d => d != null)]);
    //             const results = await Promise.all(promises);
    //             // setEvents(data => [...(data || []), ...results.filter(d => d != null)]);
    //             setEvents(results.filter(d => d != null));
    //         }
    //     } catch (error) {
    //         setError('Failed to fetch the events. Please try again later.');
    //         console.log("Error:" + error);
    //     }
    // }
    const fetchMeetings = useCallback(async () => {
        try {
            const registrations = await fetchRegistrations();
            if (registrations) {
                const promises = registrations.map(async (event: EventRegistration) => {
                    const eventId = event.eventId;
                    const response = await axios.get(`http://localhost:3001/api/cohortevent/getbyid/${eventId}`);
                    return response.data;
                });
                const results = await Promise.all(promises);
                const filtered = results.filter(d => d != null);
                setEvents(filtered);
                setNoEvents(filtered.length === 0);
            }
        } catch (error) {
            setError('Failed to fetch the events. Please try again later.');
            console.log("Error:" + error);
        }
    }, []);
    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {

            return;
        }

        // if (events == null) {
            fetchMeetings();
            setOpenCalendar(true);
        // }

    }, [fetchMeetings, isModalOpen])
    
    const goBack = () => {
        navigate('/accelerator');
    }
    const onDateSelect = (date: Date | { start: Date, end: Date }) => {
        // alert("Selected date:" + date); // Handle the selected date here
        // if (date instanceof Date || date == null)
        //     setDate(date);
        let c: number = 0;
        setEvent(null);
        debugger
        if (events)
            for (let i = 0; i < events?.length; i++) {
                // const eventStartTIme = events.at(i)?.startTime;
                const newDate = new Date(events[i].startTime)
                // alert(JSON.stringify(events[i]))
                if (date instanceof Date &&
                    date.getDate() === newDate.getDate() &&
                    date.getMonth() === newDate.getMonth() &&
                    date.getFullYear() === newDate.getFullYear()) {
                    c++;
                    setEvent(event => event ? [...event, events[i]] : [events[i]]);
                }
                if (c === 0) {
                    setEvent(null);
                }
            }
        openModal();
    }
    if (error) return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 bg-white/5 rounded-lg shadow-inner border border-white/10">
            <AlertTriangle className="w-12 h-12 text-red-400 mb-2" />
            <span className="text-lg text-red-400 font-semibold">
                An error occurred
            </span>
            <span className="text-sm text-red-300">
                {error}
            </span>
        </div>
    ) //<div>Error: {error}</div>
    if (loading) return <LoadingDots></LoadingDots>
    return <>
        <div className="container mx-auto max-w-4xl">
            <TooltipProvider>
                <div>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant={"outline"}
                                size={"sm"}
                                onClick={() => goBack()}
                            >
                                <ArrowLeft className="w-5 h-5 text-white" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent
                            side={"bottom"}
                            sideOffset={6}
                            className="px-3 py-1 rounded bg-white/10 text-white text-sm border border-white/20 backdrop-blur-sm shadow-md"
                        >
                            Back to accelerator
                        </TooltipContent>
                    </Tooltip>
                </div>
            </TooltipProvider>
            {isOpenCalendar && !noEvents ? (
                <div>
                    <div className="text-center mb-16">
                        <p className="text-xl text-muted-foreground">
                            Meetings schedule for the next 30 days
                        </p>
                    </div>
                    <Calendar onDateSelect={onDateSelect} events={events} />
                </div>) : (
                <div>
                    <NoEventsMessage />
                </div>
            )}
            {event != null &&
                <EventModal isOpen={isModalOpen} onClose={closeModal} content={event} />
            }
        </div>
    </>
}


// export default MyAccelarator;