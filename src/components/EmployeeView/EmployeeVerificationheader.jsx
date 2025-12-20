/* eslint-disable react/prop-types */

import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import coverSrc from 'assets/13.jpg';
import avatarImg from 'assets/avatar.png';
import Flex from 'components/common/Flex';
import VerifiedBadge from 'components/common/VerifiedBadge';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProfileBanner from '../pages/users/ProfileBanner';
import { get } from 'lodash';

const EmployeeVerificationheader = ({
  employeeData,
  siteId,
  handleEmployeeStatus,
  role,
  showVerified,
}) => {
  const employeePhoto =
    get(employeeData, 'documents.profilePhotoUrl') || avatarImg;
  const status = get(employeeData, 'isVerified', true);
  const statusText = status ? 'Verify' : 'Verify';
  // const fmStatusText = status ? 'Verified' : 'Not Verified';
  const handleStatus = () => {
    handleEmployeeStatus(!status);
  };
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN';
  return (
    <ProfileBanner>
      <ProfileBanner.Header avatar={employeePhoto} coverSrc={coverSrc} />
      <ProfileBanner.Body>
        <Row>
          <Col lg={8}>
            <h4 className="mb-1">
              {get(employeeData, 'employeeName', '')}
              <VerifiedBadge />
            </h4>
            <h5 className="fs-0 fw-normal">
              {get(employeeData, 'qualification', '')}
            </h5>
            <h5 className="fs-0 fw-normal">
              {' '}
              Emp No : {get(employeeData, 'employeeNumber', '')}
            </h5>
            <h5 className="fs-0 fw-normal">Site: {siteId}</h5>
            <h5 className="fs-0 fw-normal">
              Designation: {get(employeeData, 'role', '')}
            </h5>
            <p className="fs-0 fw-normal">
              {get(employeeData, 'permanentAddress.address', '')}
            </p>

            <div className="border-dashed border-bottom my-4 d-lg-none" />
          </Col>
          <Col lg={4}>
            <Link to="#!">
              <Flex alignItems="center" className="mb-2">
                <FontAwesomeIcon icon="user-circle" className="fs-3 me-2" />
                <div className="flex-1">
                  <h6 className="fs-0 mb-0">
                    {get(employeeData, 'permanentAddress.contactNumber', '')}
                  </h6>
                </div>
              </Flex>
              <Flex alignItems="center" className="mb-2">
                <FontAwesomeIcon icon="calendar-alt" className="fs-3 me-2" />
                <div className="flex-1">
                  <h6 className="fs-0 mb-0">
                    DOB: {get(employeeData, 'employeeDOB', '')}
                  </h6>
                </div>
              </Flex>
              <Flex alignItems="center" className="mb-2">
                <FontAwesomeIcon icon={faHeart} className="fs-3 me-2" />

                <div className="flex-1">
                  <h6 className="fs-0 mb-0">
                    Blood Group: {get(employeeData, 'bloodGroup', '')}
                  </h6>
                </div>
              </Flex>
              {isAdmin && showVerified && (
                <Flex alignItems="center" className="mb-2">
                  <Button className="w-100" onClick={handleStatus}>
                    {statusText}
                  </Button>
                </Flex>
              )}
              {/* {!isAdmin && showVerified && (
                <Flex alignItems="center" className="mb-2">
                  <FontAwesomeIcon
                    icon={faWindowRestore}
                    className="fs-3 me-2"
                  />
                  <div className="flex-1">
                    <h6 className="fs-0 mb-0">Status: {fmStatusText}</h6>
                  </div>
                </Flex>
              )} */}
            </Link>
          </Col>
        </Row>
      </ProfileBanner.Body>
    </ProfileBanner>
  );
};

export default EmployeeVerificationheader;
