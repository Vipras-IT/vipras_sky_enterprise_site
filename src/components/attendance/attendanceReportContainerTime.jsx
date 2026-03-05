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
import AttendanceReports from './attendanceReportTime';
import { toast } from 'react-toastify';
import IconButton from 'components/common/IconButton';
import { Select } from 'antd';
import { Card } from 'react-bootstrap';
import Loading from './Loading';
import { FormControl, InputGroup, Form } from 'react-bootstrap';
import { SearchOutlined } from '@ant-design/icons';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';

const AttendanceReportsContainerTime = () => {
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

  const dailyColumnsKeys = Array.from({ length: 31 }, (_, i) => `day${i + 1}`);

  const formatTimeExcel = (isoString) => {
    if (!isoString) return '--';
    return new Date(isoString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const onClickExportAsExcel = () => {
    const currentMonthName = monthNames[currentMonth].label;

    // Separate columns: fixed info cols vs daily cols vs total cols
    const fixedCols = tableColumn.filter(
      (col) => !dailyColumnsKeys.includes(col.dataIndex) &&
        !['present', 'absent', 'total'].includes(col.dataIndex)
    );
    const dayCols = tableColumn.filter((col) => dailyColumnsKeys.includes(col.dataIndex));
    const summaryCol = tableColumn.filter((col) =>
      ['present', 'absent', 'total'].includes(col.dataIndex)
    );

    // ── HEADER ROW 1: fixed + day titles + summary ──
    const headerRow = [
      ...fixedCols.map((month) => month.title),
      ...dayCols.map((month) => month.title),   //1 SUN,2 MON
      ...summaryCol.map((month) => month.title),
    ];

    // ── HEADER ROW 2: empty for fixed + "IN / OUT" sub-headers for day cols ──
    const subHeaderRow = [
      ...fixedCols.map(() => ''),
      ...dayCols.map(() => ''),
      ...summaryCol.map(() => ''),
    ];

    const rows = [headerRow, subHeaderRow];

    data.forEach((record) => {
      // Fixed info: name, id, designation
      const fixedValues = fixedCols.map((col) => get(record, col.dataIndex, ''));

      // Summary values
      const summaryValues = summaryCol.map((col) => get(record, col.dataIndex, ''));

      // For each day, find max duties across all days (to know how many sub-rows needed)
      const maxDuties = dayCols.reduce((max, col) => {
        const infoArray = record[`${col.dataIndex}-info`] || [];
        return Math.max(max, infoArray.length);
      }, 1); // minimum 1 row per employee

      // Build sub-rows for this employee
      for (let i = 0; i < maxDuties; i++) {
        const dayValues = dayCols.map((col) => {
          const infoKey = `${col.dataIndex}-info`;
          const infoArray = record[infoKey] || [];
          const raw = get(record, col.dataIndex, '');

          if (infoArray.length === 0) {
            // No duty info — show A / WO / NH only on first sub-row
            return i === 0 ? (raw === 0 ? 'A' : String(raw)) : '';
          }

          const entry = infoArray[i]; // get duty at index i
          if (!entry) return ''; // no more duties for this day

          const checkIn = formatTimeExcel(entry.checkIn);
          const checkOut = formatTimeExcel(entry.checkOut);
          // const shift = entry.shift ? ` (${entry.shift})` : '';
          return `Check In: ${checkIn} | Check Out: ${checkOut}`;
        });

        if (i === 0) {
          // First sub-row: include fixed info + day data + summary
          rows.push([...fixedValues, ...dayValues, ...summaryValues]);
        } else {
          // Extra sub-rows (multiple duties): empty fixed + day data + empty summary
          rows.push([
            ...fixedCols.map(() => ''),
            ...dayValues,
            ...summaryCol.map(() => ''),
          ]);
        }
      }

      // Add an empty separator row between employees for readability
      rows.push(Array(headerRow.length).fill(''));
    });

    // ── BUILD WORKSHEET ──
    const worksheet = XLSX.utils.aoa_to_sheet(rows);

    // Column widths
    const colWidths = headerRow.map((h, i) => {
      const maxLen = Math.max(
        String(h).length,
        ...rows.map((row) => String(row[i] || '').length),
      );
      return { wch: Math.min(maxLen + 2, 45) };
    });
    worksheet['!cols'] = colWidths;

    // Merge fixed info cells vertically for first employee row (optional styling)
    // Text wrap for all cells
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let R = range.s.r; R <= range.e.r; R++) {
      for (let C = range.s.c; C <= range.e.c; C++) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellRef]) {
          worksheet[cellRef] = { v: '', t: 's' };
        }
        if (!worksheet[cellRef].s) worksheet[cellRef].s = {};
        worksheet[cellRef].s.alignment = { wrapText: true, vertical: 'top' };

        // Bold header rows
        if (R === 0 || R === 1) {
          worksheet[cellRef].s.font = { bold: true };
          worksheet[cellRef].s.fill = {
            fgColor: { rgb: R === 0 ? 'C6EFCE' : 'DDEBF7' },
          };
        }
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, currentMonthName);

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, `AttendanceData_${currentMonthName}_${currentYear}.xlsx`);
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
            <h5 className="mb-0 text-white">All Check In/Out Report</h5>
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
                        <Button>
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
export default AttendanceReportsContainerTime;
