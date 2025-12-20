import axios from 'axios';
import { settings } from 'config/Config';

const authApiClient = axios.create({
  baseURL: settings.apiUrl,
});

export default authApiClient;
