/* eslint-disable react/display-name */
import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import logo from 'assets/vipras_laundry_logo_full.png';
import Avatar from 'components/common/Avatar';
import avatarImg from 'assets/avatar.png';
import signature from 'assets/signature.jpeg';
import PropTypes from 'prop-types';

const TermsForms = React.forwardRef((props, ref) => {
  const [flip, setFlip] = useState(false);

  const nameValue = props.watch('employeeName');
  const employeeNumber = props.watch('employeeNumber');
  const role = props.watch('role');
  const profilePicture = props.watch('documents.profilePhotoUrl');

  const handleFlip = () => {
    setFlip(!flip);
  };

  return (
    <>
      <div
        ref={ref}
        onClick={handleFlip}
        className="poster-container new-id-card"
      >
        <div className={flip ? 'poster flipped' : 'poster'}>
          <Card className="pic front">
            <Card.Img src={logo} variant="top" />
            <Card.Body className="no-padding-y">
              <div>
                <h4 className="mb-1 card-font-size">IDENTITY CARD</h4>
              </div>
              <Avatar
                size="5xl"
                src={profilePicture ? profilePicture : avatarImg}
                mediaClass="img-thumbnail shadow-sm"
                className="avatar-id-card"
              />
              <h4 className="mb-1 card-font-size">{nameValue}</h4>

              <h5 className="card-font-size">{role}</h5>
              <div className="id-card-text-container">
                <h5 className="id-card-text card-font-size">{`ID No: ${employeeNumber}`}</h5>
                {/* <h5 className="fw-normal id-card-text">{`Blood: ${bloodGroup}`}</h5> */}
              </div>
              <div>
                <img
                  className="d-block mx-auto id-card-image-new"
                  src={signature}
                  alt="shield"
                  width={100}
                />
              </div>
              <h5 className="card-font-size sign-text">Authorised Signatory</h5>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
});
TermsForms.propTypes = {
  register: PropTypes.func.isRequired,
  errors: PropTypes.object,
  watch: PropTypes.func,
  isNew: PropTypes.bool,
};

export default TermsForms;
