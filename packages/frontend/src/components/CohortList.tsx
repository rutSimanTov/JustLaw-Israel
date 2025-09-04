import React, {  useState } from 'react';
import { Cohort } from '@base-project/shared';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './CohortList.css';
import {Button} from './UI/Button/button'
import {X } from "lucide-react"; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./UI/tooltip";


const formatDateForDisplay = (date: string | Date | undefined | null): string => {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth()+1).padStart(2, '0')}/${d.getFullYear()}`;
}

const formatDDMMYYYY = (date: Date | string | null): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth()+1).padStart(2, '0')}/${d.getFullYear()}`;
};
const parseDDMMYYYY = (str: string): Date | null => {
  if (!str) return null;
  const [day, month, year] = str.split('/').map(Number);
  if (!day || !month || !year) return null;
  return new Date(year, month - 1, day);
};

const CohortUpdateForm = ({
  cohort,
  onSave,
  onCancel,
}: {
  cohort: Cohort;
  onSave: (updated: Cohort) => void;
  onCancel: () => void;
}) => {
  // Ensure startDate is a string in YYYY-MM-DD format
  // Format date as dd/MM/yyyy for backend and as YYYY-MM-DD for input
  // const formatDateDDMMYYYY = (date: string | Date) => {
  //   if (!date) return '';
  //   const d = typeof date === 'string' ? new Date(date) : date;
  //   if (isNaN(d.getTime())) return '';
  //   return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth()+1).padStart(2, '0')}/${d.getFullYear()}`;
  // };
  // const formatDateYYYYMMDD = (date: string | Date) => {
  //   if (!date) return '';
  //   const d = typeof date === 'string' ? new Date(date) : date;
  //   if (isNaN(d.getTime())) return '';
  //   return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  // };

  const [name, setName] = useState(cohort.name);
  const [startDate, setStartDate] = useState(cohort.startDate ? formatDDMMYYYY(cohort.startDate) : '');
  const [endDate, setEndDate] = useState(cohort.endDate ? formatDDMMYYYY(cohort.endDate) : '');
  const [touched, setTouched] = useState({ name: false, startDate: false, endDate: false });
  const [errors, setErrors] = useState<{ name?: string; startDate?: string; endDate?: string }>({});

  // Validation logic
  const validate = (field: 'name' | 'startDate' | 'endDate', value: string) => {
    if (field === 'name') {
      if (!value.trim()) return 'Name is required.';
      if (!/^[a-zA-Z0-9 ]+$/.test(value)) return 'Name must contain only letters, numbers, and spaces.';
      return '';
    }
    if (field === 'startDate') {
      if (!value) return 'Start date is required.';
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return 'Invalid date format.';
      const d = parseDDMMYYYY(value);
      if (!d || isNaN(d.getTime())) return 'Invalid date.';
      // Check startDate < endDate if endDate is set
      if (endDate && /^\d{2}\/\d{2}\/\d{4}$/.test(endDate)) {
        const sd = parseDDMMYYYY(value);
        const ed = parseDDMMYYYY(endDate);
        if (sd && ed && sd > ed) return 'Start date must be before end date.';
      }
      return '';
    }
    if (field === 'endDate') {
      if (!value) return 'End date is required.';
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) return 'Invalid date format.';
      const d = parseDDMMYYYY(value);
      if (!d || isNaN(d.getTime())) return 'Invalid date.';
      // Check endDate > startDate if startDate is set
      if (startDate && /^\d{2}\/\d{2}\/\d{4}$/.test(startDate)) {
        const sd = parseDDMMYYYY(startDate);
        const ed = parseDDMMYYYY(value);
        if (sd && ed && ed < sd) return 'End date must be after start date.';
      }
      return '';
    }
    return '';
  };

  // On blur handlers
  const handleBlur = (field: 'name' | 'startDate' | 'endDate') => {
    setTouched(t => ({ ...t, [field]: true }));
    let value: string;
    switch (field) {
      case 'name':
        value = name;
        break;
      case 'startDate':
        value = startDate;
        break;
      case 'endDate':
        value = endDate;
        break;
      default:
        value = '';
    }
    setErrors(e => ({ ...e, [field]: validate(field, value) }));
  };

  // On change handlers (do not validate on change, just update value)
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date ? formatDDMMYYYY(date) : '');
  };
  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date ? formatDDMMYYYY(date) : '');
  };

  // Disable Save if any errors or required fields missing
  const isSaveDisabled =
    !!validate('name', name) || !!validate('startDate', startDate) || !!validate('endDate', endDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all fields on submit (in case user never blurred)
    const nameError = validate('name', name);
    const startDateError = validate('startDate', startDate);
    const endDateError = validate('endDate', endDate);
    setTouched({ name: true, startDate: true, endDate: true });
    setErrors({ name: nameError, startDate: startDateError, endDate: endDateError });
    if (nameError || startDateError || endDateError) return;
    // Pass startDate and endDate as dd/MM/yyyy strings
    // Pass startDate and endDate as Date objects
    onSave({
      ...cohort,
      name,
      startDate: startDate as unknown as Date,
      endDate: endDate as unknown as Date
    });
  };

  return (
    <form onSubmit={handleSubmit} className='bg-background' style={{ marginTop: 20, padding: 16, borderRadius: 8 }} >
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Name:</label>
        <input
          value={name}
          onChange={handleNameChange}
          onBlur={() => handleBlur('name')}
          required
          style={{color:'black'}}
        />
        {touched.name && errors.name && (
          <div style={{ color: 'red', marginTop: 4 }}>{errors.name}</div>
        )}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>Start Date:</label>
        <DatePicker
          selected={parseDDMMYYYY(startDate)}
          onChange={handleStartDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/MM/yyyy"
          onBlur={() => handleBlur('startDate')}
          required
          className="form-control datepicker-black"
        />
        {touched.startDate && errors.startDate && (
          <div style={{ color: 'red', marginTop: 4 }}>{errors.startDate}</div>
        )}
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ marginRight: 8 }}>End Date:</label>
        <DatePicker
          selected={parseDDMMYYYY(endDate)}
          onChange={handleEndDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/MM/yyyy"
          onBlur={() => handleBlur('endDate')}
          required
          className="form-control datepicker-black"
        />
        {touched.endDate && errors.endDate && (
          <div style={{ color: 'red', marginTop: 4 }}>{errors.endDate}</div>
        )}
      </div>
      <button type="submit" className='bg-primary' style={{ marginRight: 8, color: 'white', border: 'none', padding: '6px 16px', borderRadius: 4 }} disabled={isSaveDisabled}>Save</button>
      <button type="button" onClick={onCancel} style={{ background: '#ccc', border: 'none', padding: '6px 16px', borderRadius: 4 }}>Cancel</button>
    </form>
  );
};

interface CohortListProps {
  cohorts: Cohort[];
  loading: boolean;
  error: string | null;
  onClose?: () => void;
  onRefresh?: (updatedCohort?: Cohort) => void;
}

const CohortList: React.FC<CohortListProps> = ({ cohorts, loading, error, onClose, onRefresh }) => {
  const [editingCohort, setEditingCohort] = useState<Cohort | null>(null);

  const handleEdit = (cohort: Cohort) => setEditingCohort(cohort);

  const handleUpdate = async (updated: Cohort) => {
    try {
      await require('../services/api').apiService.updateCohort(updated.id, {
        name: updated.name,
        startDate: updated.startDate,
        endDate: updated.endDate
      });
      setEditingCohort(null);
      if (onRefresh) await onRefresh(updated);
    } catch {
      alert('Failed to update cohort');
    }
  };

  return (
    // <div className='bg-background' style={{ maxWidth: 600, margin: '40px auto', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 24, position: 'relative' }}>
    <div className='modal-overlay'>
      <div className="modal-content">
      {/* Close (X) Button */}
      {onClose && (
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
      )}
      <h2 style={{ marginBottom: 24 }}>Cohorts</h2>
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      {!loading && !editingCohort && (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {cohorts.map(cohort => (
            <li key={cohort.id} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>
                <strong>{cohort.name}</strong> (Start: {formatDateForDisplay(cohort.startDate)})
              </span>
              <button 
              className='bg-primary'
                style={{
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  padding: '6px 16px',
                  cursor: 'pointer'
                }}
                onClick={() => handleEdit(cohort)}
              >
                Update
              </button>
            </li>
          ))}
        </ul>
      )}
      {editingCohort && (
        <CohortUpdateForm
          cohort={editingCohort}
          onSave={handleUpdate}
          onCancel={() => setEditingCohort(null)}
        />
      )}
    </div>
    </div>
  );
};

export default CohortList;
