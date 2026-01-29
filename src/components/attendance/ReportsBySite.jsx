/* eslint-disable react/prop-types */
// import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Flex from 'components/common/Flex';
import SimpleBarReact from 'simplebar-react';
import siteImage from 'assets/Sky-Logo.jpeg'
import moment from 'moment';

const BestSellingTableRow = ({
  product,
  generateReport,
  invoiceGenerateReport,
  generateProfitLoseReport,
}) => {
  const {
    unitCode,
    name,
    invoiceGeneratedOn,
    salaryGeneratedOn,
    sitePlGeneratedOn,
  } = product;

  const generateSalary = () => {
    generateReport('Salary', unitCode, name);
  };

  const generateInvoice = () => {
    invoiceGenerateReport('Invoice', unitCode, name);
  };

  const generateProfitLose = () => {
    generateProfitLoseReport('Profit', unitCode, name);
  };

  const salaryGenerateDate = salaryGeneratedOn
    ? moment(new Date(salaryGeneratedOn)).format('LLL')
    : '';

  const invoiceGenerateDate = invoiceGeneratedOn
    ? moment(new Date(invoiceGeneratedOn)).format('LLL')
    : '';

  const profitGenerateDate = sitePlGeneratedOn
    ? moment(new Date(sitePlGeneratedOn)).format('LLL')
    : '';

  return (
    <tr className="border-top border-200">
      <td>
        <Flex alignItems="center" className="position-relative">
          <img
            className="rounded-1 border border-200"
            src={siteImage}
            width={60}
            alt={name}
          />
          <div className="ms-3">
            <h6 className="mb-1 fw-semi-bold">
              <Link
                className="text-dark stretched-link"
                to="/e-commerce/product/product-details"
              >
                {name}
              </Link>
            </h6>
            <p className="fw-semi-bold mb-0 text-500">{unitCode}</p>
          </div>
        </Flex>
      </td>
      <td className="align-middle text-center fw-semi-bold width-180">
        {salaryGenerateDate}
      </td>
      <td className="align-middle text-center fw-semi-bold width-180">
        {invoiceGenerateDate}
      </td>
      <td className="align-middle text-center fw-semi-bold width-180">
        {profitGenerateDate}
      </td>
      <td className="align-middle text-center fw-semi-bold width-400">
        <Button className="attendance-btn mb-1" onClick={generateSalary}>
          <span className="ps-2">Salary</span>
        </Button>
        <Button className="ms-1 attendance-btn mb-1" disabled onClick={generateInvoice}>
          <span className="ps-2">Invoice</span>
        </Button>
        <Button
          className="ms-1 attendance-btn mb-1"
          onClick={generateProfitLose}
        >
          <span className="ps-2">PL</span>
        </Button>
      </td>
    </tr>
  );
};

const ReportsBySite = ({
  products,
  generateReport,
  invoiceGenerateReport,
  generateProfitLoseReport,
}) => {
  return (
    <Card className="h-lg-100 overflow-hidden">
      <Card.Body className="p-0">
        <SimpleBarReact
          style={{
            maxHeight: '80vh',
            overflow: 'auto',
          }}
        >
          <Table borderless className="mb-0 fs--1">
            <thead className="bg-light sticky-top">
              <tr className="text-900 fs-1">
                <th>Generated Report</th>
                <th className="text-center">Salary</th>
                <th className="text-center">Invoice</th>
                <th className="text-center">PL</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <BestSellingTableRow
                  product={product}
                  key={product.id}
                  generateReport={generateReport}
                  invoiceGenerateReport={invoiceGenerateReport}
                  generateProfitLoseReport={generateProfitLoseReport}
                />
              ))}
            </tbody>
          </Table>
        </SimpleBarReact>
      </Card.Body>
    </Card>
  );
};

export default ReportsBySite;
