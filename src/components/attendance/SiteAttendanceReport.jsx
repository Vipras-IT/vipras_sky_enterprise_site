/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Space, Spin, Collapse } from 'antd';
import { FormControl, InputGroup, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getDaysInMonth, disableFutureDates, monthNames } from 'helpers/utils';
import useAPI from 'hooks/useApi';
import { get, isEmpty } from 'lodash';
import siteAPI from 'api/siteCreation';
import attendanceAPI from 'api/attendance';
import { useAuth } from 'hooks/useAuth';
import { toast } from 'react-toastify';
import IconButton from 'components/common/IconButton';
import { Select } from 'antd';
import { Card } from 'react-bootstrap';
import Loading from './Loading';
import SiteAttendance from './SiteAttendance';
import { DatePicker, Stack } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';

const SiteAttendanceReports = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const todayDate = new Date();
  // const monthNameList = getPreviousMonthNames(todayDate.getFullYear());
  // const [monthOptions, setMonthOptions] = useState(monthNameList);
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const getSiteAPI = useAPI(siteAPI.getSitedetailsBySiteCode);
  const [siteData, setSiteData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, setValue] = useState(todayDate);

  // const yearOptions = [
  //   {
  //     value: 2022,
  //     label: '2022'
  //   },
  //   {
  //     value: 2023,
  //     label: '2023'
  //   },
  //   {
  //     value: 2024,
  //     label: '2024'
  //   }
  // ];

  const dayColumn = getDaysInMonth(currentMonth, currentYear);
  const defaultColumn = [
    {
      title: 'Site Name',
      dataIndex: 'siteName',
      fixed: 'left',
      key: 'siteName',
      width: 200,
    },
    {
      title: 'Site Id',
      dataIndex: 'siteId',
      fixed: 'left',
      key: 'siteId',
      width: 100,
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


  const handleChangeSiteId = (value) => {
    setCurrentSiteId(value);
    getSiteDetails(value);
  };

  const handleChange = (date) => {
    setValue(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const handleSearch = () => {
    getAttendanceReport(currentSiteId, currentMonth, currentYear);
  };
  useEffect(() => {
    // const monthNameList = getPreviousMonthNames(currentYear);
    const dayColumn = getDaysInMonth(currentMonth, currentYear);
    const columns = [...defaultColumn, ...dayColumn, ...totalColumn];
    setTableColumn(columns);
    // setMonthOptions(monthNameList);
  }, [currentYear]);

  useEffect(() => {
    const dayColumn = getDaysInMonth(currentMonth, currentYear);
    const columns = [...defaultColumn, ...dayColumn, ...totalColumn];
    setTableColumn(columns);
  }, [currentMonth]);

  const getSiteDetails = (siteId) => {
    getSiteAPI.request(siteId);
  };

  useEffect(() => {
    setLoading(true);
    getSiteDetails(currentSiteId);
    // const month = todayDate.getMonth() + 1;
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
  const getAttendanceReport = (siteId, month, year) => {
    setLoading(true);
    attendanceAPI
      .getSiteAttendanceReport(month, year)
      .then((response) => {
        const todayAttendance = get(response, 'data.data', []);
        setData(todayAttendance);
        // attendanceCount(todayAttendance);
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

    saveAs(blob, 'Site-Attendance.xlsx');
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
            <h5 className="mb-0 text-white">All Site Attendances Report</h5>
          </div>
        </Card.Header>
        <Collapse>
          <Panel header="Filter" key="1">
            <Row align="center">
              {/* <Col span={isAdmin ? 8 : 18}> <h5> </h5>  </Col> */}
              {/* span= {isAdmin ? 25 : 5} */}
              <Col style={style} offset={1}>
                <Space wrap>
                  <div className="d-flex flex-column justify-content-center flex-wrap align-items-center gap-3 px-5">
                    {/* {isAdmin && (
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
                    width: 410
                  }}
                />
              )} */}
                    <div className="d-flex align-items-center gap-3">
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
                        options={monthOptions}
                      /> */}
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
                          className="me-2 width-15"
                          // defaultValue={searchType}
                          // value={searchType}
                          // onChange={e => {
                          //   setSearchType(e.target.value);
                          // }}
                        >
                          {['Site Name', 'Site Id', 'Total'].map((pageSize) => (
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
                        onClick={handleSearch}
                      >
                        <span className="d-none d-sm-inline-block ms-1">
                          Search
                        </span>
                      </IconButton>
                    </div>
                    <div className="d-flex align-items-center gap-3">
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
                        <Button>
                          <span className="d-none d-sm-inline-block ms-1">
                            Total No.of Site Count : {data.length}
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
          <SiteAttendance
            columns={tableColumn}
            tableData={data}
            month={currentMonth}
            year={currentYear}
          />
        </Row>
      </Card>
    </>
  );
};
export default SiteAttendanceReports;
