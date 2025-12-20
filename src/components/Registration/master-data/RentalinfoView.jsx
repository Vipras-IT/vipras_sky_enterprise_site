/* eslint-disable react/prop-types */

import { get } from 'lodash';

const RentalInfoView = ({ rentalRoomData }) => {
  return (
    <>
      <div className="mt-3 card LineSpace ">
        <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-300 rounded-0">
          <div className="d-flex justify-content-between ">
            <h5 className="text-white">Room Rental Details</h5>
          </div>
        </div>

        <div className="fs--1 card-body">
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Site Created Date </h6>
              <label className="form-label" title="Fname">
                {get(rentalRoomData, 'startDate', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Branch Code </h6>
              <label title="Fname">
                {get(rentalRoomData, 'branchCode', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Room Code</h6>
              <label title="Fname">{get(rentalRoomData, 'roomCode', '')}</label>
            </div>
          </div>
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Rooms Alloted Units </h6>
              <label title="Fname">
                {get(rentalRoomData, 'roomsallottedUnit', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Incharge Person for Room </h6>
              <label title="Fname">
                {get(rentalRoomData, 'inchargePerson', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Incharge Person ID No </h6>
              <label title="Fname">
                {get(rentalRoomData, 'inchargePersonNo', '')}
              </label>
            </div>
          </div>

          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Room Owner Name </h6>
              <label title="Fname">
                {get(rentalRoomData, 'roomOwnersName', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Contact No </h6>
              <label title="Fname">
                {get(rentalRoomData, 'contactNumber', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Room Address </h6>
              <label title="Fname">
                {get(rentalRoomData, 'roomAddress', '')}
              </label>
            </div>
          </div>

          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Bank A/c Holder Name </h6>
              <label title="Fname">
                {get(rentalRoomData, 'accountHolderName', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Bank A/c No </h6>
              <label title="Fname">
                {get(rentalRoomData, 'accountNo', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Bank Name </h6>
              <label title="Fname">{get(rentalRoomData, 'bank', '')}</label>
            </div>
          </div>

          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Bank Branch Name </h6>
              <label title="Fname">{get(rentalRoomData, 'branch', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">IFSC Code</h6>
              <label title="Fname">{get(rentalRoomData, 'ifscCode', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Advance Amount </h6>
              <label title="Fname">
                {get(rentalRoomData, 'advanceAmount', '')}
              </label>
            </div>
          </div>

          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Rental Amount </h6>
              <label title="Fname">
                {get(rentalRoomData, 'rentalAmount', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">EB and Water Charge</h6>
              <label title="Fname">
                {get(rentalRoomData, 'ebandWater', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Rental Date </h6>
              <label title="Fname">
                {get(rentalRoomData, 'rentalDate', '')}
              </label>
            </div>
          </div>

          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Agreement Period </h6>
              <label title="Fname">
                {get(rentalRoomData, 'agreementPeriod', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Agreement Expiry Date</h6>
              <label title="Fname">
                {get(rentalRoomData, 'agreementExpiryDate', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Capacity of Room </h6>
              <label title="Fname">
                {get(rentalRoomData, 'capacityRoom', '')}
              </label>
            </div>
          </div>

          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">No of Employees Assigned </h6>
              <label title="Fname">
                {get(rentalRoomData, 'NoOfEmployeesAssigned', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Location</h6>
              <label title="Fname">{get(rentalRoomData, 'location', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Vacant </h6>
              <label title="Fname">{get(rentalRoomData, 'vacant', '')}</label>
            </div>
          </div>

          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Rent Deduct from Advance </h6>
              <label title="Fname">
                {get(rentalRoomData, 'IfRentDeductFromAdvance', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Balance Advance Amount</h6>
              <label title="Fname">
                {get(rentalRoomData, 'balanceAdvanceAmount', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Advance Claim </h6>
              <label title="Fname">
                {get(rentalRoomData, 'advanceClaim', '')}
              </label>
            </div>
          </div>

          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Photos</h6>
              <label title="Fname">
                {get(rentalRoomData, 'photosRoom', '')}
              </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RentalInfoView;
