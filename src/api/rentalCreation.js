import axios from './api';
import { get } from 'lodash';

const addRoomRental = (data) => axios.post(`/api/v1/room`, data);

const getRoomRentaldetails = (roomId) => {
  return axios.get(`/api/v1/room/${roomId}`);
};

// Function to update a room rental
const updateRoomRental = (data) => axios.post(`/api/v1/room/${data.id}`, data);

const fetchRoomRentalData = async (page, pageSize, pageFilter) => {
  const offset = page + 1;
  let url = `/api/v1/room?page=${offset}&limit=${pageSize}`;

  if (pageFilter.value.trim().length > 1) {
    const filter = { [`${pageFilter.key}`]: pageFilter.value };
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/room?filter=${serializedData}`;
  }

  try {
    const response = await axios.get(url);
    const results = get(response, 'data.data.items', []) || [];

    const hasError = get(response, 'data.success');

    const data = {
      results: results,
      count: get(response, 'data.data.totalItems'),
      hasError,
    };
    return data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

export default {
  addRoomRental,
  getRoomRentaldetails,
  updateRoomRental,
  fetchRoomRentalData,
};
