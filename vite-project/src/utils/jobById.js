import { JOBAPI_URL } from '../constants/jobsapi';
import axios from 'axios';

export const jobById = async (id) => {
  try {
    const response = await axios.get(`${JOBAPI_URL}/job/${id}`);
    if (response.status === 200) {
      console.log(response.data);  // this should only log once ideally
      return response.data;
    } else {
      throw new Error(`Error fetching job with ID ${id}: ${response.statusText}`);
    }
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};