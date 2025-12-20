/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Col, Row, Space, Spin, Collapse } from 'antd';
import { Button, Spinner } from 'react-bootstrap';
import { Card } from 'react-bootstrap';
import {
  getDaysInMonth,
  disableFutureDates,
  monthNames,
  getErrorMessage,
} from 'helpers/utils';
import { get, isEmpty } from 'lodash';
import shiftScheduleAPI from 'api/shiftSchedule';
import { useAuth } from 'hooks/useAuth';
import ShiftSchedule from './ShiftSchedule';
import { toast } from 'react-toastify';
import IconButton from 'components/common/IconButton';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Select } from 'antd';
import { FormControl, InputGroup, Form } from 'react-bootstrap';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ShiftScheduleContainer = () => {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const todayDate = new Date();

  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [value, setValue] = useState(todayDate);
  const [loading, setLoading] = useState(true);
  const [siteScheduledData, setSiteScheduledData] = useState({});


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

  const dayColumn = getDaysInMonth(currentMonth, currentYear);
  const defaultColumn = [
    {
      title: 'Name',
      dataIndex: 'name',
      editable: false,
      fixed: 'left',
      width: 200,
    },
    {
      title: 'EMP Id',
      dataIndex: 'employeeId',
      editable: false,
      fixed: 'left',
      width: 100,
    },
    {
      title: 'Designation',
      dataIndex: 'designation',
      editable: false,
      fixed: 'left',
      width: 120,
    },
  ];
  const columns = [...defaultColumn, ...dayColumn];
  const [tableColumn, setTableColumn] = useState(columns);

  const handleChange = (date) => {
    setValue(date);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    setCurrentMonth(month);
    setCurrentYear(year);
  };
  const handleChangeSiteId = (value) => {
    setCurrentSiteId(value);
  };

  useEffect(() => {
    const dayColumn = getDaysInMonth(currentMonth, currentYear);
    const columns = [...defaultColumn, ...dayColumn];
    setTableColumn(columns);
  }, [currentYear]);

  useEffect(() => {
    const dayColumn = getDaysInMonth(currentMonth, currentYear);
    const columns = [...defaultColumn, ...dayColumn];
    setTableColumn(columns);
  }, [currentMonth]);

  useEffect(() => {
    setLoading(true);
    getShiftScheduleData(currentSiteId, currentMonth, currentYear);
  }, []);

  const handleSearch = () => {
    getShiftScheduleData(currentSiteId, currentMonth, currentYear);
  };

  const style = {
    padding: '8px 0',
  };

  const onSearch = (value) => {
    console.log('search:', value);
  };

  const getShiftScheduleData = async (siteId, month, year) => {
    const response = await shiftScheduleAPI.getShiftSchedule(
      siteId,
      month + 1,
      year,
    );
    if (get(response, 'data.success') && !isEmpty(get(response, 'data.data'))) {
      const scheduleData = get(response, 'data.data.shift.schedule');
      setSiteScheduledData(get(response, 'data.data'));
      setData(scheduleData);
    }
    setLoading(false);
  };

  const updateShiftScheduleData = async () => {
    setLoading(true);
    const currentMonthName = monthNames[currentMonth].label;
    const userData = JSON.parse(localStorage.getItem('user'));
    const postData = {
      siteId: currentSiteId,
      month: `${currentMonthName}-${currentYear}`,
      schedule: data,
      createdBy: Number(userData.employeeId),
    };
    const response = await shiftScheduleAPI.updateShiftSchedule(
      get(siteScheduledData, 'shift.id'),
      postData,
    );
    const errorMessage = getErrorMessage(response);
    setLoading(false);
    if (errorMessage) {
      toast.error(errorMessage, {
        theme: 'colored',
      });
    } else {
      toast.success('Shift updated successfully', {
        theme: 'colored',
      });
    }
  };

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  if (loading) {
    return (
      <div className="text-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isEmpty(data)) {
    return (
      <div className="text-center">
        <h3>No records found!</h3>
      </div>
    );
  }

  const shiftoptionList = get(siteScheduledData, 'site.shiftoption', []);
  const shiftList = shiftoptionList.map((data) => (
    <span className="shift-option" key={data}>
      {data}
    </span>
  ));
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

    saveAs(blob, 'ShiftScheduleData.xlsx');
  };
  const { Panel } = Collapse;
  return (
    <>
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">All Shift Schedule</h5>
          </div>
        </Card.Header>
        <Collapse>
          <Panel header={shiftList} key="1">
            <Row align="middle">
              {/* <Col span={10}>{shiftList}</Col> */}
              <Col style={style} offset={1}>
                <Space wrap>
                  <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 px-5">
                    {isAdmin && (
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
                    <div>
                      <Form.Select
                        size="sm"
                        className="me-2 "
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
                      onClick={handleSearch}
                    >
                      <span className="d-none d-sm-inline-block ms-1">
                        Search
                      </span>
                    </IconButton>
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
                        <Button
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
          <ShiftSchedule
            columns={tableColumn}
            tableData={data}
            setScheduleData={setData}
          />
        </Row>
        <Row>
          <Col span={4} offset={10}>
            <Button
              onClick={updateShiftScheduleData}
              color="primary"
              className="mt-4 w-100"
            >
              {loading && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              <span className="ps-2">Save</span>
            </Button>
          </Col>
        </Row>
      </Card>
    </>
  );
};
export default ShiftScheduleContainer;
