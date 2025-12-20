/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Card, Col, Form, Row, Button } from 'react-bootstrap';
import Flex from 'components/common/Flex';
import moment from 'moment';
import { getEmployeeShiftOptions } from 'helpers/utils';
import EmployeeGrid from './EmployeeAttendance';
import ConfirmationModal from './ConfirmationModal';

const AddAttendance = ({
  employeeData,
  handleUpdateAttendace,
  handleAddNewEmployee,
  onAssignRole,
  unitCode,
}) => {
  const [employeeDatas, setEmployeeDatas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [assignRole, setAssignRole] = useState('');
  useEffect(() => {
    setEmployeeDatas(employeeData);
  }, [employeeData]);

  const today = new Date();

  const handleConfirm = (selectedOption, employeeNumber, employeeName) => {
    console.log('Selected option:', selectedOption);
    handleAddNewEmployee({
      employeeNumber,
      shift: selectedOption,
      role: assignRole,
      employeeName,
    });
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const shiftoption = getEmployeeShiftOptions();

  const handleAssignRoleChange = (value) => {
    setAssignRole(value);
    onAssignRole(value);
  };
  return (
    <>
      <ConfirmationModal
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        shiftoption={shiftoption}
        unitCode={unitCode}
        onAssignRoleChange={handleAssignRoleChange}
      />
      <Row className="flex-between-center">
        <Col sm="auto" as={Flex} alignItems="center" className="mb-2 mb-sm-0">
          <Row className="gx-2 align-items-center">
            <Col xs="auto">
              <Form as={Row} className="gx-2">
                <Col xs="auto">
                  <h5>Attendance for : {moment(today).format('LLLL')}</h5>
                </Col>
                <Col xs="auto">
                  {' '}
                  <h5>
                    <span className="d-none d-sm-inline-block ms-1">
                      Total No.of Employees count : {employeeData.length}
                    </span>
                  </h5>
                </Col>
              </Form>
            </Col>
          </Row>
        </Col>
        <Col sm="auto">
          <Button
            // className="attendance-btn mb-1"
            onClick={() => setModalVisible(true)}
            className="gx-2"
          >
            <span className="ps-2">Reliver / Subsitute Attendance</span>
          </Button>
        </Col>
      </Row>

      <Card className="mb-3">
        <Card.Body className="pb-0">
          <Row>
            {employeeDatas.map((employee, index) => (
              <EmployeeGrid
                employee={employee}
                key={employee.id}
                md={3}
                lg={3}
                index={index}
                handleUpdateAttendace={handleUpdateAttendace}
              />
            ))}
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default AddAttendance;
