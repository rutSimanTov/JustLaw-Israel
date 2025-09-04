
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from 'react-hook-form';
import { useCreateCohort } from '../../hooks/useCohort';
import {Button} from '../../components/UI/Button/button';
import {X } from "lucide-react"; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/UI/tooltip";

  // Helper to parse dd/MM/yyyy string to Date
  const parseDDMMYYYY = (str: string): Date | null => {
    if (!str) return null;
    const [day, month, year] = str.split('/').map(Number);
    if (!day || !month || !year) return null;
    return new Date(year, month - 1, day);
  };

type FormValues = {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
};

type Props = {
  onClose:()=>void;
};

export const CreateCohortForm: React.FC<Props> = ({ onClose }) => {
  const { register, watch, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      maxParticipants: 10,
    },
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const { create, isLoading, error, data } = useCreateCohort();

  useEffect(() => {
    if (data) {
      reset();
    }
  }, [data, reset]);

  //sending the new cohort details to the server
  const onSubmit = async (vals: FormValues) => {
    if (new Date(vals.startDate) > new Date(vals.endDate)) {
      setApiError('❌ Start date must be before end date');
      return;
    }
    setApiError(null);

    try {
      // Convert dd/MM/yyyy string to Date
      const parseDDMMYYYY = (str: string): Date | null => {
        if (!str) return null;
        const [day, month, year] = str.split('/').map(Number);
        if (!day || !month || !year) return null;
        return new Date(year, month - 1, day);
      };
      await create({
        name: vals.name,
        description: vals.description,
        startDate: parseDDMMYYYY(vals.startDate) as Date,
        endDate: parseDDMMYYYY(vals.endDate) as Date,
        maxParticipants: vals.maxParticipants,
      });
    } catch {
      // handled in hook
    }
  };

  return (
  <div  className="modal-overlay" >
    <div className="bg-card border border-border rounded-3xl p-8 mx-auto" style={{maxWidth: '50%', padding: '2rem'}}>
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
    <h2 className="text-center mb-6">Create New Cohort</h2>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate style={{borderColor:'pink'}}>
        
        <label className="flex flex-col mb-4">
          *Cohort Name
          <input
            type="text"
            placeholder='Cohort name, at least 3 characters'
            {...register('name', {
              required: 'Required field',
              minLength: { value: 3, message: 'At least 3 characters' },
            })}
            className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground"
          />
          {errors.name && <span className="text-red-500">{errors.name.message}</span>}
        </label>

        <label className="flex flex-col mb-4">
          Description
          <textarea
            placeholder='Cohort description'
            rows={3}
            {...register('description')}
            className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground"
          />
        </label>
          <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col mb-4">
          *Start Date
          {/* הערה: זה הקוד המקורי של אינפוט דייט */}
          {/*
          <input
            type="date"
            placeholder="dd/MM/YYYY"
            max={watch('endDate') || ''}
            {...register('startDate', { required: 'Select a start date' })}
            className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground"
            lang="en"
          />
          */}
          <DatePicker
            selected={parseDDMMYYYY(watch('startDate'))}
            onChange={date => {
              if (!date) {
                setValue('startDate', '');
                return;
              }
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              setValue('startDate', `${day}/${month}/${year}`);
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/MM/YYYY"
            className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground"
            maxDate={parseDDMMYYYY(watch('endDate')) || undefined}
            isClearable
          />
          {errors.startDate && <span className="text-red-500">{errors.startDate.message}</span>}
        </label>

        <label className="flex flex-col mb-4">
          *End Date
          {/* הערה: זה הקוד המקורי של אינפוט דייט */}
          {/*
          <input
            type="date"
            placeholder="dd/MM/YYYY"
            min={watch('startDate') || ''}
            {...register('endDate', { required: 'Select an end date' })}
            className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground"
            lang="en"
          />
          */}
          <DatePicker
            selected={parseDDMMYYYY(watch('endDate'))}
            onChange={date => {
              if (!date) {
                setValue('endDate', '');
                return;
              }
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              setValue('endDate', `${day}/${month}/${year}`);
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="dd/MM/YYYY"
            className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground"
            minDate={parseDDMMYYYY(watch('startDate')) || undefined}
            isClearable
          />
          {errors.endDate && (
            <>
              <span className="text-red-500">{errors.endDate.message}</span>
              {apiError && <span className="text-red-500">{apiError}</span>}
            </>
          )}
        </label></div>

        <label className="flex flex-col mb-4">
          *Max Participants
          <input
            type="number"
            {...register('maxParticipants', {
              required: 'Required field',
              valueAsNumber: true,
              min: { value: 1, message: 'Must be a positive number' },
            })}
            className="px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground"
          />
          {errors.maxParticipants && <span className="text-red-500">{errors.maxParticipants.message}</span>}
        </label>

        <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-white w-full py-3 rounded-lg">
          {isLoading ? 'Sending...' : 'Create Cohort'}
        </Button>

        {error && <div className="text-red-500 mt-4">{error}</div>}
        {data && <div className="text-green-500 mt-4">Cohort created successfully!</div>}
      </form>
    </div>
    </div>
  );
};
