/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import Flex from 'components/common/Flex';
import { Col, Button } from 'react-bootstrap';
import ProductImage from './ProductImage';
import avatarImg from 'assets/avatar.png';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import { toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModal';
import { getShiftOptions } from 'helpers/utils';

const EmployeeGrid = ({
  employee,
  handleCheckIn,
  handleCheckOut,
  handleContinueShift,
  ...rest
}) => {
  const shiftoption = getShiftOptions();
  const {
    id,
    employeeName,
    employeeNumber,
    designation,
    isNew,
    attendance,
    employeeImage,
  } = employee;

  console.log('Employee id', id);
  console.log('employeeNumber', employeeNumber);
  console.log('employeeName', employeeName);
  console.log('attendance', attendance);

  const [attendanceData, setAttendanceData] = useState(attendance);

  let isShiftCompleted = '';
  if (
    attendanceData.length === 1 &&
    !isEmpty(attendanceData[0].checkIn) &&
    !isEmpty(attendanceData[0].checkOut)
  ) {
    isShiftCompleted = 'first';
  }
  if (
    attendanceData.length === 2 &&
    !isEmpty(attendanceData[1].checkIn) &&
    !isEmpty(attendanceData[1].checkOut)
  ) {
    isShiftCompleted = 'second';
  }

  if (
    attendanceData.length === 1 &&
    (isEmpty(attendanceData[0].checkIn) || isEmpty(attendanceData[0].checkOut))
  ) {
    isShiftCompleted = '';
  }
  if (
    attendanceData.length === 2 &&
    (isEmpty(attendanceData[1].checkIn) || isEmpty(attendanceData[1].checkOut))
  ) {
    isShiftCompleted = '';
  }
  if (
    attendanceData.length === 3 &&
    (isEmpty(attendanceData[2].checkIn) || isEmpty(attendanceData[2].checkOut))
  ) {
    isShiftCompleted = '';
  }

  const shiftLenght = attendanceData.length;
  const isValidCheckInDate =
    !isEmpty(attendanceData) &&
    !isEmpty(attendanceData[shiftLenght - 1].checkIn);
  const isValidCheckOutDate =
    !isEmpty(attendanceData) &&
    !isEmpty(attendanceData[shiftLenght - 1].checkOut);

  const checkInDate = isValidCheckInDate
    ? attendanceData[shiftLenght - 1].checkIn
    : '';
  const checkOutDate = isValidCheckOutDate
    ? attendanceData[shiftLenght - 1].checkOut
    : '';

  const [checkIn, setCheckIn] = useState(checkInDate);
  const [checkOut, setCheckOut] = useState(checkOutDate);
  const [modalVisible, setModalVisible] = useState(false);

  const handleCheckInEmployee = (e) => {
    e.preventDefault();
    const today = moment(new Date()).format();
    setCheckIn(today);
    attendanceData[shiftLenght - 1].checkIn = today;
    handleCheckIn({
      id: id,
      employeeName: employeeName,
      employeeNumber: employeeNumber,
      employeeImage: employeeImage,
      designation,
      attendance: attendanceData,
    });
  };

  const handleCheckOutEmployee = (e) => {
    e.preventDefault();
    if (!isEmpty(checkIn)) {
      const today = moment(new Date()).format();
      setCheckOut(today);
      attendanceData[shiftLenght - 1].checkOut = today;
      handleCheckOut({
        id: id,
        employeeName: employeeName,
        employeeNumber: employeeNumber,
        employeeImage: employeeImage,
        designation,
        attendance: attendanceData,
      });
    } else {
      toast.error('You have to check In first', {
        theme: 'colored',
      });
    }
  };

  useEffect(() => {
    const shiftLenght = attendance.length;
    const isValidCheckInDate =
      !isEmpty(attendanceData) && !isEmpty(attendance[shiftLenght - 1].checkIn);
    const isValidCheckOutDate =
      !isEmpty(attendanceData) &&
      !isEmpty(attendance[shiftLenght - 1].checkOut);

    const checkInDate = isValidCheckInDate
      ? attendance[shiftLenght - 1].checkIn
      : '';
    const checkOutDate = isValidCheckOutDate
      ? attendance[shiftLenght - 1].checkOut
      : '';

    setCheckIn(checkInDate);
    setCheckOut(checkOutDate);
    setAttendanceData(attendance);
  }, [attendance]);

  const continueShift = () => {
    setModalVisible(true);
  };

  const handleConfirm = (selectedOption) => {
    // Handle the user's selection here
    console.log('Selected option:', selectedOption);
    attendanceData.push({
      checkIn: '',
      checkOut: '',
      shift: selectedOption,
    });
    handleContinueShift({
      id: id,
      employeeName: employeeName,
      employeeNumber: employeeNumber,
      employeeImage: employeeImage,
      designation,
      attendance: attendanceData,
    });
    setCheckIn('');
    setCheckOut('');
    // Close the modal
    setModalVisible(false);
  };

  const handleCancel = () => {
    // Close the modal without any action
    setModalVisible(false);
  };

  return (
    <>
      <ConfirmationModal
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        shiftoption={shiftoption}
      />
      <Col className="mb-4" {...rest}>
        <Flex
          direction="column"
          justifyContent="between"
          className="border rounded-1 h-100 pb-3"
        >
          <div className="overflow-hidden">
            <ProductImage
              name={name}
              id={get(employee, '_id')}
              isNew={isNew}
              files={[{ id: 1, src: employeeImage || avatarImg }]}
              layout="grid"
            />
            <div className="p-1">
              <h6 className="fs-0">{employeeName}</h6>
              <p className="fs--1 mb-3">{employeeNumber}</p>
              <p className="fs-0">{designation}</p>
              <p className="fs--1 mb-3">{get(attendance[0], 'shift', '')}</p>
            </div>
            <Flex justifyContent="between" className="mx-1">
              <div>
                <Button
                  className="attendance-btn mb-4"
                  onClick={handleCheckInEmployee}
                  disabled={!isEmpty(checkIn)}
                >
                  Check In
                </Button>
              </div>
              <div>
                <Button
                  className="attendance-btn mb-4"
                  onClick={handleCheckOutEmployee}
                  disabled={!isEmpty(checkOut)}
                >
                  Check Out
                </Button>
              </div>
            </Flex>
            {attendanceData.map((item) => {
              const checkInDate = item.checkIn
                ? `${new Date(item.checkIn).getDate()} - ${moment(
                    new Date(item.checkIn),
                  ).format('LT')}`
                : '';
              const checkOutDate = item.checkOut
                ? `${new Date(item.checkOut).getDate()} - ${moment(
                    new Date(item.checkOut),
                  ).format('LT')}`
                : '';
              return (
                <Flex
                  key={item.checkIn}
                  justifyContent="between"
                  className="mx-2"
                >
                  <div>{checkInDate}</div>
                  <div>{checkOutDate}</div>
                </Flex>
              );
            })}
            {!isEmpty(isShiftCompleted) && (
              <Flex justifyContent="center" className="mx-2">
                <div>
                  <Button
                    className="attendance-continue-btn mb-4"
                    onClick={continueShift}
                  >
                    Continue Shift
                  </Button>
                </div>
              </Flex>
            )}
          </div>
        </Flex>
      </Col>
    </>
  );
};

export default EmployeeGrid;
