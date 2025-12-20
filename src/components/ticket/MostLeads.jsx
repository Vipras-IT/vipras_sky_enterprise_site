import PropTypes from 'prop-types';
import Flex from 'components/common/Flex';
import { Card, Col, Row } from 'react-bootstrap';
import MostLeadsChart from './MostLeadsChart';
import classNames from 'classnames';

const LeadItem = ({ item, isLast }) => {
  return (
    <Flex
      justifyContent="between"
      alignItems="center"
      className={classNames('border-bottom py-3', {
        'border-bottom-0 pb-0': isLast,
      })}
    >
      <Flex>
        <h6 className="text-700 mb-0">{item.title}</h6>
      </Flex>
      <p className="fs--1 text-500 mb-0 fw-semi-bold">{item.target}</p>
      <h6 className="text-700 mb-0">{item.amount}%</h6>
    </Flex>
  );
};

const MostLeads = () => {
  const leadsData = [
    {
      id: 1,
      title: 'Present',
      target: '5',
      img: null,
      amount: 98,
    },
    {
      id: 2,
      title: 'Absent',
      target: '15',
      img: null,
      amount: 25,
    },
    {
      id: 3,
      title: 'No of duty',
      target: '25',
      img: null,
      amount: 63,
    },
    {
      id: 4,
      title: 'Week Off',
      target: '60',
      img: null,
      amount: 53,
    },
  ];
  return (
    <Card className="h-100">
      <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
        <div className="position-relative z-index-1 light">
          <h5 className="mb-0 text-white">Team Attendance</h5>
        </div>
      </Card.Header>
      <Card.Body as={Row}>
        <Col md={5} xxl={12} className="mb-xxl-1">
          <MostLeadsChart />
        </Col>
        <Col xxl={12} md={7}>
          <hr className="mx-ncard mb-0 d-md-none d-xxl-block" />
          {leadsData.map((item, index) => (
            <LeadItem
              key={item.id}
              item={item}
              isLast={index === leadsData.length - 1}
            />
          ))}
        </Col>
      </Card.Body>
    </Card>
  );
};

LeadItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string.isRequired,
    target: PropTypes.string.isRequired,
    img: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
  }),
  isLast: PropTypes.bool.isRequired,
};

export default MostLeads;
