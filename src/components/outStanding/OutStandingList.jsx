/* eslint-disable no-unused-vars */

import React, { useEffect, useState } from 'react';
import { Col, Row, Space, Select, Spin, Collapse } from 'antd';
import { formattedAmount, monthNames } from 'helpers/utils';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { get } from 'lodash';
import ImprestApi from 'api/invoiceApi';
import { useAuth } from 'hooks/useAuth';
import IconButton from 'components/common/IconButton';
import Loading from 'components/attendance/Loading';
import { disableFutureDates } from 'helpers/utils';
import { Card } from 'react-bootstrap';
import OutStandingHeader from './OutStandingHeader';
import { FormControl, InputGroup, Form } from 'react-bootstrap';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import { getErrorMessage } from 'helpers/utils';
const OutStandingList = () => {
  const [data, setData] = useState([]);
  const todayDate = new Date();
  const [value, setValue] = useState(todayDate);
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [modalVisible, setModalVisible] = useState(true);
  const [searchType, setSearchType] = useState('siteName');
  const [searchKeyword, setSearchKeyword] = useState('');

  const [siteIdsOptions, setSiteIdsOptions] = useState([]);
  const [currentSiteId, setCurrentSiteId] = useState(siteIdsOptions[0]?.value);

  useEffect(() => {
    getSiteSalaryDetailsFinal();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const result = await ImprestApi.getSubSite('GST');
      const errorMessage = getErrorMessage(result);
      if (errorMessage) {
        toast.error(errorMessage, {
          theme: 'colored',
        });
      } else {
        const responseData = get(result, 'data.data', []);
        responseData.push({ value: 'ALL', label: 'ALL' });
        setSiteIdsOptions(responseData);
        setCurrentSiteId(responseData[0].value);
      }
    }
    fetchData();
  }, []);

  const getSiteSalaryDetailsFinal = () => {
    const month = currentMonth;
    const year = currentYear;
    setModalVisible(true);
    getSiteSalaryDetails(currentSiteId, month, year);
  };

  const totalColumn = [
    {
      title: 'Opening Balance',
      dataIndex: 'openingBalance',
      key: 'openingBalance',
      width: 100,
      render: (text) => <strong>{formattedAmount(text ?? '')}</strong>,
    },
    {
      title: 'Opening Liability',
      dataIndex: 'openingLiability',
      key: 'openingLiability',
      width: 120,
      render: (text) => <>{formattedAmount(text ?? '')}</>,
    },
    {
      title: 'Invoice No',
      dataIndex: 'gstInvoiceNo',
      key: 'gstInvoiceNo',
      width: 80,
    },
    {
      title: 'Debit Amount',
      dataIndex: 'debitAmount',
      key: 'debitAmount',
      width: 100,
      render: (text) => <strong>{formattedAmount(text ?? '')}</strong>,
    },
    {
      title: 'Credit Amount',
      dataIndex: 'creditAmount',
      key: 'creditAmount',
      width: 100,
      render: (text) => <strong>{formattedAmount(text ?? '')}</strong>,
    },
    {
      title: 'TDS Amount',
      dataIndex: 'tdsAmount',
      key: 'tdsAmount',
      width: 100,
      render: (text) => <strong>{formattedAmount(text ?? '')}</strong>,
    },
    {
      title: 'Remarks',
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
    },
    {
      title: 'Balance OutStanding',
      dataIndex: 'balanceOutStanding',
      key: 'balanceOutStanding',
      width: 150,
    },
    {
      title: 'Balance Liability',
      dataIndex: 'balanceLiability',
      key: 'balanceLiability',
      width: 150,
    },
  ];

  const defaultColumn = [
    {
      title: 'DATE',
      dataIndex: 'date',
      key: 'date',
      editable: true,
      fixed: 'left',
      width: 100,
      render: (text, record) => {
        if (record.date === 'TOTAL') {
          return <span>TOTAL</span>;
        }
        const date = new Date(record.date);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear().toString();
        return <span>{`${day}/${month}/${year}`}</span>;
      },
    },
    {
      title: 'Unit Code',
      dataIndex: 'siteId',
      key: 'siteId',
      editable: true,
      fixed: 'left',
      width: 80,
    },
    {
      title: 'Unit Name',
      dataIndex: 'siteName',
      key: 'siteName',
      editable: true,
      fixed: 'left',
      width: 150,
    },
  ];

  const columns = [...defaultColumn, ...totalColumn];

  const onClickExportAsExcel = () => {
    const currentMonthName = monthNames[currentMonth].label;
    const dataToExport = data.map((record) =>
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

    saveAs(blob, 'out_standing.xlsx');
  };


  const getSiteSalaryDetails = (siteId, month, year) => {
    const curentMonth = month;
    const monthLabel = monthNames.find(
      (month) => month.value === curentMonth,
    ).label;
    ImprestApi.fetchInvoiceOutStanding(
      siteId,
      monthLabel,
      year,
      searchType,
      searchKeyword,
    )
      .then((response) => {

        const responseData = get(response, 'data.data', []);


        const totalCreditAmount = responseData.reduce((sum, item) => sum + (item.creditAmount || 0), 0);
        const totalDebitAmount = responseData.reduce((sum, item) => sum + (item.debitAmount || 0), 0);
        const totalTdsAmount = responseData.reduce((sum, item) => sum + (item.tdsAmount || 0), 0);

        const openingBalance = responseData.length > 0 ? parseFloat(get(responseData[0], 'openingBalance', 0)) : 0;

        // Calculate final results
        const finalCreditResult = totalCreditAmount + totalTdsAmount;
        const finalDebitResult = totalDebitAmount + openingBalance;



        const defaultDate = 'TOTAL';

        // Add the final total row
        const finalTotal = [...responseData];
        finalTotal.push({
          date: defaultDate,
          debitAmount: finalDebitResult,
          creditAmount: finalCreditResult,
          tdsAmount: totalTdsAmount,
          balanceOutStanding: finalDebitResult - finalCreditResult
        });

        // Set the updated data to state
        setData(finalTotal);

        setModalVisible(false);

      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setModalVisible(false);
      });
  };

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
  const onUnitCodeChange = (value) => {
    setCurrentSiteId(value);
  };
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const { Panel } = Collapse;

  return (
    <>
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-20 position-relative">
          <div className="position-relative light">
            <h5 className="mb-0 text-white">Out Standing Report</h5>
          </div>
        </Card.Header>
        <br />
        <Loading visible={modalVisible} />
        <Collapse>
          <Panel header="Filter" key="1">
            <Row align="middle">
              <Col style={style} offset={1} gap={4}>
                <Space wrap>
                  <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
                    <Select
                      defaultValue={currentSiteId}
                      value={currentSiteId}
                      showSearch
                      placeholder="Select a Unit Code"
                      optionFilterProp="children"
                      onChange={onUnitCodeChange}
                      options={siteIdsOptions}
                      filterOption={filterOption}
                      size="large"
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
                        className="me-2 width-15"
                        value={searchType}
                        onChange={(e) => setSearchType(e.target.value)}
                      >
                        <option value="siteName">UNIT NAME</option>
                        <option value="siteId">UNIT CODE</option>
                        <option value="gstInvoiceNo">INVOICE NO</option>
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
                    <IconButton
                      variant="primary"
                      size="sm"
                      icon="search"
                      transform="shrink-3"
                      onClick={getSiteSalaryDetailsFinal}
                    >
                      <span className="d-none d-sm-inline-block ms-1">
                        Search
                      </span>
                    </IconButton>
                  </div>
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
                </Space>
              </Col>
            </Row>
          </Panel>
        </Collapse>
        <Row>
          <OutStandingHeader columns={columns} tableData={data} />
        </Row>
      </Card>
    </>
  );
};
export default OutStandingList;
