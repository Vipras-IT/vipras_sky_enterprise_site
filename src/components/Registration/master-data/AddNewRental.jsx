/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import useAPI from 'hooks/useApi';
import RentalCreationAPI from 'api/rentalCreation';
import { toast } from 'react-toastify';
import { get, isEmpty, forIn, toNumber } from 'lodash';
import WizardInput from '../../wizard/WizardInput';
import TenantEmployee from 'components/Registration/master-data/TenantEmployee';
import { useParams } from 'react-router-dom';
import FileUpload from 'components/upload/FileUpload';
import employeeAPI from 'api/getEmployeeDetails';
import { Input } from 'antd';
import { UserOutlined, HistoryOutlined } from '@ant-design/icons';
import { getBranchDetails } from '../../../api/branch';
import { sortSiteIds } from '../../../helpers/utils';
const AddNewRentalCreation = ({ validation }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const addRoomRentalAPI = useAPI(RentalCreationAPI.addRoomRental);
  const getRoomRentalAPI = useAPI(RentalCreationAPI.getRoomRentaldetails);
  const updateRoomRentalAPI = useAPI(RentalCreationAPI.updateRoomRental);
  const siteIdsString = window.localStorage.getItem('siteIds');
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  const [tenantEmployeeList, setTenantEmployeeList] = useState([]);
  const [showBalanceAdvanceAmount, setShowBalanceAdvanceAmount] =
    useState(false);
  const [rentalDocuments, setRentalDocuments] = useState([]);
  const getEmployeeAPI = useAPI(employeeAPI.getEmployeeByEmployeeNumber);
  const [employeeId, setEmployeeId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [designation, setDesignation] = useState('');
  const [showadvanceClaim, setShowAdvanceClaim] = useState(false);
  const [branchOptions, setBranchOptions] = useState([]);

  useEffect(() => {
    const fetchBranchOptions = async () => {
      try {
        const response = await getBranchDetails();
        const branches = get(response,'data.data.items');
        const options = branches.map((branch) => branch.branchCode);
        setBranchOptions(options);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranchOptions();
  }, []);

  const handleRentDeductChange = (e) => {
    setShowBalanceAdvanceAmount(e.target.value === 'Yes');
  };

  const handleAdvanceClaimChange = (e) => {
    setShowAdvanceClaim(e.target.value === 'Yes');
  };
  const handleEmployeeNameChange = (e) => {
    setEmployeeName(e.target.value);
  };

  const handleDesignationChange = (e) => {
    setDesignation(e.target.value);
  };

  useEffect(() => {
    if (getEmployeeAPI.data) {
      if (
        get(getEmployeeAPI, 'data.success') &&
        !isEmpty(get(getEmployeeAPI, 'data.data.items'))
      ) {
        setEmployeeName(
          get(getEmployeeAPI, 'data.data.items[0].employeeName', ''),
        );
        setDesignation(get(getEmployeeAPI, 'data.data.items[0].role', ''));
      } else {
        toast.error('Employee not found!', {
          theme: 'colored',
        });
        setEmployeeName('');
        setDesignation('');
      }
    }
  }, [getEmployeeAPI.data]);

  useEffect(() => {
    if (getEmployeeAPI.error) {
      toast.error('Something went wrong please try again', {
        theme: 'colored',
      });
    }
  }, [getEmployeeAPI.error]);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm();

  const onError = () => {
    if (!validation) {
      clearErrors();
    }
  };
  const handleEmployeeIdChange = (e) => {
    setEmployeeId(e.target.value);
  };

  const onSearch = (value) => {
    if (value) {
      getEmployeeAPI.request(value, get(user, 'token'));
    }
  };
  const { Search } = Input;
  const onSubmitData = async (data) => {
    const balanceAdvanceAmount = Number(
      showBalanceAdvanceAmount ? data.balanceAdvanceAmount : 0,
    );
    const advanceClaimAmount = Number(
      showadvanceClaim ? data.advanceClaimAmount : 0,
    );
    const userData = JSON.parse(localStorage.getItem('user'));
    const postData = {
      startDate: data.startDate,
      branchCode: data.branchCode,
      roomCode: data.roomCode,
      roomsallottedUnit: data.roomsallottedUnit,
      inchargePerson: data.inchargePerson,
      inchargePersonNo: toNumber(employeeId),
      roomOwnersName: data.roomOwnersName,
      contactNumber: toNumber(data.contactNumber),
      roomAddress: data.roomAddress,
      accountHolderName: data.accountHolderName,
      accountNo: data.accountNo,
      bank: data.bank,
      branch: data.branch,
      ifscCode: data.ifscCode,
      advanceAmount: toNumber(data.advanceAmount),
      rentalAmount: toNumber(data.rentalAmount),
      ebandWater: toNumber(data.ebandWater),
      rentalDate: data.rentalDate,
      agreementPeriod: data.agreementPeriod,
      agreementExpiryDate: data.agreementExpiryDate,
      capacityRoom: toNumber(data.capacityRoom),
      NoOfEmployeesAssigned: toNumber(data.NoOfEmployeesAssigned),
      photosRoom: String(data.photosRoom),
      location: data.location,
      vacant: data.vacant,
      IfRentDeductFromAdvance: Boolean(data.IfRentDeductFromAdvance),
      balanceAdvanceAmount,
      advanceClaim: Boolean(data.advanceClaim),
      advanceClaimAmount,
      tenentEmployeesDetails: tenantEmployeeList,
      createdBy: Number(userData.employeeId),
    };
    if (!isEmpty(get(params, 'roomId'))) {
      const roomId = params.roomId;
      const updatedData = { ...postData, id: roomId };
      await updateRoomRentalAPI.request(updatedData, get(user, 'token'));
    } else {
      await addRoomRentalAPI.request(postData, get(user, 'token'));
    }
  };

  useEffect(() => {
    if (
      get(addRoomRentalAPI, 'data.success') &&
      !isEmpty(get(addRoomRentalAPI, 'data.data'))
    ) {
      toast.success('Room Rental Created successfully!', {
        theme: 'colored',
      });
      navigate('/rental-rooms-list', { replace: true });
    }
  }, [addRoomRentalAPI.data]);

  useEffect(() => {
    if (addRoomRentalAPI.error) {
      toast.error('Room Rental Creation failed!', {
        theme: 'colored',
      });
    }
  }, [addRoomRentalAPI.error]);

  useEffect(() => {
    if (updateRoomRentalAPI.data) {
      if (
        get(updateRoomRentalAPI, 'data.success') &&
        !isEmpty(get(updateRoomRentalAPI, 'data.data'))
      ) {
        toast.success('Room Rental Updated Successfully', {
          theme: 'colored',
        });
        navigate('/rental-rooms-list', { replace: true });
      } else {
        toast.error('Room Rental Updation failed', {
          theme: 'colored',
        });
      }
    }
  }, [updateRoomRentalAPI.data]);

  useEffect(() => {
    if (!isEmpty(get(params, 'roomId'))) {
      getRoomRentalAPI.request(params.roomId, get(user, 'token'));
    }
  }, [params.roomId]);

  useEffect(() => {
    if (getRoomRentalAPI.data) {
      if (!isEmpty(get(params, 'roomId'))) {
        reset(getRoomRentalAPI.data.data);
        setEmployeeId(get(getRoomRentalAPI.data.data, 'inchargePersonNo', []));
        setTenantEmployeeList(
          get(getRoomRentalAPI.data.data, 'tenentEmployeesDetails', []),
        );
        const documents = get(getRoomRentalAPI.data.data, 'documents', {});
        const documentUrlList = [];
        forIn(documents, (value) => {
          documentUrlList.push(value);
        });
        setRentalDocuments(documentUrlList);
      }
    }
  }, [getRoomRentalAPI.data]);

  return (
    <>
      <Card
        as={Form}
        onSubmit={handleSubmit(onSubmitData, onError)}
        className="theme-wizard mb-5"
      >
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">Add New Rental Creation</h5>
          </div>
        </Card.Header>

        <Card.Body className="fw-normal px-md-6 py-4">
          <Row className="g-2 mb-3">
            <WizardInput
              label="Start Date (DD/MM/YYYY)"
              name="startDate"
              placeholder="Please Enter The Date"
              errors={errors}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('startDate', {
                  required: 'Start Date field is required',
                  pattern: {
                    value:
                      /([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}/i,
                    message: 'Start date must be valid',
                  },
                }),
              }}
            />
            <WizardInput
              type="select"
              label="Branch Code"
              placeholder="Please Select Branch Code"
              name="branchCode"
              errors
              // options={[
              //   'Sholinganallur-BC001',
              //   'Anna Nagar-BC002',
              //   'Oragadam-BC003',
              // ]}
              options={branchOptions}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('branchCode'),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Room Code"
              placeholder="Please Enter The Room Code"
              name="roomCode"
              type="String"
              readOnly
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('roomCode'),
              }}
            />
            <WizardInput
              type="select"
              label="Rooms Alloted Units"
              placeholder="Please Enter Rooms Alloted Unit"
              name="roomsallottedUnit"
              errors={errors}
              options={sortSiteIds(siteIds)}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('roomsallottedUnit'),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Incharge Person for Room"
              placeholder="Please Enter The Incharge Person Name"
              name="inchargePerson"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('inchargePerson'),
              }}
            />
            <Col span={6}>
              <Form.Label>Incharge Employee ID No</Form.Label>
              <Search
                name="inchargePerson"
                size="large"
                placeholder="Please Enter The Incharge Person No..."
                value={employeeId}
                type='Number'
                onChange={handleEmployeeIdChange}
                onSearch={onSearch}
                enterButton
                formGroupProps={{ as: Col, sm: 6 }}
                formControlProps={{
                  ...register('inchargePerson'),
                }}
              />
            </Col>
            {/* <WizardInput
              label="Incharge Person ID No"
              placeholder="Please Enter The Incharge Person No..."
              name="inchargePersonNo"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('inchargePersonNo', {
                  required: 'Incharge Person No field is required'
                })
              }}
            /> */}
          </Row>
          <Row className="g-2 mb-3">
            <Col span={8} offset={1}>
              <label>Employee Name </label>
              <Input
                name="employeeName"
                size="large"
                prefix={<UserOutlined />}
                value={employeeName}
                readOnly
                onChange={handleEmployeeNameChange}
                formGroupProps={{ as: Col, sm: 6 }}
                formControlProps={{
                  ...register('employeeName'),
                }}
              />
            </Col>

            <Col span={6}>
              <label>Designation </label>
              <Input
                name="designation"
                size="large"
                prefix={<HistoryOutlined />}
                value={designation}
                onChange={handleDesignationChange}
                readOnly
                formGroupProps={{ as: Col, sm: 6 }}
                formControlProps={{
                  ...register('designation'),
                }}
              />
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Room Owner Name"
              placeholder="Please Enter The Room Owner Name"
              name="roomOwnersName"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('roomOwnersName'),
              }}
            />
            <WizardInput
              label="Contact No"
              placeholder="Please Enter The Contact No"
              name="contactNumber"
              type="Number"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('contactNumber', {
                  pattern: {
                    value: /^\d{10}$/,
                    message: 'Please enter a 10-digit contact number',
                  },
                }),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Room Address"
              placeholder="Please Enter Room Address"
              name="roomAddress"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('roomAddress'),
              }}
            />
            <WizardInput
              label="Bank A/c Holder Name"
              placeholder="Please Enter The Bank A/c Holder Name"
              name="accountHolderName"
              type="String"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('accountHolderName'),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Bank A/c No"
              placeholder="Please Enter The Bank A/c Number"
              name="accountNo"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('accountNo'),
              }}
            />
            <WizardInput
              label="Bank Name"
              placeholder="Please Enter The Bank Name"
              name="bank"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('bank'),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Bank Branch Name"
              placeholder="Please Enter The Bank Branch Name"
              name="branch"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('branch'),
              }}
            />
            <WizardInput
              label="IFSC Code"
              placeholder="Please Enter The IFSC Code"
              name="ifscCode"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('ifscCode'),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Advance Amount"
              placeholder="Please Enter The Advance Amount"
              name="advanceAmount"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('advanceAmount'),
              }}
            />
            <WizardInput
              label="Rental Amount"
              placeholder="Please Enter The Rental Amount"
              name="rentalAmount"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('rentalAmount'),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="EB and Water Charge"
              placeholder="Please Enter The Amount for EB and Water Charge."
              name="ebandWater"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('ebandWater'),
              }}
            />
            <WizardInput
              label="Rental Date"
              name="rentalDate"
              placeholder="Please Enter The Rental Date"
              errors={errors}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('rentalDate', {
                  pattern: {
                    value:
                      /([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}/i,
                    message: 'Start date must be valid',
                  },
                }),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Agreement Period"
              placeholder="Please Enter The Agreement Period"
              name="agreementPeriod"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('agreementPeriod'),
              }}
            />
            <WizardInput
              label="Agreement Expiry Date"
              name="agreementExpiryDate"
              placeholder="Please Enter Agreement Expiry Date"
              errors={errors}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('agreementExpiryDate', {
                  pattern: {
                    value:
                      /([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}/i,
                    message: 'Start date must be valid',
                  },
                }),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Capacity of Room"
              placeholder="Please Enter Room Capacity"
              name="capacityRoom"
              type='number'
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('capacityRoom'),
              }}
            />
            <WizardInput
              label="No of Employees Assigned"
              placeholder="Please Enter No of Employees"
              name="NoOfEmployeesAssigned"
              type="String"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('NoOfEmployeesAssigned'),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Location"
              placeholder="Please Enter the Location"
              name="location"
              type="String"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('location'),
              }}
            />
            <WizardInput
              label="Vacant"
              placeholder="Please Enter the Vacant"
              name="vacant"
              type="String"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('vacant'),
              }}
            />
          </Row>
          <Row className="g-2 mb-5">
            <WizardInput
              label="Rent Deduct from Advance"
              name="IfRentDeductFromAdvance"
              type="select"
              options={['Yes', 'No']}
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('IfRentDeductFromAdvance'),
                onChange: handleRentDeductChange,
              }}
            />
            {showBalanceAdvanceAmount && (
              <WizardInput
                label="Balance Advance Amount"
                placeholder="Please Enter Balance Advance Amount"
                name="balanceAdvanceAmount"
                errors
                formGroupProps={{ as: Col, sm: 6 }}
                formControlProps={{
                  ...register('balanceAdvanceAmount'),
                }}
              />
            )}
            <WizardInput
              label="Advance Claim"
              placeholder="Select Advance claim Yes or No"
              name="advanceClaim"
              type="select"
              options={['Yes', 'No']}
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('advanceClaim'),
                onChange: handleAdvanceClaimChange,
              }}
            />
            {showadvanceClaim && (
              <WizardInput
                label="Advance Claim Amount"
                placeholder="Please Enter Advance Claim Amount"
                name="advanceClaimAmount"
                type="Number"
                errors
                formGroupProps={{ as: Col, sm: 6 }}
                formControlProps={{
                  ...register('advanceClaimAmount'),
                }}
              />
            )}
          </Row>
          <Row className="g-2 mb-3">
            <Col md={12}>
              <FileUpload
                documents={rentalDocuments}
                documentName="photosRoom"
                label="Upload Photos"
                multiple={true}
                setValue={setValue}
              />
            </Col>
          </Row>
          <TenantEmployee
            setValue={setValue}
            tenantEmployeeList={tenantEmployeeList}
            setTenantEmployeeList={setTenantEmployeeList}
          />
        </Card.Body>
        <Card.Footer>
          <Row className="g-2 mb-3">
            <Col md={4}></Col>
            <Col md={4}>
              <Button type="submit" color="primary" className="mt-3 w-100">
                {addRoomRentalAPI.loading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                <span className="ps-2">Add</span>
              </Button>
            </Col>
            <Col md={4}></Col>
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
};

export default AddNewRentalCreation;
