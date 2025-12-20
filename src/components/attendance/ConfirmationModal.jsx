/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { Modal, Select, Input, Typography } from 'antd';
import employeeAPI from 'api/getEmployeeDetails';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import siteAPI from 'api/siteCreation';
import { getErrorMessage } from 'helpers/utils';
const { Option } = Select;

const { Title } = Typography;

const ConfirmationModal = ({
  visible,
  onCancel,
  onConfirm,
  shiftoption,
  onAssignRoleChange,
  unitCode,
}) => {
  const [selectedOption, setSelectedOption] = useState(shiftoption[0].value);
  const [employeeId, setEmployeeId] = useState('');
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [assignRole, setAssignRole] = useState('');

  const handleAssignRoleChange = (value) => {
    console.log(value);
    setAssignRole(value);
    onAssignRoleChange(value);
  };
  // const assignedForOptions = [];
  // const roleDegination = window.localStorage.getItem('role');
  // const roles = roleDegination ? JSON.parse(roleDegination) : [];
  // roles.map(item => {
  //   assignedForOptions.push({
  //     value: item,
  //     label: item
  //   });
  // });
  // console.log(assignedForOptions);
  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
  };

  const handleSelectChange = (value) => {
    setSelectedOption(value);
  };

  const onSearch = (value) => {
    if (value) {
      employeeAPI
        .getEmployeeByEmployeeNumber(value, null)
        .then((response) => {
          if (
            get(response, 'data.success') &&
            !isEmpty(get(response, 'data.data.items'))
          ) {
            setName(get(response, 'data.data.items[0].employeeName', ''));
            setDesignation(get(response, 'data.data.items[0].role', ''));
          } else {
            toast.error('Employee not found!', {
              theme: 'colored',
            });
            setName('');
            setDesignation('');
          }
        })
        .catch(() => {
          toast.error('Employee not found!', {
            theme: 'colored',
          });
          setName('');
          setDesignation('');
        });
    }
  };
  const { Search } = Input;

  const handleConfirmModel = () => {
    if (isEmpty(selectedOption) || isEmpty(name)) {
      toast.error('Employee data is required', {
        theme: 'colored',
      });
    } else {
      setSelectedOption('');
      setEmployeeId('');
      setName('');
      setDesignation('');
      onConfirm(selectedOption, Number(employeeId), name);
    }
  };

  const handleCancel = () => {
    setSelectedOption('');
    setEmployeeId('');
    setName('');
    setDesignation('');
    onCancel();
  };

  const [assignedForOptions, setAssignedForOptions] = useState([]);
  useEffect(() => {
    const showUpdateEmployee = async () => {
      try {
        const response = await siteAPI.getSitedetailsBySiteCode(unitCode);
        const errorMessage = getErrorMessage(response);
        if (errorMessage) {
          toast.error(errorMessage, {
            theme: 'colored',
          });
          return;
        }

        const design = get(response, 'data.data.siteAgreedManPower', {});
        const options = design.map((item) => ({
          value: item.name,
          label: item.name,
        }));
        setAssignedForOptions(options);
      } catch (error) {
        toast.error('An error occurred while fetching site details.', error, {
          theme: 'colored',
        });
      }
    };

    showUpdateEmployee();
  }, [unitCode]);

  return (
    <Modal
      title="Add Employee"
      visible={visible}
      onCancel={handleCancel}
      maskClosable={false}
      onOk={handleConfirmModel}
      centered={true}
    >
      <Title level={5}>Employee Id</Title>
      <Search
        name="employeeId"
        size="large"
        placeholder="employee Id"
        value={employeeId}
        onChange={handleEmployeeIdChange}
        onSearch={onSearch}
        enterButton
      />
      <Title level={5}>Name: {name}</Title>
      <Title level={5}>Designation: {designation}</Title>
      {/* <Col span={6} offset={1}> */}
      <Title level={5}>Assigned For</Title>
      <Select
        showSearch
        size="large"
        value={assignRole}
        style={{
          width: '100%',
        }}
        onChange={handleAssignRoleChange}
        options={assignedForOptions}
      />
      {/* </Col> */}
      &nbsp;
      <p>Please select a shift</p>
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
    </Modal>
  );
};

export default ConfirmationModal;
