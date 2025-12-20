/* eslint-disable react/prop-types */

import { get } from 'lodash';
import { Link } from 'react-router-dom';
const ExternalTicketDetails = ({ siteData }) => {
  const formatDate = () => {
    const saleDate = new Date(get(siteData, 'date', ''));
    const month = saleDate.getMonth() + 1;
    const monthValue = month < 10 ? `0${month}` : `${month}`;
    const day = saleDate.getDate();
    const dayValue = day < 10 ? `0${day}` : `${day}`;
    return `${dayValue}/${monthValue}/${saleDate.getFullYear()}`;
  };
  return (
    <>
      <div className="mt-3 card LineSpace ">
        <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-300 rounded-0">
          <div className="d-flex justify-content-between ">
            <h5 className="text-white">External Ticket Details</h5>
          </div>
        </div>

        <div className="fs--1 card-body">
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Ticket Created Date </h6>
              <label className="form-label" title="Fname">
                {formatDate()}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Ticket Number</h6>
              <label title="Fname">{get(siteData, 'ticketNo', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Type of Call</h6>
              <label title="Fname">{get(siteData, 'typeOfCall', '')}</label>
            </div>
          </div>
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Source of Lead</h6>
              <label title="Fname">{get(siteData, 'sourceOfLead', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Client Name</h6>
              <label title="Fname">{get(siteData, 'clientName', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Contact Number</h6>
              <label title="Fname">{get(siteData, 'contactNumber', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Email</h6>
              <label title="Fname">{get(siteData, 'emailId', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Address</h6>
              <label title="Fname">{get(siteData, 'address', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Assigned to</h6>
              <label title="Fname">{get(siteData, 'createdBy', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Ticket Documents</h6>
              <label title="Fname">
                <Link target="_blank" to={get(siteData, 'issueDocuments', '')}>
                  <a href={get(siteData, 'issueDocuments', '')}>
                    {get(siteData, 'issueDocuments', '')}
                  </a>
                </Link>
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExternalTicketDetails;
