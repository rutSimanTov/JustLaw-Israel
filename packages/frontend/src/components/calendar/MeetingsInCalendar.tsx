import React, { useCallback, useEffect, useRef, useState } from 'react';
import './Calendar.css';
import { CohortEvent } from '@base-project/shared/src/models/CohortEvent';

interface EventMap {
    [date: string]: number; // index signature for events by date
}

interface CalendarProps {
    onDateSelect?: (date: Date | { start: Date; end: Date }) => void;
    events: CohortEvent[] | null
}

const Calendar: React.FC<CalendarProps> = ({ onDateSelect, events }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [eventsByDate, setEventsByDate] = useState<EventMap>({});
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const calendarRef = useRef<HTMLDivElement | null>(null);

    const monthName = currentDate.toLocaleString("en-US", { month: "long", year: "numeric" });


    // const fetchEventsForMonth = async () => {
    //     // alert("s " + JSON.stringify(events));
    //     try {
    //         const mockEvents: any[] = [];//= events; // ['🐏', '🐏', '🐏', '🐏']// generateMockEvents(startDate, endDate);
    //         const eventsMap: EventMap = {};


    //         events?.forEach((e) => {
    //             const startTIme = new Date(e.startTime);
    //             if (!isNaN(startTIme.getTime())) {
    //                 const date = e.startTime.toISOString().split("T")[0];
    //                 mockEvents.push({
    //                     id: Math.floor(Math.random() * 1000),
    //                     date_start: date
    //                 })
    //             }

    //         })


    //         mockEvents.forEach((event) => {
    //             const date = event.date_start.split("T")[0];
    //             eventsMap[date] = (eventsMap[date] || 0) + 1;
    //         });

    //         setEventsByDate(eventsMap);
    //     } catch (error) {
    //         console.error("Error fetching events:", error);
    //     }
    // };

    // const fetchEventsForMonth1 = async () => {
    //     try {
    //         // debugger
    //         const myEvents: { id: number, date_start: string }[] = [];
    //         const eventsMap: EventMap = {};
    //         events?.forEach((event) => {
    //             // debugger
    //             const startTime = new Date(event.startTime);
    //             const date = startTime.toISOString();//.split("T")[0];
    //             myEvents.push({
    //                 id: Math.floor(Math.random() * 1000),
    //                 date_start: date
    //             })
    //         });

    //         myEvents.forEach((m) => {
    //             const date = m.date_start.split("T")[0];
    //             eventsMap[date] = (eventsMap[date] || 0) + 1;
    //         });
    //         setEventsByDate(eventsMap);
    //     } catch (error) {
    //         console.error("Error fetching events:", error);
    //     }
    // }

    const fetchEventsForMonth1 = useCallback(async () => {
    try {
        const myEvents: { id: number, date_start: string }[] = [];
        const eventsMap: EventMap = {};
        events?.forEach((event) => {
            const startTime = new Date(event.startTime);
            const date = startTime.toISOString();
            myEvents.push({
                id: Math.floor(Math.random() * 1000),
                date_start: date
            });
        });

        myEvents.forEach((m) => {
            const date = m.date_start.split("T")[0];
            eventsMap[date] = (eventsMap[date] || 0) + 1;
        });
        setEventsByDate(eventsMap);
    } catch (error) {
        console.error("Error fetching events:", error);
    }
}, [events]);

useEffect(() => {
    if (events != null && events.length > 0) {
        fetchEventsForMonth1();
    }
}, [events, fetchEventsForMonth1]);


    // const generateMockEvents = (startDate: Date, endDate: Date) => {
    //     const events: { id: number; date_start: string }[] = [];
    //     const days = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

    //     for (let i = 0; i <= days; i++) {
    //         const date = new Date(startDate);
    //         date.setDate(date.getDate() + i);

    //         if (Math.random() > 0.7) {
    //             const count = Math.floor(Math.random() * 3) + 1;
    //             for (let j = 0; j < count; j++) {
    //                 events.push({
    //                     id: Math.floor(Math.random() * 1000),
    //                     date_start: date.toISOString()
    //                 });
    //             }
    //         }
    //     }

    //     return events;
    // };

    // const handleMousehMove = (day: number, isOtherMonth: boolean, monthOffset: number) => {
    //     if (isOtherMonth) {
    //         // setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1));
    //         return;
    //     }

    //     const movedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

    //     if (selectedDate instanceof Date && movedDate.getTime() === selectedDate.getTime()) {
    //         return;
    //     }

    //     setSelectedDate(movedDate);
    //     if (selectedDate != null && onDateSelect) {
    //         onDateSelect(selectedDate);
    //     }
    // }

    // const handleMouseLeave = (day: number, isOtherMonth: boolean, monthOffset: number) => {

    // }

    const handleDateClick = (day: number, isOtherMonth: boolean, monthOffset: number) => {
        // alert(JSON.stringify(events));
        if (isOtherMonth) {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1));
            return;
        }

        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

        // if (selectedDate instanceof Date && clickedDate.getTime() === selectedDate.getTime()) {
        //     return;
        // }

        // if (selectionMode === "single") {
        setSelectedDate(clickedDate);
        // setRangeStart(clickedDate);
        // setSelectionMode("range");
        // } else {
        // if (rangeStart && clickedDate.getTime() === rangeStart.getTime()) {
        //     setSelectionMode("single");
        //     setRangeStart(null);
        //     setSelectedDate(clickedDate);
        //     return;
        // }

        // if (rangeStart) {
        //     let newRange;

        //     if (clickedDate.getTime() < rangeStart.getTime()) {
        //         newRange = { start: clickedDate, end: rangeStart };
        //     } else {
        //         newRange = { start: rangeStart, end: clickedDate };
        //     }
        //     setSelectedDate(newRange);
        // }

        // setSelectionMode("single");
        // setRangeStart(null);
        // }

        // Call onDateSelect only if selectedDate is not null
        if (clickedDate !== null && onDateSelect) {
            onDateSelect(clickedDate);
        }
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isDateSelected = (date: Date) => {
        if (!selectedDate) return false;

        if (selectedDate instanceof Date) {
            return date.getTime() === selectedDate.getTime();
        } else {
            return isDateInRange(date, selectedDate);
        }
    };

    const isDateInRange = (date: Date, range: { start: Date; end: Date }) => {
        if (!range) return false;
        const dateTime = date.getTime();
        const startTime = range.start.getTime();
        const endTime = range.end.getTime();
        return dateTime >= startTime && dateTime <= endTime;
    };

    const renderDays = () => {
        const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const grid = [];
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const adjustedFirstDay = firstDayOfMonth; // No adjustment needed to start week on Sunday
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const lastDayOfPrevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

        // Add headers for days of the week
        daysOfWeek.forEach(day => {
            grid.push(<div className="calendar-day-header" key={day}>{day}</div>);
        });

        // Previous month's days
        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
            const prevMonthDay = lastDayOfPrevMonth - i;
            grid.push(createDayElement(prevMonthDay, true, -1));
        }

        // Current month's days
        for (let day = 1; day <= daysInMonth; day++) {
            grid.push(createDayElement(day));
        }

        // Next month's days
        const totalDaysShown = adjustedFirstDay + daysInMonth;
        const remainingCells = (totalDaysShown <= 35 ? 35 : 42) - totalDaysShown;

        for (let i = 1; i <= remainingCells; i++) {
            grid.push(createDayElement(i, true, 1));
        }

        return grid;
    };


    const createDayElement = (day: number, isOtherMonth = false, monthOffset = 0) => {
        // debugger
        let date;
        if (isOtherMonth) {
            date = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, day);
        } else {
            date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        }

        // const dateString = date.toISOString().split("T")[0];
        const dateString = date.toLocaleDateString("sv-SE");
        const eventCount = eventsByDate[dateString] || 0;

        return (
            <div
                key={dateString}
                className={`calendar-day ${isOtherMonth ? 'other-month' : ''} ${isToday(date) ? 'today' : ''} ${isDateSelected(date) ? 'selected' : ''}`}
                onClick={() => handleDateClick(day, isOtherMonth, monthOffset)}
            // onMouseMove={() => handleMousehMove(day, isOtherMonth, monthOffset)}
            // onMouseLeave={() => handleMouseLeave(day, isOtherMonth, monthOffset)}
            >
                <span className="day-number">{day}</span>
                {eventCount > 0 && (
                    <div className="event-indicators">
                        {Array(Math.min(eventCount, 3)).fill(<span className="event-dot" />)}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="calendar-container" ref={calendarRef}>
            <div className="calendar-header">
                <div className="calendar-title">{monthName}</div>
                <div className="calendar-nav">
                    <button className="calendar-nav-button prev-month" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
                        <i className="fa fa-chevron-left" >‹</i>
                    </button>
                    <button className="calendar-nav-button next-month" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
                        <i className="fa fa-chevron-right">›</i>
                    </button>
                </div>
            </div>
            <div className="calendar-grid">
                {renderDays()}
            </div>
        </div>
    );
};

export default Calendar;