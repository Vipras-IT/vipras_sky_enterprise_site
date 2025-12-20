/* eslint-disable react/prop-types */

import { get } from 'lodash';
import { Link } from 'react-router-dom';

const TicketDetails = ({ siteData }) => {
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
            <h5 className="text-white">Ticket Details</h5>
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
              <h6 className="fs-0 mb-0">Ticket Assigned To</h6>
              <label title="Fname">
                {get(siteData, 'assignedEmployeeName', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Ticket Priority</h6>
              <label title="Fname">{get(siteData, 'ticketPriority', '')}</label>
            </div>
          </div>
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Problem Description</h6>
              <label title="Fname">
                {get(siteData, 'issueDescription', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Ticket Number</h6>
              <label title="Fname">{get(siteData, 'ticketNo', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Ticket Status</h6>
              <label title="Fname">{get(siteData, 'status', '')}</label>
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

export default TicketDetails;
