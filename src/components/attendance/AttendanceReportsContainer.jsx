/* eslint-disable no-unused-vars */

import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Row, Space, Spin, Collapse, Input } from 'antd';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getDaysInMonth, disableFutureDates, monthNames } from 'helpers/utils';
import useAPI from 'hooks/useApi';
import { get, isEmpty } from 'lodash';
import siteAPI from 'api/siteCreation';
import attendanceAPI from 'api/attendance';
import Highlighter from 'react-highlight-words';
import { useAuth } from 'hooks/useAuth';
import AttendanceReports from './AttendanceReports';
import { toast } from 'react-toastify';
import IconButton from 'components/common/IconButton';
import { Select } from 'antd';
import { Card } from 'react-bootstrap';
import Loading from './Loading';
import { FormControl, InputGroup, Form } from 'react-bootstrap';
import { SearchOutlined } from '@ant-design/icons';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';

const AttendanceReportsContainer = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const todayDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const getSiteAPI = useAPI(siteAPI.getSitedetailsBySiteCode);
  const [siteData, setSiteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(todayDate);
  const [searchType, setSearchType] = useState('Name');
  const [searchKeyword, setSearchKeyword] = useState('');

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const dayColumn = getDaysInMonth(currentMonth, currentYear);

  const searchInput = useRef(null);


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),

    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
        : false,

    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });


  const defaultColumn = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'EMP Id',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      fixed: 'left',
      ...getColumnSearchProps('id'),
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      key: 'designation',
      width: 120,
      fixed: 'left',
      editable: true,
      ...getColumnSearchProps('designation'),
    },
  ];


  const totalColumn = [
    {
      title: 'Present ',
      dataIndex: 'present',
      key: 'Present',
      width: 100,
    },
    {
      title: 'Absent',
      dataIndex: 'absent',
      key: 'absent',
      width: 100,
    },
    {
      title: 'WeekOff',
      dataIndex: 'weekOff',
      key: 'weekOff',
      width: 100,
    },
    {
      title: 'National Holiday',
      dataIndex: 'nationalHoliday',
      key: 'nationalHoliday',
      width: 100,
    },
    // {
    //   title: 'Bulk Duty',
    //   dataIndex: 'bulkDuty',
    //   key: 'bulkDuty',
    //   width: 100,
    // },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: 100,
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

  const handleChange = (date) => {
    setValue(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const handleChangeSiteId = (value) => {
    setCurrentSiteId(value);
    getSiteDetails(value);
  };


  const getSiteDetails = (siteId) => {
    getSiteAPI.request(siteId);
  };

  useEffect(() => {
    setLoading(true);
    getSiteDetails(currentSiteId);
    getAttendanceReport(currentSiteId, currentMonth, currentYear);
  }, []);

  useEffect(() => {
    if (getSiteAPI.data) {
      if (!isEmpty(getSiteAPI.data.data)) {
        setSiteData(getSiteAPI.data.data);
      }
    }
    setLoading(false);
  }, [getSiteAPI.data]);

  useEffect(() => {
    if (getSiteAPI.error) {
      setSiteData({});
    }
    setLoading(false);
  }, [getSiteAPI.error]);

  const style = {
    padding: '8px 0',
  };


  const handleSearchs = () => {

  getAttendanceReport(currentSiteId, currentMonth, currentYear);
    const dayColumn = getDaysInMonth(currentMonth, currentYear);
    const columns = [...defaultColumn, ...dayColumn, ...totalColumn];
    setTableColumn(columns);
  };

  const getAttendanceReport = (siteId, month, year, filter) => {
    setLoading(true);
    console.log(month);

    attendanceAPI
      .getAttendanceReport(siteId, month, year, filter)
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

  const onSearch = (value) => {
    console.log('search:', value);
  };

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const siteName = get(siteData, 'siteName', '');
  const siteCode = get(siteData, 'unitcode', '');
  const siteNameDetails = `${siteCode} - ${siteName}`;
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

    saveAs(blob, 'AttendanceData.xlsx');
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
            <h5 className="mb-0 text-white">All Attendances Report</h5>
          </div>
        </Card.Header>
        <Collapse>
          <Panel header={siteNameDetails} key="1">
            <Row align="middle">
              <Col style={style} span={isAdmin ? 22 : 5} offset={1}>
                <Space wrap>
                  <div className="d-flex flex-wrap justify-content-center align-items-center gap-3 px-5">
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
                        style={{
                          width: 350,
                        }}
                      />
                    )}
                    <DatePicker
                      format="MMM yyyy"
                      caretAs={BsCalendar2MonthFill}
                      value={value}
                      onChange={handleChange}
                      shouldDisableDate={disableFutureDates}
                    />
                    {/* <div>
                      <Form.Select
                        size="sm"
                        className="me-2 "
                        defaultValue={searchType}
                        value={searchType}
                        onChange={e => {
                          setSearchType(e.target.value);
                        }}
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
                          value={searchKeyword}
                          onChange={(e) => setSearchKeyword(e.target.value)}
                        />
                      </InputGroup>
                    </div> */}
                    <IconButton
                      variant="primary"
                      size="sm"
                      icon="search"
                      transform="shrink-3"
                      onClick={handleSearchs}
                    >
                      <span className="d-none d-sm-inline-block ms-1">
                        Search
                      </span>
                    </IconButton>
                    <div className="d-flex align-items-center gap-2">
                      <div id="orders-actions">
                        <IconButton
                          variant="primary"
                          size="sm"
                          icon="external-link-alt"
                          transform="shrink-3"
                          onClick={onClickExportAsExcel}
                        >
                          <span className="d-none d-sm-inline-block ms-1">
                            Export
                          </span>
                        </IconButton>
                      </div>
                      <div id="orders-actions">
                        <Button
                        // variant="primary"
                        // size="sm"
                        // icon="external-link-alt"
                        // transform="shrink-3"
                        // onClick={onClickExportAsExcel}
                        >
                          <span className="d-none d-sm-inline-block ms-1">
                            Total No.of Employees count : {data.length}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Space>
              </Col>
            </Row>
          </Panel>
        </Collapse>
        <Row>
          <AttendanceReports
            columns={tableColumn}
            tableData={data}
            month={currentMonth}
            year={currentYear}
            hide={false}
          />
        </Row>
      </Card>
    </>
  );
};
export default AttendanceReportsContainer;
