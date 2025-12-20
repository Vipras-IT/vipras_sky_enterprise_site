import { Row, Col, Card } from 'react-bootstrap';
import { useState } from 'react';
import { useEffect } from 'react';
import FmCall from 'components/crm/FmCall';
import crmAPI from 'api/crm';
import useApi from 'hooks/useApi';
import { get, isEmpty } from 'lodash';
import { useParams } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import InternalCall from 'components/crm/InternalCall';
import DcCall from 'components/crm/DcCall';

const LeadGeneration = () => {
  const { user } = useAuth();
  const params = useParams();
  const [dates, setDates] = useState('');
  const [title, setTitle] = useState('Ticket Creation');
  const [typeofCall, setTypeofCall] = useState();
  const [showTextBox1, setShowTextBox1] = useState(false);
  const [callHide, setCallHide] = useState(false);
  const [internalHide, setInternalHide] = useState(false);
  const getByIdCRMAPI = useApi(crmAPI.getByIdCRM);
  const [data, setData] = useState();
  const [escalation, setEscalation] = useState('');

  const handleChange = (e) => {
    setTypeofCall(e.target.value);
    console.log(dates);
    if (e.target.value === 'DC_CALL') {
      console.log(e.target.value);
      setShowTextBox1(true);
    } else {
      setShowTextBox1(true);
    }
  };

  const handleChangeEscalation = (e) => {
    setEscalation(e.target.value);
    console.log(dates);
    if (e.target.value === 'EXTERNAL') {
      setCallHide(true);
      setTitle('Enternal Ticket');
      setInternalHide(false);
    } else if (e.target.value === 'INTERNAL') {
      setCallHide(false);
      setInternalHide(true);
      setTitle('Internal Ticket');
    } else {
      setCallHide(false);
      setInternalHide(false);
      setTitle('Ticket Creation');
    }
  };

  const handleChangeDate = (e) => {
    setDates(e.target.value);
  };
  useEffect(() => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
    setDates(formattedDate);
  }, []);

  useEffect(() => {
    if (!isEmpty(get(params, 'id'))) {
      getByIdCRMAPI.request(params.id, get(user, 'token'));
    }
  }, [params.id]);

  useEffect(() => {
    if (getByIdCRMAPI.data) {
      if (!isEmpty(get(params, 'id'))) {
        const selecteDate = get(getByIdCRMAPI.data.data, 'date', []);
        const inputDate = new Date(selecteDate);
        const day = inputDate.getUTCDate().toString().padStart(2, '0');
        const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = inputDate.getUTCFullYear();
        const formattedDateString = `${year}-${month}-${day}`;
        setDates(formattedDateString);
        setTypeofCall(get(getByIdCRMAPI.data.data, 'typeOfCall', ''));
        setData(get(getByIdCRMAPI, 'data.data'));
      }
    }
  }, [getByIdCRMAPI.data]);

  return (
    <>
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">{title}</h5>
          </div>
        </Card.Header>

        <Card.Body className="fw-normal px-md-6 py-4">
          <Row className="g-2 mb-3">
            <Col md="6">
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
            </Col>
            <Col span={6}>
              <label>Escalation Type</label>
              <select
                name="source"
                value={escalation}
                onChange={handleChangeEscalation}
                className="form-select"
              >
                <option value="">Select your option...</option>
                <option value="INTERNAL">INTERNAL</option>
                <option value="EXTERNAL">EXTERNAL</option>
              </select>
            </Col>
            {callHide && (
              <Col span={6}>
                <label>Type of Call</label>
                <select
                  name="source"
                  value={typeofCall}
                  onChange={handleChange}
                  className="form-select"
                >
                  <option value="">Select your option...</option>
                  <option value="FMS_CALL">FMS Call</option>
                  <option value="DC_CALL">DC Call</option>
                  <option value="GARBAGE_CAL">Garbage Call</option>
                  <option value="LAUNDRY_CALL">Laundry Call</option>
                  <option value="CIVIL_CALL">Civil Call</option>
                  <option value="ESI_PF_RELATED_CALL">
                    ESI & PF Related Call
                  </option>
                  <option value="RESIGNED_EMPLOYEE_CALL">
                    Resigned Employee Call
                  </option>
                  <option value="JOB_CALL">Job Call</option>
                  <option value="COMPLAINT_CALL">Complaint Call</option>
                </select>
              </Col>
            )}
            {internalHide && (
              <InternalCall dates={dates} escalation={escalation} />
            )}
            {typeofCall === 'DC_CALL' ? (
              <DcCall
                showTextBox1={showTextBox1}
                dates={dates}
                typeofCall={typeofCall}
                data={data}
                escalation={escalation}
              />
            ) : typeofCall ? (
              <FmCall
                dates={dates}
                typeofCall={typeofCall}
                data={data}
                escalation={escalation}
              />
            ) : null}
          </Row>
        </Card.Body>
        {/* <Card.Footer>
          <Button type="submit" color="primary" className="mt-3 w-100">
            {postCrmAPI.loading && (
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
        </Card.Footer> */}
      </Card>
    </>
  );
};

export default LeadGeneration;
