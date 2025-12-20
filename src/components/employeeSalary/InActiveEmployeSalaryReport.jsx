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
  Collapse,
} from 'antd';
import { formattedAmount, disableFutureDates, monthNames } from 'helpers/utils';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { get, upperCase } from 'lodash';
import salaryApi from 'api/salary';
import { useAuth } from 'hooks/useAuth';
import IconButton from 'components/common/IconButton';
import Loading from 'components/attendance/Loading';
// import { getPreviousMonthNames } from "helpers/utils";
import { useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import InActiveSalaryTable from './InActiveSalaryTable';
import { FormControl, InputGroup, Form } from 'react-bootstrap';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';

const InActiveEmployeSalaryReport = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [arrayValues, setArrayValues] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const todayDate = new Date();
  const [value, setValue] = useState(todayDate);
  // const monthNameList = getMonthNames(todayDate.getFullYear());
  // const [monthOptions, setMonthOptions] = useState(monthNameList);
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [modalVisible, setModalVisible] = useState(true);
  const [salaryPaid, setSalaryPaid] = useState('');
  const [salaryNotPaid, setSalaryNotPaid] = useState('');
  const [searchType, setSearchType] = useState('employeeName');
  const [searchKeyword, setSearchKeyword] = useState('');
  // const yearOptions = [
  //   {
  //     value: 2023,
  //     label: "2023",
  //   },
  //   {
  //     value: 2024,
  //     label: "2024",
  //   },
  //   {
  //     value: 2025,
  //     label: "2025",
  //   },
  //   {
  //     value: 2026,
  //     label: "2026",
  //   },
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
    getInactiveEmploye();
  }, []);
  //  currentSiteId, currentMonth, currentYear, salaryNotPaid, salaryPaid

  const getInactiveEmploye = () => {
    const siteId = currentSiteId;
    const month = currentMonth;
    const year = currentYear;
    setModalVisible(true);
    salaryApi
      .getInactiveSalaryBySitecode(
        siteId,
        month,
        year,
        salaryPaid ? 'true' : '',
        salaryNotPaid ? 'false' : '',
        searchType,
        searchKeyword,
      )
      .then((response) => {
        const responseData = get(response, 'data.data', []);
        setData(responseData);
        setModalVisible(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setModalVisible(false);
      });
  };

  // useEffect(() => {
  //   const monthNameList = getPreviousMonthNames(currentYear);
  //   // setMonthOptions(monthNameList);
  // }, [currentYear]);

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
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'EMI',
      dataIndex: 'emi',
      key: 'emi',
      width: 150,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    { title: 'ID CARD', dataIndex: 'idcard', key: 'idcard', width: 150 },
    {
      title: 'VIPRAS MART',
      dataIndex: 'viprasMart',
      key: 'viprasMart',
      width: 120,
    },
    {
      title: 'TRANSPORT',
      dataIndex: 'transport',
      key: 'transport',
      width: 130,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'FINE',
      dataIndex: 'fine',
      key: 'fine',
      width: 130,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'OTHERS',
      dataIndex: 'others',
      key: 'others',
      width: 130,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'ATTENDANCE BONUS',
      dataIndex: 'attendanceBonus',
      key: 'attendanceBonus',
      width: 150,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
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
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'ESI AMOUNT',
      dataIndex: 'esiAmount',
      key: 'esiAmount',
      width: 120,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'FIXED SALARY',
      dataIndex: 'fixedSalary',
      key: 'fixedSalary',
      width: 130,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
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
      title: 'DAY SALARY',
      dataIndex: 'perDaySalary',
      key: 'perDaySalary',
      width: 120,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'GROSS SALARY',
      dataIndex: 'grossSalary',
      key: 'grossSalary',
      width: 130,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'TOTAL EARNINGS',
      dataIndex: 'attendanceBonus',
      key: 'attendanceBonus',
      width: 130,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'TOTAL DEDUCTION',
      dataIndex: 'totalDeduction',
      key: 'totalDeduction',
      width: 130,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'NET SALARY',
      dataIndex: 'netSalary',
      key: 'netSalary',
      width: 120,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'OUTSTANDING ADVANCES',
      dataIndex: 'outstandingAdvances',
      key: 'outstandingAdvances',
      width: 150,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
  ];

  const checkIfSalaryIsPaid = (record) => {
    console.log(record);
    const employeeId = record.employeeIDNumber;
    if (arrayValues.includes(employeeId)) {
      const newArray = arrayValues.filter((value) => value !== employeeId);
      setArrayValues(newArray);
      const updatedExcelData = excelData.filter(
        (data) => data.employeeIDNumber !== employeeId,
      );
      setExcelData(updatedExcelData);
    } else {
      setArrayValues([...arrayValues, employeeId]);
      setExcelData([...excelData, record]);
    }
  };
  const defaultColumn = [
    {
      title: 'Checkbox',
      dataIndex: 'employeeIDNumber',
      key: 'employeeNumber',
      fixed: 'left',
      width: 100,
      render: (text, record) => (
        <Checkbox onClick={() => checkIfSalaryIsPaid(record)} />
      ),
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
    const todayDate = new Date();
    const currentMonth = todayDate.getMonth();
    const currentYear = todayDate.getFullYear();
    navigate(
      `/your-attendance-report/${employeeId}/${
        currentMonth
      }/${currentYear}`,
      {
        replace: true,
      },
    );
    console.log('Employee ID:', employeeId);
  };

  const onClickExportAsExcel = () => {
    const currentMonthName = monthNames[currentMonth].label;
    const dataToExport = excelData.map((record) =>
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
  };

  const calculateTotalAdvances = (data, field) => {
    return data.reduce((total, record) => {
      const advances = record[field] || 0;
      return total + advances;
    }, 0);
  };
  const totalAdvances = calculateTotalAdvances(data, 'advances');
  const totalPresent = calculateTotalAdvances(data, 'present');
  const totalEmi = calculateTotalAdvances(data, 'emi');
  const totalIdCard = calculateTotalAdvances(data, 'idcard');
  const totalViprasMart = calculateTotalAdvances(data, 'viprasMart');
  const totalTransport = calculateTotalAdvances(data, 'transport');
  const totalFine = calculateTotalAdvances(data, 'fine');
  const totalOthers = calculateTotalAdvances(data, 'others');
  const totalAttendanceBonus = calculateTotalAdvances(data, 'attendanceBonus');
  const totalweekoff = calculateTotalAdvances(data, 'weekOff');
  const totalNationalHoliday = calculateTotalAdvances(data, 'nationalHoliday');
  const totalGrosssalary = calculateTotalAdvances(data, 'grossSalary');
  const totalDeduction = calculateTotalAdvances(data, 'totalDeduction');
  const totalNetSalary = calculateTotalAdvances(data, 'netSalary');
  const totalOutStandingAdvances = calculateTotalAdvances(
    data,
    'outstandingAdvances',
  );

  const totalNOOFDUTY = calculateTotalAdvances(data, 'numberofDuty');
  const totalperDaySalary = calculateTotalAdvances(data, 'perDaySalary');
  const formattedGranTotalAmount = formattedAmount(totalAdvances);

  const handleChangeSiteId = (value) => {
    setCurrentSiteId(value);
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

  // const handleChangeYear = (value) => {
  //   setCurrentYear(value);
  //   console.log(value);
  // };

  // const handleChangeMonth = (value) => {
  //   const currentMonthName = monthNames[value].value;
  //   setCurrentMonth(currentMonthName);
  // };

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
    const currentMonthName = monthNames[currentMonth].label;
    const monthChar = upperCase(currentMonthName.slice(0, 3));
    const yearChar = currentYear.toString().slice(2);
    const texts = excelData
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
  };

  const downloadTxt = () => {
    const currentMonthName = monthNames[currentMonth].label;
    const monthChar = upperCase(currentMonthName.slice(0, 3));
    const yearChar = currentYear.toString().slice(2);
    const texts = excelData
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
  };

  const onChangeSalaryPaid = (e) => {
    const isChecked = e.target.checked;
    if (e.target.checked) {
      setSalaryPaid(isChecked);
      setSalaryNotPaid(!isChecked);
    } else {
      setSalaryPaid('');
    }
  };

  const onChangeSalaryNotPaid = (e) => {
    const isChecked = e.target.checked;
    if (e.target.checked) {
      setSalaryNotPaid(isChecked);
      setSalaryPaid(!isChecked);
    } else {
      setSalaryNotPaid('');
    }
  };

  // function getMonthNames(year) {
  //   const todayDate = new Date();
  //   const currentMonth = todayDate.getMonth();
  //   const months = Array.from({ length: 12 }, (_, index) => {
  //     const monthDate = new Date(year, index, 1);
  //     const monthName = monthDate.toLocaleString("default", { month: "long" });
  //     return {
  //       label: monthName,
  //       value: index,
  //       disabled: index < currentMonth - 12,
  //     };
  //   });
  //   return months;
  // }

  const { Panel } = Collapse;
  return (
    <>
      <Loading visible={modalVisible} />
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">All InActive Salary Report</h5>
          </div>
        </Card.Header>
        <Collapse>
          <Panel header="Filters" key="1">
            <Row align="middle">
              <Col style={style} offset={1}>
                <Space wrap>
                  <div
                    className="d-flex flex-wrap justify-content-center  align-items-center gap-3"
                    style={{ padding: '0 10rem' }}
                  >
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

                    {/* <Select
                      defaultValue={currentYear}
                      style={{
                        width: 120
                      }}
                      onChange={handleChangeYear}
                      options={yearOptions}
                    />
                    <Select
                      defaultValue={currentMonth}
                      value={currentMonth}
                      style={{
                        width: 120
                      }}
                      onChange={handleChangeMonth}
                      options={getMonthNames(currentMonth)}
                    /> */}
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
                    <div>
                      <InputGroup className=" input-search-width">
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
                    </div>
                    {/* <Button
                      size="sm"
                      variant="outline-secondary"
                      className="border-300 hover-border-secondary"
                      style={{ height: 'auto' }}
                      onClick={getInactiveEmploye}
                    >
                      <FontAwesomeIcon icon="search" className="fs--1" />
                    </Button> */}
                    <IconButton
                      variant="primary"
                      size="sm"
                      icon="search"
                      transform="shrink-3"
                      onClick={getInactiveEmploye}
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
        <div
          id="orders-actions"
          className="d-flex p-3 align-items-center justify-content-center gap-2"
        >
          <IconButton
            variant="primary"
            size="sm"
            icon="external-link-alt"
            transform="shrink-3"
            onClick={onClickExportAsExcel}
          >
            <span className="d-none d-sm-inline-block ms-1">Export</span>
          </IconButton>
          &nbsp; &nbsp;
          <Button id="downloadBtn" onClick={downloadTxtFile} value="download">
            Download Other Bank
          </Button>
          &nbsp; &nbsp;
          <Button id="downloadBtn" onClick={downloadTxt} value="download">
            Download City Union Bank
          </Button>
        </div>
        <Row>
          <InActiveSalaryTable
            columns={columns}
            tableData={data}
            currentSiteId={currentSiteId}
            currentMonth={currentMonth + 1}
            currentYear={currentYear}
          />
          <b>
            &nbsp;&nbsp; ADVANCES TOTAL :{' '}
            {formattedAmount(formattedGranTotalAmount)} |
          </b>
          <b>&nbsp;&nbsp; TOTAL PRESENT: {totalPresent} |</b>
          <b>&nbsp;&nbsp; TOTAL NO OF DUTY: {totalNOOFDUTY} |</b>
          <b>
            &nbsp;&nbsp; TOTAL DAY SALARY: {formattedAmount(totalperDaySalary)}{' '}
            |
          </b>
          <b>&nbsp;&nbsp; TOTAL EMI : {formattedAmount(totalEmi)} |</b>
          <b>&nbsp;&nbsp; TOTAL ID CARD : {formattedAmount(totalIdCard)} |</b>
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
          <b>&nbsp;&nbsp; TOTAL WEEKOFF : {totalAttendanceBonus} |</b>
          <b>&nbsp;&nbsp; TOTAL NATIONAL HOLIDAY : {totalNationalHoliday} |</b>
          <b>
            &nbsp;&nbsp; TOTAL GROSS SALARY :{' '}
            {formattedAmount(totalGrosssalary)} |
          </b>
          <b>
            &nbsp;&nbsp; TOTAL DEDUCTION : {formattedAmount(totalDeduction)} |
          </b>
          <b>
            &nbsp;&nbsp; TOTAL NET SALARY : {formattedAmount(totalNetSalary)} |
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
export default InActiveEmployeSalaryReport;
