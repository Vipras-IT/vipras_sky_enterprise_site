import { Card } from 'react-bootstrap';
import TableData from 'components/Registration/previous-employment/Table';
import SiteReportHeader from './ReportHeader';

const EmployeeReports = () => {
  const columns = [
    {
      accessor: 'sno',
      Header: 'S.No',
      headerProps: { className: 'pe-1' },
    },
    {
      accessor: 'employeeId',
      Header: 'Employee No',
      headerProps: { className: 'pe-1' },
    },
    {
      accessor: 'employeename',
      Header: 'Employee Name',
      headerProps: { className: 'pe-7' },
    },
    {
      accessor: 'employeedesigination',
      Header: 'Desigination',
    },
    {
      accessor: 'agreedsalary',
      Header: 'Agreed Salary',
    },
    {
      accessor: 'noofworkingdays',
      Header: 'No Of Working Days',
    },
    {
      accessor: 'noofleavedays',
      Header: 'No Of Leave Days',
    },
    {
      accessor: 'unitno',
      Header: 'Site Id',
    },
    {
      accessor: 'sitename',
      Header: 'Site Name',
    },
  ];
  return (
    <>
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-20 position-relative">
          <div className="position-relative light">
            <h5 className="mb-0 text-white">All Employees Report</h5>
          </div>
        </Card.Header>
        <Card.Header>
          <SiteReportHeader onClickFilterCallback defaultKeyword />
        </Card.Header>
        <Card.Body className="p-0">
          <Card.Body className="p-0">
            <TableData
              columns={columns}
              data={[]}
              headerClassName="bg-200 text-900 text-nowrap align-middle"
              rowClassName="align-middle white-space-nowrap"
              tableProps={{
                bordered: true,
                striped: true,
                className: 'fs--1 mb-0 overflow-hidden',
              }}
            />
          </Card.Body>
        </Card.Body>
        <Card.Footer></Card.Footer>
      </Card>
    </>
  );
};

export default EmployeeReports;
