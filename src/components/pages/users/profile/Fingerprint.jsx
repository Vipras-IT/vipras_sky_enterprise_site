/* eslint-disable react/prop-types */

import { Card, Col, Row } from 'react-bootstrap';
import FalconCardHeader from 'components/common/FalconCardHeader';
import { Link } from 'react-router-dom';
import { isEmpty, get, forIn } from 'lodash';

const FingerPrint = ({ documents }) => {
  const voterIdDocs = [];
  const aadharCardDocs = [];
  const markSheetDocs = [];
  forIn(documents, (value, key) => {
    if (key.startsWith('voter_id')) {
      voterIdDocs.push(value);
    }
    if (key.startsWith('aadhar_card')) {
      aadharCardDocs.push(value);
    }
    if (key.startsWith('mark_sheet')) {
      markSheetDocs.push(value);
    }
  });

  return (
    <Card className="mt-3">
      <FalconCardHeader title="Documents" light />
      <Card.Body>
        <Row className="g-2">
          {!isEmpty(aadharCardDocs) &&
            aadharCardDocs.map((item, index) => (
              <Col xs={6} key={item}>
                <Link target="_blank" to={item}>
                  Aadhar card {index + 1}
                </Link>
              </Col>
            ))}
          {!isEmpty(get(documents, 'pan_card')) && (
            <Col xs={6}>
              <Link target="_blank" to={get(documents, 'pan_card')}>
                PAN card
              </Link>
            </Col>
          )}
          {!isEmpty(get(documents, 'left_finger_print')) && (
            <Col xs={6}>
              <Link target="_blank" to={get(documents, 'left_finger_print')}>
                Left finger print
              </Link>
            </Col>
          )}
          {!isEmpty(get(documents, 'right_finger_print')) && (
            <Col xs={6}>
              <Link target="_blank" to={get(documents, 'right_finger_print')}>
                Right finger print
              </Link>
            </Col>
          )}
          {!isEmpty(get(documents, 'police_verification_certificate')) && (
            <Col xs={6}>
              <Link
                target="_blank"
                to={get(documents, 'police_verification_certificate')}
              >
                Police Verification Certification
              </Link>
            </Col>
          )}
          {!isEmpty(voterIdDocs) &&
            voterIdDocs.map((item, index) => (
              <Col xs={6} key={item}>
                <Link target="_blank" to={item}>
                  Voter Id {index + 1}
                </Link>
              </Col>
            ))}
          {!isEmpty(get(documents, 'driving_licence')) && (
            <Col xs={6}>
              <Link target="_blank" to={get(documents, 'driving_licence')}>
                Driving Licence
              </Link>
            </Col>
          )}
          {!isEmpty(markSheetDocs) &&
            markSheetDocs.map((item, index) => (
              <Col xs={6} key={item}>
                <Link target="_blank" to={item}>
                  Mark sheet {index + 1}
                </Link>
              </Col>
            ))}
          {!isEmpty(get(documents, 'profilePhotoUrl')) && (
            <Col xs={6}>
              <Link target="_blank" to={get(documents, 'profilePhotoUrl')}>
                Your Photo
              </Link>
            </Col>
          )}
          {!isEmpty(get(documents, 'family_photo')) && (
            <Col xs={6}>
              <Link target="_blank" to={get(documents, 'family_photo')}>
                Your Family Photo
              </Link>
            </Col>
          )}
          {!isEmpty(get(documents, 'family_photo_other')) && (
            <Col xs={6}>
              <Link target="_blank" to={get(documents, 'family_photo_other')}>
                Your Other Family Photo
              </Link>
            </Col>
          )}
          {!isEmpty(get(documents, 'other_documents')) && (
            <Col xs={6}>
              <Link target="_blank" to={get(documents, 'other_documents')}>
                Other documents
              </Link>
            </Col>
          )}

          {!isEmpty(get(documents, 'profile_video')) && (
            <Col xs={6}>
              <Link target="_blank" to={get(documents, 'profile_video')}>
                Your Videos
              </Link>
            </Col>
          )}
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FingerPrint;
