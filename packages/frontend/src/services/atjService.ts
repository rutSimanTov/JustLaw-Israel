import axios from 'axios';

export interface SignatoryData {
  id: number;
  name: string;
  country: string;
  type: 'individual' | 'organization';
  representative_name?: string;
  representative_title?: string;
}

export const fetchAllSignatories = async (): Promise<SignatoryData[]> => {
  try {
    console.log('🔍 Starting to fetch signatories...');
    
    // שליפה דרך ה-API של השרת
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    
    console.log('📞 Fetching signatories from backend API...');
    const response = await axios.get(`${API_BASE_URL}/atj/signatories`);
    console.log('✅ Raw API response:', response.data);
    
    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const formattedData: SignatoryData[] = response.data.map((signatory: any) => ({
        id: signatory.id,
        name: signatory.name,
        country: signatory.country,
        type: signatory.type,
        representative_name: signatory.representative_name,
        representative_title: signatory.representative_title,
      }));
      
      console.log('🎯 Formatted data for display:', formattedData);
      return formattedData;
    } else {
      console.log('ℹ️ No signatories found or empty response');
      return [];
    }
    
  } catch (error: any) {
    console.error('❌ Error in fetchAllSignatories:', error);
    console.error('❌ Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    throw error;
  }
};
