import { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { isEmpty, get } from 'lodash';
import useAPI from 'hooks/useApi';
import employeeAPI from 'api/getEmployeeDetails';
import notificationAPI from 'api/notificationapi';
import { useAuth } from 'hooks/useAuth';
import { toast } from 'react-toastify';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import Topheader from '../EmployeeView/Topheader';
import DealForecastBar from './DealForecastBar';
import Transactions from './Transactions';
import ImprestHolderTransactionAPI from 'api/Imprestholdertransaction';
import { Select } from 'antd';
import { getPreviousMonthNames } from 'helpers/utils';
import { QueryClientProvider, QueryClient } from 'react-query';
import AttendanceReportsBySiteContainer from 'components/attendance/AttendanceReportsBySiteContainer';
import ReportProgress from 'components/dashboards/default/BandwidthSaved';
import MostLeads from 'components/ticket/MostLeads';
import Intelligence from 'components/ticket/Intelligence';
import StatisticsCards from 'components/ticket/StatisticsCards';
import { Card } from 'react-bootstrap';
import ConnectCard from 'components/imprest-holder/ConnectCard';
import { getErrorMessage } from 'helpers/utils';

const queryClient = new QueryClient();

const ImpresHolderProfile = () => {
  const { user } = useAuth();
  const getEmployeeAPI = useAPI(employeeAPI.getEmployeeDetailsById);
  // const getNotificationAPI = useAPI(notificationAPI.NotificationgetAll);

  const addRemoveEmployeeAPI = useAPI(employeeAPI.removeEmployee);
  const params = useParams();
  const [employeeData, setEmployeeData] = useState({});
  const [siteInfo, setSiteInfo] = useState('');
  const [available, setAvailable] = useState();
  const [expenses, setExpenses] = useState();
  const [imprestTo, setImprestTo] = useState();
  const [advance, setAdvance] = useState();
  const [used, setUsed] = useState();
  const [salary, setSalary] = useState();
  const [total, setTotal] = useState();
  const [tableData, setTableData] = useState([]);
  const todayDate = new Date();
  const monthNameList = getPreviousMonthNames(todayDate.getFullYear());
  const [monthOptions, setMonthOptions] = useState(monthNameList);
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [attendanceReport, setAttendanceReport] = useState({});
  const [ticketReport, setTicketReport] = useState({});
  const [verificationCount, setVerificationCount] = useState([]);
  const [notificationData, setNotificationData] = useState([]);
  const siteIdsString = window.localStorage.getItem('siteIds');
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  const navigate = useNavigate();
  const datas = localStorage.getItem('user');
  const userData = JSON.parse(datas);

  const yearOptions = [
    {
      value: 2022,
      label: '2022',
    },
    {
      value: 2023,
      label: '2023',
    },
    {
      value: 2024,
      label: '2024',
    },
  ];

  const handleChangeYear = (value) => {
    if (value === todayDate.getFullYear()) {
      setCurrentMonth(todayDate.getMonth());
    }
    setCurrentYear(value);
    getReport(currentMonth, value);
    getTransactionReport(currentMonth, value);
  };
  const handleChangeMonth = (value) => {
    setCurrentMonth(value);
    getReport(value, currentYear);
    getTransactionReport(value, currentYear);
  };

  useEffect(() => {
    const monthNameList = getPreviousMonthNames(currentYear);
    setMonthOptions(monthNameList);
  }, [currentYear]);

  useEffect(() => {
    const employeeId = Number(userData.employeeId);
    getEmployeeAPI.request(employeeId, get(user, 'token'));
    getTicketReport(employeeId);
    getPendingVerificationReport();
  }, []);

  useEffect(() => {
    const token = get(user, 'token');
    notificationAPI.NotificationgetAll(token).then((response) => {
      setNotificationData(get(response, 'data.data.items', []));
    });
  }, []);

  useEffect(() => {
    if (getEmployeeAPI.data) {
      setEmployeeData(getEmployeeAPI.data.data);
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

  useEffect(() => {
    getReport(currentMonth, currentYear);
    getTransactionReport(currentMonth, currentYear);
    getAttendanceReport(currentMonth, currentYear);
  }, []);

  const getReport = (currentMonth, currentYear) => {
    const token = get(user, 'token');
    const employeeNumber = Number(get(user, 'employeeId'));
    ImprestHolderTransactionAPI.getImprestHolderTransaction(
      employeeNumber,
      currentMonth,
      currentYear,
      token,
    )
      .then((response) => {
        console.log(response.data);
        console.log(response.data.data.available);
        setAvailable(get(response.data.data, 'available'));
        setUsed(get(response.data.data, 'used'));
        setImprestTo(get(response.data.data, 'imprestTo'));
        setExpenses(get(response.data.data, 'expenses'));
        setAdvance(get(response.data.data, 'advance'));
        setSalary(get(response.data.data, 'salary'));
        setTotal(get(response, 'data.data.total'));
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const getTransactionReport = (month, currentYear) => {
    const currentMonth = month + 1;
    const token = get(user, 'token');
    const employeeNumber = Number(get(user, 'employeeId'));
    const defaultFilter = {
      imprestholderId: employeeNumber,
      from: new Date(currentYear, currentMonth - 1, 1),
      to: new Date(currentYear, currentMonth, 1),
    };
    ImprestHolderTransactionAPI.getImprestHolder(defaultFilter, token)
      .then((response) => {
        const responseData = get(response, 'data.data.items', []);
        const array = [];
        for (const item of responseData) {
          if (item.credit > 0) {
            array.push({
              date: item.date,
              amount: item.credit,
              description: item.description,
            });
          }
        }

        setTableData(array);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const getAttendanceReport = (month, currentYear) => {
    const currentMonth = month + 1;
    const token = get(user, 'token');
    const employeeNumber = Number(get(user, 'employeeId'));
    ImprestHolderTransactionAPI.getImprestHolderAttendance(
      employeeNumber,
      currentMonth,
      currentYear,
      token,
    )
      .then((response) => {
        const responseData = get(response, 'data.data');
        setAttendanceReport(responseData);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleEmployeeStatus = async (status) => {
    addRemoveEmployeeAPI.request(params.employeeid, status, get(user, 'token'));
  };

  const getTicketReport = async (employeedId) => {
    const response = await ImprestHolderTransactionAPI.getTicketReport(
      employeedId,
      get(user, 'token'),
    );
    const errorMessage = getErrorMessage(response);
    if (errorMessage) {
      toast.error(errorMessage, {
        theme: 'colored',
      });
    } else {
      setTicketReport(get(response, 'data.data', {}));
    }
  };
  const getPendingVerificationReport = async () => {
    const response = await ImprestHolderTransactionAPI.getEmployeeVerification(
      get(user, 'token'),
    );
    const errorMessage = getErrorMessage(response);
    if (errorMessage) {
      toast.error(errorMessage, {
        theme: 'colored',
      });
    } else {
      setVerificationCount(get(response, 'data.data', []));
    }
  };

  useEffect(() => {
    if (
      get(addRemoveEmployeeAPI, 'data.success') &&
      !isEmpty(get(addRemoveEmployeeAPI, 'data.data'))
    ) {
      toast.success('Employee status update successfully!', {
        theme: 'colored',
      });
      navigate('/', { replace: true });
    }
  }, [addRemoveEmployeeAPI.data]);

  useEffect(() => {
    if (addRemoveEmployeeAPI.error) {
      toast.error('Employee status update failed!', {
        theme: 'colored',
      });
    }
  }, [addRemoveEmployeeAPI.error]);

  const columns = [
    {
      accessor: 'date',
      Header: 'Date',
      headerProps: { className: 'pe-1' },
      Cell: (rowData) => {
        const saleDate = new Date(get(rowData, 'row.values.date', null));
        const month = saleDate.getMonth() + 1;
        const monthValue = month < 10 ? `0${month}` : `${month}`;
        const day = saleDate.getDate();
        const dayValue = day < 10 ? `0${day}` : `${day}`;
        const formatDate = `${dayValue}/${monthValue}/${saleDate.getFullYear()}`;
        return <>{formatDate}</>;
      },
    },
    {
      accessor: 'amount',
      Header: 'Credit',
      headerProps: { className: 'pe-7' },
    },
    {
      accessor: 'description',
      Header: 'Description',
    },
  ];

  const access = get(user, 'access', []);
  const hasImpressHolder = access.includes('IMPREST_HOLDER');

  const hasAuthorizedOfficer = access.includes('AUTH_OFFICERS');

  const accessSiteId = get(user, 'unitCodes', []);

  const daysAttended = get(attendanceReport, 'present', 0);

  const totalDaysInMonth = get(attendanceReport, 'totalWorkingDays', 0);

  const absent = get(attendanceReport, 'absent', 0);

  const weekOff = get(attendanceReport, 'weekOff', 0);

  const percentage = Math.round((daysAttended / totalDaysInMonth) * 100);

  // const intelligence = [
  //   {
  //     title: 'Welcome',
  //     icon: 'code-branch',
  //     description:
  //       'Welcome to Vipras Facility Management Solutions Private Limited'
  //   },
  //   {
  //     title: 'Technical',
  //     icon: 'bug',
  //     description:
  //       'Show me a trend of my average page load time over the last 3 months'
  //   }
  // ];

  return (
    <>
      <Topheader
        employeeData={employeeData}
        siteId={siteInfo}
        handleEmployeeStatus={handleEmployeeStatus}
        role={user.role}
        showActive={false}
      />
      <Row>
        <Col md={9}></Col>
        <Col md={3} className="mb-1">
          <Select
            defaultValue={currentYear}
            style={{
              width: 120,
            }}
            onChange={handleChangeYear}
            options={yearOptions}
          />
          <Select
            defaultValue={currentMonth}
            value={currentMonth}
            style={{
              width: 120,
            }}
            onChange={handleChangeMonth}
            options={monthOptions}
          />
        </Col>
      </Row>
      <StatisticsCards
        ticketReport={ticketReport}
        verificationCount={verificationCount}
      />
      <Row className="g-3">
        <Col md={4}>
          <ReportProgress
            value={percentage}
            title="Your Attendance"
            label={`Present - ${daysAttended}, Absent - ${absent}, Week Off - ${weekOff}`}
          />
        </Col>
        <Col md={4}>
          <MostLeads />
        </Col>
        <Col md={4}>
          <Intelligence data={notificationData} />
        </Col>
      </Row>
      <br />
      {hasAuthorizedOfficer && (
        <ConnectCard count={get(ticketReport, 'totalAttendance', 0)} />
      )}

      <br />
      {hasImpressHolder && (
        <Row className="g-3 mb-3">
          <Col md={6} lg={6}>
            <Transactions available={available} used={used} />
          </Col>
          <Col md={6} lg={6}>
            <Row className="g-3 mb-3">
              <Col md={12} lg={12}>
                <div className="card ">
                  <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
                    <div className="position-relative z-index-1 light">
                      <h5 className="mb-0 text-white">Credit Details</h5>
                    </div>
                  </Card.Header>
                  <AdvanceTableWrapper
                    columns={columns}
                    data={tableData}
                    sortable
                    pagination
                    perPage={5}
                    rowCount={5}
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
              </Col>
              <Col md={12} lg={12}>
                <DealForecastBar
                  expenses={expenses}
                  imprestTo={imprestTo}
                  advance={advance}
                  salary={salary}
                  total={total}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      )}
      <br />
      <QueryClientProvider client={queryClient}>
        <AttendanceReportsBySiteContainer siteId={accessSiteId} />
      </QueryClientProvider>
    </>
  );
};

export default ImpresHolderProfile;
