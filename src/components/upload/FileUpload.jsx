/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import UploadService from 'api/FileUploadService';
import FalconDropzone from 'components/common/FalconDropzone';
import Flex from 'components/common/Flex';
import { Link } from 'react-router-dom';
import { ProgressBar } from 'react-bootstrap';
import cloudUpload from 'assets/cloud-upload.svg';
import { get } from 'lodash';

const UploadFiles = ({
  setValue,
  documentName,
  label,
  multiple = false,
  documents = [],
}) => {
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState(documents);

  useEffect(() => {
    const removeDublecat = [...new Set(documents)];
    setMessage(removeDublecat);
  }, [documents]);

  const uploadFile = (selectedFiles) => {
    let currentFile = selectedFiles[0];
    setProgress(0);
    const originalFileName = get(currentFile.file, 'name', '');
    if (multiple) {
      documentName = `${documentName}_${message.length + 1}`;
    }
    const newFile = new File([currentFile.file], originalFileName, {
      type: currentFile.file.type,
    });
    UploadService.upload(newFile, (event) => {
      setProgress(Math.round((100 * event.loaded) / event.total));
    })
      .then((response) => {
        setValue(`documents.${documentName}`, response.data.fileUrl);
        setMessage((oldMessage) => [...oldMessage, response.data.fileUrl]);
      })
      .catch(() => {
        setMessage((oldMessage) => [
          ...oldMessage,
          'Could not upload the file!',
        ]);
      });
  };
  return (
    <>
      <FalconDropzone
        onChange={(files) => {
          uploadFile(files);
        }}
        multiple={multiple}
        placeholder={
          <>
            <Flex justifyContent="center">
              <img src={cloudUpload} alt="" width={25} className="me-2" />
              <p className="fs-0 mb-0 text-700">{label}</p>
            </Flex>
          </>
        }
        className="file-upload-area"
      />
      {progress > 0 && progress != 100 && (
        <ProgressBar
          className="file-progress-bar"
          variant="success"
          now={progress}
          label={`${progress} %`}
        />
      )}
      {message.map((data) => (
        <p key={data}>
          <Link target="_blank" to={data}>
            {data}
          </Link>
        </p>
      ))}
    </>
  );
};

export default UploadFiles;
