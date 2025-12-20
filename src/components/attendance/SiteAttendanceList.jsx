import { useEffect, useState } from 'react';
import { Col, Row, Space, Spin } from 'antd';
import { get } from 'lodash';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import manualAttendanceAPI from 'api/manualAttendance';
import IconButton from 'components/common/IconButton';
import Loading from 'components/attendance/Loading';
import { Card } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import SiteAttendanceListTable from './SiteAttendanceListTable';
// import { monthNames } from 'helpers/utils';

const SiteAttendanceList = () => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(true);
  const params = useParams();
  const { month, year, Id, day } = params;
  useEffect(() => {
    const stringValues = day.toString();
    const splitValues = stringValues.split(' ');
    const firstDay = splitValues[0];
    setModalVisible(true);
    manualAttendanceAPI
      .getAttendanceByEmployee(year, month, Id, firstDay)
      .then((response) => {
        const responseData = get(response, 'data.data', []);
        console.log(responseData);
        setData(responseData);
        setModalVisible(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setModalVisible(false);
      });
  }, []);

  const totalColumn = [
    {
      title: 'UNIT CODE',
      dataIndex: 'siteId',
      key: 'siteId',
      width: 50,
    },
    {
      title: 'Shift',
      dataIndex: 'shift',
      key: 'shift',
      width: 50,
    },
    {
      title: 'No Of Duty',
      dataIndex: 'noOfDuty',
      key: 'noOfDuty',
      width: 60,
    },
  ];

  const defaultColumn = [
    {
      title: 'Employee Name',
      dataIndex: 'employeeName',
      key: 'employeeName',
      editable: true,
      fixed: 'left',
      width: 50,
    },
    {
      title: 'Employee Number',
      dataIndex: 'employeeNumber',
      key: 'employeeNumber',
      editable: true,
      fixed: 'left',
      width: 50,
    },
    {
      title: 'DESIGNATION',
      dataIndex: 'role',
      editable: true,
      fixed: 'left',
      width: 80,
    },
  ];
  const columns = [...defaultColumn, ...totalColumn];

  const onClickExportAsExcel = () => {
    // const currentMonthName = monthNames[currentMonth].label;
    const dataToExport = data.map((record) =>
      columns.map((column) => get(record, column.dataIndex, '')),
    );

    const worksheet = XLSX.utils.aoa_to_sheet([
      columns.map((column) => column.title),
      ...dataToExport,
    ]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet);

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    saveAs(blob, 'Site-Attendance-Report.xlsx');
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

  return (
    <>
      <Loading visible={modalVisible} />
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">Site Attendance Report</h5>
          </div>
        </Card.Header>
        <Row align="middle">
          <Col style={style} span={13} offset={1}>
            <Space wrap>
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
            </Space>
          </Col>
        </Row>
        <Row>
          <SiteAttendanceListTable
            columns={columns}
            tableData={data}
          />
        </Row>
      </Card>
    </>
  );
};
export default SiteAttendanceList;
