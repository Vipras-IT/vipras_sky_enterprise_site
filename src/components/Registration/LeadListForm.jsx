import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import LeadList from './LeadList';
import LeadListFms from './LeadListFms';
import LeadListDc from './LeadListDc';
export default function LeadListForm() {
  const [typeofCall, setTypeofCall] = useState();
  const [showTextBox1, setShowTextBox1] = useState(false);
  const [showTextBox2, setShowTextBox2] = useState(false);
  const [showTextBox3, setShowTextBox3] = useState(false);
  const handleChange = (e) => {
    setTypeofCall(e.target.value);
    if (e.target.value === 'FMS_CALL') {
      setShowTextBox2(true);
      setShowTextBox3(false);
      setShowTextBox1(false);
    } else if (e.target.value === 'DC_CALL') {
      setShowTextBox3(true);
      setShowTextBox2(false);
      setShowTextBox1(false);
    } else {
      setShowTextBox1(true);
      setShowTextBox2(false);
      setShowTextBox3(false);
    }
  };

  return (
    <div>
      <Row className="g-2 mb-3">
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
            <option value="ESI_PF_RELATED_CALL">ESI & PF Related Call</option>
            <option value="RESIGNED_EMPLOYEE_CALL">
              Resigned Employee Call
            </option>
            <option value="JOB_CALL">Job Call</option>
            <option value="COMPLAINT_CALL">Complaint Call</option>
          </select>
        </Col>
        <Col span={6}></Col>
      </Row>
      {showTextBox1 && <LeadList typeofCall={typeofCall} />}
      {showTextBox2 && <LeadListFms typeofCall={typeofCall} />}
      {showTextBox3 && <LeadListDc typeofCall={typeofCall} />}
    </div>
  );
}
