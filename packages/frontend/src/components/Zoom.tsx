// // import axios from 'axios';
// // import { useEffect, useState } from 'react';
// // import { Button } from '../tempSH/button';
// // import { useEvents, Meeting } from '../contexts/EventContext';
// // import { FaDoorOpen, FaRocket } from 'react-icons/fa';
// // import PinkCircle from './Circle'; // ודא שהנתיב נכון
// // function MeetingComponent() {
// //   const allEvents: Meeting[] = useEvents().allEvents;
// //   const [currentIndex, setCurrentIndex] = useState<number>(0);
// //   const [currentMeeting, setCurrentMeeting] = useState<Meeting>(allEvents[currentIndex]);
// //   const [isButtonEnabled, setButtonEnabled] = useState<boolean>(false);
// // const FaDoorOpenIcon = FaDoorOpen as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
// // const FaRocketIcon = FaRocket as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
// //   const getNextMeeting = () => {
// //     setCurrentIndex((prevIndex) => prevIndex + 1);
// //     setCurrentMeeting(allEvents[currentIndex + 1]);
// //   }
// //   useEffect(() => {
// //     const checkMeetingTime = () => {
// //       const now = new Date();
// //       const startTime = new Date(currentMeeting?.start_time);
// //       const oneHourBefore = new Date(startTime.getTime() - 60 * 60 * 1000);
// //       setButtonEnabled(now >= oneHourBefore);
// //     };
// //     checkMeetingTime();
// //     const interval = setInterval(checkMeetingTime, 60000);
// //     return () => clearInterval(interval);
// //   }, [currentMeeting?.start_time]);
// //   const hasMeeting = currentMeeting && Object.values(currentMeeting).some((value) => value !== null && value !== '');
// //   return (
// //     <div style={styles.container}>
// //       <div style={styles.headerContainer}>
// //         <div style={{ ...styles.headerContainer, border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
// //           <h1 style={{ ...styles.title, display: 'flex', alignItems: 'center',fontFamily:'class="text-3xl font-bold text-primary mb-4"' }}>
// //             <PinkCircle />
// //             JustLaw Global Jusricetech Accelerator
// //           </h1>
// //         </div>
// //         <h3 style={styles.subtitle}>Empowering the next generation of Jusricetech innovators through mentorship,collaboration, </h3>
// //         <h3 style={styles.subtitle}>and cutting-edge resources. </h3>
// //         <div style={{ ...styles.headerContainer, border: 'none', display: 'flex', justifyContent: 'center' }}>
// //           <Button
// //             variant="ghost"
// //             className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full"
// //             onClick={getNextMeeting}
// //             style={{ border: 'none', borderRadius: '20px', width: '50%', display: 'flex', justifyContent: 'center',fontFamily:'class="text-3xl font-bold text-primary mb-4'}} // רוחב חצי
// //           >
// //             <FaRocketIcon style={{ marginRight: '8px' }} /> {/* אייקון חללית */}
// //             Apply to the Next Cohort</Button>
// //         </div>
// //       </div>
// //       {hasMeeting ? (
// //         <div style={styles.card}>
// //           <h2 style={styles.meetingHeader}> Next Meeting</h2>
// //         {currentMeeting?.title && <p style={{margin: '5px 0'}}><strong>Title:</strong> {currentMeeting.title}</p>}
// //         {currentMeeting?.start_time && <p style={{margin: '10px 0'}}><strong>:stopwatch: Start:</strong> {formatDate(currentMeeting?.start_time)}</p>}
// //         {currentMeeting?.end_time && <p style={{margin: '10px 0'}}><strong>:stopwatch: End:</strong> {formatDate(currentMeeting.end_time)}</p>}
// //         {currentMeeting?.description && <p style={{margin: '5px 0'}}><strong>Description:</strong> {currentMeeting.description}</p>}
// //           {currentMeeting?.zoom_join_url && (
// //             <div style={{ ...styles.headerContainer, border: 'none', display: 'flex', justifyContent: 'center' }}>
// //               <Button
// //                 className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full"
// //                 onClick={() => window.open(currentMeeting.zoom_join_url, '_blank')}
// //                 variant="ghost"
// //                 disabled={!isButtonEnabled}
// //                 style={{ border: 'none', borderRadius: '20px', width: '50%', display: 'flex', justifyContent: 'center' }} // רוחב חצי
// //               >
// //                 <FaDoorOpenIcon style={{ color: 'white' }} /> Enter Live Meeting
// //               </Button>
// //             </div>
// //           )}
// //         </div>
// //       ) : (
// //         <div style={styles.card}>
// //           <h2 style={styles.meetingHeader}>you have no more meeting for today</h2>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
// // // Date formatting function
// // function formatDate(dateStr: string): string {
// //   const date = new Date(dateStr);
// //   return date.toLocaleString('en-US', {
// //     weekday: 'short',
// //     day: '2-digit',
// //     month: '2-digit',
// //     hour: '2-digit',
// //     minute: '2-digit',
// //   });
// // }
// // // Styles
// // const styles: { [key: string]: React.CSSProperties } = {
// //   container: {
// //     padding: '2rem',
// //     // fontFamily: "text-muted-foreground mb-6", // הגדרת הפונט כאן
// //     direction: 'ltr',
// //     textAlign: 'left',
// //     color: '#FFFFFF',
// //     // backgroundColor: '#003366',
// //     height: '100vh',
// //     display: 'flex',
// //     flexDirection: 'column',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //   },
// //   headerContainer: {
// //     width: '90%',
// //     margin: '20px auto',
// //     textAlign: 'left',
// //     // backgroundColor: '#003366',
// //     padding: '20px',
// //     borderRadius: '8px',
// //     border: '2px solid hsl(var(--primary))', // הוספת מסגרת וורודה
// //   },
// //   card: {
// //     // backgroundColor: '#003366',
// //     color: '#FFFFFF',
// //     border: '2px solid hsl(var(--primary))', // הוספת מסגרת וורודה
// //     borderRadius: '8px',
// //     width: '90%',
// //     margin: '20px auto',
// //     padding: '1.5rem',
// //     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
// //     textAlign: 'center',
// //   },
// //   title:
// //   {
// //     color: 'hsl(var(--primary))',
// //     fontSize: '2rem',
// //     textAlign: 'center',
// //   },
// //   subtitle: {
// //     fontFamily:'class="text-3xl font-bold text-primary mb-4',
// //     color: '#FFFFFF',
// //     fontSize: '1.5rem',
// //     textAlign: 'center',
// //   },
// //   meetingHeader: {
// //         fontFamily:'class="text-3xl font-bold text-primary mb-4',
// //     // fontFamily:"text-2xl font-bold mb-4",
// //     marginBottom: '1rem',
// //     color: 'hsl(var(--primary))',
// //   },
// //   wideButton: {
// //         fontFamily:'class="text-3xl font-bold text-primary mb-4',
// //     width: '100%', // Full width for the button
// //   },
// //   meetingContent:
// //   {
// //     textAlign: 'center', // מרכז את הטקסט בדיב
// //         fontFamily:'class="text-3xl font-bold text-primary mb-4',
// // },
// //  meetingText: {
// //       fontFamily:'class="text-3xl font-bold text-primary mb-4',
// //     display: 'block', // שורות נפרדות
// //     margin: '0', // הוספת רווח אפס כדי לשמור על יישור אחיד
// //     padding: '5px 0', // הוספת רווח בין השורות
// //     whiteSpace: 'nowrap', // מונע שבר שורות
// // }
// // };
// // export default MeetingComponent;

// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { Button } from '../tempSH/button';
// import { useEvents, Meeting } from '../contexts/EventContext';
// import { FaDoorOpen, FaRocket } from 'react-icons/fa';
// import PinkCircle from './Circle'; // Ensure the path is correct
// import { Link } from 'react-router-dom'; // Import Link for navigation
// import { useNavigate } from 'react-router-dom';
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';

// function MeetingComponent() {
//   const allEvents: Meeting[] = useEvents().allEvents;
//   const [currentIndex, setCurrentIndex] = useState<number>(0);
//   const [currentMeeting, setCurrentMeeting] = useState<Meeting>(allEvents[currentIndex]);
//   const [isButtonEnabled, setButtonEnabled] = useState<boolean>(false);
//   const FaDoorOpenIcon = FaDoorOpen as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
//   const FaRocketIcon = FaRocket as unknown as React.FC<React.SVGProps<SVGSVGElement>>;

//   const getNextMeeting = () => {
//     setCurrentIndex((prevIndex) => prevIndex + 1);
//     setCurrentMeeting(allEvents[currentIndex + 1]);
//   }
// const navigate = useNavigate();


//   useEffect(() => {
//     const checkMeetingTime = () => {
//       const now = new Date();
//       const startTime = new Date(currentMeeting?.start_time);
//       const oneHourBefore = new Date(startTime.getTime() - 60 * 60 * 1000);
//       setButtonEnabled(now >= oneHourBefore);
//     };
//     checkMeetingTime();
//     const interval = setInterval(checkMeetingTime, 60000);
//     return () => clearInterval(interval);
//   }, [currentMeeting?.start_time]);

//   const hasMeeting = currentMeeting && Object.values(currentMeeting).some((value) => value !== null && value !== '');

//   return (
//     <div style={styles.container}>
//       <TooltipProvider>
//          <Tooltip>
//           <TooltipTrigger asChild>
//              <Button
// variant="ghost"
//  onClick={() => navigate('/accelerator')} // כאן אתה משתמש ב-navigate
//  className="mb-6 px-2"
// >
// <svg
//  xmlns="http://www.w3.org/2000/svg"
// width="40"
//  height="40"
// fill="none"
// viewBox="0 0 24 24"
//  stroke="currentColor"
// strokeWidth={2.5}
// className="text-white"
// >
// <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" />
// <path strokeLinecap="round" strokeLinejoin="round" d="M11 18l-6-6 6-6" />
// </svg>
//  </Button>
//  </TooltipTrigger>
//  <TooltipContent
// side="bottom"
//  sideOffset={6}
//  className="px-3 py-1 rounded bg-white/10 text-white text-sm border border-white/20 backdrop-blur-sm shadow-md"
// >
//  Back to Accelerator
// </TooltipContent>
// </Tooltip>
// </TooltipProvider>
//       <div style={styles.headerContainer}>
//         <div style={{ ...styles.headerContainer, border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//           <h1 style={{ ...styles.title, display: 'flex', alignItems: 'center', fontFamily: 'class="text-3xl font-bold text-primary mb-4"' }}>
//             <PinkCircle />
//             JustLaw Global Jusricetech Accelerator
//           </h1>
//         </div>
//         <h3 style={styles.subtitle}>Empowering the next generation of Jusricetech innovators through mentorship, collaboration,</h3>
//         <h3 style={styles.subtitle}>and cutting-edge resources.</h3>

//         <div style={{ ...styles.headerContainer, border: 'none', display: 'flex', justifyContent: 'center' }}>
//           <Button
//             variant="ghost"
//             className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full"
//             onClick={getNextMeeting}
//             style={{ border: 'none', borderRadius: '20px', width: '50%', display: 'flex', justifyContent: 'center', fontFamily: 'class="text-3xl font-bold text-primary mb-4"' }}
//           >
//             <FaRocketIcon style={{ marginRight: '8px' }} /> {/* Icon */}
//             Apply to the Next Cohort
//           </Button>
//         </div>

//         {/* Back to Accelerator button
//         <div style={{ display: 'flex', justifyContent: 'flex-start', width: '90%', margin: '20px auto' }}>
//           <Link to="/accelerator">
//             <Button
//               variant="ghost"
//               className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-4"
//               style={{ border: 'none', borderRadius: '20px', width: 'auto' }} // Adjusted width for a smaller button
//             >
//               Back to Accelerator
//             </Button>
//           </Link>
//         </div> */}
//       </div>

//       {hasMeeting ? (
//         <div style={styles.card}>
//           <h2 style={styles.meetingHeader}>Next Meeting</h2>
//           {currentMeeting?.title && <p style={{ margin: '5px 0' }}><strong>Title:</strong> {currentMeeting.title}</p>}
//           {currentMeeting?.start_time && <p style={{ margin: '10px 0' }}><strong>:stopwatch: Start:</strong> {formatDate(currentMeeting?.start_time)}</p>}
//           {currentMeeting?.end_time && <p style={{ margin: '10px 0' }}><strong>:stopwatch: End:</strong> {formatDate(currentMeeting.end_time)}</p>}
//           {currentMeeting?.description && <p style={{ margin: '5px 0' }}><strong>Description:</strong> {currentMeeting.description}</p>}
//           {currentMeeting?.zoom_join_url && (
//             <div style={{ ...styles.headerContainer, border: 'none', display: 'flex', justifyContent: 'center' }}>
//               <Button
//                 className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full"
//                 onClick={() => window.open(currentMeeting.zoom_join_url, '_blank')}
//                 variant="ghost"
//                 disabled={!isButtonEnabled}
//                 style={{ border: 'none', borderRadius: '20px', width: '50%', display: 'flex', justifyContent: 'center' }}
//               >
//                 <FaDoorOpenIcon style={{ color: 'white' }} /> Enter Live Meeting
//               </Button>
//             </div>
//           )}
//         </div>
//       ) : (
//         <div style={styles.card}>
//           <h2 style={styles.meetingHeader}>You have no more meetings for today</h2>
//         </div>
//       )}
//     </div>
//   );
// }

// // Date formatting function
// function formatDate(dateStr: string): string {
//   const date = new Date(dateStr);
//   return date.toLocaleString('en-US', {
//     weekday: 'short',
//     day: '2-digit',
//     month: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//   });
// }

// // Styles
// const styles: { [key: string]: React.CSSProperties } = {
//   container: {
//     padding: '2rem',
//     direction: 'ltr',
//     textAlign: 'left',
//     color: '#FFFFFF',
//     height: '100vh',
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   headerContainer: {
//     width: '90%',
//     margin: '20px auto',
//     textAlign: 'left',
//     padding: '20px',
//     borderRadius: '8px',
//     border: '2px solid hsl(var(--primary))',
//   },
//   card: {
//     color: '#FFFFFF',
//     border: '2px solid hsl(var(--primary))',
//     borderRadius: '8px',
//     width: '90%',
//     margin: '20px auto',
//     padding: '1.5rem',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
//     textAlign: 'center',
//   },
//   title: {
//     color: 'hsl(var(--primary))',
//     fontSize: '2rem',
//     textAlign: 'center',
//   },
//   subtitle: {
//     fontFamily: 'class="text-3xl font-bold text-primary mb-4"',
//     color: '#FFFFFF',
//     fontSize: '1.5rem',
//     textAlign: 'center',
//   },
//   meetingHeader: {
//     fontFamily: 'class="text-3xl font-bold text-primary mb-4"',
//     marginBottom: '1rem',
//     color: 'hsl(var(--primary))',
//   },
// };

// export default MeetingComponent;

import { useCallback, useEffect, useState } from 'react';
import { Button } from '../tempSH/button';
import { useEvents, Meeting } from '../contexts/EventContext';
import { FaDoorOpen, FaRocket } from 'react-icons/fa';
import PinkCircle from './Circle'; // Ensure the path is correct
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';

function MeetingComponent() {
  const allEvents: Meeting[] = useEvents().allEvents;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(allEvents[currentIndex]);
  const [isButtonEnabled, setButtonEnabled] = useState<boolean>(false);
  const FaDoorOpenIcon = FaDoorOpen as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
  const FaRocketIcon = FaRocket as unknown as React.FC<React.SVGProps<SVGSVGElement>>;
  const navigate = useNavigate();

  const getNextMeeting = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      if (nextIndex < allEvents.length) {
        setCurrentMeeting(allEvents[nextIndex]);
        return nextIndex;
      }
      setCurrentMeeting(null); // No more meetings
      return prevIndex; // לא מעדכן אם אין עוד פגישות
    });
  };

 const checkEndMeetingTime = useCallback(() => {
    if (!currentMeeting || !allEvents || allEvents.length === 0 || currentIndex === allEvents.length) {
      setCurrentMeeting(null); // No more meetings
      return; // No current meeting to check
    }
    const now = new Date();
    const endTime = new Date(currentMeeting?.start_time);
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
    };
}, [allEvents, currentIndex,currentMeeting]);

  useEffect(() => {
      window.scrollTo(0, 0);

    const checkMeetingState = () => {
      const now = new Date();

      // בדיקה עבור הכפתור – האם שעה לפני תחילת פגישה
      if (!currentMeeting?.start_time) {
        setButtonEnabled(false);
      } else {
        const startTime = new Date(currentMeeting.start_time);
        const oneHourBefore = new Date(startTime.getTime() - 60 * 60 * 1000);
        setButtonEnabled(now >= oneHourBefore);
      }

      // בדיקה אם הפגישה הסתיימה לפי end_time
      const endTimeStr = currentMeeting?.end_time;
      if (endTimeStr && !isNaN(Date.parse(endTimeStr))) {
        const endTime = new Date(endTimeStr);
        if (now > endTime) {
          checkEndMeetingTime();
        }
      }

      // הפעלה בכל מקרה – כמו שהיה במקור
      checkEndMeetingTime();
    };

    checkMeetingState(); // הפעלה מיידית
    const interval = setInterval(checkMeetingState, 60000); // כל דקה

    return () => clearInterval(interval); // ניקוי
  }, [currentMeeting,checkEndMeetingTime]);

  const hasMeeting = currentMeeting && Object.values(currentMeeting).some((value) => value !== null && value !== '');

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              onClick={() => navigate('/accelerator')} // Navigate to accelerator
              className="mb-6 px-2"
              style={{ position: 'absolute', left: '20px' }} // Adjusted position
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                className="text-white"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 18l-6-6 6-6" />
              </svg>
            </Button>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            sideOffset={6}
            className="px-3 py-1 rounded bg-white/10 text-white text-sm border border-white/20 backdrop-blur-sm shadow-md"
          >
            Back to Accelerator
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div style={styles.container}>

        <div style={styles.headerContainer}>
          <div style={{ ...styles.headerContainer, border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{ ...styles.title, display: 'flex', alignItems: 'center', fontFamily: 'class="text-3xl font-bold text-primary mb-4"' }}>
              <PinkCircle />
              JustLaw Global Jusricetech Accelerator
            </h1>
          </div>
          <h3 style={styles.subtitle}>Empowering the next generation of Jusricetech innovators through mentorship, collaboration,</h3>
          <h3 style={styles.subtitle}>and cutting-edge resources.</h3>

          <div style={{ ...styles.headerContainer, border: 'none', display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="ghost"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full"
              onClick={getNextMeeting}
              style={{ border: 'none', borderRadius: '20px', width: '50%', display: 'flex', justifyContent: 'center', fontFamily: 'class="text-3xl font-bold text-primary mb-4"' }}
            >
              <FaRocketIcon style={{ marginRight: '8px' }} /> {/* Icon */}
              Apply to the Next Event
            </Button>
          </div>
        </div>

        {hasMeeting ? (
          <div style={styles.card}>
            {/* <h2 style={styles.meetingHeader}>Next Meeting</h2> */}
            {currentMeeting?.title && <p style={{ margin: '5px 0' }}><strong>Title:</strong> {currentMeeting.title}</p>}
            {currentMeeting?.start_time && <p style={{ margin: '10px 0' }}><strong> Start:</strong> {formatDate(currentMeeting?.start_time)}</p>}
            {currentMeeting?.end_time && <p style={{ margin: '10px 0' }}><strong> End:</strong> {formatDate(currentMeeting.end_time)}</p>}
            {currentMeeting?.description && <p style={{ margin: '5px 0' }}><strong>Description:</strong> {currentMeeting.description}</p>}
            {currentMeeting?.zoom_join_url && (
              <div style={{ ...styles.headerContainer, border: 'none', display: 'flex', justifyContent: 'center' }}>
                <Button
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8 w-full"
                  onClick={() => window.open(currentMeeting.zoom_join_url, '_blank')}
                  variant="ghost"
                  disabled={!isButtonEnabled}
                  style={{ border: 'none', borderRadius: '20px', width: '50%', display: 'flex', justifyContent: 'center' }}
                >
                  <FaDoorOpenIcon style={{ color: 'white' }} /> Enter Live Meeting
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div style={styles.card}>
            <h2 style={styles.meetingHeader}>You have no more meetings</h2>
          </div>
        )}
      </div>
    </>
  );
}

// Date formatting function
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '2rem',
    direction: 'ltr',
    textAlign: 'left',
    color: '#FFFFFF',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    width: '70%', // Adjusted to make it narrower
    margin: '20px auto',
    textAlign: 'left',
    padding: '10px', // Reduced padding to make it shorter
    borderRadius: '8px',
    border: '2px solid hsl(var(--primary))',
  },
  card: {
    color: '#FFFFFF',
    border: '2px solid hsl(var(--primary))',
    borderRadius: '8px',
    width: '70%', // Adjusted to make it narrower
    margin: '20px auto',
    padding: '1rem', // Reduced padding to make it shorter
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
  },
  title: {
    color: 'hsl(var(--primary))',
    fontSize: '2rem',
    textAlign: 'center',
  },
  subtitle: {
    color: '#FFFFFF',
    fontSize: '1.5rem',
    textAlign: 'center',
  },
  meetingHeader: {
    marginBottom: '1rem',
    color: 'hsl(var(--primary))',
  },
};
export default MeetingComponent;