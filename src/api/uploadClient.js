import axios from 'axios';
import { settings } from 'config/Config';

export default axios.create({
  baseURL: settings.documentApiUrl,
});
