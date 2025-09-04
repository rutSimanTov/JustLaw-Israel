import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Meeting {
  title: string;
  start_time: string;
  end_time: string;
  zoom_join_url: string;
  zoom_password: string;
  description: string;
}
interface EventsContextType {
    allEvents: Meeting[];
    setAllEvents: React.Dispatch<React.SetStateAction<Meeting[]>>;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export const EventsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [allEvents, setAllEvents] = useState<Meeting[]>([]);
    return (
        <EventsContext.Provider value={{ allEvents, setAllEvents }}>
            {children}
        </EventsContext.Provider>
    );
};

export const useEvents = (): EventsContextType => {
    const context = useContext(EventsContext);
    if (!context) {
        throw new Error("useEvents must be used within an EventsProvider");
    }
    return context;
};