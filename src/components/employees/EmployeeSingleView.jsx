/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import AddressView from 'components/pages/users/profile/Address';
import FingerPrint from 'components/pages/users/profile/Fingerprint';
import Mandatorydocument from 'components/EmployeeView/Mandatorydocument';
import Bankdetails from 'components/EmployeeView/Bankdetails';
import GeneralViewpoint from 'components/EmployeeView/Generaldata';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import { useParams, useNavigate } from 'react-router-dom';
import { isEmpty, get } from 'lodash';
import useAPI from 'hooks/useApi';
import employeeAPI from 'api/getEmployeeDetails';
import { useAuth } from 'hooks/useAuth';
import { toast } from 'react-toastify';
import Topheader from '../EmployeeView/Topheader';

const columnsval = [
  {
    accessor: 'name',
    Header: 'Name',
    headerProps: { className: 'pe-1' },
  },
  {
    accessor: 'relation',
    Header: 'Relation',
    headerProps: { className: 'pe-7' },
  },
  {
    accessor: 'dob',
    Header: 'DOB',
  },
  {
    accessor: 'occupation',
    Header: 'Occupation',
  },
  {
    accessor: 'aadharNumber',
    Header: 'AadharNumber',
  },
];

const employerColumns = [
  {
    accessor: 'preEmployer',
    Header: 'Previous Employer',
    headerProps: { className: 'pe-1' },
  },
  {
    accessor: 'duration',
    Header: 'Duration',
    headerProps: { className: 'pe-7' },
  },
  {
    accessor: 'refWhom',
    Header: 'Ref Whom',
  },
  {
    accessor: 'reasForLeave',
    Header: 'Reason for Leaving',
  },
];
const EmployeeSingleView = () => {
  const { user } = useAuth();
  const getEmployeeAPI = useAPI(employeeAPI.getEmployeeDetails);
  const addRemoveEmployeeAPI = useAPI(employeeAPI.removeEmployee);
  const params = useParams();
  const [employeeData, setEmployeeData] = useState({});
  const [siteInfo, setSiteInfo] = useState('');
  const siteIdsString = window.localStorage.getItem('siteIds');
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  const navigate = useNavigate();

  useEffect(() => {
    getEmployeeAPI.request(params.employeeid, get(user, 'token'));
  }, [params.employeeid]);

  const [familyData, setFamilyData] = useState([]);
  const [employeementData, setEmployeementData] = useState({});

  useEffect(() => {
    if (getEmployeeAPI.data) {
      /* const detailsData = find(getEmployeeAPI.data.data, {
        _id: params.employeeid
      }); */
      setEmployeeData(getEmployeeAPI.data.data);
      setFamilyData(get(getEmployeeAPI.data.data, 'familyDetails', []));
      setEmployeementData(
        get(getEmployeeAPI.data.data, 'previousEmployerDetails', []),
      );
      const siteCode = get(getEmployeeAPI.data.data, 'siteCode', '');
      for (let i = 0; i < siteIds.length; i++) {
        if (siteIds[i].startsWith(siteCode)) {
          setSiteInfo(siteIds[i]);
          break;
        }
      }
    }
  }, [getEmployeeAPI.data]);

  useEffect(() => {
    if (getEmployeeAPI.error) {
      setEmployeeData({});
    }
  }, [getEmployeeAPI.error]);

  const handleEmployeeStatus = async (status) => {
    addRemoveEmployeeAPI.request(params.employeeid, status, get(user, 'token'));
  };

  useEffect(() => {
    if (
      get(addRemoveEmployeeAPI, 'data.success') &&
      !isEmpty(get(addRemoveEmployeeAPI, 'data.data'))
    ) {
      toast.success('Employee status update successfully!', {
        theme: 'colored',
      });
      // navigate('/', { replace: true });
    }
  }, [addRemoveEmployeeAPI.data]);

  useEffect(() => {
    if (addRemoveEmployeeAPI.error) {
      toast.error('Employee status update failed!', {
        theme: 'colored',
      });
    }
  }, [addRemoveEmployeeAPI.error]);

  return (
    <>
      <Topheader
        employeeData={employeeData}
        siteId={siteInfo}
        handleEmployeeStatus={handleEmployeeStatus}
        role={user.role}
        showActive={true}
      />
      <Row className="g-3 mb-3">
        <Col lg={8}>
          <Mandatorydocument employeeData={employeeData} />
          <Bankdetails employeeData={employeeData} />
          {!isEmpty(familyData) && (
            <div className="mt-3 card ">
              <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-100 rounded-0">
                <div className="d-flex justify-content-between ">
                  <h5 className="text-white">Family Details</h5>
                </div>
              </div>
              <AdvanceTableWrapper
                columns={columnsval}
                data={familyData}
                sortable
                pagination
                perPage={5}
                rowCount={familyData.length}
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
            </div>
          )}
          {!isEmpty(employeementData) && (
            <div className="mt-3 card ">
              <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-100 rounded-0">
                <div className="d-flex justify-content-between ">
                  <h5 className="text-white">Previous Employer Details</h5>
                </div>
              </div>
              <AdvanceTableWrapper
                columns={employerColumns}
                data={employeementData}
                sortable
                pagination
                perPage={5}
                rowCount={employeementData.length}
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
            </div>
          )}
          {!isEmpty(employeeData) && (
            <FingerPrint documents={get(employeeData, 'documents')} />
          )}
        </Col>
        <Col lg={4}>
          <div className="sticky-sidebar Alignheader">
            <GeneralViewpoint employeeData={employeeData} />
            <br />
            <AddressView employeeData={employeeData} />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default EmployeeSingleView;
