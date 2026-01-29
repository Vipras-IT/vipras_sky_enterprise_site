/* eslint-disable react/prop-types */

import { get } from 'lodash';
import { Row, Col, Button } from 'react-bootstrap';
const OtherDeductionsInfoview = ({ storePurchaseData, onDelete }) => {
  const saleDate = new Date(get(storePurchaseData, 'date', null));
  const month = saleDate.getMonth() + 1;
  const monthValue = month < 10 ? `0${month}` : `${month}`;
  const day = saleDate.getDate();
  const dayValue = day < 10 ? `0${day}` : `${day}`;
  const formatDate = `${dayValue}/${monthValue}/${saleDate.getFullYear()}`;
  return (
    <>
      <Row className="g-2 mb-3">
        <Col md={4}></Col>
        <Col md={6}></Col>
        <Col md={2}>
          <Button color="primary" onClick={onDelete} className="mt-2 w-100">
            <span className="ps-2">Delete</span>
          </Button>
        </Col>
      </Row>
      <div className="mt-3 card LineSpace ">
        <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-300 rounded-0">
          <div className="d-flex justify-content-between ">
            <h5 className="text-white">Other Deductions details</h5>
          </div>
        </div>

        <div className="fs--1 card-body">
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Other Deductions Created Date </h6>
              <label className="form-label" title="Fname">
                {formatDate}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">EmployeeID</h6>
              <label title="Fname">
                {get(storePurchaseData, 'employeeIDNumber', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Employee Name</h6>
              <label title="Fname">
                {get(storePurchaseData, 'employeeName', '')}
              </label>
            </div>
          </div>
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Designation</h6>
              <label title="Fname">
                {get(storePurchaseData, 'designation', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">UnitCode</h6>
              <label title="Fname">
                {get(storePurchaseData, 'unitCode', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Advance</h6>
              <label title="Fname">
                {get(storePurchaseData, 'advance', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Transport</h6>
              <label title="Fname">
                {get(storePurchaseData, 'transport', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Fine</h6>
              <label title="Fname">{get(storePurchaseData, 'fine', '')}</label>
            </div>
            {/* <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">ViprasMart</h6>
              <label title="Fname">
                {get(storePurchaseData, 'viprasMart', '')}
              </label>
            </div> */}
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Attendance Bonus</h6>
              <label title="Fname">
                {get(storePurchaseData, 'attendanceBonus', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Others</h6>
              <label title="Fname">
                {get(storePurchaseData, 'others', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Additional Id Card</h6>
              <label title="Fname">
                {get(storePurchaseData, 'additionalIdCard', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Remarks</h6>
              <label title="Fname">
                {get(storePurchaseData, 'remarks', '')}
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtherDeductionsInfoview;
