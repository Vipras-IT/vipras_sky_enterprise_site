import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { Col, Row, Spin } from 'antd';
import { DatePicker, Stack } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';
import 'rsuite/dist/rsuite.min.css';
import { Table } from 'antd';
import { getCompareAgreedActual } from 'api/compareagreedactual';
import IconButton from 'components/common/IconButton';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { monthNames, disableFutureDates } from 'helpers/utils';

export default function CompareAgreedAcutal() {
  const [value, setValue] = useState(new Date());
  const [monthValue, setMonthValue] = useState(new Date().getMonth());
  const [yearValue, setYearValue] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const columns = [
    {
      title: 'UNIT CODE',
      dataIndex: 'unitCode',
      key: 'unitCode',
    },
    {
      title: 'UNIT NAME',
      dataIndex: 'unitName',
      key: 'unitName',
    },
    {
      title: 'AGR MAN',
      dataIndex: 'agreedManPower',
      key: 'agreedManPower',
    },
    {
      title: 'AGR AMT',
      dataIndex: 'agreedAmount',
      key: 'agreedAmount',
    },
    {
      title: 'ACT MAN',
      dataIndex: 'actualManPower',
      key: 'actualManPower',
    },
    {
      title: 'ACT BILL',
      dataIndex: 'actualBilling',
      key: 'actualBilling',
    },
    {
      title: 'DEF MAN',
      dataIndex: 'deficitManPower',
      key: 'deficitManPower',
    },
    {
      title: 'DEF AMT',
      dataIndex: 'deficitBilling',
      key: 'deficitBilling',
    },
  ];

  const handleChange = (date) => {
    setValue(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    setMonthValue(month);
    setYearValue(year);
    getDataReport(month, year);
  };

  const getDataReport = async (month = monthValue, year = yearValue) => {
    setModalVisible(true);
    try {
      const response = await getCompareAgreedActual(month, year);
      const menuData = response.data.data;
      setReportData(menuData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setModalVisible(false);
    }
  };

  useEffect(() => {
    getDataReport();
  }, []);

  const onClickExportAsExcel = () => {
    const currentMonthName = monthNames[monthValue - 1].label;
    const headers = columns.map((column) => column.title);
    const dataToExport = reportData.map((item) => [
      item.unitCode,
      item.unitName,
      item.agreedManPower,
      item.agreedAmount,
      item.actualManPower,
      item.actualBilling,
      item.deficitManPower,
      item.deficitBilling,
    ]);
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataToExport]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, currentMonthName);

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(blob, 'Agreed_VS_Actual_Billing.xlsx');
  };
  return (
    <Card>
      <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
        <div className="position-relative z-index-1 light">
          <h5 className="mb-0 text-white">
            Comparision of Agreed Vs Acutal Billing
          </h5>
        </div>
      </Card.Header>
      <Row align="end mb-3 mt-3 me-5">
        <Col>
          <IconButton
            variant="primary"
            size="sm"
            icon="external-link-alt"
            transform="shrink-3"
            onClick={onClickExportAsExcel}
          >
            <span className="d-none d-sm-inline-block ms-1">Export</span>
          </IconButton>
        </Col>
        <Col offset={1}>
          <Stack spacing={10} direction="column" alignItems="flex-start">
            <DatePicker
              format="MMM yyyy"
              caretAs={BsCalendar2MonthFill}
              value={value}
              onChange={handleChange}
              shouldDisableDate={disableFutureDates}
            />
          </Stack>
        </Col>
      </Row>
      {modalVisible ? (
        <div className="text-center">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          columns={columns}
          dataSource={reportData}
          pagination={false}
          scroll={{
            y: 400,
          }}
        />
      )}
    </Card>
  );
}
