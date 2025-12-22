/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import {
  Col,
  Row,
  Space,
  Select,
  Button,
  Spin,
  Checkbox,
  notification,
} from 'antd';
import { Tag } from 'antd';
import { formattedAmount, monthNames, disableFutureDates } from 'helpers/utils';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { get, upperCase } from 'lodash';
import salaryApi from 'api/salary';
import { useAuth } from 'hooks/useAuth';
import SalaryTable from './SalaryTable';
import IconButton from 'components/common/IconButton';
import Loading from 'components/attendance/Loading';
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getErrorMessage } from 'helpers/utils';
import { Collapse } from 'antd';
import { FormControl, InputGroup, Form } from 'react-bootstrap';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';

const SalaryReport = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type, message) => {
    api[type]({
      message: message,
    });
  };
  const todayDate = new Date();
  const [value, setValue] = useState(todayDate);
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [modalVisible, setModalVisible] = useState(true);
  const [salaryPaid, setSalaryPaid] = useState(false);
  const [salaryNotPaid, setSalaryNotPaid] = useState(false);
  const [salaryHold, setSalaryHold] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKey, setSelectedRowKey] = useState([]);
  const [searchType, setSearchType] = useState('employeeName');
  const [searchKeyword, setSearchKeyword] = useState('');

  // const yearOptions = [
  //   {
  //     value: 2023,
  //     label: '2023'
  //   },
  //   {
  //     value: 2024,
  //     label: '2024'
  //   },
  //   {
  //     value: 2025,
  //     label: '2025'
  //   },
  //   {
  //     value: 2026,
  //     label: '2026'
  //   }
  // ];
  const siteIdsString = window.localStorage.getItem('siteIds');
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  const siteIdsOptions = [];
  siteIds.map((item) => {
    const siteIdArray = item.split('-');
    siteIdsOptions.push({
      value: siteIdArray[0],
      label: item,
    });
  });
  siteIdsOptions.push({ value: 'ALL', label: 'ALL' });
  const [currentSiteId, setCurrentSiteId] = useState(
    get(siteIdsOptions[0], 'value', ''),
  );

  // const [tableData, setTableData] = useState([]);

  useEffect(() => {
    getSalaryReport();
  }, []);

  const getSalaryReport = () => {
    const siteId = currentSiteId;
    const month = currentMonth;
    const year = currentYear;

    setModalVisible(true);
    let status = '';
    if (salaryPaid) {
      status = 'PAID';
    }
    if (salaryNotPaid) {
      status = 'NOT_PAID';
    }
    if (salaryHold) {
      status = 'HOLD';
    }

    salaryApi
      .getSalaryBySitecode(
        siteId,
        month,
        year,
        status,
        searchType,
        searchKeyword,
      )
      .then((response) => {
        const responseData = get(response, 'data.data', []);
        const mapData = responseData.map((item) => {
          return { ...item, key: item.employeeIDNumber };
        });
        setData(mapData);
        setModalVisible(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setModalVisible(false);
      });
  };

  const totalColumn = [
    {
      title: 'UNIT CODE',
      dataIndex: 'unitCode',
      key: 'unitCode',
      width: 120,
    },
    {
      title: 'UNIT NAME',
      dataIndex: 'UnitName',
      key: 'UnitName',
      width: 200,
    },
    {
      title: 'UAN NO',
      dataIndex: 'uanNumber',
      key: 'uanNumber',
      width: 150,
    },
    {
      title: 'ESI NO',
      dataIndex: 'esiNumber',
      key: 'esiNumber',
      width: 150,
    },
    {
      title: 'ACCOUNT HOLDER NAME',
      dataIndex: 'accountHolderName',
      key: 'accountHolderName',
      width: 150,
    },
    {
      title: 'ACCOUNT NO',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      width: 150,
    },
    {
      title: 'BANK NAME',
      dataIndex: 'bankName',
      key: 'bankName',
      width: 150,
    },
    {
      title: 'BRANCH',
      dataIndex: 'branch',
      key: 'branch',
      width: 200,
    },
    { title: 'IFSC CODE', dataIndex: 'ifscCode', key: 'ifscCode', width: 150 },
    { title: 'MONTH', dataIndex: 'month', key: 'month', width: 150 },
    {
      title: 'ADVANCES',
      dataIndex: 'advances',
      key: 'advances',
      width: 150,
      render: (text) => <strong>{formattedAmount(text)}</strong>,
    },
    {
      title: 'EMI/UNIFORM',
      dataIndex: 'emi',
      key: 'emi',
      width: 150,
      render: (text) => <strong>{formattedAmount(text)}</strong>,
    },
    { title: 'ID CARD', dataIndex: 'idcard', key: 'idcard', width: 150 },
    // {
    //   title: 'VIPRAS MART',
    //   dataIndex: 'viprasMart',
    //   key: 'viprasMart',
    //   width: 120,
    // },
    {
      title: 'TRANSPORT',
      dataIndex: 'transport',
      key: 'transport',
      width: 130,
    },
    { title: 'FINE', dataIndex: 'fine', key: 'fine', width: 130 },
    { title: 'OTHERS', dataIndex: 'others', key: 'others', width: 130 },
    {
      title: 'ATTENDANCE BONUS',
      dataIndex: 'attendanceBonus',
      key: 'attendanceBonus',
      width: 150,
    },
    {
      title: 'PF %',
      dataIndex: 'pfPercentage',
      key: 'pfPercentage',
      width: 100,
    },
    {
      title: 'ESI %',
      dataIndex: 'esiPercentage',
      key: 'esiPercentage',
      width: 100,
    },
    {
      title: 'PF AMONT',
      dataIndex: 'pfAmount',
      key: 'pfAmount',
      width: 120,
    },
    {
      title: 'ESI AMOUNT',
      dataIndex: 'esiAmount',
      key: 'esiAmount',
      width: 120,
    },
    {
      title: 'FIXED SALARY',
      dataIndex: 'fixedSalary',
      key: 'fixedSalary',
      width: 130,
      render: (text) => <strong>{formattedAmount(text)}</strong>,
    },
    {
      title: 'PRESENT',
      dataIndex: 'present',
      key: 'present',
      width: 120,
    },
    {
      title: 'WEEK OFF',
      dataIndex: 'weekOff',
      key: 'weekOff',
      width: 120,
    },
    {
      title: 'NATIONAL HOLIDAY',
      dataIndex: 'nationalHoliday',
      key: 'nationalHoliday',
      width: 120,
    },
    {
      title: 'NO OF DUTY',
      dataIndex: 'numberofDuty',
      key: 'numberofDuty',
      width: 120,
      render: (text, record) => (
        <span
          style={{ cursor: 'pointer' }}
          onClick={() => handleNoOfDutyClick(record)}
        >
          <Link>{text}</Link>
        </span>
      ),
    },
    {
      title: 'BULK DUTY',
      dataIndex: 'bulkDuty',
      key: 'bulkDuty',
      width: 120,
    },
    {
      title: 'TOTAL DUTIES',
      dataIndex: 'totalDuties',
      key: 'totalDuties',
      width: 120,
    },
    {
      title: 'DAY SALARY',
      dataIndex: 'perDaySalary',
      key: 'perDaySalary',
      width: 120,
      render: (text) => <strong>{formattedAmount(text ?? '')}</strong>,
    },
    {
      title: 'GROSS SALARY',
      dataIndex: 'grossSalary',
      key: 'grossSalary',
      width: 130,
      render: (text) => <strong>{formattedAmount(text ?? '')}</strong>,
    },
    {
      title: 'TOTAL EARNINGS',
      dataIndex: 'attendanceBonus',
      key: 'attendanceBonus',
      width: 130,
    },
    {
      title: 'TOTAL DEDUCTION',
      dataIndex: 'totalDeduction',
      key: 'totalDeduction',
      width: 130,
      render: (text) => <strong>{formattedAmount(text ?? '')}</strong>,
    },
    {
      title: 'NET SALARY',
      dataIndex: 'netSalary',
      key: 'netSalary',
      width: 120,
      render: (text) => <strong>{formattedAmount(text ?? '')}</strong>,
    },
    {
      title: 'OUTSTANDING ADVANCES',
      dataIndex: 'outstandingAdvances',
      key: 'outstandingAdvances',
      width: 150,
      render: (text) => <strong>{formattedAmount(text ?? '')}</strong>,
    },
    {
      title: 'PAID BY',
      dataIndex: 'paidBy',
      key: 'paidBy',
      width: 150
    },
    {
      title: 'SALARY STATUS',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => (
        <Tag
          color={
            status === 'PAID'
              ? '#87d068'
              : status === 'HOLD'
                ? '#108ee9'
                : '#f50'
          }
        >
          {status || 'NOT_PAID'}
        </Tag>
      ),
    },
  ];

  const handleUnMarkPaid = async () => {
    if (selectedRows.length === 0) {
      openNotificationWithIcon('error', 'Please select at least one employee.');
    } else {
      const month = `${monthNames[currentMonth].label}-${currentYear}`;
      const response = await salaryApi.updateSalaryReport(
        selectedRowKey,
        'NOT_PAID',
        month,
      );
      const errorMessage = getErrorMessage(response);
      if (errorMessage) {
        openNotificationWithIcon('error', 'Error.');
      } else {
        setSelectedRows([]);
        getSalaryReport();
      }
    }
  };

  const handleMarkPaid = async () => {
    if (selectedRows.length === 0) {
      openNotificationWithIcon('error', 'Please select at least one employee.');
    } else {
      const month = `${monthNames[currentMonth].label}-${currentYear}`;
      const response = await salaryApi.updateSalaryReport(
        selectedRowKey,
        'PAID',
        month,
      );
      const errorMessage = getErrorMessage(response);
      if (errorMessage) {
        openNotificationWithIcon('error', 'Error.');
      } else {
        setSelectedRows([]);
        getSalaryReport();
      }
    }
  };

  const handleMarkHold = async () => {
    if (selectedRows.length === 0) {
      openNotificationWithIcon('error', 'Please select at least one employee.');
    } else {
      const month = `${monthNames[currentMonth].label}-${currentYear}`;
      const response = await salaryApi.updateSalaryReport(
        selectedRowKey,
        'HOLD',
        month,
      );
      const errorMessage = getErrorMessage(response);
      if (errorMessage) {
        openNotificationWithIcon('error', 'Error.');
      } else {
        setSelectedRows([]);
        getSalaryReport();
      }
    }
  };

  const defaultColumn = [
    {
      title: 'S.NO',
      dataIndex: 'sno',
      fixed: 'left',
      key: '',
      width: 100,
      render: (text, record, index) => index + 1,
    },
    {
      title: 'NAME',
      dataIndex: 'employeeName',
      key: 'employeeName',
      editable: true,
      fixed: 'left',
      width: 200,
    },
    {
      title: 'ID',
      dataIndex: 'employeeIDNumber',
      key: 'employeeNumber',
      editable: true,
      fixed: 'left',
      width: 100,
    },
    {
      title: 'DESIGNATION',
      dataIndex: 'designation',
      editable: true,
      fixed: 'left',
      width: 200,
    },
  ];
  const columns = [...defaultColumn, ...totalColumn];
  const navigate = useNavigate();
  const handleNoOfDutyClick = (record) => {
    const employeeId = record.employeeIDNumber;
    navigate(
      `/your-attendance-report/${employeeId}/${currentMonth}/${currentYear}`,
      {
        replace: true,
      },
    );
    console.log('Employee ID:', employeeId);
  };

  const onClickExportAsExcel = () => {
    if (selectedRows.length === 0) {
      openNotificationWithIcon('error', 'Please select at least one employee.');
    } else {
      const currentMonthName = monthNames[currentMonth].label;
      const dataToExport = selectedRows.map((record) =>
        columns.map((column) => get(record, column.dataIndex, '')),
      );

      const worksheet = XLSX.utils.aoa_to_sheet([
        columns.map((column) => column.title),
        ...dataToExport,
      ]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, currentMonthName);

      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      saveAs(blob, 'Salary.xlsx');
    }
  };

  const onChangeSalaryPaid = (e) => {
    const isChecked = e.target.checked;
    if (e.target.checked) {
      setSalaryPaid(isChecked);
      setSalaryNotPaid(!isChecked);
      setSalaryHold(!isChecked);
    } else {
      setSalaryPaid(false);
    }
  };

  const onChangeSalaryNotPaid = (e) => {
    const isChecked = e.target.checked;
    if (e.target.checked) {
      setSalaryNotPaid(isChecked);
      setSalaryPaid(!isChecked);
      setSalaryHold(!isChecked);
    } else {
      setSalaryNotPaid(false);
    }
  };

  const onChangeSalaryHold = (e) => {
    const isChecked = e.target.checked;
    if (e.target.checked) {
      setSalaryNotPaid(!isChecked);
      setSalaryPaid(!isChecked);
      setSalaryHold(isChecked);
    } else {
      setSalaryHold(false);
    }
  };

  const calculateTotalAdvances = (field) => {
    return data.reduce((total, record) => {
      if (field === 'minusnetSalary') {
        const label = 'netSalary';
        const advances = record[label] || 0;
        return advances < 0 ? total + advances : total;
      }
      const advances = record[field] || 0;
      return total + advances;
    }, 0);
  };
  const totalAdvances = calculateTotalAdvances('advances');
  const totalEmi = calculateTotalAdvances('emi');
  const totalIdCard = calculateTotalAdvances('idcard');
  const totalViprasMart = calculateTotalAdvances('viprasMart');
  const totalTransport = calculateTotalAdvances('transport');
  const totalFine = calculateTotalAdvances('fine');
  const totalOthers = calculateTotalAdvances('others');
  const totalAttendanceBonus = calculateTotalAdvances('attendanceBonus');
  const totalGrosssalary = calculateTotalAdvances('grossSalary');
  const totalDeduction = calculateTotalAdvances('totalDeduction');
  const totalNetSalary = calculateTotalAdvances('netSalary');
  const totalMinusNetSalary = calculateTotalAdvances('minusnetSalary');
  const totalOutStandingAdvances = calculateTotalAdvances(
    data,
    'outstandingAdvances',
  );

  const totalNOOFDUTY = calculateTotalAdvances('numberofDuty');
  const totalBulkDuty = calculateTotalAdvances('bulkDuty');
  const totalperDaySalary = calculateTotalAdvances('perDaySalary');
  const formattedGranTotalAmount = formattedAmount(totalAdvances);

  const handleChangeSiteId = (value) => {
    setCurrentSiteId(value);
    setSelectedRows([]);
    setSelectedRowKey([]);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleChange = (date) => {
    setValue(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const style = {
    padding: '8px 0',
  };

  if (modalVisible) {
    return (
      <div className="text-center">
        <Spin size="large" />
      </div>
    );
  }

  const downloadTxtFile = () => {
    if (selectedRows.length === 0) {
      openNotificationWithIcon('error', 'Please select at least one employee.');
    } else {
      const currentMonthName = monthNames[currentMonth].label;
      const monthChar = upperCase(currentMonthName.slice(0, 3));
      const yearChar = currentYear.toString().slice(2);
      const texts = selectedRows
        .filter((item) => item.bankName !== 'CITY UNION BANK')
        .map(
          (item) =>
            `NEFT~${item.ifscCode}~${item.netSalary}.00~10~${item.accountNumber}~${item.employeeName}~CHENNAI~SAL-${monthChar}-${yearChar}`,
        );
      const file = new Blob([texts.join('\n')], { type: 'text/plain' });
      const element = document.createElement('a');
      element.href = URL.createObjectURL(file);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
      element.download = `Other Bank-${formattedDate}.txt`;
      document.body.appendChild(element);
      element.click();
    }
  };

  const downloadTxt = () => {
    if (selectedRows.length === 0) {
      openNotificationWithIcon('error', 'Please select at least one employee.');
    } else {
      const currentMonthName = monthNames[currentMonth].label;
      const monthChar = upperCase(currentMonthName.slice(0, 3));
      const yearChar = currentYear.toString().slice(2);
      const texts = selectedRows
        .filter((item) => item.bankName === 'CITY UNION BANK')
        .map(
          (item) =>
            `${item.accountNumber}~${item.netSalary}.00~SAL-${monthChar}-${yearChar}`,
        );
      const file = new Blob([texts.join('\n')], { type: 'text/plain' });
      const element = document.createElement('a');
      element.href = URL.createObjectURL(file);
      element.download = 'CITY_UNION_BANK_' + Date.now() + '.txt';
      document.body.appendChild(element);
      element.click();
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
      setSelectedRowKey(selectedRowKeys);
    },
  };

  const { Panel } = Collapse;
  return (
    <>
      {contextHolder}
      <Loading visible={modalVisible} />
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">All Salary Report</h5>
          </div>
        </Card.Header>
        <Collapse>
          <Panel header="Filter" key="1">
            <Row align="center">
              <Col style={style} span={23} offset={1}>
                <Space wrap>
                  <div className="d-flex flex-wrap justify-content-center align-items-center mb-2  gap-3 px-5">
                    <Select
                      showSearch
                      defaultValue={currentSiteId}
                      placeholder="Select a site"
                      optionFilterProp="children"
                      onChange={handleChangeSiteId}
                      onSearch={onSearch}
                      filterOption={filterOption}
                      options={siteIdsOptions}
                      style={{
                        width: 410,
                      }}
                    />
                    <DatePicker
                      format="MMM yyyy"
                      caretAs={BsCalendar2MonthFill}
                      value={value}
                      onChange={handleChange}
                      shouldDisableDate={disableFutureDates}
                    />
                    <div id="orders-actions">
                      <Checkbox
                        onChange={onChangeSalaryPaid}
                        checked={salaryPaid}
                      >
                        Salary Paid
                      </Checkbox>
                    </div>
                    <div id="orders-actions">
                      <Checkbox
                        onChange={onChangeSalaryNotPaid}
                        checked={salaryNotPaid}
                      >
                        Salary Not Paid
                      </Checkbox>
                    </div>
                    <div id="orders-actions">
                      <Checkbox
                        onChange={onChangeSalaryHold}
                        checked={salaryHold}
                      >
                        Salary Hold
                      </Checkbox>
                    </div>

                    <div>
                      <Form.Select
                        size="sm"
                        className="me-2 width-15"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                      >
                        <option value="employeeName">Employee Name</option>
                        <option value="employeeIDNumber">Employee ID</option>
                        <option value="accountNumber">Account Number</option>
                      </Form.Select>
                    </div>

                    <InputGroup className="input-search-width">
                      <FormControl
                        size="sm"
                        id="search"
                        type="search"
                        className="shadow-none"
                        placeholder={`Search by ${searchType}`}
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                      />
                    </InputGroup>
                    <IconButton
                      variant="primary"
                      size="sm"
                      icon="search"
                      transform="shrink-3"
                      onClick={getSalaryReport}
                    >
                      <span className="d-none d-sm-inline-block ms-1">
                        Search
                      </span>
                    </IconButton>
                  </div>
                </Space>
              </Col>
            </Row>
          </Panel>
        </Collapse>
        <div className="d-flex p-3 align-items-center justify-content-center gap-2">
          <IconButton
            variant="primary"
            size="sm"
            icon="external-link-alt"
            transform="shrink-3"
            onClick={onClickExportAsExcel}
          >
            <span className="d-none d-sm-inline-block ms-1">Export</span>
          </IconButton>
          <div id="orders-actions">
            <IconButton variant="primary" size="sm" onClick={handleMarkPaid}>
              <span className="d-none d-sm-inline-block ms-1">Mark Paid</span>
            </IconButton>
          </div>
          <div id="orders-actions">
            <IconButton variant="primary" size="sm" onClick={handleUnMarkPaid}>
              <span className="d-none d-sm-inline-block ms-1">
                Mark Un Paid
              </span>
            </IconButton>
          </div>
          <div id="orders-actions">
            <IconButton variant="primary" size="sm" onClick={handleMarkHold}>
              <span className="d-none d-sm-inline-block ms-1">Mark Hold</span>
            </IconButton>
          </div>
          <div id="orders-actions">
            &nbsp; &nbsp;
            <Button id="downloadBtn" onClick={downloadTxtFile} value="download">
              Download Other Bank
            </Button>
            &nbsp; &nbsp;
            <Button id="downloadBtn" onClick={downloadTxt} value="download">
              Download City Union Bank
            </Button>
          </div>
        </div>

        <Row>
          <SalaryTable
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            columns={columns}
            tableData={data}
            currentSiteId={currentSiteId}
            currentMonth={currentMonth + 1}
            currentYear={currentYear}
          />
          <b>&nbsp;&nbsp; ADVANCES TOTAL : {formattedGranTotalAmount} |</b>
          <b>
            &nbsp;&nbsp; TOTAL DUTIES:{' '}
            {Math.round(totalNOOFDUTY + totalBulkDuty)} |
          </b>
          <b>
            &nbsp;&nbsp; TOTAL DAY SALARY: {formattedAmount(totalperDaySalary)}{' '}
            |
          </b>
          <b>
            &nbsp;&nbsp; TOTAL EMI / UNIFORM : {formattedAmount(totalEmi)} |
          </b>
          <b>&nbsp;&nbsp; TOTAL ID CARD : {totalIdCard} |</b>
          <b>
            &nbsp;&nbsp; TOTAL VIPRA SMART : {formattedAmount(totalViprasMart)}{' '}
            |
          </b>
          <b>
            &nbsp;&nbsp; TOTAL TRANSPORT : {formattedAmount(totalTransport)} |
          </b>
          <b>&nbsp;&nbsp; TOTAL FINE : {formattedAmount(totalFine)} |</b>
          <b>&nbsp;&nbsp; TOTAL OTHERS : {formattedAmount(totalOthers)} |</b>
          <b>
            &nbsp;&nbsp; TOTAL ATTENDANCE BONUS :{' '}
            {formattedAmount(totalAttendanceBonus)} |
          </b>
          <b>&nbsp;&nbsp; TOTAL GROSS SALARY : {totalGrosssalary} |</b>
          <b>
            &nbsp;&nbsp; TOTAL DEDUCTION : {formattedAmount(totalDeduction)} |
          </b>
          <b>
            &nbsp;&nbsp; TOTAL NET SALARY : {formattedAmount(totalNetSalary)} |
          </b>
          <b>
            &nbsp;&nbsp; CARRIED FORWARD ADVANCE :{' '}
            {formattedAmount(totalMinusNetSalary)} |
          </b>
          <b>
            &nbsp;&nbsp; TOTAL OUTS TANDING ADVANCES :{' '}
            {formattedAmount(totalOutStandingAdvances)} |
          </b>
        </Row>
      </Card>
    </>
  );
};
export default SalaryReport;
