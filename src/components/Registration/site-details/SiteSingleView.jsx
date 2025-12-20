import { useState, useEffect } from 'react';
import SiteInfoview from './SiteInfoview';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import { Card, Col, Row } from 'react-bootstrap';
import FalconCardHeader from 'components/common/FalconCardHeader';
import siteAPI from 'api/siteCreation';
import useAPI from 'hooks/useApi';
import { useParams } from 'react-router-dom';
import { get, isEmpty, forIn } from 'lodash';
import { useAuth } from 'hooks/useAuth';
import { Link } from 'react-router-dom';

const siteotherservices = [
  {
    accessor: 'serviceName',
    Header: 'Service Name',
    headerProps: { className: 'pe-1' },
  },
  {
    accessor: 'rate',
    Header: 'Rate',
    headerProps: { className: 'pe-7' },
  },
  {
    accessor: 'billingcycle',
    Header: 'Billing Cycle',
  },
];

const sitedeployment = [
  {
    accessor: 'name',
    Header: 'Designation',
    headerProps: { className: 'pe-1' },
  },
  {
    accessor: 'noOfDuties',
    Header: 'Head Count',
    headerProps: { className: 'pe-7' },
  },
  {
    accessor: 'fixedSalary',
    Header: 'Rate',
  },
  {
    accessor: 'takeHomeRate',
    Header: 'Take Home',
  },
];

const SiteSingleView = () => {
  const params = useParams();
  const { user } = useAuth();
  const getSiteAPI = useAPI(siteAPI.getSitedetails);
  const [manpowerData, setManpowerData] = useState([]);
  const [otherExpensive, setOtherExpensive] = useState([]);
  const [siteData, setSiteData] = useState({});
  const [siteDocuments, setSiteDocuments] = useState([]);

  useEffect(() => {
    if (!isEmpty(get(params, 'siteId'))) {
      getSiteAPI.request(params.siteId, get(user, 'token'));
    }
  }, [params.siteId]);

  useEffect(() => {
    if (getSiteAPI.data) {
      setSiteData(getSiteAPI.data.data);
      setManpowerData(get(getSiteAPI.data.data, 'siteAgreedManPower', []));
      setOtherExpensive(get(getSiteAPI.data.data, 'otherServices', []));
      const documents = get(getSiteAPI.data.data, 'documents', {});
      const documentUrlList = [];
      forIn(documents, (value) => {
        documentUrlList.push(value);
      });
      setSiteDocuments(documentUrlList);
    }
  }, [getSiteAPI.data]);

  useEffect(() => {
    if (getSiteAPI.error) {
      setSiteData({});
    }
  }, [getSiteAPI.error]);

  return (
    <>
      <SiteInfoview siteData={siteData} />
      {!isEmpty(manpowerData) && (
        <div className="mt-3 card ">
          <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-100 rounded-0">
            <div className="d-flex justify-content-between ">
              <h5 className="text-white">Site Deployment details</h5>
            </div>
          </div>
          <AdvanceTableWrapper
            columns={sitedeployment}
            data={manpowerData}
            sortable
            pagination
            perPage={50}
            rowCount={manpowerData.length}
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
      {!isEmpty(otherExpensive) && (
        <div className="mt-3 card ">
          <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-100 rounded-0">
            <div className="d-flex justify-content-between ">
              <h5 className="text-white">Site Other Services</h5>
            </div>
          </div>
          <AdvanceTableWrapper
            columns={siteotherservices}
            data={otherExpensive}
            sortable
            pagination
            perPage={50}
            rowCount={otherExpensive.length}
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

      {!isEmpty(siteDocuments) && (
        <Card className="mt-3">
          <FalconCardHeader title="Documents" light />
          <Card.Body>
            <Row className="g-2">
              {!isEmpty(siteDocuments) &&
                siteDocuments.map((item, index) => (
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

export default SiteSingleView;
