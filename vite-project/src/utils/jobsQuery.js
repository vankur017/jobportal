import axios from 'axios';
import { JOBAPI_URL } from '../constants/api';

export const jobsQuery = async ({ role = '', location = '' }) => {

  try {
    const response = await axios.get(`${JOBAPI_URL}/jobs`, {
      params: {
        role,
        location,
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};
