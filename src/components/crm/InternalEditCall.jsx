/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import { Button, Card, Col, Form, Row, Spinner } from 'react-bootstrap';
import TicketDetails from 'components/imprest-holder/TicketDetails';
import WizardInput from 'components/wizard/WizardInput';
import { useForm } from 'react-hook-form';
import { Select, Typography } from 'antd';
const { Title } = Typography;
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import { useAuth } from 'hooks/useAuth';
import ticketAPI from 'api/ticket';
import useAPI from 'hooks/useApi';
import { useParams } from 'react-router-dom';

import crmAPI from 'api/crm';
const InternalEditCall = () => {
  const params = useParams();
  const getTicketsAPI = useAPI(ticketAPI.getTicketsdetails);
  const { user } = useAuth();
  const [manager, setManager] = useState('');
  const [status, setStatus] = useState('');
  const [datas, setDatas] = useState();
  const [history, setHistory] = useState([]);
  const [authOfficers, setAuthOfficers] = useState([]);
  const getAllAuthorizedOfficersAPI = useAPI(crmAPI.getByUserDropDown);
  const updateCrmAPI = useAPI(crmAPI.updateCRM);
  const { register, handleSubmit, clearErrors } = useForm();
  const [employeeId, setEmployeeId] = useState();
  const [employeeName, setEmployeeName] = useState('');
  const [designation, setDesignation] = useState('');
  const [statusHide, setStatusHide] = useState(false);
  const options = [
    { label: 'APPROVED', value: 'APPROVED' },
    { label: 'IN PROGRESS', value: 'INPROGRESS' },
    { label: 'COMPLETED', value: 'COMPLETED' },
    { label: 'CLOSED', value: 'CLOSED' },
  ];
  const handleChangeManager = (value) => {
    const managerinfo = authOfficers.find((item) => item.value == value);
    const splitValues = split(managerinfo.label);
    setManager(managerinfo.label);
    setEmployeeName(splitValues[0]);
    setDesignation(splitValues[1]);
    setEmployeeId(managerinfo.value);
  };
  const siteotherservices = [
    {
      accessor: 'date',
      Header: 'Date',
      headerProps: { className: 'pe-1' },
      Cell: (rowData) => {
        const saleDate = new Date(get(datas, 'date', null));
        const month = saleDate.getMonth() + 1;
        const monthValue = month < 10 ? `0${month}` : `${month}`;
        const day = saleDate.getDate();
        const dayValue = day < 10 ? `0${day}` : `${day}`;
        const formatDate = `${dayValue}/${monthValue}/${saleDate.getFullYear()}`;
        return <>{formatDate}</>;
      },
    },
    {
      accessor: 'comments',
      Header: 'Comments',
      headerProps: { className: 'pe-7' },
    },
    {
      accessor: 'actionByName',
      Header: 'Updated By Name',
    },
    {
      accessor: 'actionById',
      Header: 'Updated By Id',
    },
  ];
  const handleChangeStatus = (value) => {
    console.log(value);
    setStatus(value);
  };

  const split = (value) => {
    let str = value;
    return str.split('-');
  };
  useEffect(() => {
    getAllAuthorizedOfficersAPI.request(get(user, 'token'));
  }, []);
  useEffect(() => {
    if (
      get(getAllAuthorizedOfficersAPI, 'data.success') &&
      !isEmpty(get(getAllAuthorizedOfficersAPI, 'data.data'))
    ) {
      const responseData = get(getAllAuthorizedOfficersAPI, 'data.data', []);
      setAuthOfficers(responseData);
    }
  }, [getAllAuthorizedOfficersAPI.data]);
  useEffect(() => {
    if (getAllAuthorizedOfficersAPI.error) {
      toast.error('Authorized Officers updated failed', {
        theme: 'colored',
      });
    }
  }, [getAllAuthorizedOfficersAPI.error]);

  useEffect(() => {
    if (!isEmpty(get(params, 'id'))) {
      getTicketsAPI.request(params.id, get(user, 'token'));
    }
  }, [params.id]);
  useEffect(() => {
    if (getTicketsAPI.data) {
      if (!isEmpty(get(params, 'id'))) {
        setDatas(getTicketsAPI.data.data);
        const status = get(getTicketsAPI, 'data.data.status', '');
        setStatusHide(status === 'CLOSED');
      }
    }
  }, [getTicketsAPI.data]);

  const onSubmitData = async (data) => {
    const user = localStorage.getItem('user');
    const userData = JSON.parse(user);
    const employeeNumber = userData.employeeId;
    const employeeName = userData.fullName;
    const postData = {
      ...data,
      date: get(datas, 'date', ''),
      ticketType: get(datas, 'ticketType', ''),
      issueDescription: get(datas, 'issueDescription', ''),
      ticketPriority: get(datas, 'ticketPriority', ''),
      issueDocuments: String(get(datas, 'issueDocuments', '')),
      assignedEmployeeId: get(datas, 'assignedEmployeeId', 0),
      assignedEmployeeName: get(datas, 'assignedEmployeeName', ''),
      assignedEmployeeRole: get(datas, 'assignedEmployeeRole', ''),
      firstLevelEmployeeId: get(datas, 'firstLevelEmployeeId', 0),
      firstLevelEmployeeName: get(datas, 'firstLevelEmployeeName', ''),
      firstLevelEmployeeRole: get(datas, 'firstLevelEmployeeRole', ''),
      secondLevelEmployeeId: get(datas, 'secondLevelEmployeeId', 0),
      secondLevelEmployeeName: get(datas, 'secondLevelEmployeeName', ''),
      secondLevelEmployeeRole: get(datas, 'secondLevelEmployeeRole', ''),
      status: String(status),
      userComments: String(data.comments),
      commentsUserName: employeeName,
      confirmedByEmployeeId: Number(employeeId),
      confirmedByEmployeeName: String(employeeName),
      confirmedByEmployeeRole: String(designation),
      updatedBy: employeeNumber,
    };
    if (!isEmpty(get(params, 'id'))) {
      const roomId = params.id;
      console.log(roomId);
      const updatedData = { ...postData, id: roomId };
      await updateCrmAPI.request(updatedData, get(user, 'token'));
    }
  };

  useEffect(() => {
    if (
      get(updateCrmAPI, 'data.success') &&
      !isEmpty(get(updateCrmAPI, 'data.data'))
    ) {
      toast.success('Internal Ticket added successfully', {
        theme: 'colored',
      });
    } else if (get(updateCrmAPI, 'data.message')) {
      toast.error(
        `Internal Ticket added failed: ${updateCrmAPI.data.message}`,
        {
          theme: 'colored',
        },
      );
    }
  }, [updateCrmAPI.data]);

  useEffect(() => {
    if (updateCrmAPI.error) {
      toast.error('Internal Ticket added failed', {
        theme: 'colored',
      });
    }
  }, [updateCrmAPI.error]);

  return (
    <>
      <Card
        as={Form}
        onSubmit={handleSubmit(onSubmitData)}
        className="theme-wizard mb-3"
      >
        <Card.Body className="fw-normal px-md-3 py-2">
          <Row className="g-2 mb-3">
            <Col md={12}>
              <TicketDetails siteData={datas} />
            </Col>
          </Row>
          <Row className="g-0 mb-2">
            <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-100 rounded-0">
              <div className="d-flex justify-content-between ">
                <h5 className="text-white">History</h5>
              </div>
            </div>
            <AdvanceTableWrapper
              columns={siteotherservices}
              data={get(datas, 'comments', [])}
              sortable
              pagination
              perPage={50}
              rowCount={history.length}
            >
              <AdvanceTable
                table
                headerClassName="bg-200 text-900 text-nowrap align-middle"
                rowClassName="btn-reveal-trigger text-nowrap align-middle"
                tableProps={{
                  bordered: true,
                  striped: true,
                  className: 'fs--1 mb-0 overflow-hidden',
                }}
              />
            </AdvanceTableWrapper>
          </Row>
          {!statusHide && (
            <Row className="g-0 mb-2">
              <Row className="g-0 mb-3">
                <div className="mt-3 card LineSpace ">
                  <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-300 rounded-0">
                    <div className="d-flex justify-content-between ">
                      <h5 className="text-white">Your Ticket Status</h5>
                    </div>
                  </div>
                </div>
              </Row>
              <Row className="g-2 mb-3">
                <Col md={6}>
                  <Title level={5}>Status</Title>
                  <Select
                    size="large"
                    style={{ width: '100%' }}
                    value={status}
                    onChange={handleChangeStatus}
                    options={options}
                  />
                </Col>
                <Col md={6}>
                  <Title level={5}>Re-Assign</Title>
                  <Select
                    size="large"
                    style={{ width: '100%' }}
                    //value={manager}
                    showSearch
                    optionFilterProp="label"
                    onChange={handleChangeManager}
                    options={authOfficers.map((officer) => ({
                      value: officer.value,
                      label: officer.label,
                    }))}
                  />
                </Col>
              </Row>
              <Row className="g-2 mb-3">
                <Col md={6}>
                  <WizardInput
                    label="Comments"
                    name="comments"
                    type="textarea"
                    errors
                    formGroupProps={{ as: Col, sm: 12 }}
                    formControlProps={{
                      ...register('comments'),
                    }}
                  />
                </Col>
              </Row>
            </Row>
          )}
        </Card.Body>
        {!statusHide && (
          <Card.Footer>
            <Row className="g-2 mb-3">
              <Col md={4}></Col>
              <Col md={4}>
                <Button type="submit" color="primary" className="mt-3 w-100">
                  {/* {AddImprestHolderTransactionAPI.loading && ( */}
                  {/* <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                /> */}
                  {/* )} */}
                  <span className="ps-2">Save</span>
                </Button>
              </Col>
              <Col md={4}></Col>
            </Row>
          </Card.Footer>
        )}
      </Card>
    </>
  );
};

export default InternalEditCall;
