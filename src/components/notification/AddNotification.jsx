import { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import FileUpload from 'components/upload/FileUpload';
import { useAuth } from 'hooks/useAuth';
import useAPI from 'hooks/useApi';
import notificationAPI from 'api/notificationapi';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import WizardInput from 'components/wizard/WizardInput';
const AddNotification = () => {
  const { user } = useAuth();
  const addnotificationAPI = useAPI(notificationAPI.postNotification);
  const { register, handleSubmit } = useForm();
  const [quote1, setQuote1] = useState([]);
  const [dates, setDates] = useState('');
  useEffect(() => {
    if (
      get(addnotificationAPI, 'data.success') &&
      !isEmpty(get(addnotificationAPI, 'data.data'))
    ) {
      toast.success('Notification Added successfully!', {
        theme: 'colored',
      });
    } else if (get(addnotificationAPI, 'data.message')) {
      toast.error('Notification Added failed', {
        theme: 'colored',
      });
    }
  }, [addnotificationAPI.data]);
  const handleChangeDate = (e) => {
    setDates(e.target.value);
  };
  useEffect(() => {
    if (addnotificationAPI.error) {
      toast.error('Notification Added failed', {
        theme: 'colored',
      });
    }
  }, [addnotificationAPI.error]);
  const handleChangeQuets = (key, value) => {
    quote1.push(value);
    setQuote1(quote1);
  };
  const onSubmitData = async (data) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const postData = {
      date: String(dates),
      title: String(data.title),
      text: String(data.text),
      link: String(quote1),
      createdBy: Number(userData.employeeId),
    };
    addnotificationAPI.request(postData, get(user, 'token'));
  };

  return (
    <>
      <Card
        as={Form}
        onSubmit={handleSubmit(onSubmitData)}
        className="theme-wizard mb-5"
      >
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">Add Notification</h5>
          </div>
        </Card.Header>
        <Card.Body className="fw-normal px-md-6 py-4">
          <Row className="g-2 mb-3">
            <Col md={6}>
              <label>Date (DD/MM/YYYY)</label>
              <input
                label="Date (DD-MM-YYYY)"
                name="date"
                type="date"
                value={dates}
                onChange={handleChangeDate}
                // onChange={e => setDates(e.target.value)}
                className="form-control"
              />
              <WizardInput
                label="Title"
                name="title"
                type="String"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('title', {
                    required: 'This field is required',
                  }),
                }}
              />
            </Col>
            <Col md={6}>
              <WizardInput
                label="Description"
                name="text"
                type="textarea"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('text'),
                }}
              />
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            <Col md={12}>
              <FileUpload
                setValue={handleChangeQuets}
                documentName="quote1"
                label="Uploade Images"
                documents={quote1}
                multiple={true}
              />
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row className="g-2 mb-3">
            <Col md={4}></Col>
            <Col md={4}>
              <Button type="submit" color="primary" className="mt-3 w-100">
                {addnotificationAPI.loading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                <span className="ps-2">Save</span>
              </Button>
            </Col>
            <Col md={4}></Col>
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
};

export default AddNotification;
