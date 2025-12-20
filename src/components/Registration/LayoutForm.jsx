import { useContext, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Card, Form, Nav, ProgressBar, Button } from 'react-bootstrap';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
// import Success from './Success';
import BankDetailsForm from './Bankdetails';
import EmployeeBasicForm from './EmployeeBasicForm';
import Familydetails from './Familydetails';
import MandatoryForm from './MandatoryForm';
import LocalAddressForm from './LocalAddressForm';
import PermantAddressForm from './PermantantAddressForm';
import TermsForms from './Terms';
import TermsFormsBack from './TermsBack';
// import JoiningKitForm from './JoiningKit';
import AppContext, { RegistrationContext } from 'context/Context';
import IconButton from 'components/common/IconButton';
import WizardModal from '../wizard/WizardModal';
import Flex from 'components/common/Flex';
import PreviousEmployee from './PreviousEmployee';
import {
  faCreditCard,
  faUser,
  faAddressBook,
  faFile,
  faIdCard,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { has, get, isEmpty } from 'lodash';
import useAPI from 'hooks/useApi';
import employeeAPI from 'api/employeeRegistartion';
import employeeDetailsAPI from 'api/getEmployeeDetails';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import { useReactToPrint } from 'react-to-print';
import Sale from './Sales/Sale';

const LayoutForm = ({ variant, validation, progressBar }) => {
  const { isRTL } = useContext(AppContext);
  const params = useParams();
  const { employee, setEmployee, step, setStep } =
    useContext(RegistrationContext);
  const addEmployeeAPI = useAPI(employeeAPI.addEmployee);
  const updateEmployeeAPI = useAPI(employeeAPI.updateEmployee);
  const getEmployeeDetailsAPI = useAPI(employeeDetailsAPI.getEmployeeDetails);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    clearErrors,
    watch,
  } = useForm();

  const [modal, setModal] = useState(false);
  const [languageKnown, setLanguageKnown] = useState([]);
  const [siteCodeWithName, setSiteCodeWithName] = useState('');
  const [empDocuments, setEmpDocuments] = useState({});
  const { user } = useAuth();

  const navItems = [
    {
      icon: faUser,
      label: 'Employee Basic',
    },
    {
      icon: faAddressBook,
      label: 'Permanent Address',
    },
    {
      icon: faAddressBook,
      label: 'Local Address',
    },
    {
      icon: faCreditCard,
      label: 'Bank Details',
    },
    {
      icon: faFile,
      label: 'Documents ',
    },
    {
      icon: faIdCard,
      label: 'Previous Employeement',
    },
    {
      icon: faUsers,
      label: 'Family Details',
    },
    {
      icon: 'thumbs-up',
      label: 'Done',
    },
    {
      icon: faUsers,
      label: ' Uniform / Kit Tab',
    },
  ];
  const [employeeNumber, setEmployeeNumber] = useState();
  useEffect(() => {
    if (addEmployeeAPI.data) {
      if (
        get(addEmployeeAPI, 'data.success') &&
        !isEmpty(get(addEmployeeAPI, 'data.data'))
      ) {
        toast.success('Employee created successfully', {
          theme: 'colored',
        });
        setValue(
          'employeeNumber',
          get(addEmployeeAPI, 'data.data.employeeNumber', ''),
        );
        setEmployeeNumber(get(addEmployeeAPI, 'data.data.employeeNumber', ''));
      } else {
        toast.error(get(addEmployeeAPI, 'data.message'), {
          theme: 'colored',
        });
      }
    }
  }, [addEmployeeAPI.data]);

  useEffect(() => {
    if (addEmployeeAPI.error) {
      toast.error('Something went wrong please try again', {
        theme: 'colored',
      });
    }
  }, [addEmployeeAPI.error]);

  useEffect(() => {
    if (updateEmployeeAPI.data) {
      if (
        get(updateEmployeeAPI, 'data.success') &&
        !isEmpty(get(updateEmployeeAPI, 'data.data'))
      ) {
        toast.success('Employee updated successfully', {
          theme: 'colored',
        });
        setEmployeeNumber(
          get(updateEmployeeAPI, 'data.data.employeeNumber', ''),
        );
        // setStep(step + 1);
      } else {
        toast.error('Employee update failed', {
          theme: 'colored',
        });
      }
    }
  }, [updateEmployeeAPI.data]);

  useEffect(() => {
    if (addEmployeeAPI.error) {
      toast.error('Something went wrong please try again', {
        theme: 'colored',
      });
    }
  }, [updateEmployeeAPI.error]);

  const onSubmitData = (data) => {
    if (step === 6 && !has(employee, 'previousEmployerDetails')) {
      data.previousEmployerDetails = [];
    }
    if (step === 7 && !has(employee, 'familyDetails')) {
      data.familyDetails = [];
    }
    const employeeMapData = { ...employee, ...data, languageKnown, siteCodeWithName };
    setEmployee(employeeMapData);
    const datas = localStorage.getItem('user');
    const userData = JSON.parse(datas);
    const employeeId = Number(userData.employeeId);
    if (step === 7) {
      if (!isEmpty(get(params, 'employeeid'))) {
        delete employeeMapData.createdOn;
        delete employeeMapData.updatedOn;
        delete employeeMapData.verifiedOn;
      console.log('employeeMapData====================', employeeMapData)
        if (get(employeeMapData, 'siteCodeWithName')) {
          employeeMapData.siteCode = get(
            employeeMapData,
            'siteCodeWithName',
            '',
          ).split('-')[0];
          employeeMapData.siteName = get(
            employeeMapData,
            'siteCodeWithName',
            '',
          ).split('-')[1];
          employeeMapData.department = get(employeeMapData, 'department', '');
        }
        employeeMapData.documents.joiningDate = new Date(
          employeeMapData.documents.joiningDate,
        );
        employeeMapData.updatedBy = employeeId;
        employeeMapData.updatedByName = String(userData.fullName);
        updateEmployeeAPI.request(employeeMapData, get(user, 'token'));
      } else {
        if (get(employeeMapData, 'siteCodeWithName')) {
          employeeMapData.siteCode = get(
            employeeMapData,
            'siteCodeWithName',
            '',
          ).split('-')[0];
          employeeMapData.siteName = get(
            employeeMapData,
            'siteCodeWithName',
            '',
          ).split('-')[1];
          employeeMapData.department = get(employeeMapData, 'department', '');
        }
        const currentDate = new Date();
        employeeMapData.documents.joiningDate = currentDate;
        employeeMapData.createdBy = employeeId;
        employeeMapData.createdByName = String(userData.fullName);
        delete employeeMapData.employeeNumber;
        addEmployeeAPI.request(employeeMapData, get(user, 'token'));
      }
    }
    if (step !== 9) {
      setStep(step + 1);
    }
  };
  const onError = () => {
    if (!validation) {
      clearErrors();
      setStep(step + 1);
    }
  };

  const toggle = () => setModal(!modal);

  const handleNavs = (targetStep) => {
    if (step !== 8) {
      if (targetStep < step) {
        setStep(targetStep);
      } else {
        handleSubmit(onSubmitData, onError)();
      }
    } else {
      toggle();
    }
  };
  const gender = watch('gender');

  useEffect(() => {
    if (!isEmpty(get(params, 'employeeid'))) {
      getEmployeeDetailsAPI.request(params.employeeid, get(user, 'token'));
    }
  }, [params.employeeid]);

  useEffect(() => {
    if (
      getEmployeeDetailsAPI.data &&
      get(getEmployeeDetailsAPI, 'data.success')
    ) {
      if (!isEmpty(get(params, 'employeeid'))) {
        updateEmployeeData(getEmployeeDetailsAPI.data.data);
      }
    }
  }, [getEmployeeDetailsAPI.data]);

  useEffect(() => {
    if (getEmployeeDetailsAPI.error) {
      console.log(getEmployeeDetailsAPI.error);
    }
  }, [getEmployeeDetailsAPI.error]);

  const updateEmployeeData = (employeeData) => {
    setLanguageKnown(get(employeeData, 'languageKnown', []));
    setSiteCodeWithName(get(employeeData, 'siteCodeWithName', []));

    setEmpDocuments(get(employeeData, 'documents', {}));
    reset(employeeData);
  };

  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });

  const componentBackRef = useRef();
  /* const handlePrintBack = useReactToPrint({
    content: () => componentBackRef.current
  }); */
  const title = 'Uniform Deduction';
  return (
    <>
      <WizardModal modal={modal} setModal={setModal} />
      <Card
        as={Form}
        noValidate
        onSubmit={handleSubmit(onSubmitData, onError)}
        className="theme-wizard mb-5"
      >
        <Card.Header
          className={classNames('bg-light', {
            'px-4 py-3': variant === 'pills',
            'pb-2': !variant,
          })}
        >
          <Nav className="justify-content-center" variant={variant}>
            {variant === 'pills'
              ? navItems.map((item, index) => (
                  <NavItemPill
                    key={item.label}
                    index={index + 1}
                    step={step}
                    handleNavs={handleNavs}
                    icon={item.icon}
                    label={item.label}
                  />
                ))
              : navItems.map((item, index) => (
                  <NavItem
                    key={item.label}
                    index={index + 1}
                    step={step}
                    handleNavs={handleNavs}
                    icon={item.icon}
                    label={item.label}
                  />
                ))}
          </Nav>
        </Card.Header>
        {progressBar && <ProgressBar now={step * 25} style={{ height: 2 }} />}
        <Card.Body className="fw-normal px-md-6 py-4">
          {step === 1 && (
            <EmployeeBasicForm
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              token={get(user, 'token')}
              isUpdate={!isEmpty(get(params, 'employeeid'))}
              languageKnown={languageKnown}
              setLanguageKnown={setLanguageKnown}
              siteCodeWithName={siteCodeWithName}
              setSiteCodeWithName={setSiteCodeWithName}
            />
          )}
          {step === 2 && (
            <PermantAddressForm
              register={register}
              errors={errors}
              setValue={setValue}
            />
          )}
          {step === 3 && (
            <LocalAddressForm
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          )}
          {step === 4 && (
            <BankDetailsForm
              register={register}
              errors={errors}
              setValue={setValue}
            />
          )}
          {step === 5 && (
            <MandatoryForm
              register={register}
              errors={errors}
              setValue={setValue}
              empDocuments={empDocuments}
            />
          )}
          {step === 6 && (
            <PreviousEmployee
              register={register}
              errors={errors}
              setValue={setValue}
            />
          )}
          {step === 7 && (
            <Familydetails
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              empDocuments={empDocuments}
            />
          )}
          {step === 9 && (
            <Sale
              register={register}
              title={title}
              errors={errors}
              setValue={setValue}
              gender={gender}
              watch={watch}
              employeeNumber={employeeNumber}
            />
          )}
          {step === 8 && (
            <>
              <div className="text-right">
                <Button onClick={handlePrint}>Print this out!</Button>
              </div>
              <div ref={contentRef}>
                <TermsForms
                  watch={watch}
                  isNew={isEmpty(get(params, 'employeeid'))}
                />
                <TermsFormsBack
                  watch={watch}
                  ref={componentBackRef}
                  isNew={isEmpty(get(params, 'employeeid'))}
                />
              </div>
            </>
          )}
          {/* {step === 8 && <Success reset={reset} />} */}
        </Card.Body>
        <Card.Footer
          className={classNames('px-md-6 bg-light', {
            'd-none': step === 9,
            ' d-flex': step < 9,
          })}
        >
          <IconButton
            variant="link"
            icon={isRTL ? 'chevron-right' : 'chevron-left'}
            iconAlign="left"
            transform="down-1 shrink-4"
            className={classNames('px-0 fw-semi-bold', {
              'd-none': step === 1,
            })}
            onClick={() => {
              setStep(step - 1);
            }}
          >
            Prev
          </IconButton>

          <IconButton
            variant="primary"
            className="ms-auto px-5"
            type="submit"
            icon={isRTL ? 'chevron-left' : 'chevron-right'}
            iconAlign="right"
            transform="down-1 shrink-4"
          >
            Next
          </IconButton>
        </Card.Footer>
      </Card>
    </>
  );
};

const NavItem = ({ index, step, handleNavs, icon, label }) => {
  return (
    <Nav.Item>
      <Nav.Link
        className={classNames('fw-semi-bold', {
          done: index < 9 ? step > index : step > 8,
          active: step === index,
        })}
        onClick={() => handleNavs(index)}
      >
        <span className="nav-item-circle-parent">
          <span className="nav-item-circle">
            <FontAwesomeIcon icon={icon} />
          </span>
        </span>
        <span className="d-none d-md-block mt-1 fs--1">{label}</span>
      </Nav.Link>
    </Nav.Item>
  );
};

const NavItemPill = ({ index, step, handleNavs, icon, label }) => {
  return (
    <Nav.Item>
      <Nav.Link
        className={classNames('fw-semi-bold', {
          done: step > index,
          active: step === index,
        })}
        onClick={() => handleNavs(index)}
      >
        <Flex alignItems="center" justifyContent="center">
          <FontAwesomeIcon icon={icon} />
          <span className="d-none d-md-block mt-1 fs--1 ms-2">{label}</span>
        </Flex>
      </Nav.Link>
    </Nav.Item>
  );
};

LayoutForm.propTypes = {
  variant: PropTypes.oneOf(['pills']),
  validation: PropTypes.bool,
  progressBar: PropTypes.bool,
};

NavItemPill.propTypes = {
  index: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  handleNavs: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

NavItem.propTypes = NavItemPill.propTypes;

export default LayoutForm;
