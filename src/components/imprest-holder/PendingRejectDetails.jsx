import { useEffect } from 'react';
import { get, isEmpty } from 'lodash';
import { useParams } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import PendingImprestHolderAPI from 'api/Imprestholdertransaction';
import useAPI from 'hooks/useApi';
import { useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
// import { useForm } from 'react-hook-form';
import { getErrorMessage } from 'helpers/utils';
import { toast } from 'react-toastify';
import { Input } from 'antd';
import { useNavigate } from 'react-router-dom';
const PendingRejectDetails = () => {
  const { TextArea } = Input;
  const navigate = useNavigate();
  const [siteData, setSiteData] = useState({});
  const params = useParams();
  const { user } = useAuth();
  const getPendingImprestAPI = useAPI(
    PendingImprestHolderAPI.getSubTransdetails,
  );
  const formatDate = () => {
    const saleDate = new Date(get(siteData, 'date', ''));
    const month = saleDate.getMonth() + 1;
    const monthValue = month < 10 ? `0${month}` : `${month}`;
    const day = saleDate.getDate();
    const dayValue = day < 10 ? `0${day}` : `${day}`;
    return `${dayValue}/${monthValue}/${saleDate.getFullYear()}`;
  };

  useEffect(() => {
    if (!isEmpty(get(params, 'id'))) {
      getPendingImprestAPI.request(params.id, get(user, 'token'));
    }
  }, [params.id]);
  useEffect(() => {
    if (getPendingImprestAPI.data) {
      if (!isEmpty(get(params, 'id'))) {
        setSiteData(get(getPendingImprestAPI, 'data.data', {}));
      }
    }
  }, [getPendingImprestAPI.data]);
  const [reason, setReason] = useState('');
  const handleReaseon = (e) => {
    console.log(e.target.value);
    setReason(e.target.value);
  };
  // const handleReject = reason => {
  //   console.log('Rejected because:', reason);
  //   if (reason && reason.preventDefault) {
  //     reason.preventDefault();
  //     console.log('Button clicked without specific reason.');
  //   } else {
  //     console.log('Rejected because:', reason);
  //   }
  // };

  async function sumitRejectReason(reasons) {
    const user = localStorage.getItem('user');
    const userData = JSON.parse(user);
    const employeeNum = userData.employeeId;
    delete siteData.createdOn;
    delete siteData.updatedOn;
    const data = {
      ...siteData,
      id: get(params, 'id'),
      rejectedReason: reason,
      rejectedBy: employeeNum,
      rejectedByName: userData.fullName,
      isVerified: reasons,
    };
    const response = await PendingImprestHolderAPI.updateSubTransdetails(data);
    const errorMessage = getErrorMessage(response);
    if (errorMessage) {
      toast.error('Error', {
        theme: 'colored',
      });
    } else {
      if (reasons == 'APPROVED') {
        toast.success('successfully Approved', {
          theme: 'colored',
        });
      } else if (reasons == 'REJECTED') {
        toast.success('successfully Rejected', {
          theme: 'colored',
        });
      }

      navigate('/pending-impress-list', { replace: true });
    }
  }

  // const { register } = useForm();
  return (
    <>
      <div className="mt-3 card LineSpace ">
        <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-300 rounded-0">
          <div className="d-flex justify-content-between ">
            <h5 className="text-white">Imprest Holder Transaction Details</h5>
          </div>
        </div>

        <div className="fs--1 card-body">
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Date </h6>
              <label className="form-label" title="Fname">
                {formatDate()}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Imprest holder Id</h6>
              <label title="Fname">
                {get(siteData, 'imprestholderId', 0)} -{' '}
                {get(siteData, 'imprestholderName', 0)}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Employee ID</h6>
              <label title="Fname">{get(siteData, 'employeeID', 0)}</label>
            </div>
          </div>
          <div className="row">
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Employee Name</h6>
              <label title="Fname">{get(siteData, 'employeeName', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Unit</h6>
              <label title="Fname">
                {get(siteData, 'unitCodeWithName', '')}
              </label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Room</h6>
              <label title="Fname">{get(siteData, 'roomCode', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Credit</h6>
              <label title="Fname">{get(siteData, 'credit', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Debit</h6>
              <label title="Fname">{get(siteData, 'debit', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Description</h6>
              <label title="Fname">{get(siteData, 'description', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Explanation</h6>
              <label title="Fname">{get(siteData, 'explanation', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Transaction Type</h6>
              <label title="Fname">{get(siteData, 'payType', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Expenses Type</h6>
              <label title="Fname">{get(siteData, 'expensesType', '')}</label>
            </div>
            <div className="h-100 col-md-4">
              <h6 className="fs-0 mb-0">Month</h6>
              <label title="Fname">{get(siteData, 'month', '')}</label>
            </div>
            <Row className="g-0 mb-2">
              <Row className="g-2 mb-3">
                <Col md={3}></Col>
                <Col md={6}>
                  <TextArea
                    rows={4}
                    placeholder="Rejected Reason"
                    // maxLength={6}
                    onChange={handleReaseon}
                  />
                  <Col md={3}></Col>
                </Col>
              </Row>
            </Row>
            <Card.Footer>
              <Row className="g-2 mb-3">
                <Col md={3}></Col>
                <Col md={3}>
                  <Button
                    onClick={() => sumitRejectReason('APPROVED')}
                    color="primary"
                    className="mt-3 w-100"
                  >
                    <span className="ps-2">APPROV</span>
                  </Button>
                </Col>
                <Col md={3}>
                  <Button
                    onClick={() => sumitRejectReason('REJECTED')}
                    color="primary"
                    className="mt-3 w-100"
                  >
                    <span className="ps-2">REJECT</span>
                  </Button>
                </Col>
                <Col md={3}></Col>
              </Row>
            </Card.Footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default PendingRejectDetails;
