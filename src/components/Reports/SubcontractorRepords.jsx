/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Flex from 'components/common/Flex';
import SimpleBarReact from 'simplebar-react';
import {
  getErrorMessage,
  disableFutureDates,
  formattedAmount,
} from 'helpers/utils';
import subContractorApi from 'api/subcontractor';
import { Col, Row, Space } from 'antd';
import { get } from 'lodash';
import { useAuth } from 'hooks/useAuth';
import { toast } from 'react-toastify';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';
const BestSellingTableRows = ({ product }) => {
  const { employeeId, employeeName, debit, credit, cashInhand, openingBalance } = product;

  return (
    <tr className="border-top border-200 ">
      <td>
        <Flex alignItems="center" className="position-relative">
          <div className="ms-3">
            <h6 className="mb-1 fw-semi-bold">
              <Link className="text-dark stretched-link" to="#">
                {employeeName}
              </Link>
            </h6>
            <p className="fw-semi-bold mb-0 text-500">{employeeId}</p>
          </div>
        </Flex>
      </td>
      <td className="align-middle text-center fw-semi-bold">
        {formattedAmount(openingBalance)}
      </td>
      <td className="align-middle text-center fw-semi-bold ">
        {formattedAmount(credit)}
      </td>
      <td className="align-middle text-center fw-semi-bold ">
        {formattedAmount(debit)}
      </td>
      <td className="align-middle text-center fw-semi-bold ">
        {formattedAmount(cashInhand)}
      </td>
    </tr>
  );
};

const SubcontractorRepords = () => {
  const { user } = useAuth();
  const todayDate = new Date();
  const [value, setValue] = useState(todayDate);
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [data, setData] = useState([]);

  const handleChange = (date) => {
    setValue(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  useEffect(() => {
    showUpdateEmployee(currentMonth, currentYear);
  }, [value]);
  const showUpdateEmployee = async (month, year) => {
    const response = await subContractorApi.getSubContractorReport(
      month,
      year
    );
    const errorMessage = getErrorMessage(response);
    if (errorMessage) {
      toast.error(errorMessage, {
        theme: 'colored',
      });
    } else {
      const res = get(response, 'data.data', []);

      const totalDebit = res.reduce(
        (accumulator, item) => accumulator + (item.debit || 0),
        0,
      );

      const totalCredit = res.reduce(
        (accumulator, item) => accumulator + (item.credit || 0),
        0,
      );

      const totalCashInHand = res.reduce(
        (accumulator, item) => accumulator + (item.cashInhand || 0),
        0,
      );

      const totalopeningBalance = res.reduce(
        (accumulator, item) => accumulator + (item.openingBalance || 0),
        0,
      );

      const finalTotal = [...res];
      finalTotal.push({
        employeeId: 0,
        employeeName: 'TOTAL',
        openingBalance: totalopeningBalance,
        debit: totalDebit,
        credit: totalCredit,
        cashInhand: totalCashInHand,
      });

      setData(finalTotal);
    }
  };

  return (
    // <Card className="h-lg-100 overflow-hidden">
    <Card className="overflow-hidden">
      <Card.Header className="bg-shape modal-shape-header px-20 position-relative">
        <div className="position-relative light">
          <h5 className="mb-0 text-white">Sub Contractor - Summary Reports</h5>
        </div>
      </Card.Header>
      <Row align="end me-3 mt-3 mb-3">
        <Col offset={1}>
          <Space wrap>
            <DatePicker
              format="MMM yyyy"
              caretAs={BsCalendar2MonthFill}
              value={value}
              onChange={handleChange}
              shouldDisableDate={disableFutureDates}
            />
          </Space>
        </Col>
      </Row>
      <Card.Body className="p-0">
        <SimpleBarReact
          style={{
            maxHeight: '80vh',
            overflow: 'auto',
          }}
        >
          <Table borderless className="mb-0 fs--1">
            <thead className="bg-light sticky-top">
              <tr className="text-900 ">
                <th className="fs-1">Sub Contractor Name</th>
                <th className="text-center fs-1">Opening Balance</th>
                <th className="text-center fs-1">Credit</th>
                <th className="text-center fs-1">Debit</th>
                <th className="pe-x1 text-end fs-1" style={{ width: '12rem' }}>
                  Cash In hand (₹)
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((product) => (
                <BestSellingTableRows product={product} key={product.id} />
              ))}
            </tbody>
          </Table>
        </SimpleBarReact>
      </Card.Body>
    </Card>
  );
};

export default SubcontractorRepords;
