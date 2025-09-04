import React, { useEffect, useState } from 'react';
import './EventModal.css';
import {usePastEvents} from '../../hooks/useEvents';
import { CohortEvent } from '@base-project/shared/src';
import EventDetails from './EventDetails';
import {Button} from '../../components/UI/Button/button'
import {X } from "lucide-react"; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/UI/tooltip";


interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const EventModal: React.FC<EventModalProps> = ({  isOpen, onClose }) => {
    const [cohort_events, setEvents] = useState<CohortEvent[]|null>([]);
    const {events,cohort, loading, error}=usePastEvents();
    useEffect(() => {
        if (isOpen&&events&&cohort) {
            setEvents(events);
        }
    }, [isOpen,events,cohort]);

    if (!isOpen) return null;

    return (
        <>
        {error&&<p>error: {error}</p>}
        {!loading&&
                    <>
        <div className="modal-overlay">
            <div className="modal-content">

                <TooltipProvider>
                    <div className='close-button' >
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={onClose}
                                >
                                    <X className="w-5 h-5 text-white" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent
                                side="bottom"
                                sideOffset={6}
                                className="px-3 py-1 rounded bg-white/10 text-white text-sm border border-white/20 backdrop-blur-sm shadow-md"
                            >
                                close
                            </TooltipContent>
                        </Tooltip>
                    </div>
                </TooltipProvider>

                
                <div className='cohort-content'>
                    <h2 >Recent Events From The Last Month For Cohort:</h2>
                    <p>{cohort?.name}</p>
                    <p>About: {cohort?.description}</p>
                </div>

                <ul>
                    {cohort_events?(cohort_events.map(event => (
                        <li key={event.id}>
                            <EventDetails event={event} />
                        </li>
                    ))):(
                        <p className='cohort-content'>This Cohort Didn't Have Events In The Last Month</p>
                    )}
                </ul>
               
            </div> 
            
        </div>
         </>}</>
    );
};

export default EventModal;

