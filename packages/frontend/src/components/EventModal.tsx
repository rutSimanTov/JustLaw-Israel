import { CohortEvent } from "@base-project/shared/src/models/CohortEvent";
import { PencilLine, Trash2 } from "lucide-react";
import {Button} from "./UI/Button/button";
import UpdateEventForm from './UpdateEventForm'
import {useDeleteEvent} from '../hooks/useEvents'
import {useUserRoleByEmail} from '../hooks/useUsers'
import {Tooltip,TooltipContent, TooltipProvider, TooltipTrigger,} from "../components/UI/tooltip";
import {X } from "lucide-react"; 
import React, { useCallback, useEffect, useState } from "react";
import '../features/event/EventModal.css'

interface ModalProps {
    isOpen: boolean,
    onClose: (updatedEvents:CohortEvent[]) => void,
    content: CohortEvent[]
}



const EventModal: React.FC<ModalProps> = ({ isOpen, onClose, content }) => {

    const [events, setEvents] = useState<CohortEvent[]>(content);
    const [selectedEventEdit, setSelectedEventEdit]=useState<string|null>(null);
    const [selectedEventDelete, setSelectedEventDelete]=useState<string|null>(null);
    const [confirmedEventDelete,setConfirmedEventDelete]=useState<string|null>(null)
    const {data, loading,error}=useDeleteEvent(confirmedEventDelete!);
    const userEmail=localStorage.getItem("userEmail");
    const {role, loading:loadingRole,error:errorRole}=useUserRoleByEmail(userEmail!);
    const cardContainerStyle: React.CSSProperties = {
        display: 'flex',
        flexDirection: 'column', // Stack elements vertically
        gap: '16px', // Space between cards
        width: '100%', // Full width of the modal
    };

    const cardStyle: React.CSSProperties = {
        padding: '16px', // Inner padding
        transition: 'transform 0.2s', // Smooth scale effect on hover
        margin: '10px 0',
        backgroundColor: 'rgb(15 44 77)',
        color: '#f9f9f9',
        border: '1px solid #ff338f',
        borderRadius: '15px',
        // textAlign:'center'
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '1.5em', // Larger title font
        marginBottom: '8px', // Space below title
    };

    const descriptionStyle: React.CSSProperties = {
        marginBottom: '16px', // Space below description
        fontSize: '1em', // Standard font size
    };

    const linkStyle: React.CSSProperties = {
        display: 'inline-block', // Ensure link takes up only as much space as needed
        backgroundColor: '#ff338f', //'#007bff', // Button background color
        color: '#fff', // Button text color
        padding: '10px 15px', // Button padding
        borderRadius: '5px', // Rounded button corners
        textDecoration: 'none', // Remove underline
    };

    const h5Style: React.CSSProperties = {
        fontSize: '1.25em', // Font size for h5
        color: '#6c757d', // Muted foreground color
        marginBottom: '16px', // Space below h5
    };

    const handleEventUpdate = (updatedEvent: CohortEvent) => {
    setEvents(prevEvents => 
      prevEvents.map(event => (event.id === updatedEvent.id ? updatedEvent : event))
    );
    };

    const executeDelete = useCallback(async () => {
        if (!confirmedEventDelete) return;
        if (data) {
            setEvents(events.filter(event => event.id !== selectedEventDelete));
            setSelectedEventDelete(null);
            setConfirmedEventDelete(null);
        } else {
            alert('Deletion failed.');
        }
    }, [confirmedEventDelete, data, selectedEventDelete, events]);


    useEffect(()=>{

    },[confirmedEventDelete]) 

    useEffect(() => {
        if (data) {
            executeDelete();
        }
    }, [data, selectedEventDelete, events, executeDelete]);

    useEffect(()=>{

    },[loading,error])

    useEffect(() => {
        
    }, [userEmail]);

    if (!isOpen) return null;
    return (
        <div className="modal-overlay">
            {selectedEventDelete && (
                            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                                <div className="bg-card border border-white/20 rounded-lg p-6 shadow-lg max-w-md w-full text-white space-y-4">
                                    <h2 className="text-xl font-bold">Delete Article</h2>
                                    <p>
                                        Are you sure you want to delete the event?
                                        <br />
                                        {/* <span className="font-semibold text-primary">"{deleteCandidate.title}"</span> */}
                                    </p>
                                    <div className="flex justify-end gap-3 mt-4">
                                        <Button variant="outline" onClick={() => setSelectedEventDelete(null)}>Cancel</Button>
                                        <Button variant="destructive" onClick={()=>{setConfirmedEventDelete(selectedEventDelete);}}>Delete</Button>
                                    </div>
                                    {loading&&<p>deleting event...</p>}
                                    {error&&<p>{error}</p>}
                                </div>
                            </div>
                        )}
            <div className="modal-content">
                <TooltipProvider>
                    <div className='close-button'>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={()=>{onClose(events)}}
                                >
                                    <X className="w-5 h-5 text-white"/>
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

                <div style={cardContainerStyle}>
                    <>
                        {events.length === 1 ?
                            <h5 style={h5Style} className="text-xl text-muted-foreground mt-10">You have one meeting today:</h5> :
                            <h5 style={h5Style} className="text-xl text-muted-foreground mt-10">You have several meetings today:</h5>
                        }

                        {data&&<p>event deleted successfully</p>}
                        {events.map((e, i) => (
                            <div key={i} style={cardStyle}>
                                <h3 style={titleStyle}>{e.title}</h3>
                                <p style={descriptionStyle}>{e.description}</p>
                                <p style={descriptionStyle}><svg fill="none" stroke="black" viewBox="0 0 24 24"
                                    stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="w-8 h-8">
                                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg> {new Date(e.startTime).toLocaleString().split(",")[1]} - {new Date(e.endTime).toLocaleString().split(",")[1]}</p>
                                <p><a target="_blank" rel="noopener noreferrer" style={linkStyle} href={e.zoomJoinUrl}>Join meeting now</a></p>
                                              <div className="flex gap-2">
                            {(!loadingRole&&!errorRole&&role==='admin')&&
                            <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={()=>{setSelectedEventEdit(e.id)}}
                                >
                                    <PencilLine className="w-5 h-5 text-white" />
                                </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" sideOffset={6} className="px-3 py-1 rounded bg-white/10 text-white text-sm border border-white/20 backdrop-blur-sm shadow-md">
                                Edit
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={()=>{setSelectedEventDelete(e.id)}}
                                >
                                    <Trash2 className="w-5 h-5 text-white" />
                                </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" sideOffset={6} className="px-3 py-1 rounded bg-white/10 text-white text-sm border border-white/20 backdrop-blur-sm shadow-md">
                                Delete
                                </TooltipContent>
                            </Tooltip>
                            </TooltipProvider>}
                        </div>
                                        </div>
                        ))}
                        {selectedEventEdit&&
                        <div
                        className="modal-overlay">
                        <UpdateEventForm eventId={selectedEventEdit} onClose={()=>{setSelectedEventEdit(null)}} onUpdate={handleEventUpdate}></UpdateEventForm></div> }
                    </>
                </div>
            </div>
        </div>
    );
};

export default EventModal;