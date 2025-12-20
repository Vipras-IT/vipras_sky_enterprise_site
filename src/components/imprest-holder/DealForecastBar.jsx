/* eslint-disable react/prop-types */

import { Card, Col, ProgressBar, Row } from 'react-bootstrap';
import FalconCardHeader from 'components/common/FalconCardHeader';
import CardDropdown from 'components/common/CardDropdown';
import classNames from 'classnames';
import Flex from 'components/common/Flex';
const DealForecastBar = ({ expenses, imprestTo, advance, salary }) => {
  const dealForecastData = [
    {
      id: 1,
      title: 'Advances',
      amount: advance,
      variant: 'progress-gradient',
    },
    {
      id: 2,
      title: 'Expenses',
      amount: expenses,
      variant: 'success',
    },
    {
      id: 3,
      title: 'Impresed To',
      amount: imprestTo,
      variant: 'warning',
    },
    {
      id: 4,
      title: 'Salary Paid',
      amount: salary,
      variant: 'info',
    },
  ];

  const total = dealForecastData.reduce((acc, data) => acc + data.amount, 0);

  return (
    <Card className="h-100">
      <FalconCardHeader
        title="Expensess"
        titleTag="h5"
        className="border-200 border-bottom py-2"
        endEl={<CardDropdown />}
      />
      <Card.Body as={Flex} alignItems="center">
        <div className="w-100">
          <h3 className="text-700 mb-6">{total.toLocaleString()}</h3>
          <ProgressBar
            className="font-sans-serif fs--1 fw-medium mt-xxl-auto rounded-3 overflow-visible"
            style={{ height: 20 }}
          >
            {total > 0 &&
              dealForecastData.map((item, index) => {
                if (item.amount === 0) {
                  return null;
                }
                return (
                  <ProgressBar
                    variant={item.variant}
                    now={(item.amount / total) * 100}
                    key={item.id}
                    className={classNames(
                      'overflow-visible position-relative',
                      {
                        'rounded-end rounded-pill': index === 0,
                        'rounded-start rounded-pill':
                          index === dealForecastData.length - 1,
                        ' border-end border-white border-2':
                          index !== dealForecastData.length - 1,
                      },
                    )}
                    label={
                      <h5
                        className="text-800 position-absolute"
                        style={{ top: -30 }}
                      >
                        {item.amount}
                      </h5>
                    }
                  />
                );
              })}
          </ProgressBar>
          <Row className="fs--1 fw-semi-bold text-500 mt-3 g-0">
            {dealForecastData.map((item, index) => (
              <Col
                xs="auto"
                key={index}
                as={Flex}
                alignItems="center"
                className="pe-3"
              >
                <span className={`dot bg-${item.variant}`}></span>
                <span>{item.title}</span>
                <span className="d-none d-md-inline-block d-lg-none d-xxl-inline-block">
                  ({((item.amount / total) * 100).toFixed(1)}%)
                </span>
              </Col>
            ))}
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DealForecastBar;
