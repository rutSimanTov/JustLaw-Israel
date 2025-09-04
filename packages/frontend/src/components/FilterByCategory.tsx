import React from 'react';
import Select from 'react-select';
import { ContentCategory } from '../services/contentServise';

type Props = {
  selectedCategories: string[];
  setSelectedCategories: (categories: string[]) => void;
  categories: ContentCategory[];
};

export default function CategoryArticles({ selectedCategories, setSelectedCategories, categories }: Props) {
  // יצירת רשימת אפשרויות עם "All" בתחילה ולאחר מכן הקטגוריות הדינמיות
  const categoryOptions = [
    { value: 'ALL', label: 'All' },
    ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
  ];

  const handleSelectChange = (selected: any) => {
    let selectedVals = selected ? selected.map((opt: any) => opt.value) : [];
    // אם נבחרה קטגוריה אחרת בנוסף ל-ALL, הסר את ALL
    if (selectedVals.includes('ALL') && selectedVals.length > 1) {
      selectedVals = selectedVals.filter((val: string) => val !== 'ALL');
    }
    // אם נבחרה רק ALL, השאר רק אותה
    if (selectedVals.includes('ALL')) {
      selectedVals = ['ALL'];
    }
    // אם לא נבחרה אף קטגוריה, הגדר ALL כברירת מחדל
    if (selectedVals.length === 0) {
      selectedVals = ['ALL'];
    }
    setSelectedCategories(selectedVals);
  };

  return (
    <div className="ml-2">
      <div className="w-[300px]">
        <Select
        isMulti
        options={categoryOptions}
        value={categoryOptions.filter(opt => selectedCategories.includes(opt.value))}
        onChange={handleSelectChange}
        placeholder="Sort by"
        className="react-select-container"
        classNamePrefix="react-select"
        styles={{
          control: (provided, state) => ({
            ...provided,
            backgroundColor: 'transparent', // רקע שקוף כמו העמוד
            borderColor: state.isFocused ? '#ffffff' : '#ffffff', // מסגרת לבנה
            borderWidth: '1px',
            borderRadius: '8px',
            minHeight: '48px',
            maxHeight: '48px', // גובה קבוע
            width: '100%', // רוחב מלא של הcontainer
            boxShadow: 'none',
            '&:hover': {
              borderColor: '#ffffff'
            }
          }),
          valueContainer: (provided) => ({
            ...provided,
            maxHeight: '46px',
            overflowY: 'hidden',
            overflowX: 'auto',
            flexWrap: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            '::-webkit-scrollbar': {
              height: '4px',
            },
            '::-webkit-scrollbar-track': {
              background: 'transparent',
            },
            '::-webkit-scrollbar-thumb': {
              background: '#475569',
              borderRadius: '2px',
            },
          }),
          menu: (provided) => ({
            ...provided,
            backgroundColor: 'hsl(var(--card))', // משתמש במשתנה העמוד
            borderRadius: '8px',
            border: '1px solid #475569',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)',
            zIndex: 9999
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected 
              ? '#475569' 
              : state.isFocused 
              ? '#475569' 
              : 'transparent',
            color: '#ffffff',
            padding: '12px 16px',
            fontSize: '14px',
            '&:hover': {
              backgroundColor: '#475569'
            }
          }),
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#475569',
            borderRadius: '6px',
            overflow: 'hidden',
            flexShrink: 0, // לא יתכווץ
            minWidth: 'fit-content'
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: '500'
          }),
          multiValueRemove: (provided) => ({
            ...provided,
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#64748b',
              color: '#ffffff'
            }
          }),
          placeholder: (provided) => ({
            ...provided,
            color: '#cbd5e1', // slate-300
            fontSize: '14px'
          }),
          input: (provided) => ({
            ...provided,
            color: '#ffffff'
          }),
          singleValue: (provided) => ({
            ...provided,
            color: '#ffffff'
          }),
          indicatorSeparator: (provided) => ({
            ...provided,
            backgroundColor: '#475569'
          }),
          dropdownIndicator: (provided) => ({
            ...provided,
            color: '#cbd5e1',
            '&:hover': {
              color: '#ffffff'
            }
          }),
          clearIndicator: (provided) => ({
            ...provided,
            color: '#cbd5e1',
            '&:hover': {
              color: '#ffffff'
            }
          })
        }}
      />
      </div>
    </div>
  );
}