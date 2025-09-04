// src/components/AddGoogleEventForm.tsx
import React, { useState,useEffect } from 'react';
import Select from 'react-select';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAddGoogleEvent } from '../../hooks/useAddGoogleEvent';
import { AddParticipantsToEventForm } from '../event/AddParticipantsToEventForm';
import { useCohorts } from '../../hooks/useCohort';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// Define the shape of the form data
type FormData = {
  summary: string;
  description: string;
  start: string;
  end: string;
  cohortId: string;
};

const AddGoogleEventForm = () => {
  const navigate = useNavigate();
  // Fetch list of cohorts
  const { data: cohorts } = useCohorts();

  // Initialize form management
  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    defaultValues: {
      summary: '',
      description: '',
      start: '',
      end: '',
      cohortId: '',
    },
  });
  
  const startDate = watch('start');
  const getNowDateTimeLocal = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    return now.toISOString().slice(0, 16);
  };
  const now = getNowDateTimeLocal();
console.log('now: ',now);
  useEffect(() => {
  const endDate = watch('end');
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    setValue('end', '');
  }
}, [startDate,setValue,watch]);  // State to store event details after creation

  const [eventInfo, setEventInfo] = useState<{
    eventId: string;
    cohortId: string;
    googleEventId: string;
    googleEventLink: string;
  } | null>(null);

  // Hook to handle adding a Google Calendar event
  const { addEvent, loading, message, error } = useAddGoogleEvent();

  // Convert cohorts into select options with custom display
  const options =
    cohorts?.map(cohort => ({
      value: cohort.id,
      label: (
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span>{cohort.name}</span>
          {!cohort.isActive && (
            <span style={{ color: 'red', display: 'flex', alignItems: 'center', gap: 4 }}>
              archived <DeleteIcon fontSize="small" />
            </span>
          )}
        </div>
      ),
      isDisabled: !cohort.isActive,
    })) || [];

  // Watch the selected cohort ID from the form
  const selectedCohortId = watch('cohortId');

  // Handle form submission
  const onSubmit = async (data: FormData) => {

    // Pass both form and cohortId explicitly
    const result = await addEvent(data, data.cohortId);

    // Save the event info to show participant form
    if (result?.eventId && result?.cohortId && result?.googleEventId) {
      setEventInfo({
        eventId: result.eventId,
        cohortId: result.cohortId,
        googleEventId: result.googleEventId,
        googleEventLink: result.googleEventLink
      });
    }
  };

  return (<>
        <div className="text-center mt-3 sm:mt-4">
          <button
            type="button"
            onClick={() => navigate('/accelerator')}
            className="border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 sm:h-10 px-4 py-2 w-full rounded-md text-muted-foreground transition-colors duration-200"
          >
            Back to accelerator
          </button>
        </div>


    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 flex items-center justify-center">
              <img
                src="/company_logo.png"
                alt="JustLaw Logo"
                className="w-full h-full object-contain brightness-0 invert"
              />
            </div>
            <span className="text-xl font-bold text-primary">JustLaw</span>
          </div>
          <h2 className="text-3xl font-bold text-primary">Add Meeting to Calendar</h2>
          <p className="mt-2 text-muted-foreground">Add a new meeting to your Google Calendar</p>
        </div>

        {/* Form Section */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Summary input */}
          <input
            id="summary"
            {...register('summary', { required: true })}
            type="text"
            placeholder="Work meeting"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground"
          />

          {/* Description textarea */}
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            placeholder="Meeting description"
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground resize-none"
          />

          {/* Start date-time */}
          <input
            id="start"
            {...register('start', { required: true })}
            type="datetime-local"
            min={now}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground"
          />

          {/* End date-time */}
          <input
            id="end"
            {...register('end', { required: true })}
            type="datetime-local"
            min={startDate}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground"
          />

          {/* Cohort select field */}
          <Select
            inputId="cohortId"
            options={options}
            value={options.find(o => o.value === selectedCohortId) || null}
            onChange={selectedOption => setValue('cohortId', selectedOption?.value || '')}
            styles={{
              control: provided => ({
                ...provided,
                display: 'flex',
                borderColor: '#ccc',
                '&:hover': {
                  borderColor: '#888',
                },
              }),
              singleValue: provided => ({
                ...provided,
                color: 'rgb(15 44 77)',
              }),
              option: (provided, state) => ({
                ...provided,
                display: 'flex',
                justifyContent: 'space-between',
                backgroundColor: state.isFocused ? '#E0E0E0' : '#fff',
                color: '#333',
                '&:active': {
                  backgroundColor: '#C0C0C0',
                },
              }),
            }}
          />

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading || !watch('summary') || !watch('start') || !watch('end') || !watch('cohortId')}
            className={`w-full h-10 px-4 py-3 rounded-md font-medium text-white transition-colors duration-200
              ${!watch('summary') || !watch('start') || !watch('end') || !watch('cohortId') ? 'bg-gray-300 cursor-not-allowed' : loading ? 'bg-gray-400 cursor-wait' : 'bg-primary hover:bg-primary/90'}`}
          >
            {loading ? 'Submitting...' : 'Add to Calendar'}
          </button>
        </form>

        {/* Display success or error message */}
        {message && <div className="text-center text-green-600 font-bold">✅ {message}</div>}
        {error && <div className="text-center text-red-600 font-bold">❌ {error}</div>}

      {eventInfo && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.4)', 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#0f2c4d',
              padding: '2rem',
              borderRadius: '1rem',
              maxWidth: '600px',
              width: '90%',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
          >
            <AddParticipantsToEventForm
              cohortId={eventInfo.cohortId}
              eventId={eventInfo.eventId}
              googleEventId={eventInfo.googleEventId}
              googleEventLink={eventInfo.googleEventLink}
            />
          </div>
        </div>
      )}
      </div>
    </div>
  </>);
};

export default AddGoogleEventForm;

