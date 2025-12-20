import { useState, useEffect } from 'react';
import RentalinfoView from './RentalinfoView';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import { Card, Col, Row } from 'react-bootstrap';
import FalconCardHeader from 'components/common/FalconCardHeader';
import RentalCreationAPI from 'api/rentalCreation';
import useAPI from 'hooks/useApi';
import { useParams } from 'react-router-dom';
import { get, isEmpty, forIn } from 'lodash';
import { useAuth } from 'hooks/useAuth';
import { Link } from 'react-router-dom';

const tenantempdetails = [
  {
    accessor: 'sno',
    Header: 'S.No',
    headerProps: { className: 'pe-1' },
  },
  {
    accessor: 'date',
    Header: 'Date',
    headerProps: { className: 'pe-1' },
  },
  {
    accessor: 'employeeId',
    Header: 'Employee ID',
    headerProps: { className: 'pe-7' },
  },
  {
    accessor: 'employeeName',
    Header: 'Employee Name',
  },
  {
    accessor: 'remarks',
    Header: 'Remarks',
  },
];

const RentalSingleView = () => {
  const params = useParams();
  const { user } = useAuth();
  const getRoomRentalAPI = useAPI(RentalCreationAPI.getRoomRentaldetails);
  const [tenantEmployee, setTenantEmployee] = useState([]);
  const [rentalRoomData, setRentalRoomData] = useState({});
  const [rentalDocuments, setRentalDocuments] = useState([]);

  useEffect(() => {
    if (!isEmpty(get(params, 'roomId'))) {
      getRoomRentalAPI.request(params.roomId, get(user, 'token'));
    }
  }, [params.roomId]);

  useEffect(() => {
    if (getRoomRentalAPI.data) {
      setRentalRoomData(getRoomRentalAPI.data.data);
      setTenantEmployee(
        get(getRoomRentalAPI.data.data, 'tenentEmployeesDetails', []),
      );
      const documents = get(getRoomRentalAPI.data.data, 'documents', {});
      const documentUrlList = [];
      forIn(documents, (value) => {
        documentUrlList.push(value);
      });
      setRentalDocuments(documentUrlList);
    }
  }, [getRoomRentalAPI.data]);

  useEffect(() => {
    if (getRoomRentalAPI.error) {
      setRentalRoomData({});
    }
  }, [getRoomRentalAPI.error]);

  return (
    <>
      <RentalinfoView rentalRoomData={rentalRoomData} />
      {!isEmpty(tenantEmployee) && (
        <div className="mt-3 card ">
          <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-100 rounded-0">
            <div className="d-flex justify-content-between ">
              <h5 className="text-white">Tenant Employee Details</h5>
            </div>
          </div>
          <AdvanceTableWrapper
            columns={tenantempdetails}
            data={tenantEmployee}
            sortable
            pagination
            perPage={50}
            rowCount={tenantEmployee.length}
          >
            <AdvanceTable
              table
              headerClassName="bg-200 text-900 text-nowrap align-middle"
              rowClassName="btn-reveal-trigger text-nowrap align-middle"
              tableProps={{
                bordered: true,
                striped: true,
                className: 'fs--1 mb-0 overflow-hidden',
              }}
            />
          </AdvanceTableWrapper>
        </div>
      )}

      {!isEmpty(rentalDocuments) && (
        <Card className="mt-3">
          <FalconCardHeader title="Documents" light />
          <Card.Body>
            <Row className="g-2">
              {!isEmpty(rentalDocuments) &&
                rentalDocuments.map((item, index) => (
                  <Col xs={6} key={item}>
                    <Link target="_blank" to={item}>
                      Site Documents {index + 1}
                    </Link>
                  </Col>
                ))}
            </Row>
          </Card.Body>
        </Card>
      )}
    </>
  );
};

export default RentalSingleView;
