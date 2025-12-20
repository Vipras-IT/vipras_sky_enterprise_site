/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import {
  Col,
  Row,
  Space,
  Select,
  Button,
  Spin,
  Checkbox,
  notification,
  Input,
  Collapse,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import {
  calculateGrandTotalAmount,
  formattedAmount,
  accountsTransactionTypes,
} from 'helpers/utils';
import { disableFutureDates, monthNames } from 'helpers/utils';
import * as XLSX from 'xlsx';
import Highlighter from 'react-highlight-words';
import ImprestHolderTransactionAPI from 'api/Imprestholdertransaction';
import { saveAs } from 'file-saver';
import { get, upperCase } from 'lodash';
import IconButton from 'components/common/IconButton';
import Loading from 'components/attendance/Loading';
import { Card } from 'react-bootstrap';
import { getErrorMessage } from 'helpers/utils';
import expensesApi from 'api/expenses';
import AccountsTransactionListTable from './AccountsTransactionListTable';
import { toast } from 'react-toastify';
import { FormControl, InputGroup, Form } from 'react-bootstrap';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';
import { formatDateToIST } from '../../helpers/utils';

const AccountsTransactionList = () => {
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
  const [expenses, setExpenses] = useState([]);
  const [searchType, setSearchType] = useState('employeeName');
  const [searchKeyword, setSearchKeyword] = useState('');



  useEffect(() => {
    getSalaryReportFinal();
  }, []);

  const getSalaryReportFinal = () => {
    getSalaryReport(currentMonth, currentYear);
  };

  const getSalaryReport = (month, year) => {
    setModalVisible(true);
    let status = '';
    if (salaryPaid) {
      status = 'PAID';
    }
    if (salaryNotPaid) {
      status = 'NOT_PAID';
    }

    ImprestHolderTransactionAPI.fetchAccountsDetails(
      status,
      month + 1,
      year,
      searchType,
      searchKeyword,
    )
      .then((response) => {
        const responseData = get(response, 'data.data.items', []);
        const mapData = responseData.map((item) => {
          return { ...item, key: item.id };
        });
        const finalTotal = [...mapData];
        finalTotal.push({
          date: 'TOTAL',
          credit: formattedAmount(calculateGrandTotalAmount(mapData, 'credit')),
          debit: formattedAmount(calculateGrandTotalAmount(mapData, 'debit')),
        });
        setData(finalTotal);
        setModalVisible(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setModalVisible(false);
      });
  };

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [totalDebitAmount, setTotalDebitAmount] = useState(0);
  const [totalCreditAmount, setTotalCreditAmount] = useState(0);
  const [totalDebit, setTotalDebit] = useState(false);

  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);

    if (dataIndex === 'payType') {
      const filteredData = data.filter((record) => {
        if (!record[dataIndex]) return false;
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(selectedKeys[0].toLowerCase());
      });

      const totalDebit = filteredData.reduce((sum, item) => {
        const creditValue = parseFloat(item.debit) || 0;
        return sum + creditValue;
      }, 0);
      const totalCredit = filteredData.reduce((sum, item) => {
        const creditValue = parseFloat(item.credit) || 0;
        return sum + creditValue;
      }, 0);
      setTotalCreditAmount(totalCredit);
      setTotalDebitAmount(totalDebit);
      setTotalDebit(true);
    }
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
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        {dataIndex === 'payType' ? (
          <>
            <Select
              showSearch
              style={{ width: '100%', marginBottom: 8 }}
              size="large"
              placeholder="Select a type"
              filterOption={(input, option) =>
                (option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(value) => {
                setSelectedKeys(value ? [value] : []);
                handleSearch([value], confirm, dataIndex);
              }}
              options={accountsTransactionTypes}
            />
          </>
        ) : dataIndex === 'expensesType' ? (
          <Select
            showSearch
            style={{ width: '100%', marginBottom: 8 }}
            size="large"
            placeholder="Select an expense type"
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            onChange={(value) => {
              setSelectedKeys(value ? [value] : []);
              handleSearch([value], confirm, dataIndex);
            }}
            options={expenses}
          />
        ) : (
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
        )}
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

  useEffect(() => {
    const fetchData = async () => {
      const response = await expensesApi.getAllExpenses();
      const errorMessage = getErrorMessage(response);
      if (errorMessage) {
        toast.error(errorMessage, {
          theme: 'colored',
        });
      } else {
        setExpenses(get(response.data, 'data', []));
      }
    };
    fetchData();
  }, []);

  const totalColumn = [
    {
      title: 'UNITCODE',
      dataIndex: 'unitCode',
      key: 'unitCode',
      width: 120,
      ...getColumnSearchProps('unitCode'),
    },
    {
      title: 'ROOM CODE',
      dataIndex: 'roomCode',
      key: 'roomCode',
      width: 200,
      ...getColumnSearchProps('roomCode'),
    },
    {
      title: 'VENDOR CODE',
      dataIndex: 'vendorCode',
      key: 'vendorCode',
      width: 200,
      ...getColumnSearchProps('vendorCode'),
    },
    {
      title: 'DEBIT',
      dataIndex: 'debit',
      key: 'debit',
      width: 150,
      ...getColumnSearchProps('debit'),
    },
    {
      title: 'CREDIT',
      dataIndex: 'credit',
      key: 'credit',
      width: 150,
      ...getColumnSearchProps('credit'),
    },
    {
      title: 'TRANSACTION TYPE',
      dataIndex: 'payType',
      key: 'payType',
      width: 250,
      ...getColumnSearchProps('payType'),
    },
    {
      title: 'EXPENSES TYPE',
      dataIndex: 'expensesType',
      key: 'expensesType',
      width: 250,
      ...getColumnSearchProps('expensesType'),
    },
    {
      title: 'REMARKS',
      dataIndex: 'explanation',
      key: 'explanation',
      width: 150,
      ...getColumnSearchProps('explanation'),
    },
    {
      title: 'STATUS',
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
    {
      title: 'PAID BY',
      dataIndex: 'paidBy',
      key: 'paidBy',
      width: 150,
    },
    {
      title: 'CREATED ON',
      dataIndex: 'createdOn',
      key: 'createdOn',
      width: 150,
      render: (createdOn) => formatDateToIST(createdOn),
    },
    {
      title: 'UPDATED ON',
      dataIndex: 'updatedOn',
      key: 'updatedOn',
      width: 150,
      render: (updatedOn) => formatDateToIST(updatedOn),
    },
  ];

  const handleUnMarkPaid = async () => {
    if (selectedRows.length === 0) {
      openNotificationWithIcon('error', 'Please select at least one employee.');
    } else {
      const response = await ImprestHolderTransactionAPI.updateAccountsDetails(
        selectedRowKey,
        'NOT_PAID',
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
      const response = await ImprestHolderTransactionAPI.updateAccountsDetails(
        selectedRowKey,
        'PAID',
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
      title: 'DATE',
      dataIndex: 'date',
      key: 'date',
      editable: true,
      fixed: 'left',
      width: 200,
      render: (date) => {
        if (date === 'TOTAL') {
          return <span>TOTAL</span>;
        }
        const saleDate = new Date(date);
        const month = saleDate.getMonth() + 1;
        const monthValue = month < 10 ? `0${month}` : `${month}`;
        const day = saleDate.getDate();
        const dayValue = day < 10 ? `0${day}` : `${day}`;
        const formatDate = `${dayValue}/${monthValue}/${saleDate.getFullYear()}`;
        return <>{formatDate}</>;
      },
    },
    {
      title: 'EMP NAME',
      dataIndex: 'employeeName',
      key: 'employeeName',
      editable: true,
      fixed: 'left',
      width: 200,
      ...getColumnSearchProps('employeeName'),
    },
    {
      title: 'EMP ID',
      dataIndex: 'employeeID',
      key: 'employeeID',
      editable: true,
      fixed: 'left',
      width: 120,
      ...getColumnSearchProps('employeeID'),
    },
  ];

  const totalExportColumn = [
    {
      title: 'MONTH',
      dataIndex: 'month',
      key: 'month',
      width: 120,
    },
  ];
  const columns = [...defaultColumn, ...totalColumn];
  const exportColumn = [...defaultColumn, ...totalColumn, ...totalExportColumn];
  const onClickExportAsExcel = () => {
    if (selectedRows.length === 0) {
      openNotificationWithIcon('error', 'Please select at least one employee.');
    } else {
      const currentMonthName = monthNames[currentMonth].label;
      const dataToExport = selectedRows.map((record) =>
        exportColumn.map((column) => get(record, column.dataIndex, '')),
      );

      const worksheet = XLSX.utils.aoa_to_sheet([
        exportColumn.map((column) => column.title),
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

      saveAs(blob, 'AccountsTransaction.xlsx');
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
        .filter(
          (item) => get(item, 'bankDetails.bankName') !== 'CITY UNION BANK',
        )
        .map(
          (item) =>
            `NEFT~${get(item, 'bankDetails.ifscode')}~${item.debit}.00~10~${get(
              item,
              'bankDetails.accountNumber',
            )}~${item.employeeName}~CHENNAI~SAL-${monthChar}-${yearChar}`,
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
        .filter(
          (item) => get(item, 'bankDetails.bankName') === 'CITY UNION BANK',
        )
        .map(
          (item) =>
            `${get(item, 'bankDetails.accountNumber')}~${
              item.debit
            }.00~SAL-${monthChar}-${yearChar}`,
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
      const items = selectedRows.map((item) => item.id);
      setSelectedRowKey(items);
    },
  };

  const handleChange = (date) => {
    setValue(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  const { Panel } = Collapse;
  return (
    <>
      {contextHolder}
      <Loading visible={modalVisible} />
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">Accounts Transactions Report</h5>
          </div>
        </Card.Header>
        <Collapse>
          <Panel header="Filters" key="1">
            <Row align="center">
              <Col style={style} span={23} offset={1}>
                <Space
                  wrap
                  className="d-flex align-items-center justify-content-center gap-2"
                >
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

                  {/* <div id="orders-actions">
                    <Select
                      defaultValue={currentYear}
                      style={{
                        width: 120
                      }}
                      onChange={handleChangeYear}
                      options={yearOptions}
                    />
                  </div>
                  <div id="orders-actions">
                    <Select
                      defaultValue={currentMonth}
                      value={currentMonth}
                      style={{
                        width: 120
                      }}
                      onChange={handleChangeMonth}
                      options={getMonthNames(currentMonth)}
                    />
                  </div> */}
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
                      value={searchType}
                      onChange={(e) => setSearchType(e.target.value)}
                    >
                      <option value="employeeName">EMPLOYEE NAME</option>
                      <option value="employeeID">EMPLOYEE ID</option>
                      <option value="unitCode">UNIT CODE</option>
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
                    onClick={getSalaryReportFinal}
                  >
                    <FontAwesomeIcon icon="search" className="fs--1" />
                  </Button> */}
                  <IconButton
                    variant="primary"
                    size="sm"
                    icon="search"
                    transform="shrink-3"
                    onClick={getSalaryReportFinal}
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
        <div
          id="orders-actions"
          className="d-flex p-3 align-items-center justify-content-center gap-2"
        >
          <Button id="downloadBtn" onClick={downloadTxtFile} value="download">
            Download Other Bank
          </Button>
          &nbsp; &nbsp;
          <Button id="downloadBtn" onClick={downloadTxt} value="download">
            Download City Union Bank
          </Button>
          &nbsp; &nbsp;
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
        </div>
        <Row>
          <AccountsTransactionListTable
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            columns={columns}
            tableData={data}
            getSalaryReportFinal={getSalaryReportFinal}
          />
        </Row>
        {totalDebit && (
          <p className="text-alignleft fs-3 mt-n5 fw-bold">
            Total Debit: {formattedAmount(totalDebitAmount)}
          </p>
        )}
        {totalDebit && (
          <p className="text-center fs-3 mt-n5 fw-bold">
            Total Credit: {formattedAmount(totalCreditAmount)}
          </p>
        )}
      </Card>
    </>
  );
};
export default AccountsTransactionList;
