/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import SiteManpowerSalary from 'components/Registration/site-details/SiteManpowerSalary';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import SiteOtherExpensive from 'components/Registration/site-details/SiteOtherExpensive';
import FileUpload from 'components/upload/FileUpload';
import crm from 'api/crm';
import { useAuth } from 'hooks/useAuth';
import useAPI from 'hooks/useApi';
import siteAPI from 'api/siteCreation';
import { toast } from 'react-toastify';
import { get, isEmpty, forIn } from 'lodash';
import { useParams } from 'react-router-dom';
import { Select, Typography, Input } from 'antd';
import { getErrorMessage } from 'helpers/utils';
const { Title } = Typography;
import { getShiftOptions, registrationRole } from 'helpers/utils';
import WizardInput from '../../wizard/WizardInput';
import { getBranchDetails } from '../../../api/branch';

const SiteCreation = ({ validation }) => {
  const { user } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const addSiteAPI = useAPI(siteAPI.addSite);
  const getSiteAPI = useAPI(siteAPI.getSitedetails);
  const updateSiteAPI = useAPI(siteAPI.updateSite);
  const [otherServiceList, setOtherServiceList] = useState([]);
  const [hkbudget, setHkBudget] = useState();
  const [hkbudgetAmount, setHkBudgetAmount] = useState();
  const [showTextBox, setShowTextBox] = useState(false);
  const [showTextBox1, setShowTextBox1] = useState(false);
  const [isActive, setIsActive] = useState('true');
  const [invoiceType, setInvoiceType] = useState('');
  const [dates, setDates] = useState();
  const [breakUp, setBreakUp] = useState();
  const [breakStatus, setBreakStatus] = useState('');
  const [subname, setSubName] = useState([]);
  const [subContractorIds, setSubContractorIds] = useState(0);
  const [subContractorNames, setsubContractorNames] = useState('');
  const [tableData, setTableData] = useState([]);
  const [reason, setReason] = useState([]);
  const serviceTypes = registrationRole;
  const handleChange = (e) => {
    setHkBudget(e.target.value);
    if (e.target.value === 'Yes') {
      setShowTextBox(true);
    } else {
      setShowTextBox(false);
    }
  };
  const handleAmountChange = (e) => {
    setHkBudgetAmount(e.target.value);
  };
  const handleSubContractorChange = (e) => {
    const selectedSubContractorId = e.target.value;

    // Assuming you have the data available in the subname state
    const selectedSubContractor = subname.find(
      (subContractor) => subContractor.value == selectedSubContractorId,
    );

    if (selectedSubContractor) {
      const selectedSubContractorName = selectedSubContractor.label;
      setsubContractorNames(selectedSubContractorName.split('-')[0]);
      setSubContractorIds(selectedSubContractorId);
    } else {
      console.error('Selected Sub-Contractor not found');
    }
  };

  const handleChangeIsactive = (e) => {
    setIsActive(String(e.target.value));
  };
  const handleChangeType = (e) => {
    setInvoiceType(e.target.value);
    if (e.target.value === 'SUB_CONTRACTOR' || e.target.value === 'Both') {
      setShowTextBox1(true);
    } else {
      setShowTextBox1(false);
    }
  };
  const handleChangeBreakUp = (e) => {
    if (e.target.value === 'YES') {
      setBreakUp(true);
      setBreakStatus(e.target.value);
    } else {
      setBreakUp(false);
      setBreakStatus(e.target.value);
    }
  };

  const deploymenttypes = [
    {
      value: 'Integrated Facility Management Services',
      label: 'Integrated Facility Management Services',
    },
    { value: 'Security Services', label: 'Security Services' },
    { value: 'Manpower Services', label: 'Manpower Services' },
    { value: 'House Keeping', label: 'House Keeping' },
    { value: 'Deep Cleaning', label: 'Deep Cleaning' },
    { value: 'Garbage Collection', label: 'Garbage Collection' },
    { value: 'Laundry Service', label: 'Laundry Service' },
    {
      value: 'Pest Control',
      label: 'Pest Control',
    },
    { value: 'Vipras Mart', label: 'Vipras Mart' },
    { value: 'Admin', label: 'Admin' },
  ];

  const shiftoption = getShiftOptions();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    clearErrors,
  } = useForm();

  const [country] = useState([
    'Afghanistan',
    'Bangladesh',
    'Bhutan',
    'India',
    'Iran',
    'Maldives',
    'Nepal',
    'Pakistan',
    'Sri Lanka',
  ]);

  const [state] = useState([
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttarakhand',
    'Uttar Pradesh',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli',
    'Daman and Diu',
    'Delhi',
    'Lakshadweep',
    'Puducherry',
  ]);
  const [city] = useState([
    'Ariyalur',
    'Chennai',
    'Coimbatore',
    'Cuddalore',
    'Dharmapuri',
    'Dindigul',
    'Erode',
    'Kanchipuram',
    'Kanyakumari',
    'Karur',
    'Madurai',
    'Nagapattinam',
    'Nilgiris',
    'Namakkal',
    'Perambalur',
    'Pudukkottai',
    'Ramanathapuram',
    'Salem',
    'Sivaganga',
    'Tirupur',
    'Tiruchirappalli',
    'Theni',
    'Tirunelveli',
    'Thanjavur',
    'Thoothukudi',
    'Tiruvallur',
    'Tiruvarur',
    'Tiruvannamalai',
    'Vellore',
    'Viluppuram',
    'Virudhunagar',
  ]);

  const [selectedDeployment, setSelectedDeployment] = useState([]);
  const [selectedShift, setSelectedShift] = useState([]);
  const [siteDocuments, setSiteDocuments] = useState([]);
  const [branchOptions, setBranchOptions] = useState([]);

  useEffect(() => {
    const fetchBranchOptions = async () => {
      try {
        const response = await getBranchDetails();
        const branches = get(response, 'data.data.items', []);
        const options = branches.map((branch) => branch.branchCode);

        setBranchOptions(options);
      } catch (error) {
        console.error('Error fetching branches:', error);
      }
    };

    fetchBranchOptions();
  }, []);

  const onSubmitData = (data) => {
    const myBoolean = String(isActive).toLowerCase() === 'true';
    const siteIdParams = get(params, 'siteId');
    const isActiveForPostData = siteIdParams ? myBoolean : true;
    const hkPresent = String(hkbudget) === 'Yes';
    const hkAmountPresent = hkPresent ? Number(hkbudgetAmount) : 0;
    // if (tableData.length > 0) {
    const userData = JSON.parse(localStorage.getItem('user'));
    const postData = {
      ...data,
      hkConsumableBudget: String(hkbudget),
      hkConsumableAmount: hkAmountPresent,
      siteAgreedManPower: tableData,
      otherServices: otherServiceList,
      deployment: selectedDeployment,
      shiftoption: selectedShift,
      isActive: isActiveForPostData,
      invoiceType: invoiceType,
      description: String(data.description),
      personName: String(data.personName),
      personNumber: Number(data.personNumber),
      personGmail: String(data.personGmail),
      renewalDate: dates,
      breakUp: breakUp,
      subContractor: subContractorNames,
      subContractorId: Number(subContractorIds),
      createdBy: Number(userData.employeeId),
    };
    if (!isEmpty(get(params, 'siteId'))) {
      const historyData = {
        date: new Date(),
        updatedBy: get(user, 'userId'),
        reason: String(reason),
      };
      const postUpdate = {
        ...postData,
        history: [...(postData.history || []), historyData],
      };
      delete postUpdate.createdOn;
      delete postUpdate.updatedOn;
      updateSiteAPI.request(postUpdate, get(user, 'token'));
    } else {
      addSiteAPI.request(postData, get(user, 'token'));
    }
    /* } else {
      toast.error(`Please add one product`, {
        theme: 'colored'
      });
    } */
  };
  const onError = () => {
    if (!validation) {
      clearErrors();
    }
  };

  useEffect(() => {
    /* crm
      .GetSubContractName()
      .then(response => {
        const items = response.data.data.items;
        const subContractors = items
          .filter(item => item.role.includes('SubContractor'))
          .map(item => ({
            name: item.employeeName,
            id: item.employeeId // Assuming there's an employeeId property for the ID
          }));

        setSubName(subContractors);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      }); */
    getSubContractOptions();
  }, []);

  useEffect(() => {
    if (addSiteAPI.data) {
      if (
        get(addSiteAPI, 'data.success') &&
        !isEmpty(get(addSiteAPI, 'data.data'))
      ) {
        getAllSiteDetails();
        toast.success('Site created successfully', {
          theme: 'colored',
        });
        navigate('/sitelist', { replace: true });
      } else {
        toast.error('Site creation failed', {
          theme: 'colored',
        });
      }
    }
  }, [addSiteAPI.data]);

  useEffect(() => {
    if (updateSiteAPI.data) {
      if (
        get(updateSiteAPI, 'data.success') &&
        !isEmpty(get(updateSiteAPI, 'data.data'))
      ) {
        getAllSiteDetails();
        toast.success('Site updated successfully', {
          theme: 'colored',
        });
        navigate('/sitelist', { replace: true });
      } else {
        toast.error('Site creation failed', {
          theme: 'colored',
        });
      }
    }
  }, [updateSiteAPI.data]);

  useEffect(() => {
    if (addSiteAPI.error) {
      toast.error('Site creation failed', {
        theme: 'colored',
      });
    }
  }, [addSiteAPI.error]);

  useEffect(() => {
    if (!isEmpty(get(params, 'siteId'))) {
      getSiteAPI.request(params.siteId, get(user, 'token'));
    }
  }, [params.siteId]);

  useEffect(() => {
    if (getSiteAPI.data) {
      if (!isEmpty(get(params, 'siteId'))) {
        reset(getSiteAPI.data.data);
        setTableData(get(getSiteAPI.data.data, 'siteAgreedManPower', []));
        setOtherServiceList(get(getSiteAPI.data.data, 'otherServices', []));
        setSelectedDeployment(get(getSiteAPI.data.data, 'deployment', []));

        const selecteDate = new Date(
          get(getSiteAPI.data.data, 'renewalDate', null),
        );
        if (selecteDate !== null) {
          const inputDate = new Date(selecteDate);
          const day = inputDate.getUTCDate().toString().padStart(2, '0');
          const month = (inputDate.getUTCMonth() + 1)
            .toString()
            .padStart(2, '0');
          const year = inputDate.getUTCFullYear();
          const formattedDateString = `${year}-${month}-${day}`;
          setDates(formattedDateString);
        }

        setIsActive(get(getSiteAPI.data.data, 'isActive', true));
        const Type = get(getSiteAPI.data.data, 'invoiceType', '');
        setInvoiceType(Type);
        if (Type === 'Sub Invoice' || Type === 'Both') {
          setsubContractorNames(get(getSiteAPI.data.data, 'subContractor', ''));
          setShowTextBox1(true);
        } else {
          setShowTextBox1(false);
        }
        const hkbudget = get(getSiteAPI.data.data, 'hkConsumableBudget', '');
        setHkBudget(hkbudget);
        if (hkbudget === 'Yes') {
          const hkamount = get(getSiteAPI.data.data, 'hkConsumableAmount', 0);
          setShowTextBox(true);
          setHkBudgetAmount(hkamount);
        } else {
          setHkBudgetAmount(0);
        }
        const historyArray = get(getSiteAPI.data.data, 'history', []);
        if (historyArray.length > 0) {
          const latestHistoryEntry = historyArray[historyArray.length - 1];
          const latestReason = get(latestHistoryEntry, 'reason', '');
          setReason(latestReason);
        }
        if (get(getSiteAPI.data.data, 'breakUp', '')) {
          setBreakStatus('YES');
        } else {
          setBreakStatus('NO');
        }

        setSelectedShift(get(getSiteAPI.data.data, 'shiftoption', []));
        const documents = get(getSiteAPI.data.data, 'documents', {});
        const documentUrlList = [];
        forIn(documents, (value) => {
          documentUrlList.push(value);
        });
        setSiteDocuments(documentUrlList);
      }
    }
  }, [getSiteAPI.data]);

  const getAllSiteDetails = async () => {
    const response = await siteAPI.getAllSiteIds();
    const errorMessage = getErrorMessage(response);
    if (errorMessage) {
      toast.error(errorMessage, {
        theme: 'colored',
      });
    } else {
      window.localStorage.setItem(
        'siteIds',
        JSON.stringify(get(response, 'data.data', [])),
      );
    }
  }

  const getSubContractOptions = async () => {
    const response = await crm.getBySubcontractorUserDropDown();
    const errorMessage = getErrorMessage(response);
    if (errorMessage) {
      toast.error('Error', {
        theme: 'colored',
      });
    } else {
      if (!isEmpty(get(response, 'data.data'))) {
        setSubName(get(response, 'data.data'));
      }
    }
  };
  const siteIdsString = window.localStorage.getItem('siteIds');
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  const siteIdsOptions = [];

  siteIds.map((item) => {
    const siteIdArray = item.split('-');
    siteIdsOptions.push({
      value: siteIdArray[0],
      label: item,
    });
  });

  const handleChangeSiteId = (value) => {
    const selectedOption = siteIdsOptions.find(
      (option) => option.value === value,
    );
    const units = get(selectedOption, 'label');
    setValue('unitcode', units);
  };

  return (
    <>
      <Card
        as={Form}
        onSubmit={handleSubmit(onSubmitData, onError)}
        className="theme-wizard mb-5"
      >
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">Site Creation</h5>
          </div>
        </Card.Header>

        <Card.Body className="fw-normal px-md-6 py-4">
          <Row className="g-2 mb-3">
            <WizardInput
              label="Start Date (DD/MM/YYYY)"
              name="startdate"
              errors={errors}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('startdate', {
                  pattern: {
                    value:
                      /([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}/i,
                    message: 'Start date must be valid',
                  },
                }),
              }}
            />
            {/* <WizardInput
              label="Unit Code"
              name="unitcode"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('unitcode', {
                  required: 'Unit Code field is required',
                  pattern: {
                    value: /[0-9]|[A-Z]|[a-z]/,
                    message: 'Unit code must be numberic with letters',
                  },
                  minLength: {
                    value: 3,
                    message: 'Unit Code must have at least 3 characters',
                  },
                }),
                disabled: get(params, 'siteId') ? true : false, 
              }}
            /> */}
            <WizardInput
              type="select"
              label="Unit Code"
              name="unitcode"
              placeholder="Select your Unit Code..."
              errors
              options={siteIdsOptions}
              onChange={(value) => {
                handleChangeSiteId(value);
                setValue('unitcode', value);
              }}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('unitcode'),
                disabled: get(params, 'siteId') ? true : false,
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              type="select"
              label="Country"
              name="country"
              placeholder="Select your Country..."
              errors
              options={country}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('country'),
              }}
            />
            <WizardInput
              type="select"
              label="State"
              name="state"
              placeholder="Select your State..."
              errors
              options={state}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('state'),
              }}
            />
          </Row>

          <Row className="g-2 mb-3">
            <WizardInput
              type="select"
              label="City"
              name="city"
              placeholder="Select your City..."
              errors
              options={city}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('city'),
              }}
            />
            <WizardInput
              type="select"
              label="Branch Code"
              name="branchCode"
              placeholder="Select your Branch code..."
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
              label="Builder Name"
              name="builderName"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('builderName'),
                disabled: get(params, 'siteId') ? true : false,
              }}
            />
            <WizardInput
              label="Site Name"
              name="siteName"
              errors
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('siteName'),
                disabled: get(params, 'siteId') ? true : false,
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="GST Number"
              name="gstnumber"
              type="text"
              errors={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('gstNumber'),
              }}
            />
            <WizardInput
              label="Credit Period in Days"
              name="creditPeriod"
              type="number"
              errors={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('creditPeriod'),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <Col md={6}>
              <Title level={5}>Deployment</Title>
              <Select
                size="large"
                mode="multiple"
                name="deployment"
                allowClear
                style={{
                  width: '100%',
                }}
                placeholder="Please select"
                defaultValue={[]}
                value={selectedDeployment}
                onChange={setSelectedDeployment}
                options={deploymenttypes}
              />
            </Col>
            <Col md={6}>
              <WizardInput
                label="Agreed Manpower"
                name="agreedmanpower"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('agreedmanpower'),
                  step: '0.1',
                }}
              />
            </Col>
          </Row>

          <Row className="g-2 mb-3">
            <WizardInput
              label="Agreed Amount"
              name="agreedamount"
              type="number"
              errors={''}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('agreedamount'),
              }}
            />
            <WizardInput
              label="Agreed OT Duty"
              name="agreedot"
              type="select"
              errors={''}
              options={['Yes', 'No']}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('agreedot', {
                  required: 'Agreed OT is required',
                }),
              }}
            />
          </Row>

          <Row className="g-2 mb-3">
            <WizardInput
              type="select"
              label="Agreed Weekoff"
              name="agreedweekoff"
              placeholder="Select your option..."
              errors
              options={['Yes', 'No']}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('agreedweekoff'),
              }}
            />
            <WizardInput
              type="select"
              label="Security Weekoff"
              name="securityweekoff"
              placeholder="Select your option..."
              errors
              options={['Yes', 'No']}
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('securityweekoff'),
              }}
            />
          </Row>
          <Row className="g-2 mb-3">
            <Col md={6}>
              <WizardInput
                type="select"
                label="Agreed National Holiday"
                name="agreedholiday"
                placeholder="Select your option..."
                errors
                options={['Yes', 'No']}
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('agreedholiday'),
                }}
              />
            </Col>
            <Col md={6}>
              <Title level={5}>Shift Option</Title>
              <Select
                size="large"
                mode="multiple"
                name="shiftoption"
                allowClear
                style={{
                  width: '100%',
                }}
                placeholder="Please select"
                defaultValue={[]}
                value={selectedShift}
                onChange={setSelectedShift}
                options={shiftoption}
              />
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            <Col md="6">
              <label>HK Consumable Budget Assigned</label>
              <select
                name="hkConsumableBudget"
                value={hkbudget}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select your option...</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </Col>

            {showTextBox && (
              <Col md="6">
                <label>HK Consumable Budget Amount</label>
                <Input
                  type="number"
                  className="form-control"
                  label="HK Consumable Budget Amount"
                  name="hkConsumableAmount"
                  value={hkbudgetAmount}
                  onChange={handleAmountChange}
                />
              </Col>
            )}
            {get(params, 'siteId') && (
              <Col md="6">
                <label>Status (Active Or InActive)</label>
                <select
                  name="isactive"
                  value={isActive}
                  onChange={handleChangeIsactive}
                  className="form-select"
                >
                  <option value="">Select your option...</option>
                  <option value="true">Active</option>
                  <option value="false">InActive</option>
                </select>
              </Col>
            )}
          </Row>
          <Row className="g-2 mb-3">
            <Col md="6">
              <label>Invoice Type</label>
              <select
                name="isactive"
                value={invoiceType}
                onChange={handleChangeType}
                className="form-select"
              >
                <option value="">Select your option...</option>
                <option value="SUB_CONTRACTOR">Sub-Contractor Invoice</option>
                <option value="GST">GST Invoice</option>
                <option value="BOTH">Both</option>
              </select>
            </Col>
            {showTextBox1 && (
              <Col md={6}>
                <label>Sub-Contractor Name</label>
                <select
                  name="Sub-Contractor Name"
                  onChange={handleSubContractorChange}
                  className="form-control"
                  value={subContractorNames}
                >
                  <option value="" disabled>
                    Select a Sub-Contractor Name
                  </option>
                  {subname.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Col>
            )}
            <Col md="6">
              <label>Break Up</label>
              <select
                value={breakStatus}
                onChange={handleChangeBreakUp}
                className="form-select"
              >
                <option value="">Select your option...</option>
                <option value="YES">YES</option>
                <option value="NO">NO</option>
              </select>
            </Col>
            <Col md="6">
              <WizardInput
                label="Description"
                name="description"
                type="text"
                errors={''}
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('description'),
                }}
              />
            </Col>
            <Col md="6">
              <WizardInput
                label="Person Name"
                name="personName"
                type="text"
                errors={''}
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('personName'),
                }}
              />
            </Col>
            <Col md="6">
              <WizardInput
                label="Contact Number"
                name="personNumber"
                type="number"
                errors={''}
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('personNumber'),
                }}
              />
            </Col>
            <Col md="6">
              <WizardInput
                label="Gmail"
                name="personGmail"
                type="text"
                errors={''}
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('personGmail'),
                }}
              />
            </Col>
            <Col md="6">
              <label>Renewal Date (DD-MM-YYYY)</label>
              <input
                label="Renewal Date (DD-MM-YYYY)"
                name="date"
                type="date"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="form-control"
              />
            </Col>
            <Col md={12}>
              <FileUpload
                documents={siteDocuments}
                documentName="site_creation_documents"
                label="Additional Documents"
                multiple={true}
                setValue={setValue}
              />
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            <WizardInput
              label="Location"
              type="textarea"
              name="location"
              errors={''}
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps={{
                ...register('location'),
              }}
            />
          </Row>

          <SiteManpowerSalary
            rows={tableData}
            setRows={setTableData}
            serviceTypes={serviceTypes}
          />
          {get(params, 'siteId') && (
            <Row className="g-2 mb-3">
              <Form.Label>Reason</Form.Label>
              <Form.Control
                as="textarea"
                name="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Row>
          )}
          <SiteOtherExpensive
            setValue={setValue}
            otherServiceList={otherServiceList}
            setOtherServiceList={setOtherServiceList}
          />
        </Card.Body>
        <Card.Footer>
          <Row className="g-2 mb-3">
            <Col md={4}></Col>
            <Col md={4}>
              <Button type="submit" color="primary" className="mt-3 w-100">
                {addSiteAPI.loading && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
                <span className="ps-2">Save</span>
              </Button>
            </Col>
            <Col md={4}></Col>
          </Row>
        </Card.Footer>
      </Card>
    </>
  );
};

export default SiteCreation;
