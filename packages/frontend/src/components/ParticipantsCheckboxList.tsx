import React, { useEffect, useState } from 'react';
import { useEventsRegisteredByEvent } from '../hooks/useEvents';
import {Participant} from '../hooks/useUsers'

type Props = {
  participants: Participant[];
  cohortId: string;
  eventId:string;
  value?: string[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const ParticipantsCheckboxList: React.FC<Props> = ({ participants, cohortId,eventId, value = [], onChange }) => {
  const { data: registered, loading: loadingRegistered, error: errorRegistered } = useEventsRegisteredByEvent(eventId);
  const [participantsIds, setParticipantsIds] = useState<string[]>([]);

  useEffect(() => {
    if (registered) {
      setParticipantsIds(registered.map(application => application.userId));
    }
  }, [registered]);

  useEffect(() => {
    // when cohortId changes, the hook automatically updated
  }, [eventId]);

  return (
    <>
    <label>*Select Participants:</label>
    <div style={userCheckboxList}>
        {loadingRegistered&&<p>loading...</p>}
        {errorRegistered&&<p>error: {errorRegistered}</p>}
       {participants &&registered&& participants.map(participant => (
        <label key={participant.user_id} style={userCheckbox}>
          <input
            type="checkbox"
            value={participant.user_id}
            checked={value.includes(participant.user_id)}
            disabled={participantsIds.includes(participant.user_id)}
            onChange={onChange}
          />
          <span style={userCheckbox}>{participant.name}</span>
        </label>
     ))}
    </div>
    </>
  );
};
const userCheckboxList: React.CSSProperties = {
  maxHeight: '250px',
  overflowY: 'auto',
  border: 'solid',
  borderRadius: '15px',
  borderWidth: '1px',
  borderColor: '#ff338f', 
  padding: '10px',
  backgroundColor: 'rgb(15 44 77)', 
  marginTop: '10px',
  marginBottom: '10px'
};

const userCheckbox: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  marginBottom: '8px',
  cursor: 'pointer',
  color: 'white', 
};

