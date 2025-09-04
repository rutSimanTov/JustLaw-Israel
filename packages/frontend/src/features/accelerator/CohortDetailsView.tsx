import React from 'react';
import { Cohort } from '@base-project/shared';

interface Props {
  cohort: Cohort;
}

export const CohortDetailsView: React.FC<Props> = ({ cohort }) => {
  return (
    <div style={{ padding: 24, maxWidth: 600, margin: 'auto' }}>
      <h1>name: {cohort.name}</h1>
      <p>description: {cohort.description}</p>
      <p>
        status:{' '}
        <span style={{
          color: '#fff',
          backgroundColor: cohort.isActive ? 'green' : 'gray',
          padding: '4px 8px',
          borderRadius: 4
        }}>
          {cohort.isActive ? 'active' : 'completed'}
        </span>
      </p>
      <p>current participants: {cohort.currentParticipants} of {cohort.maxParticipants}</p>
    </div>
  );
};
