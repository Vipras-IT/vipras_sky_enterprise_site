/* eslint-disable react/prop-types */

import { Card, Table, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Flex from 'components/common/Flex';
import SimpleBarReact from 'simplebar-react';
import siteImage from 'assets/vipras_laundry_logo.jpeg';

const getProductItemCalculatedData = (aggreedManpower, totalCheckIn) => {
  const percentage = ((totalCheckIn * 100) / aggreedManpower).toFixed(0);
  return { percentage };
};

const BestSellingTableRow = ({ product }) => {
  const { agreedmanpower, noOfCheckIn, siteName, unitcode } = product;
  const { percentage } = getProductItemCalculatedData(
    agreedmanpower,
    noOfCheckIn,
  );

  return (
    <tr className="border-top border-200">
      <td>
        <Flex alignItems="center" className="position-relative">
          <img
            className="rounded-1 border border-200"
            src={siteImage}
            width={60}
            alt={siteName}
          />
          <div className="ms-3">
            <h6 className="mb-1 fw-semi-bold">
              <Link className="text-dark stretched-link" to="#">
                {siteName}
              </Link>
            </h6>
            <p className="fw-semi-bold mb-0 text-500">{unitcode}</p>
          </div>
        </Flex>
      </td>
      <td className="align-middle text-center fw-semi-bold">
        {agreedmanpower}
      </td>
      <td className="align-middle text-center fw-semi-bold">{noOfCheckIn}</td>
      <td className="align-middle pe-x1">
        <Flex alignItems="center">
          <ProgressBar
            className="me-3 bg-200"
            now={percentage}
            style={{ width: 150, height: 10 }}
          />
          <div className="fw-semi-bold ms-2">{percentage}%</div>
        </Flex>
      </td>
    </tr>
  );
};

const AttendanceReportsBySite = ({ products }) => {
  return (
    // <Card className="h-lg-100 overflow-hidden">
    <Card className="overflow-hidden">
      <Card.Body className="p-0">
        <SimpleBarReact>
          <Table borderless className="mb-0 fs--1">
            <thead className="bg-light">
              <tr className="text-900">
                <th>Today Attendance Report</th>
                <th className="text-center">Agreed Manpower</th>
                <th className="text-center">CheckIn</th>
                <th className="pe-x1 text-end" style={{ width: '10rem' }}>
                  CheckIn (%)
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <BestSellingTableRow product={product} key={product.id} />
              ))}
            </tbody>
          </Table>
        </SimpleBarReact>
      </Card.Body>
    </Card>
  );
};

export default AttendanceReportsBySite;
