/* eslint-disable react/prop-types */

import { get } from 'lodash';

const Bankdetails = ({ employeeData }) => {
  return (
    <div className="mt-3 card LineSpace ">
      <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-300 rounded-0">
        <div className="d-flex justify-content-between ">
          <h5 className="text-white">Bank Details</h5>
        </div>
      </div>

      <div className="fs--1 card-body">
        <div className="row">
          <div className="h-100 col-md-3">
            <h6 className="fs-0 mb-0">Name of A/C Holder </h6>
            <label title="Fname">
              {get(employeeData, 'bankDetails.accountHolderName', '')}
            </label>
          </div>
          <div className="h-100 col-md-3">
            <h6 className="fs-0 mb-0">Account Number </h6>
            <label title="Fname">
              {get(employeeData, 'bankDetails.accountNumber', '')}
            </label>
          </div>
          <div className="h-100 col-md-3">
            <h6 className="fs-0 mb-0">Bank Name </h6>
            <label title="Fname">
              {get(employeeData, 'bankDetails.bankName', '')}
            </label>
          </div>
          <div className="h-100 col-md-3">
            <h6 className="fs-0 mb-0">Branch </h6>
            <label title="Fname">
              {get(employeeData, 'bankDetails.branch', '')}
            </label>
          </div>
          <div className="h-100 col-md-3">
            <h6 className="fs-0 mb-0">IFSC Code</h6>
            <label title="Fname">
              {get(employeeData, 'bankDetails.ifscode', '')}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bankdetails;
