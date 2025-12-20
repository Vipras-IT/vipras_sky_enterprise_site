import { useEffect } from 'react';
import Flex from 'components/common/Flex';
import FalconDropzone from 'components/common/FalconDropzone';
import cloudUpload from 'assets/cloud-upload.svg';
import { Col, Row } from 'react-bootstrap';
import UploadService from 'api/FileUploadService';
import { get, isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import documentAPI from 'api/document';
import useAPI from 'hooks/useApi';
import { useAuth } from 'hooks/useAuth';
// import Gallery from 'react-photo-gallery';
// import Carousel, { Modal, ModalGateway } from 'react-images';

const AddPhotos = () => {
  const { user } = useAuth();
  const addDocumentAPI = useAPI(documentAPI.addDocument);
  const getAllPhotosAPI = useAPI(documentAPI.getDocumentByFilter);
  // const [documents, setDocuments] = useState([]);
  // const [currentImage, setCurrentImage] = useState(0);
  // const [viewerIsOpen, setViewerIsOpen] = useState(false);

  // const openLightbox = useCallback((event, { index }) => {
  //   setCurrentImage(index);
  //   setViewerIsOpen(true);
  // }, []);

  // const closeLightbox = () => {
  //   setCurrentImage(0);
  //   setViewerIsOpen(false);
  // };

  useEffect(() => {
    getAllPhotosAPI.request('photo', get(user, 'token'));
  }, []);

  useEffect(() => {
    if (getAllPhotosAPI.data) {
      if (
        get(getAllPhotosAPI, 'data.success') &&
        !isEmpty(get(getAllPhotosAPI, 'data.data'))
      ) {
        const photos = [];
        const responseDocs = get(getAllPhotosAPI, 'data.data.items', []);
        for (const photo of responseDocs) {
          photos.push({
            src: get(photo, 'url', ''),
            width: 30,
            height: 40,
          });
        }
        // setDocuments(photos);
      }
    }
  }, [getAllPhotosAPI.data]);

  useEffect(() => {
    if (getAllPhotosAPI.error) {
      toast.error('Error fetching documents:', {
        theme: 'colored',
      });
    }
  }, [getAllPhotosAPI.error]);

  const uploadProfilePhoto = (selectedFiles) => {
    let currentFile = selectedFiles[0];
    const originalFileName = get(currentFile.file, 'name', '');
    const newFile = new File([currentFile.file], originalFileName, {
      type: currentFile.file.type,
    });

    UploadService.upload(newFile, () => {})
      .then((response) => {
        const doc = {
          name: originalFileName,
          bucket: 'photo',
          url: response.data.fileUrl,
          updatedBy: get(user, 'userId'),
        };
        addDocumentAPI.request(doc, get(user, 'token'));
      })
      .catch((error) => {
        console.error('File upload error:', error);
        toast.error('Could not upload the file!', {
          theme: 'colored',
        });
      });
  };

  useEffect(() => {
    if (addDocumentAPI.data) {
      if (
        get(addDocumentAPI, 'data.success') &&
        !isEmpty(get(addDocumentAPI, 'data.data'))
      ) {
        getAllPhotosAPI.request('photo', get(user, 'token'));
      }
    }
  }, [addDocumentAPI.data]);

  useEffect(() => {
    if (addDocumentAPI.error) {
      toast.error('Error fetching documents:', {
        theme: 'colored',
      });
    }
  }, [addDocumentAPI.error]);

  return (
    <div>
      <Row className="mb-3">
        <Col md={6}>
          <FalconDropzone
            files={null}
            onChange={(files) => {
              uploadProfilePhoto(files);
            }}
            multiple={false}
            accept="image/*"
            placeholder={
              <>
                <Flex justifyContent="center">
                  <img src={cloudUpload} alt="" width={25} className="me-2" />
                  <p className="fs-0 mb-0 text-700">Add your photo</p>
                </Flex>
              </>
            }
          />
        </Col>
      </Row>
      <Row className="mb-3">
        {/* {documents.length > 0 && (
          <Col md={12}>
            <Gallery photos={documents} onClick={openLightbox} />
            <ModalGateway>
              {viewerIsOpen ? (
                <Modal onClose={closeLightbox}>
                  <Carousel
                    currentIndex={currentImage}
                    views={documents.map(x => ({
                      ...x,
                      srcset: x.srcSet,
                      caption: x.title
                    }))}
                  />
                </Modal>
              ) : null}
            </ModalGateway>
          </Col>
        )} */}
      </Row>
    </div>
  );
};

export default AddPhotos;
