import Avatar from 'components/common/Avatar';
import LockScreenForm from 'components/authentication/LockScreenForm';
import { Col, Row } from 'react-bootstrap';
import avatarImg from 'assets/avatar.png';
import bgImg from 'assets/14.jpg';
import AuthSplitLayout from 'layouts/AuthSplitLayout';
import Flex from 'components/common/Flex';

const LockScreen = () => {
  return (
    <AuthSplitLayout bgProps={{ image: bgImg }}>
      <Row className="justify-content-center">
        <Col xs="auto">
          <Flex alignItems="center">
            <Avatar src={avatarImg} size="4xl" className="me-4" />
            <div>
              <h4>Hi! Emma</h4>
              <p className="mb-0">
                Enter your password <br />
                to access the admin.
              </p>
            </div>
          </Flex>
          <LockScreenForm className="mt-4" />
        </Col>
      </Row>
    </AuthSplitLayout>
  );
};

export default LockScreen;
