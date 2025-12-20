
/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { get } from 'lodash';
import WizardInput from '../wizard/WizardInput';
import { BsCalendar2MonthFill } from 'react-icons/bs';
import {
  disableFutureDates
} from 'helpers/utils';
import vendorAPI from 'api/vendor';
import { getErrorMessage } from 'helpers/utils';
import { DatePicker } from 'rsuite';
import { Select } from 'antd';
import { toast } from 'react-toastify';
import resume from '../../api/resume';
import { number } from 'is_js';
import { monthNames } from '../../helpers/utils';
const AddLiability = () => {
  const todayDate = new Date();
  const [values, setValues] = useState(todayDate);
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [dates, setDates] = useState();
  const { register, handleSubmit, watch } = useForm();
  const [loading, setLoading] = useState(false);
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
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const [currentSiteId, setCurrentSiteId] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState([]);

  const handleChangeSiteId = (option, value) => {
    setCurrentSiteId(value);

  };
  const handleChangeVendor = (option, value) => {
    setSelectedVendor(value);
    console.log(value);
  };

  const handleChange = (date) => {
    setValues(date);
    console.log(date);

    const year = date.getFullYear();
    const month = date.getMonth();

    const selectedMonthName = monthNames[month].label;
    console.log(selectedMonthName);
    console.log(year);

    setCurrentMonth(selectedMonthName);
    setCurrentYear(year);
  };

  const source = watch('source');
  useEffect(() => {
    if (source === 'Unit Code') {
      setSelectedVendor([]);
    } else if (source === 'Vendor Code') {
      setCurrentSiteId([]);
    }
  }, [source]);

  const onSubmitData = async (data) => {
    const postData = {
      date: dates,
      liabilityType: String(data.liabilityType),
      month: String(`${currentMonth}-${currentYear}`),
      unitCode: String(currentSiteId?.value ?? ""),
      unitCodeWithName: String(currentSiteId?.label ?? ""),
      vendorCode: String(selectedVendor?.value ?? ""),
      vendorName: String(selectedVendor?.label ?? ""),
      creditAmount: Number(data.creditAmount),
      balanceLiabilityAmount: Number(data.creditAmount),
    };
    setLoading(true);
    const response = await resume.addLiability(
      postData
    );
    const errorMessage = getErrorMessage(response);
    setLoading(false);
    if (errorMessage) {
      toast.error(errorMessage, {
        theme: 'colored',
      });
    } else {
      toast.success('Liability added successfully', {
        theme: 'colored',
      });
    }
  };

  useEffect(() => {
    vendorAPI
      .getVentorNameDetails()
      .then((response) => {
        const vendors = get(response, "data.data.items", []).map((vendor) => ({
          label: vendor.vendorName, // Display text
          value: vendor.vendorCode, // Actual value
        }));
        setVendor(vendors);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const liabilityOptions = [
    { label: "GST", value: "GST" },
    { label: "PF", value: "PF" },
    { label: "ESI", value: "ESI" },
    { label: "OD", value: "OD_RETURN" },
    { label: "VENDOR", value: "VENDOR_PAYMENT" },
    { label: "HANDLOAN", value: "HANDLOAN_REPAYMENT" },
  ];
  
  return (
    <>
      <Card
        as={Form}
        onSubmit={handleSubmit(onSubmitData)}
        className="theme-wizard mb-5"
      >
        <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
          <div className="position-relative z-index-1 light">
            <h5 className="mb-0 text-white">Add Liability</h5>
          </div>
        </Card.Header>
        <Card.Body className="fw-normal px-md-6 py-4">
          <Row className="g-2 mb-3">
            <Col md="6">
              <label>Date (DD-MM-YYYY)</label>
              <input
                label="Date (DD-MM-YYYY)"
                name="date"
                type="date"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="form-control"
              />
            </Col>
            <Col md={6}>
              <WizardInput
                label="Liability Type"
                name="liabilityType"
                type="select"
                options={liabilityOptions}
                placeholder="Select liability type..."
                errors
                formControlProps={{
                  ...register('liabilityType'),
                }}
              />
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            <Col md={6}>
              <WizardInput
                label="Liability Amount"
                placeholder="Please Enter The Liability Amount"
                name="creditAmount"
                type="number"
                errors
                formControlProps={{
                  ...register('creditAmount'),
                }}
              />
            </Col>
            <Col span={6}>
              <label>Month</label>
              <DatePicker
                format="MMM yyyy"
                caretAs={BsCalendar2MonthFill}
                value={values}
                onChange={handleChange}
                shouldDisableDate={disableFutureDates}
                style={{ width: '100%' }}
              />
            </Col>
          </Row>
          <Row className="g-2 mb-3">
            <Col md={6}>
              <WizardInput
                label="Source"
                name="source"
                type="select"
                options={['Unit Code', 'Vendor Code']}
                placeholder="Select your source status..."
                errors
                formControlProps={{
                  ...register('source'),
                }}
              />
            </Col>
            {source === 'Unit Code' && (
              <Col md={6}>
                <label>Unit Code</label>
                <Select
                  defaultValue={currentSiteId}
                  value={currentSiteId}
                  showSearch
                  placeholder="Select a Unit code"
                  optionFilterProp="children"
                  onChange={handleChangeSiteId}
                  // onSearch={onSearch}
                  filterOption={filterOption}
                  options={siteIdsOptions}
                  size="large"
                  style={{ width: '100%' }}
                />
              </Col>
            )}
            {source === 'Vendor Code' && (
              <Col md={6}>
                <label>Vendor Code</label>
                <Select
                  defaultValue={selectedVendor}
                  value={selectedVendor}
                  showSearch
                  placeholder="Select a vendor code"
                  optionFilterProp="children"
                  onChange={handleChangeVendor}
                  // onSearch={onSearch}
                  filterOption={filterOption}
                  options={vendor}
                  size="large"
                  style={{ width: '100%' }}
                />
              </Col>
            )}
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row className="g-2 mb-3">
            <Col md={4}></Col>
            <Col md={4}>
              <Button type="submit" color="primary" className="mt-3 w-100">
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

export default AddLiability;
