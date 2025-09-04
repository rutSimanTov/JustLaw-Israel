import React, { useEffect, useState } from 'react';
import { User } from '@base-project/shared';
import { useApplicationsByCohort } from '../hooks/useUsers';
import './UserCheckboxList.css'
type Props = {
  users: User[];
  cohortId: string;
  value?: string[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const UserCheckboxList: React.FC<Props> = ({ users, cohortId, value = [], onChange }) => {
  const { data: applications, loading: loadingApplications, error: errorApplications } = useApplicationsByCohort(cohortId);
  const [applicationsIds, setApplicationsIds] = useState<string[]>([]);

  useEffect(() => {
    if (applications) {
      setApplicationsIds(applications.map(application => application.userId));
    }
  }, [applications]);

  useEffect(() => {
    // when cohortId changes, the hook automatically updated
  }, [cohortId]);

  return (
    <>
      <label>*Select Participants:</label>
      <div className='userCheckboxList'>
        {loadingApplications&&<p>loading...</p>}
        {errorApplications&&<p>error: {errorApplications}</p>}
        {users && applications && users.map(user => (
          <div key={user.id} className='userCheckbox'>
            <label>
              <input
                type="checkbox"
                value={user.id}
                checked={value.includes(user.id)}
                disabled={applicationsIds.includes(user.id)}
                onChange={onChange}
              />
              <span>{user.username}</span>
            </label>
          </div>
        ))}
      </div>
    </>
  );
};
