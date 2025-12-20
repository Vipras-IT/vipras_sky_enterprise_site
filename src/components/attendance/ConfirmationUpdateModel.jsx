/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Modal, Select, DatePicker, Row, Col } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const ConfirmationModal = ({ visible, onCancel, onConfirm, shiftoption }) => {
  const [selectedOption, setSelectedOption] = useState(shiftoption[0].value);
  const [checkIn, setCheckIn] = useState(
    dayjs(new Date()).format('DD-MM-YYYY HH:mm:ss'),
  );
  const [checkOut, setCheckOut] = useState(
    dayjs(new Date()).format('DD-MM-YYYY HH:mm:ss'),
  );

  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };

  const handleCheckInChange = (date, dateString) => {
    setCheckIn(dateString);
  };

  const handleCheckInCheckOut = (date, dateString) => {
    setCheckOut(dateString);
  };

  return (
    <Modal
      title="Shit to Add"
      visible={visible}
      onCancel={onCancel}
      maskClosable={false}
      onOk={() => onConfirm(selectedOption, checkIn, checkOut)}
      width={1000}
    >
      <Row>
        <Col>
          Shift:
          <Select
            size="large"
            value={selectedOption}
            onChange={handleSelectChange}
          >
            {shiftoption.map((item) => (
              <Option key={item.value} value={item.value}>
                {item.label}
              </Option>
            ))}
          </Select>
        </Col>
        <Col>
          Check In:
          <DatePicker
            format="DD-MM-YYYY HH:mm:ss"
            value={dayjs(checkIn, 'DD-MM-YYYY HH:mm:ss')}
            showTime
            size="large"
            onChange={handleCheckInChange}
          />
        </Col>
        <Col>
          Check Out:
          <DatePicker
            format="DD-MM-YYYY HH:mm:ss"
            value={dayjs(checkOut, 'DD-MM-YYYY HH:mm:ss')}
            showTime
            size="large"
            onChange={handleCheckInCheckOut}
          />
        </Col>
      </Row>
    </Modal>
  );
};

export default ConfirmationModal;
