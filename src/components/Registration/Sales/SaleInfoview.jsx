/* eslint-disable react/prop-types */

import { get } from 'lodash';

const SaleInfoview = ({ saleData }) => {
  const saleDate = new Date(get(saleData, 'date', null));
  const month = saleDate.getMonth() + 1;
  const monthValue = month < 10 ? `0${month}` : `${month}`;
  const day = saleDate.getDate();
  const dayValue = day < 10 ? `0${day}` : `${day}`;
  const formatDate = `${dayValue}/${monthValue}/${saleDate.getFullYear()}`;
  return (
    <>
      <div className="mt-3 card LineSpace ">
        <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-300 rounded-0">
          <div className="d-flex justify-content-between ">
            <h5 className="text-white">Sale Details</h5>
          </div>
        </div>

        <div className="fs--1 card-body">
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Sale Created Date </h6>
              <label className="form-label" title="Fname">
                {formatDate}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Site Name </h6>
              <label title="Fname">{get(saleData, 'unitCode', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Deduction Duration </h6>
              <label title="Fname">
                {get(saleData, 'deductionDuration', []).join('-')}
              </label>
            </div>
          </div>
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Employee Name </h6>
              <label title="Fname">{get(saleData, 'employeeName', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Designation </h6>
              <label title="Fname">{get(saleData, 'designation', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Total Amount </h6>
              <label title="Fname">{get(saleData, 'totalAmount', '')}</label>
            </div>
          </div>
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Is Monthly Advance</h6>
              <div>{get(saleData, 'isMonthlyAdvance', '')}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SaleInfoview;
