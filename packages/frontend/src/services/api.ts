import axios from 'axios';
import { Cohort } from '@base-project/shared';

const API_URL = process.env.REACT_APP_API_URL;
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);


export const apiService = {
  // Health check
  checkHealth: async () => {
    const response = await apiClient.get('/health');
    return response.data;
  },
  // Get all items
  // getItems: async (): Promise<Item[]> => {
  //   const response = await apiClient.get<ItemsResponse>('/items');
  //   if (response.data.success && response.data.data) {
  //     return response.data.data;
  //   }
  //   throw new Error(response.data.error || 'Failed to fetch items');
  // },
  // Get specific item
  // getItem: async (id: string): Promise<Item> => {
  //   const response = await apiClient.get<ItemResponse>(`/items/${id}`);
  //   if (response.data.success && response.data.data) {
  //     return response.data.data;
  //   }
  //   throw new Error(response.data.error || 'Failed to fetch item');
  // },
   saveDraft: async (
    draftId: number,
    content: string,
    lastUpdated: string,
    override: boolean = false
  ): Promise<{ lastUpdated: string }> => {
    const response = await axios.put(`/api/draft/${draftId}`, {
      content,
      lastUpdated,
      override,
    });
    return response.data;
  },
  async getCohorts() {
    const token = localStorage.getItem('jwtToken'); // or your actual key
    const res = await fetch('/api/cohorts', {
      headers: { Authorization: 'Bearer ' + token }
    });
    if (!res.ok) throw new Error('Failed to fetch cohorts');
    return res.json();
  },

  async updateCohort(id: string, cohort: Partial<Cohort>) {
    const res = await fetch(`/api/cohorts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwtToken')
      },
      body: JSON.stringify(cohort)
    });
    if (!res.ok) throw new Error('Failed to update cohort');
    return res.json();
  },
};


export { apiClient }; // הוספת שורת export