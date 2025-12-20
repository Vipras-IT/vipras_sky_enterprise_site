/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import Flex from 'components/common/Flex';
import signalImg from 'assets/signal.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import SimpleBarReact from 'simplebar-react';

const SingleItem = ({ icon, title, description }) => {
  return (
    <div className="border border-1 border-300 rounded-2 p-3 ask-analytics-item position-relative mb-3">
      <Flex alignItems="center" className="mb-3">
        <FontAwesomeIcon icon="code-branch" className="text-primary" />
        <Link to="#!" className="stretched-link text-decoration-none">
          <h5 className="fs--1 text-600 mb-0 ps-3">{title}</h5>
        </Link>
      </Flex>
      <h5 className="fs--1 text-800">{description}</h5>
      {/* <Link target="_blank" to={icon}>
        <a href={icon}>{icon}</a>
      </Link> */}
    </div>
  );
};

SingleItem.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const Intelligence = ({ data }) => {
  return (
    <Card className="h-100">
      <Card.Header as={Flex} alignItems="center">
        <img src={signalImg} alt="intelligence" height={35} className="me-2" />
        <h5 className="fs-0 fw-normal text-800 mb-0">Notice board</h5>
      </Card.Header>
      <Card.Body className="p-0">
        <SimpleBarReact className="ask-analytics">
          <div className="pt-0 px-x1">
            {data.map((item) => (
              <SingleItem
                key={item.title}
                icon={item.link}
                title={item.title}
                description={item.text}
              />
            ))}
          </div>
        </SimpleBarReact>
      </Card.Body>
    </Card>
  );
};

Intelligence.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape(SingleItem.propTypes)).isRequired,
};

export default Intelligence;
