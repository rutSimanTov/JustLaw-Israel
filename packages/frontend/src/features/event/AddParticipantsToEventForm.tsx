// AddParticipantsToEventForm.tsx
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useApplicationsDetailsByCohort } from '../../hooks/useUsers';
import { useAddParticipantsToEvent } from '../../hooks/useEvents';
import { useAddGoogleParticipants } from '../../hooks/useParticipants';
import { ParticipantsCheckboxList } from '../../components/ParticipantsCheckboxList';
import { Button } from '../../components/UI/Button/button';
import { useNavigate } from 'react-router-dom';

type FormValues = { userIds: string[], eventId: string };
type Props = {
  cohortId: string;
  eventId: string;
  googleEventId: string;
  googleEventLink: string;
};

export const AddParticipantsToEventForm: React.FC<Props> = ({ cohortId, eventId,googleEventId,googleEventLink }) => {
  const { data: participants, loading, error } = useApplicationsDetailsByCohort(cohortId);
  const { addParticipants: addToDb, isLoading, error: dbError, data: doneDb } = useAddParticipantsToEvent(eventId);
  const { addParticipants: addToGoogle, loading: gLoading, error: gError, done: doneGoogle } = useAddGoogleParticipants(googleEventId);
  const {  handleSubmit, watch, reset, setValue } = useForm<FormValues>({
    defaultValues: { userIds: [], eventId },
  });

  const selectedIds = watch('userIds');

const navigate = useNavigate();

useEffect(() => {
  if (doneDb && doneGoogle) {
    // פותחים את הקישור בכרטיסייה חדשה (טאב חדש)
    window.open(googleEventLink, '_blank');

    // ואז מפנים את הטאב הנוכחי ל /accelerator
    navigate('/accelerator');

    // איפוס טופס
    reset();
  }
}, [doneDb, doneGoogle, reset, googleEventLink, navigate]);

  useEffect(() => {
    setValue('userIds', []);
  }, [setValue]);

  const onSubmit = async (vals: FormValues) => {
    await addToDb(vals.eventId, vals.userIds);
    const selectedUsers = participants?.filter(p => vals.userIds.includes(p.user_id));
    const attendees = selectedUsers?.map(p => ({ email: p.email })) || [];
    if (attendees.length > 0) {
      await addToGoogle(attendees);
    }

  };

  const onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const currentIds = watch('userIds');
    const updatedIds = checked
      ? [...currentIds, value]
      : currentIds.filter(id => id !== value);
    setValue('userIds', updatedIds);
  };

  if (loading) return <p>Loading users…</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 480, margin: '2rem auto' }}>
      <h2>Add participants to Cohort</h2>

      {participants &&
        <ParticipantsCheckboxList
          participants={participants}
          eventId={eventId}
          cohortId={cohortId}
          value={selectedIds}
          onChange={onCheckboxChange}
        />}

      <Button
        variant="default"
        size="default"
        type="submit"
        disabled={loading || selectedIds.length === 0 || !cohortId || isLoading || gLoading}
        className="bg-primary hover:bg-primary/90 text-white w-full py-3 rounded-lg mt-3"
      >
        {(isLoading || gLoading) ? 'Adding…' : 'Add Selected'}
      </Button>

      {dbError && <p style={{ color: '#c00' }}>DB Error: {dbError}</p>}
      {gError && <p style={{ color: '#c00' }}>Google Calendar Error: {gError}</p>}
      {(doneDb && doneGoogle) && <p style={{ color: '#080' }}>Participants added successfully to the cohort and Google Calendar!</p>}
    </form>
  );
};
