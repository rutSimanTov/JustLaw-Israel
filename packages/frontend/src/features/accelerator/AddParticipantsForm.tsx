import React, { useEffect } from 'react';
import Select from 'react-select';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm } from 'react-hook-form';
import { useUsers, useAddParticipants } from '../../hooks/useUsers';
import { useCohorts } from '../../hooks/useCohort';
import { UserCheckboxList } from '../../components/UserCheckboxList';
import {Button} from '../../components/UI/Button/button'
import {X } from "lucide-react"; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/UI/tooltip";

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


type FormValues = { userIds: string[], cohortId: string };
type Props = {
  onClose:()=>void;
};

export const AddParticipantsForm : React.FC<Props> = ({ onClose })=>{
  const { data: users, loading, error } = useUsers();
  const { data: cohorts, loading: loadCohorts, error: errorCohorts } = useCohorts();
  const { addParticipants, isLoading, error: apiError, data: done } = useAddParticipants();
  const {  handleSubmit, watch, reset, setValue } = useForm<FormValues>({
    defaultValues: { userIds: [], cohortId: '' },
  });

  const selectedIds = watch('userIds');
  const selectedCohortId = watch('cohortId');

  useEffect(() => {
    if (done) {
      reset();
    }
  }, [done, reset]);

  useEffect(() => {
    setValue('userIds', []);
  }, [selectedCohortId, setValue]);

  const onSubmit = (vals: FormValues) => addParticipants(vals.cohortId, vals.userIds);

  const onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const currentIds = watch('userIds');

    const updatedIds = checked
      ? [...currentIds, value]
      : currentIds.filter(id => id !== value);

    setValue('userIds', updatedIds);
  };

  if (error) return <p>Error: {error}</p>;

  const options = cohorts?.map(cohort => ({
    value: cohort.id,
    label: (
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <span>{cohort.name}</span>
        {!cohort.isActive && <span>archived <DeleteIcon /></span>}
      </div>
    ),
    isDisabled: !cohort.isActive,
  })) || [];

  return (
    <div  className="modal-overlay" >
    <div className="bg-card border border-border rounded-3xl p-8 mx-auto" style={{minHeight:'90%',maxWidth: '60%', padding: '2rem'}}>
    <TooltipProvider>
        <div  style={{alignSelf: 'flex-end'}} >
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
    {loading?(<LoadingDots />):(
    <form onSubmit={handleSubmit(onSubmit)} style={{ maxWidth: 480, margin: '2rem auto' }}>
      <h2>Add participants to Cohort</h2>
      <label htmlFor="cohortId">*Select Cohort:</label>

     <Select
        id="cohortId"
        options={options}
        onChange={(selectedOption) => setValue('cohortId', selectedOption?.value || '')}
        styles={{
          control: (provided, state) => ({
            ...provided,
            width: '100%',
            borderRadius: '0.375rem',
            padding: '0.5rem 1rem',
            border: '1px solid #ff338f', 
            backgroundColor: 'var(--background)', 
            color: 'white',
            appearance: 'none',
            cursor: 'pointer',
            boxShadow: state.isFocused ? 'none' : 'none', 
            '&:focus': {
              outline: 'none', 
            },
            '&:hover': {
              borderColor: '#ff338f',
            },
          }),
          singleValue: (provided) => ({
            ...provided,
            color: 'white', 
          }),
          option: (provided, state) => ({
            ...provided,
            display: 'flex',
            justifyContent: 'space-between',
            backgroundColor: state.isFocused ? '#e0e0e0' : 'rgb(15, 44, 77)',
            color: 'white',
            '&:active': {
              backgroundColor: '#ff338f',
            },
          }),
          placeholder: (provided) => ({
            ...provided,
            color: 'gray', 
          }),
        }}
        placeholder="*Select Cohort"
      />



      {selectedCohortId && users &&
        <UserCheckboxList users={users} cohortId={selectedCohortId} value={selectedIds} onChange={onCheckboxChange} />}

      <Button variant="default" size="default" type="submit" disabled={isLoading || loadCohorts || selectedIds.length === 0 || !selectedCohortId} className="bg-primary hover:bg-primary/90 text-white w-full py-3 rounded-lg mt-3">
        {isLoading || loadCohorts ? 'adding…' : 'Add Selected'}
      </Button>

      {(apiError||errorCohorts) && <p style={{ color: '#c00' }}>{apiError?apiError:errorCohorts}</p>}
      {done && <p style={{ color: '#080' }}>Participants added successfully to the cohort!</p>}
    </form>)}
    </div>
    </div>
  );
};


