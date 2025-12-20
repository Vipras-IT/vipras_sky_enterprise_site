/* eslint-disable react/prop-types */
import { Col, Row } from 'react-bootstrap';
import StatisticsCard from './StatisticsCard';
import bg1 from 'assets/corner-1.png';
import bg2 from 'assets/corner-2.png';
import bg3 from 'assets/corner-3.png';
import { get } from 'lodash';

const StatisticsCards = ({ ticketReport, verificationCount }) => {
  const statsData = [
    {
      title: 'Open',
      value: get(ticketReport, 'open', 0),
      decimal: false,
      suffix: '',
      prefix: '',
      valueClassName: 'text-warning',
      badgeBg: 'warning',
      // badgeText: '-0.23%',
      link: '/e-commerce/customers',
      linkText: 'See all',
      image: bg1,
    },
    {
      title: 'In Progress',
      value: get(ticketReport, 'inProgress', 0),
      decimal: false,
      suffix: '',
      prefix: '',
      valueClassName: 'text-info',
      badgeBg: 'info',
      // badgeText: '0.0%',
      link: '/e-commerce/orders/order-list',
      linkText: 'All orders',
      image: bg2,
    },
    {
      title: 'Completed',
      value: get(ticketReport, 'completed', 0),
      decimal: false,
      suffix: '',
      prefix: '',
      valueClassName: '',
      badgeBg: 'success',
      // badgeText: '9.54%',
      link: '/',
      linkText: 'Statistics',
      image: bg3,
    },
    {
      title: 'Approved',
      value: get(ticketReport, 'approved', 0),
      decimal: false,
      suffix: '',
      prefix: '',
      valueClassName: 'text-warning',
      badgeBg: 'warning',
      // badgeText: '-0.23%',
      link: '/e-commerce/customers',
      linkText: 'See all',
      image: bg1,
    },
    {
      title: 'Closed',
      value: get(ticketReport, 'closed', 0),
      decimal: false,
      suffix: '',
      prefix: '',
      valueClassName: 'text-info',
      badgeBg: 'info',
      // badgeText: '0.0%',
      link: '/e-commerce/orders/order-list',
      linkText: 'All orders',
      image: bg2,
    },
    {
      title: 'Total',
      value: get(ticketReport, 'total', 0),
      decimal: false,
      suffix: '',
      prefix: '',
      valueClassName: '',
      badgeBg: 'success',
      // badgeText: '9.54%',
      link: '/',
      linkText: 'Statistics',
      image: bg3,
    },
    {
      title: 'Pending Verification',
      value: get(verificationCount, 'totalItems', 0),
      decimal: false,
      suffix: '',
      prefix: '',
      valueClassName: 'text-info',
      badgeBg: 'info',
      // badgeText: '9.54%',
      link: '/',
      linkText: 'Statistics',
      image: bg3,
    },
  ];

  return (
    <Row className="g-3 mb-3">
      {statsData.map((stat, index) => (
        <Col key={stat.title} sm={index === 2 ? 12 : 6} md={2}>
          <StatisticsCard stat={stat} style={{ minWidth: '12rem' }} />
        </Col>
      ))}
    </Row>
  );
};

export default StatisticsCards;
