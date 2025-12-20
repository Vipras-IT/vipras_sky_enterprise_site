import { Card } from 'react-bootstrap';
import SiteReportHeader from './ReportHeader';
import TableData from 'components/Registration/previous-employment/Table';

const SiteReport = () => {
  const columns = [
    {
      accessor: 'sno',
      Header: 'S.No',
      headerProps: { className: 'pe-1' },
    },
    {
      accessor: 'sitename',
      Header: 'Site Name',
      headerProps: { className: 'pe-1' },
    },
    {
      accessor: 'uinitid',
      Header: 'Unit No',
      headerProps: { className: 'pe-7' },
    },
    {
      accessor: 'noofemployees',
      Header: 'No Of Employees',
    },
    {
      accessor: 'status',
      Header: 'Site Status',
    },
  ];

  return (
    <>
      <Card>
        <Card.Header className="bg-shape modal-shape-header px-20 position-relative">
          <div className="position-relative light">
            <h5 className="mb-0 text-white">All Sites Report</h5>
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

export default SiteReport;
