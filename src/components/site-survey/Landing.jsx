/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Card, Form, Nav, ProgressBar } from 'react-bootstrap';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';
import AppContext, { RegistrationContext } from 'context/Context';
import IconButton from 'components/common/IconButton';
import Civildetails from './Civildetails';
// import Clientdeployment from './Clientdeployments';
import Commondetails from './Commondetails';
import CostEffectiveMeasure from './CostEffectiveMeasure';
import Electricdetails from './Electricdetails';
import Expectation from './Expectation';
import PenaltyClass from './PenaltyClass';
import Plumbingdetails from './Plumbingdetails';
import RevenueSources from './RevenueSources';
import Securitydetails from './Securitydetails';
import SiteBasicdetails from './SiteBasicdetails';
import SystemCommunication from './SystemCommunication';
import Viprasdeployments from './Viprasdeploymets';
import Success from './Success';

import {
  faCreditCard,
  faUser,
  faAddressBook,
  faFile,
  faIdCard,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { has } from 'lodash';
import { toast } from 'react-toastify';

const LandingSurvey = ({ variant, validation, progressBar }) => {
  const { isRTL } = useContext(AppContext);
  const [step, setStep] = useState(1);
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

  const navItems = [
    {
      icon: faUser,
      label: 'Site Basic Details',
    },
    {
      icon: faAddressBook,
      label: 'Electrical Details',
    },
    {
      icon: faAddressBook,
      label: 'System Communication',
    },
    {
      icon: faCreditCard,
      label: 'Plumbing Details',
    },
    {
      icon: faFile,
      label: 'Common Details ',
    },
    {
      icon: faIdCard,
      label: 'Security Tab',
    },
    {
      icon: faUsers,
      label: 'Civil Details',
    },
    {
      icon: faUsers,
      label: 'Vipras Deployments',
    },
    {
      icon: faUsers,
      label: 'Expectation',
    },
    {
      icon: faUsers,
      label: 'Cost Effective Measure',
    },
    {
      icon: faUsers,
      label: 'Revenue Sources',
    },
    {
      icon: faUsers,
      label: 'Penalty Class',
    },

    {
      icon: 'thumbs-up',
      label: 'Done',
    },
  ];

  const handleNavs = (targetStep) => {
    if (step !== 12) {
      if (targetStep < step) {
        setStep(targetStep);
      } else {
        handleSubmit(onSubmitData, onError)();
      }
    } else {
      toggle();
    }
  };

  const onSubmitData = (data) => {
    setStep(step + 1);
  };
  const onError = () => {
    if (!validation) {
      clearErrors();
      setStep(step + 1);
    }
  };

  return (
    <>
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
            <SiteBasicdetails
              register={register}
              errors={errors}
              setValue={setValue}
            />
          )}
          {step === 2 && (
            <Electricdetails
              register={register}
              errors={errors}
              setValue={setValue}
            />
          )}
          {step === 3 && (
            <SystemCommunication
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          )}
          {step === 4 && (
            <Plumbingdetails
              register={register}
              errors={errors}
              setValue={setValue}
            />
          )}
          {step === 5 && (
            <Commondetails
              register={register}
              errors={errors}
              setValue={setValue}
            />
          )}
          {step === 6 && (
            <Securitydetails
              register={register}
              errors={errors}
              setValue={setValue}
            />
          )}
          {step === 7 && (
            <Civildetails
              register={register}
              errors={errors}
              setValue={setValue}
            />
          )}
          {step === 8 && (
            <Viprasdeployments
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          )}
          {step === 9 && (
            <Expectation
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          )}
          {step === 10 && (
            <CostEffectiveMeasure
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          )}
          {step === 11 && (
            <RevenueSources
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          )}
          {step === 12 && (
            <PenaltyClass
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
            />
          )}

          {step === 13 && <Success reset={reset} />}
        </Card.Body>
        <Card.Footer
          className={classNames('px-md-6 bg-light', {
            'd-none': step === 13,
            ' d-flex': step < 13,
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
          done: index < 13 ? step > index : step > 12,
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

LandingSurvey.propTypes = {
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

export default LandingSurvey;
