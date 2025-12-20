/* eslint-disable react/prop-types */

import { get, isEmpty } from 'lodash';

const SiteInfoview = ({ siteData }) => {
  let deployment = '';

  const deploymentList = get(siteData, 'deployment', []);
  deploymentList.map((data) => {
    deployment += `${data}, `;
  });

  const shiftoptionList = get(siteData, 'shiftoption', []);
  const shiftList = shiftoptionList.map((data) => (
    <p className="shift-option" key={data}>
      {data}
    </p>
  ));

  return (
    <>
      <div className="mt-3 card LineSpace ">
        <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-300 rounded-0">
          <div className="d-flex justify-content-between ">
            <h5 className="text-white">Site Details</h5>
          </div>
        </div>

        <div className="fs--1 card-body">
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Site Created Date </h6>
              <label className="form-label" title="Fname">
                {get(siteData, 'startdate', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Building Name </h6>
              <label title="Fname">{get(siteData, 'builderName', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Site Name </h6>
              <label title="Fname">{get(siteData, 'siteName', '')}</label>
            </div>
          </div>
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Branch Code </h6>
              <label title="Fname">{get(siteData, 'branchCode', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">City </h6>
              <label title="Fname">{get(siteData, 'city', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">State </h6>
              <label title="Fname">{get(siteData, 'state', '')}</label>
            </div>
          </div>
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Deployment options </h6>
              <label title="Fname">{deployment}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Agreed Manpower</h6>
              <label title="Fname">
                {get(siteData, 'agreedmanpower', '20/10/2020')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Agreed OT </h6>
              <label title="Fname">
                {isEmpty(get(siteData, 'agreedot', ''))
                  ? get(siteData, 'agreedot', '')
                  : get(siteData, 'agreedot', '')}
              </label>
            </div>
          </div>
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Agreed Weekoff </h6>
              <label title="Fname">{get(siteData, 'agreedweekoff', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Agreed Amount </h6>
              <label title="Fname">{get(siteData, 'agreedamount', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Agreed Holiday </h6>
              <label title="Fname">{get(siteData, 'agreedholiday', '')}</label>
            </div>
          </div>
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Shift Option </h6>
              <div>{shiftList}</div>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Credit Period </h6>
              <label title="Fname">{get(siteData, 'creditPeriod', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Location </h6>
              <label title="Fname">{get(siteData, 'location', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">GST Number </h6>
              <label title="Fname">{get(siteData, 'gstNumber', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">HK Consumable Budget Assgined</h6>
              <label title="Fname">
                {get(siteData, 'hkConsumableBudget', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">HK Consumable Budget Amount</h6>
              <label title="Fname">
                {get(siteData, 'hkConsumableAmount', '')}
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SiteInfoview;
