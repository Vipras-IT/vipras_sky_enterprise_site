/* eslint-disable react/prop-types */

import { get, isEmpty } from 'lodash';

const Mandatorydocument = ({ employeeData }) => {

  const basic = Number(get(employeeData, 'documents.basicSalary', 0));
  const da = Number(get(employeeData, 'documents.da', 0));
  const hra = Number(get(employeeData, 'documents.hra', 0));
  const otherAllowance = Number(get(employeeData, 'documents.otherAllowance', 0));

  const totalSalary = basic + da + hra + otherAllowance;
  return (
    <div className="mt-3 card LineSpace ">
      <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-300 rounded-0">
        <div className="d-flex justify-content-between ">
          <h5 className="text-white">Mandatory Document</h5>
        </div>
      </div>

      <div className="fs--1 card-body">
        <div className="row">
          <div className="h-100 col-md-4">
            <h6 className="fs-0 mb-0">Voter ID No </h6>
            <label className="form-label" title="Fname">
              {get(employeeData, 'documents.voterId', '')}
            </label>
          </div>
          <div className="h-100 col-md-4">
            <h6 className="fs-0 mb-0">Driving Licence No </h6>
            <label title="Fname">
              {get(employeeData, 'documents.drivingLicenceNumber', '')}
            </label>
          </div>
          <div className="h-100 col-md-4">
            <h6 className="fs-0 mb-0">Pan Card No </h6>
            <label title="Fname">
              {get(employeeData, 'documents.panCardNumber', '')}
            </label>
          </div>
        </div>
        <div className="row">
          <div className="h-100 col-md-4">
            <h6 className="fs-0 mb-0">Aadhar Card No </h6>
            <label title="Fname">{get(employeeData, 'aadharNumber', '')}</label>
          </div>
          <div className="h-100 col-md-4">
            <h6 className="fs-0 mb-0">ESI Number </h6>
            <label title="Fname">
              {get(employeeData, 'documents.esiNumber', '')}
            </label>
          </div>
          <div className="h-100 col-md-4">
            <h6 className="fs-0 mb-0">UAN Number </h6>
            <label title="Fname">
              {get(employeeData, 'documents.pfNumber', '')}
            </label>
          </div>
        </div>
        <div className="row">
          <div className="h-100 col-md-4">
            <h6 className="fs-0 mb-0">Mark Sheet </h6>
            <label title="Fname">
              {get(employeeData, 'documents.markSheet', '')}
            </label>
          </div>
          <div className="h-100 col-md-4">
            <h6 className="fs-0 mb-0">Joining Date</h6>
            <label title="Fname">
              {get(employeeData, 'documents.joiningDate', '20/10/2020')}
            </label>
          </div>
          <div className="h-100 col-md-4">
            <h6 className="fs-0 mb-0">Salary </h6>
            <label title="Fname">
              {totalSalary}
              {/* {get(employeeData, 'totalSalary', '')} */}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mandatorydocument;
