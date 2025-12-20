/* eslint-disable react/display-name */
import { useState, forwardRef } from 'react';
import { Card } from 'react-bootstrap';
import logo from 'assets/vipras_laundry_logo.jpeg';
// import logo from 'assets/companynamelogo.png';

import PropTypes from 'prop-types';

const TermsForms = forwardRef((props, ref) => {
  const [flip, setFlip] = useState(false);

  const contactNumber = props.watch('permanentAddress.contactNumber');
  const currentDate = props.isNew
    ? new Date()
    : new Date(props.watch('documents.joiningDate'));
  // Extract day, month, and year
  const day = String(currentDate.getDate()).padStart(2, '0');
  const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
  const year = String(currentDate.getFullYear());

  // Create the formatted date string
  const formattedDate = `${day}/${month}/${year}`;

  const dataOfJoining = formattedDate;
  const dateOfBirth = props.watch('employeeDOB');

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
          <Card className="pic back">
            <h5 className="card-font-size id-back-text">{`Date Of Birth: ${dateOfBirth}`}</h5>
            <h5 className="card-font-size id-back-text">{`Date of Join: ${dataOfJoining}`}</h5>
            <h5 className="card-font-size id-card-text card-font-size">{`Phone: ${contactNumber}`}</h5>
            <Card.Body className="no-padding-y">
              <Card.Img className="id-card-image" src={logo} variant="top" />
              <Card.ImgOverlay className="id-card-image-content">
                <Card.Title className="fs-0 mb-2 id-back-title-text">
                  Company Address
                </Card.Title>
                <Card.Text className="back-text-p1">
                  Vipras Laundry Services Pvt Ltd,
                  <br /> 94/1, Gramini Street,
                  <br /> Pattikulam, <br /> Chennai - 603104
                </Card.Text>
                <Card.Text className="back-text-p2">
                  This card is non-transferable and must be surrender on
                  cessation of the employment
                </Card.Text>
              </Card.ImgOverlay>
            </Card.Body>
            <Card.Footer className="back-text-p2">
              Contact Number: 7823911187
            </Card.Footer>
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
