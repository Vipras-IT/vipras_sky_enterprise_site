import { useEffect, useRef, useState } from 'react';
import IconButton from 'components/common/IconButton';
import {
  Card,
  Col,
  Row,
  FormControl,
  InputGroup,
  Form,
} from 'react-bootstrap';
import * as XLSX from 'xlsx';
import attendanceAPI from 'api/attendance';
import { Spin, Space, Collapse } from 'antd';
import { get } from 'lodash';
import { useAuth } from 'hooks/useAuth';
import { getDaysInMonth, disableFutureDates } from 'helpers/utils';
import { toast } from 'react-toastify';
import { Select } from 'antd';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';
import DailyBreakUpAttendance from './dailyBreakUpAttendance';
import { saveAs } from 'file-saver';
const DailyBreakUp = () => {
  const [data, setData] = useState([]);
  const todayDate = new Date();
  const [value, setValue] = useState(todayDate);
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const componentRef = useRef();
  const dayColumn = getDaysInMonth(currentMonth, currentYear);
  const defaultColumn = [
    {
      title: 'Designation',
      dataIndex: 'roleName',
      fixed: 'left',
      key: 'roleName',
      width: 200,
    },
  ];
  const totalColumn = [
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 100,
      render: (text) => <strong>{text}</strong>,
    },
  ];
  const siteIdsString = window.localStorage.getItem('siteIds');
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  let siteIdsOptions = [];
  siteIds.map((item) => {
    const siteIdArray = item.split('-');
    siteIdsOptions.push({
      value: siteIdArray[0],
      label: item,
    });
  });
  siteIdsOptions.push({ value: 'ALL', label: 'ALL' });
  let userSiteIds = get(user, 'unitCodes');
  let userDefaultSiteId = '';
  if (userSiteIds && userSiteIds[0] === 'ALL') {
    userDefaultSiteId = get(siteIdsOptions[0], 'value', '');
  } else if (userSiteIds && userSiteIds.length > 0) {
    siteIdsOptions = siteIdsOptions.filter((item) =>
      userSiteIds.includes(item.value),
    );
    userDefaultSiteId = userSiteIds[0];
  }
  const [currentSiteId, setCurrentSiteId] = useState(userDefaultSiteId);

  const columns = [...defaultColumn, ...dayColumn, ...totalColumn];
  const [tableColumn, setTableColumn] = useState(columns);
  useEffect(() => {
    const dayColumn = getDaysInMonth(currentMonth, currentYear);
    const columns = [...defaultColumn, ...dayColumn, ...totalColumn];
    setTableColumn(columns);
  }, [currentYear]);

  useEffect(() => {
    const dayColumn = getDaysInMonth(currentMonth, currentYear);
    const columns = [...defaultColumn, ...dayColumn, ...totalColumn];
    setTableColumn(columns);
  }, [currentMonth]);

  const getAttendanceReport = (currentMonth, currentYear, currentSiteId) => {
    setLoading(true);
    attendanceAPI
      .getDailyBreakUp(currentMonth, currentYear, currentSiteId)
      .then((response) => {
        const todayAttendance = get(response, 'data.data', []);
        setData(todayAttendance);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Get Attendance failed!', {
          theme: 'colored',
        });
        setLoading(false);
      });
  };
  useEffect(() => {
    getAttendanceReportFinal();
  }, []);

  const getAttendanceReportFinal = () => {
    getAttendanceReport(currentMonth, currentYear, currentSiteId);
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spin size="large" />
      </div>
    );
  }
  const style = {
    padding: '8px 0',
  };
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


  const onClickExportAsExcel = () => {
    if (data.length === 0) {
      toast.warn("No data available to export");
      return;
    }
    // Prepare headers for Excel
    const headers = columns.map((column) => column.title || column.dataIndex);
    // Prepare row data
    const dataToExport = data.map((record) =>
      columns.map((column) => get(record, column.dataIndex, ''))
    );
    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([
      headers,
      ...dataToExport,
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    // Write Excel file
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    const filename = `Invoice_Breakup_${formattedDate}.xlsx`;
  
    saveAs(blob, filename);
  };
  
  const { Panel } = Collapse;

  return (
    <>
      <Card className="mb-3">
        <Card.Body>
          <Row className="justify-content-between align-items-center">
            <Col md>
              <h5 className="mb-2 mb-md-0">INVOICE BREAKUP</h5>
            </Col>
            <Col xs="auto">
              <div id="orders-actions">
                <IconButton
                  variant="primary"
                  size="sm"
                  icon="external-link-alt"
                  transform="shrink-3"
                  onClick={onClickExportAsExcel}
                >
                  <span className="d-none d-sm-inline-block ms-1">Export</span>
                </IconButton>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-3" id="pdf-content" ref={componentRef}>
        <Card.Body>
          <Collapse>
            <Panel header="Filter" key="1">
              <Row align="middle">
                <Col style={style} offset={1}>
                  <Space wrap>
                    <Select
                      defaultValue={currentSiteId}
                      showSearch
                      placeholder="Select a site"
                      optionFilterProp="children"
                      onChange={handleChangeSiteId}
                      onSearch={onSearch}
                      filterOption={filterOption}
                      options={siteIdsOptions}
                      style={{
                        width: 350,
                      }}
                    />
                    <DatePicker
                      format="MMM yyyy"
                      caretAs={BsCalendar2MonthFill}
                      value={value}
                      onChange={handleChange}
                      shouldDisableDate={disableFutureDates}
                    />
                    <div>
                      <Form.Select
                        size="sm"
                        className="me-2"
                      >
                        {['Name', 'Designation', 'EMP Id'].map((pageSize) => (
                          <option key={pageSize} value={pageSize}>
                            {pageSize}
                          </option>
                        ))}
                      </Form.Select>
                    </div>
                    <div>
                      <InputGroup className=" input-search-width">
                        <FormControl
                          size="sm"
                          id="search"
                          type="search"
                          className="shadow-none"
                          placeholder="Search"
                        />
                      </InputGroup>
                    </div>
                    <IconButton
                      variant="primary"
                      size="sm"
                      icon="search"
                      transform="shrink-3"
                      onClick={getAttendanceReportFinal}
                    >
                      <span className="d-none d-sm-inline-block ms-1">
                        Search
                      </span>
                    </IconButton>
                  </Space>
                </Col>
              </Row>
            </Panel>
          </Collapse>
          <div className="mt-4 fs--1">
            <Row>
              <DailyBreakUpAttendance
                columns={tableColumn}
                tableData={data}
                hide={true}
              />
            </Row>
          </div>
        </Card.Body>
        <Card.Footer className="bg-light">
          <p className="fs--1 mb-0"></p>
        </Card.Footer>
      </Card>
    </>
  );
};

export default DailyBreakUp;
