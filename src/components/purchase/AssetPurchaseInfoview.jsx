/* eslint-disable react/prop-types */

import { get } from 'lodash';

const AssetPurchaseInfoview = ({ assetPurchaseData }) => {
  const saleDate = new Date(get(assetPurchaseData, 'date', null));
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
            <h5 className="text-white">Asset Purchase Details</h5>
          </div>
        </div>

        <div className="fs--1 card-body">
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Asset Purchase Created Date </h6>
              <label className="form-label" title="Fname">
                {formatDate}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">invoiceNo</h6>
              <label title="Fname">
                {get(assetPurchaseData, 'invoiceNo', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Vendor Name</h6>
              <label title="Fname">
                {get(assetPurchaseData, 'vendorName', '')}
              </label>
            </div>
          </div>
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Vendor Code</h6>
              <label title="Fname">
                {get(assetPurchaseData, 'vendorCode', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Total Amount </h6>
              <label title="Fname">
                {get(assetPurchaseData, 'totalAmount', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Grant Total</h6>
              <label title="Fname">
                {get(assetPurchaseData, 'grantTotal', '')}
              </label>
            </div>
          </div>
        </div>
        {/* <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Products</h6>
              <div>{productList}</div>
            </div>
            </div> */}
      </div>
    </>
  );
};

export default AssetPurchaseInfoview;
