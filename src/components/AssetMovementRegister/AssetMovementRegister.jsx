import { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import useAPI from 'hooks/useApi';
import addAssetMovementRegisterAPI from 'api/assetmovementregister';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import WizardInput from 'components/wizard/WizardInput';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from 'helpers/utils';

const AssetMovementRegister = () => {
  const addAssetMovementAPI = useAPI(
    addAssetMovementRegisterAPI.AddAssetsMovementRegister,
  );
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [dates, setDates] = useState();
  const [esstimatedDate, setEsstimatedDate] = useState();
  const [returnedDate, setReturnedDate] = useState();
  const [assetData, setAssetData] = useState([]);
  const [selectedAsset, setSelectedAssetCode] = useState('');
  const [scrapDate, setScrapDate] = useState();
  const [lostDate, setLostDate] = useState();
  useEffect(() => {
    if (
      get(addAssetMovementAPI, 'data.success') &&
      !isEmpty(get(addAssetMovementAPI, 'data.data'))
    ) {
      toast.success('AssetMovementRegister Added successfully!', {
        theme: 'colored',
      });
      navigate('/asset-movement-register-list', { replace: true });
    }
  }, [addAssetMovementAPI.data]);

  useEffect(() => {
    if (addAssetMovementAPI.error) {
      toast.error('AssetMovementRegister Added failed', {
        theme: 'colored',
      });
    }
  }, [addAssetMovementAPI.error]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await addAssetMovementRegisterAPI.getAssetsId();
      const errorMessage = getErrorMessage(response);
      if (errorMessage) {
        toast.error(errorMessage, {
          theme: 'colored',
        });
      } else {
        setAssetData(get(response.data, 'data', []));
      }
    };
    fetchData();
  }, []);

  const onSubmitData = async (data) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const postData = {
      date: dates,
      assetCode: String(selectedAsset),
      actualLocation: String(data.actuallocation),
      allottedLocation: String(data.allottedlocation),
      movedTo: String(data.movedto),
      EsstimatedDate: esstimatedDate,
      ReturnedDate: returnedDate,
      lostDate: lostDate,
      scrapDate: scrapDate,
      createdBy: Number(userData.employeeId),
    };
    await addAssetMovementAPI.request(postData);
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
            <h5 className="mb-0 text-white">Asset Movement Register</h5>
          </div>
        </Card.Header>
        <Card.Body className="fw-normal px-md-6 py-4">
          <Row className="g-2 mb-3">
            <Col md="6">
              <label>Date (DD/MM/YYYY)</label>
              <input
                label="Date (DD/MM/YYYY)"
                name="date"
                type="date"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="form-control"
              />
            </Col>
            <Col md={6}>
              <label>Asset Code</label>
              <select
                className="form-control"
                name="assetCode"
                value={selectedAsset}
                onChange={(e) => setSelectedAssetCode(e.target.value)}
              >
                <option value="">Select AssetCode</option>
                {assetData.map((option, index) => (
                  <option key={index.productId} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            <Col md={6}>
              <WizardInput
                label="Actual Location	"
                name="actuallocation"
                type="String"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('actuallocation', {
                    required: 'This field is required',
                  }),
                }}
              />
            </Col>
            <Col md={6}>
              <WizardInput
                label="Allotted Location"
                name="allottedlocation"
                type="String"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('allottedlocation', {
                    required: 'This field is required',
                  }),
                }}
              />
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            <Col md={6}>
              <WizardInput
                label="Moved to"
                name="movedto"
                type="String"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('movedto', {
                    required: 'This field is required',
                  }),
                }}
              />
            </Col>
            <Col md="6">
              <label>Esstimated Date (DD/MM/YYYY)</label>
              <input
                label="Date (DD/MM/YYYY)"
                name="date"
                type="date"
                value={esstimatedDate}
                onChange={(e) => setEsstimatedDate(e.target.value)}
                className="form-control"
              />
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            <Col md="6">
              <label>Returned Date (DD/MM/YYYY)</label>
              <input
                label="Date (DD/MM/YYYY)"
                // name="returnedDate"
                type="date"
                value={returnedDate}
                onChange={(e) => setReturnedDate(e.target.value)}
                className="form-control"
              />
            </Col>
            <Col md="6">
              <label>lost Date(DD/MM/YYYY)</label>
              <input
                label="Date (DD/MM/YYYY)"
                // name="returnedDate"
                type="date"
                value={lostDate}
                onChange={(e) => setLostDate(e.target.value)}
                className="form-control"
              />
            </Col>
          </Row>
          {/* <Row className="g-2 mb-3">
            <Col md="6">
              <label>lost Date(DD/MM/YYYY)</label>
              <input
                label="Date (DD/MM/YYYY)"
                // name="returnedDate"
                type="date"
                value={returnedDate}
                onChange={e => setReturnedDate(e.target.value)}
                className="form-control"
              />
            </Col>
          </Row> */}
          <Row className="g-2 mb-3">
            <Col md="6">
              <label>Scrap Date(DD/MM/YYYY)</label>
              <input
                label="Date (DD/MM/YYYY)"
                // name="returnedDate"
                type="date"
                value={scrapDate}
                onChange={(e) => setScrapDate(e.target.value)}
                className="form-control"
              />
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row className="g-2 mb-3">
            <Col md={4}></Col>
            <Col md={4}>
              <Button type="submit" color="primary" className="mt-3 w-100">
                {addAssetMovementAPI.loading && (
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

export default AssetMovementRegister;
