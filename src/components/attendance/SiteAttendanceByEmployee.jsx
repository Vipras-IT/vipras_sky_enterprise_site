import { useEffect, useRef, useState } from 'react';
import { Col, Row, Space, Spin, Button, Input, Select, Collapse } from 'antd';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  formattedAmount,
  getDaysInMonth,
  monthNames,
  disableFutureDates,
} from 'helpers/utils';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { get } from 'lodash';
import attendanceAPI from 'api/attendance';
import { useAuth } from 'hooks/useAuth';
import AttendanceReports from './AttendanceReports';
import { toast } from 'react-toastify';
import IconButton from 'components/common/IconButton';
import { Card } from 'react-bootstrap';
import Loading from './Loading';
import { FormControl, InputGroup, Form } from 'react-bootstrap';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';

const SiteAttendanceByEmployee = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const todayDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [loading, setLoading] = useState(true);
  const [manPower, setManPower] = useState('');
  const [site, setSite] = useState('');
  const [value, setValue] = useState(todayDate);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button type="link" size="small" onClick={() => close()}>
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const dayColumn = getDaysInMonth(currentMonth, currentYear);
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
      title: 'Name',
      dataIndex: 'employeeName',
      fixed: 'left',
      key: 'employeeName',
      width: 200,
      ...getColumnSearchProps('employeeName'),
    },
    {
      title: 'EMP ID',
      dataIndex: 'employeeNumber',
      fixed: 'left',
      key: 'employeeNumber',
      width: 200,
      sorter: (a, b) => a.employeeNumber - b.employeeNumber,
      ...getColumnSearchProps('employeeNumber'),
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      editable: true,
      fixed: 'left',
      width: 120,
      ...getColumnSearchProps('designation'),
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
    {
      title: 'Total Salary',
      dataIndex: 'totalSalary',
      key: 'totalSalary',
      width: 100,
      render: (text) => <strong>{formattedAmount(text ?? '')}</strong>,
    },
    {
      title: 'Total NetSalary',
      dataIndex: 'netSalary',
      key: 'netSalary',
      width: 100,
      render: (text) => <strong>{formattedAmount(text ?? '')}</strong>,
    },
  ];

  const siteIdsString = window.localStorage.getItem('siteIds');
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  let siteIdsOptions = siteIds.map((item) => {
    const siteIdArray = item.split('-');
    return { value: siteIdArray[0], label: item };
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

  const handleChange = (date) => {
    setValue(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const handleChangeSiteId = (value) => {
    setCurrentSiteId(value);
  };
  const handleSearchButton = () => {
    const dayColumn = getDaysInMonth(currentMonth, currentYear);
    const columns = [...defaultColumn, ...dayColumn, ...totalColumn];
    setTableColumn(columns);
    getAttendanceReport(currentSiteId, currentMonth, currentYear);
  };

  useEffect(() => {
    setLoading(true);
    getAttendanceReport(currentSiteId, currentMonth, currentYear);
  }, []);

  const style = { padding: '8px 0' };

  const getAttendanceReport = (siteId, month, year) => {
    setLoading(true);
    attendanceAPI
      .getAttendanceReportByEmployee(siteId, month, year)
      .then((response) => {
        const todayAttendance = get(response, 'data.data.attemdanceReport', []);
        setManPower(get(response, 'data.data.aggreedManpower', ''));
        setSite(get(response, 'data.data.siteName', ''));
        // const filteredData = todayAttendance.filter((item) => item.employeeNumber !== 0);
        // const finalData = filteredData.sort((a, b) => a.employeeNumber - b.employeeNumber);
        setData(todayAttendance);
        setLoading(false);
      })
      .catch(() => {
        toast.error('Get Attendance failed!', { theme: 'colored' });
        setLoading(false);
      });
  };

  const onSearch = (value) => {
    console.log('search:', value);
  };

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const isAdmin = user.role !== 'FM';

  const onClickExportAsExcel = () => {
    const currentMonthName = monthNames[currentMonth].label;
    const dataToExport = data.map((record) =>
      tableColumn.map((column) => get(record, column.dataIndex, '')),
    );

    const worksheet = XLSX.utils.aoa_to_sheet([
      tableColumn.map((column) => column.title),
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

    saveAs(blob, 'Employee-Site-Attendances.xlsx');
  };

  if (loading) {
    return (
      <div className="text-center">
        <Spin size="large" />
      </div>
    );
  }
  const { Panel } = Collapse;
  return (
    <>
      <Loading visible={loading} />
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">
              Employee Site Attendances Report
            </h5>
          </div>
        </Card.Header>
        <Collapse>
          <Panel header="Filter" key="1">
            <Row
              align="middle"
              className="d-flex align-items-center justify-content-center"
            >
              <Col span={isAdmin ? 10 : 18} className="text-center">
                <h5>Agreed Man Power : {manPower} </h5>
                <h5>Site Name: {`${currentSiteId}-${site}`} </h5>
              </Col>
              <Col style={style} span={isAdmin ? 20 : 5} offset={1}>
                <Space wrap>
                  {isAdmin && (
                    <Select
                      defaultValue={currentSiteId}
                      showSearch
                      placeholder="Select a site"
                      optionFilterProp="children"
                      onChange={handleChangeSiteId}
                      onSearch={onSearch}
                      filterOption={filterOption}
                      options={siteIdsOptions}
                      style={{ width: 350 }}
                    />
                  )}
                  <DatePicker
                    format="MMM yyyy"
                    caretAs={BsCalendar2MonthFill}
                    value={value}
                    onChange={handleChange}
                    shouldDisableDate={disableFutureDates}
                  />
                  <div>
                    <Form.Select size="sm" className="me-2 ">
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
                      // value={keyword.value}
                      // onChange={onKeywordChange}
                      />
                    </InputGroup>
                  </div>

                  <IconButton
                    variant="primary"
                    size="sm"
                    icon="search"
                    transform="shrink-3"
                    onClick={handleSearchButton}
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
        <div id="orders-actions" className="p-3">
          <IconButton
            variant="primary"
            size="sm"
            icon="external-link-alt"
            transform="shrink-3"
            onClick={onClickExportAsExcel}
          >
            <span className="d-none d-sm-inline-block ms-1 ">Export</span>
          </IconButton>
        </div>
        <Row>
          <AttendanceReports
            columns={tableColumn}
            tableData={data}
            month={currentMonth}
            year={currentYear}
            hide={true}
            agreedManPower={manPower}
          />
        </Row>
      </Card>
    </>
  );
};
export default SiteAttendanceByEmployee;
