/* eslint-disable react/prop-types */

import { Card, Dropdown } from 'react-bootstrap';
import CardDropdown from 'components/common/CardDropdown';
import RecentPurchasesHeader from '../family-details/RecentPurchasesHeader';
import TableData from '../previous-employment/Table';

const SiteManpowerAssest = ({
  handleModel,
  handleData,
  selectRowId,
  updateRecord,
  type,
}) => {
  const columns = [
    {
      accessor: 'sno',
      Header: 'S.No',
      headerProps: { className: 'pe-1' },
    },
    {
      accessor: 'serviceName',
      Header: 'Service Name',
      headerProps: { className: 'pe-1' },
    },
    {
      accessor: 'idNo',
      Header: 'Emp Id',
      headerProps: { className: 'pe-1' },
    },
    {
      accessor: 'empName',
      Header: 'Emp Name',
      headerProps: { className: 'pe-1' },
    },
    {
      accessor: 'fixedSalary',
      Header: 'Fixed salary',
      headerProps: { className: 'pe-1' },
    },
    {
      accessor: 'shiftType',
      Header: 'Shift',
      headerProps: { className: 'pe-1' },
    },
    {
      accessor: 'billingValue',
      Header: 'Billing Value',
      headerProps: { className: 'pe-1' },
    },
    {
      accessor: 'noOfDuties',
      Header: 'No of duties',
      headerProps: { className: 'pe-7' },
    },
    {
      accessor: 'salary',
      Header: 'Gross Salary',
    },
    {
      accessor: 'none',
      Header: '',
      disableSortBy: true,
      cellProps: {
        className: 'text-end py-2',
      },
      Cell: ({ row }) => {
        const i = row.original.id;
        const data = row.original;
        return (
          <CardDropdown iconClassName="fs--1" drop="start">
            <div className="py-2">
              <Dropdown.Item
                onClick={() => {
                  editRecord(data);
                }}
                className="text-warning"
              >
                Edit
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  deleteRecord(i);
                }}
                className="text-danger"
              >
                Delete
              </Dropdown.Item>
            </div>
          </CardDropdown>
        );
      },
    },
  ];

  const deleteRecord = (id) => {
    selectRowId(id);
  };

  const editRecord = (rec) => {
    updateRecord(rec);
  };

  return (
    <>
      <Card>
        <Card.Header>
          <RecentPurchasesHeader
            pageName={type}
            handleModel={handleModel}
            table
          />
        </Card.Header>
        <Card.Body className="p-0">
          <Card.Body className="p-0">
            <TableData
              columns={columns}
              data={handleData}
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

export default SiteManpowerAssest;
