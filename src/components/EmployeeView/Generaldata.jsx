/* eslint-disable react/prop-types */

import { Col, Row } from 'react-bootstrap';
import { get } from 'lodash';

const GeneralViewpoint = ({ employeeData }) => {
  let languageKnown = '';

  const languageList = get(employeeData, 'languageKnown', []);
  languageList.map((data) => {
    languageKnown += `${data}, `;
  });

  return (
    <div className="border rounded-3 bg-white dark__bg-1000 mx-0 g-0">
      <div className=" bg-danger card-header notification border-x-0 border-bottom-0 border-300 rounded-0 d-flex justify-content-between ">
        <h5 className="text-white">Personal Info</h5>
      </div>

      <Row className="Alignbox LineSpace">
        <Col md={6} className="pe-md-4 pe-xl-0">
          <div>
            <h6 className="mb-1">Father Name </h6>
            <label title="Fname">{get(employeeData, 'fatherName', '')}</label>
          </div>
        </Col>
        <Col md={6} className="pe-md-4 pe-xl-0">
          <div>
            <h6 className="mb-1">Mother Name </h6>
            <label title="MName">{get(employeeData, 'motherName', '')}</label>
          </div>
        </Col>
        <Col md={6} className="pe-md-4 pe-xl-0">
          <div>
            <h6 className="mb-1">Language Known</h6>
            <label className="mb-md-0 mb-xl-4" title="Language">
              {languageKnown}
            </label>
          </div>
        </Col>
        <Col md={6} className="pe-md-4 pe-xl-0">
          <div>
            <h6 className="mb-1">Martial Status</h6>
            <label className="mb-md-0 mb-xl-4" title="marstatus">
              {get(employeeData, 'maritalStatus', '')}
            </label>
          </div>
        </Col>
        <Col md={6} className="pe-md-4 pe-xl-0">
          <div>
            <h6 className="mb-1">Gender</h6>
            <label className="mb-md-0 mb-xl-4" title="gender">
              {get(employeeData, 'gender', '')}
            </label>
          </div>
        </Col>
        <Col md={6} className="pe-md-4 pe-xl-0">
          <div>
            <h6 className="mb-1">Spouse Name</h6>
            <label className="mb-md-0 mb-xl-4" title="gender">
              {get(employeeData, 'guardianName', '')}
            </label>
          </div>
        </Col>
        <Col md={6} className="pe-md-4 pe-xl-0">
          <div>
            <h6 className="mb-1">Spouse Contact Number</h6>
            <label className="mb-md-0 mb-xl-4" title="gender">
              {get(employeeData, 'guardianContactNumber', '')}
            </label>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default GeneralViewpoint;
