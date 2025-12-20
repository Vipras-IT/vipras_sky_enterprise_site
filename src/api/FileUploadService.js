import http from './uploadClient';

const upload = (file, onUploadProgress) => {
  let formData = new FormData();

  formData.append('file', file);

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const token = user?.token || '';

  return http.post('/api/v1/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    onUploadProgress,
  });
};

const getFiles = () => {
  return http.get('/files');
};

const FileUploadService = {
  upload,
  getFiles,
};

export default FileUploadService;
