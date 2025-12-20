/* eslint-disable react/prop-types */
import { useState } from 'react';
import Flex from 'components/common/Flex';
import { Col, Button } from 'react-bootstrap';
import ProductImage from './ProductImage';
import avatarImg from 'assets/avatar.png';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import { toast } from 'react-toastify';
import { getEmployeeShiftOptions } from 'helpers/utils';
import { Select } from 'antd';

const { Option } = Select;

const EmployeeGrid = ({ employee, handleUpdateAttendace }) => {
  const {
    employeeName,
    employeeNumber,
    designation,
    checkIn,
    checkOut,
    shift,
    day,
    employeeImage,
    month,
  } = employee;
  const shiftoption = getEmployeeShiftOptions();
  const [selectedOption, setSelectedOption] = useState(shift);

  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };

  const handleCheckInEmployee = (e) => {
    if (isEmpty(selectedOption)) {
      toast.error('Please select a shift', {
        theme: 'colored',
      });
    } else {
      e.preventDefault();
      const checkInTime = new Date();
      const today = moment(checkInTime).format();
      handleUpdateAttendace({
        employeeNumber,
        checkIn: today,
        checkOut,
        day,
        shift: selectedOption,
        designation: designation,
        employeeName,
      });
    }
  };

  const handleCheckOutEmployee = (e) => {
    e.preventDefault();
    if (!isEmpty(checkIn)) {
      const checkOutTime = new Date();
      const today = moment(checkOutTime).format();
      handleUpdateAttendace({
        employeeNumber,
        checkIn,
        checkOut: today,
        day,
        shift: selectedOption,
        checkoutMonth: month,
        designation: designation,
        employeeName,
      });
    } else {
      toast.error('You have to check In first', {
        theme: 'colored',
      });
    }
  };

  const checkInDate = checkIn
    ? `${new Date(checkIn).getDate()} - ${moment(new Date(checkIn)).format(
        'LT',
      )}`
    : '';
  const checkOutDate = checkOut
    ? `${new Date(checkOut).getDate()} - ${moment(new Date(checkOut)).format(
        'LT',
      )}`
    : '';

  return (
    <Col className="mb-1" xs={12} md={3}>
      <Flex
        direction="column"
        justifyContent="between"
        className="border rounded-1 h-100 pb-3"
      >
        <div className="overflow-hidden">
          <ProductImage
            name={name}
            id={get(employee, '_id')}
            files={[{ id: 1, src: employeeImage || avatarImg }]}
            layout="grid"
          />
          <div className="p-1">
            <h6 className="fs-0">
              {employeeName} - {employeeNumber}
            </h6>
            <h6 className="fs-0">{designation}</h6>
            <Select
              value={selectedOption}
              onChange={handleSelectChange}
              className="shift-select"
            >
              {shiftoption.map((item) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </div>
          <Flex justifyContent="between" className="mx-1 mt-1 mb-1">
            <div>
              <Button
                className="attendance-btn"
                onClick={handleCheckInEmployee}
                disabled={!isEmpty(checkIn)}
              >
                Check In
              </Button>
            </div>
            <div>
              <Button
                className="attendance-btn"
                onClick={handleCheckOutEmployee}
                disabled={!isEmpty(checkOut)}
              >
                Check Out
              </Button>
            </div>
          </Flex>
          <Flex key={checkIn} justifyContent="between" className="mx-2">
            <div>{checkInDate}</div>
            <div>{checkOutDate}</div>
          </Flex>
        </div>
      </Flex>
    </Col>
  );
};

export default EmployeeGrid;
