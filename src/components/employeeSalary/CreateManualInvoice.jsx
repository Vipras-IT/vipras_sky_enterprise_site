/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useAuth } from 'hooks/useAuth';
import useAPI from 'hooks/useApi';
import { useNavigate } from 'react-router-dom';
import purchaseAPI from 'api/invoiceApi';
import crm from 'api/crm';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import { Input, Select } from 'antd';
import InvoiceTable from './InvoiceTable';
import WizardInput from 'components/wizard/WizardInput';
import {
  getErrorMessage,
  getPreviousMonthNames,
  monthNames,
  disableFutureDates
} from 'helpers/utils';

import { useParams } from 'react-router-dom';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';
const CreateManualInvoice = () => {
  const params = useParams();
  const addInvoiceAPI = useAPI(purchaseAPI.addInvoice);
  const [tableData, setTableData] = useState([]);
  const [cgstPercentage, setCgstPercentage] = useState(0);
  const [cgstAmount, setCgstAmount] = useState(0);
  const [sgstPercentage, setsgstPercentage] = useState(0);
  const [sgstAmount, setsgstAmount] = useState(0);
  const [igstPercentage, setIgstPercentage] = useState(0);
  const [igstAmount, setIgstAmount] = useState(0);
  const [dates, setDates] = useState();
  const [loading, setLoading] = useState(false);
  const [poDate, setPoDate] = useState();
  const [clientName, setClientName] = useState();
  const [invoiceNo, setInvoiceNo] = useState('');
  const [subname, setSubName] = useState([]);
  const [subContractorHide, setSubContractorHide] = useState(false);
  const [gstHide, setGstHide] = useState(false);
  const [isGstInvoice, setIsGstInvoice] = useState(false);
  const [subContractorNames, setsubContractorNames] = useState('');
  const [subContractorIds, setSubContractorIds] = useState(0);
  const [showTextBox1, setShowTextBox1] = useState(false);
  const [clientNameHide, setClientNameHide] = useState(true);
  const [clientAddressHide, setClientAddressHide] = useState(true);
  const [showTextBox2, setShowTextBox2] = useState(true);
  const todayDate = new Date();
  const [values, setValues] = useState(todayDate);
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (
      get(addInvoiceAPI, 'data.success') &&
      !isEmpty(get(addInvoiceAPI, 'data.data'))
    ) {
      toast.success('Manual Invoice Created successfully', {
        theme: 'colored',
      });
      handleAllDataClear();
    } else if (get(addInvoiceAPI, 'data.message')) {
      toast.error(
        `Manual Invoice Created failed: ${addInvoiceAPI.data.message}`,
        {
          theme: 'colored',
        },
      );
    }
  }, [addInvoiceAPI.data]);

  useEffect(() => {
    if (addInvoiceAPI.error) {
      toast.error('Manual Invoice Created failed', {
        theme: 'colored',
      });
    }
  }, [addInvoiceAPI.error]);

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
  const [currentSiteId, setCurrentSiteId] = useState();
  const handleChangeSiteId = (value) => {
    if (invoicesType === 'GST' && value) {
      setClientNameHide(false);
      setClientAddressHide(false);
    }
    const selectedOption = siteIdsOptions.find(
      (option) => option.value === value,
    );
    const units = get(selectedOption, 'label');
    setCurrentSiteId(units);
  };
  const handleAllDataClear = () => {
    setValue('siteId', '');
    setInvoiceNo('');
    setClientName('');
    setsgstAmount(0);
    setCgstAmount(0);
    setIgstAmount(0);
    setsgstPercentage(0);
    setCgstPercentage(0);
    setIgstPercentage(0);
    setTableData([]);
  };

  const calculateFinalAmount = () => {
    const totalAmount = calculateTotalAmount();
    const totalAmount1 = totalAmount + sgstAmount + igstAmount + cgstAmount;
    return Math.round(totalAmount1);
  };

  const calculateTotalAmount = () => {
    let total = 0;
    for (const row of tableData) {
      total += row.totalAmount;
    }
    return total;
  };

  const handlePercentage = (e) => {
    setCgstPercentage(e.target.value);
    const cgstAmount = getPercentage(e.target.value);
    setCgstAmount(cgstAmount);
  };
  const handleMonthlyAdvanceChanges = (e) => {
    setSubContractorHide(e.target.value === 'SUB_CONTRACTOR');
    setShowTextBox1(e.target.value === 'SUB_CONTRACTOR');
    if (e.target.value === 'SUB_CONTRACTOR') {
      setShowTextBox2(false);
    }
    setShowTextBox2(e.target.value === 'GST');
    setGstHide(e.target.value === 'GST');
    setIsGstInvoice(e.target.value === 'GST');
  };

  const igsthandlePercentage = (e) => {
    setIgstPercentage(e.target.value);
    const igstAmount = getPercentage(e.target.value);
    setIgstAmount(igstAmount);
  };

  const sgsthandlePercentage = (e) => {
    setsgstPercentage(e.target.value);
    const sgstAmount = getPercentage(e.target.value);
    setsgstAmount(sgstAmount);
  };

  const getPercentage = (percentage) => {
    const total = calculateTotalAmount();
    if (total !== 0) {
      const finalAmount = (total / 100) * percentage;
      return Math.round(finalAmount);
    } else {
      // toast.error(`Please add one purchases`, {
      //   theme: 'colored'
      // });
    }
  };
  const { handleSubmit, setValue, register, reset, watch } = useForm();

  // const handleChangeYear = (value) => {
  //   setCurrentYear(value);
  // };
  // const handleChangeMonth = (value) => {
  //   const MonthNames = monthNames[value].label;
  //   setCurrentMonth(MonthNames);
  // };
  const navigate = useNavigate();
  const invoicesType = watch('invoiceType');
  const onSubmitData = async (data) => {
    const postData = {
      ...data,
      date: dates,
      gstNumber: String(invoiceNo),
      siteId: currentSiteId ? String(currentSiteId.split('-')[0]) : '',
      siteName: currentSiteId ? String(currentSiteId.split('-')[1]) : '',
      clientName: String(clientName),
      clientAddress: String(data.clientAddress),
      invoiceType: String(data.invoiceType),
      totalCgstAmount: Number(cgstAmount) || 0,
      totalIgstAmount: Number(igstAmount) || 0,
      poNumber: data.poNumber,
      poDate: poDate ? poDate : null,
      totalSgstPercentage: Number(sgstPercentage) || 0,
      totalCgstPercentage: Number(cgstPercentage) || 0,
      totalIgstPercentage: Number(igstPercentage) || 0,
      subContractor: String(subContractorNames.trim()),
      subContractorId: Number(subContractorIds),
      totalTaxAmount: sgstAmount + cgstAmount + igstAmount,
      totalSgstAmount: Number(sgstAmount) || 0,
      totalAmount: Number(
        calculateTotalAmount() + sgstAmount + igstAmount + cgstAmount,
      ),
      month: `${currentMonth}-${currentYear}`,
      employeeIDNumber: Number(subContractorIds),
      isGstInvoice: isGstInvoice,
      invoiceBreakUP: tableData.map((product) => ({
        role: String(product.role),
        totalDuty: Number(product.totalDuty) || 0,
        qty: Number(product.qty) || 0,
        rate: Number(product.rate) || 0,
        sgstPercentage: Number(sgstPercentage) || 0,
        cgstPercentage: Number(cgstPercentage) || 0,
        igstPercentage: Number(igstPercentage) || 0,
        sgstAmount: Math.round(
          (Number(product.totalAmount) / 100) * Number(sgstPercentage),
        ),
        cgstAmount: Math.round(
          (Number(product.totalAmount) / 100) * Number(cgstPercentage),
        ),
        igstAmount: Math.round(
          (Number(product.totalAmount) / 100) * Number(igstPercentage),
        ),
        taxableValue: sgstAmount + cgstAmount + igstAmount,
        totalAmount: Number(product.totalAmount) || 0,
      })),
    };
    if (!isEmpty(get(params, 'id'))) {
      setLoading(true);
      delete postData.createdOn;
      delete postData.updatedOn;
      const subcontracterId = params.id;
      const updatedData = { ...postData, id: subcontracterId };
      const response = await purchaseAPI.updateInvoice(
        updatedData
      );
      const errorMessage = getErrorMessage(response);
      setLoading(false);
      if (errorMessage) {
        toast.error(errorMessage, {
          theme: 'colored',
        });
      } else {
        toast.success('Sub-Contracter Invoice updated successfully', {
          theme: 'colored',
        });
        if (invoicesType === 'GST') {
          navigate('/gstinvoice-report', { replace: true });
        } else {
          navigate('/sub-contracter-invoice-report', { replace: true });
        }
      }
    } else {
      if (currentMonth && currentYear) {
        await addInvoiceAPI.request(postData);
      } else {
        toast.error('Year, Month, and Table Data are required.', {
          theme: 'colored',
        });
      }
    }
  };

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

  useEffect(() => {
    getSubContractOptions();
    handleChange(values)
  }, []);
  const handleSubContractorChange = (e) => {
    const selectedSubContractorId = e.target.value;
    console.log(selectedSubContractorId);
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

  const handleChangeDate = (e) => {
    const date = new Date(e.target.value);
    setDates(e.target.value);
  };
  const handleChangePoDate = (e) => {
    setPoDate(e.target.value);
  };

  useEffect(() => {
    if (!isEmpty(get(params, 'id'))) {
      showUpdateEmployee(params.id);
      setIsEditing(true)
    }
  }, [params.id]);

  const showUpdateEmployee = async (id) => {
    const response = await purchaseAPI.getByIdInvoicedetails(id);
    const errorMessage = getErrorMessage(response);
    if (errorMessage) {
      toast.error(errorMessage, {
        theme: 'colored',
      });
    } else {
      reset(response.data.data.invoiceDetails);
      reset(response.data.data);
      const inputDate = new Date(
        get(response, 'data.data.invoiceDetails.date', ''),
      );
      const day = inputDate.getUTCDate().toString().padStart(2, '0');
      const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0');
      const year = inputDate.getUTCFullYear();
      const formattedDateString = `${year}-${month}-${day}`;
      setDates(formattedDateString);
      setClientName(get(response, 'data.data.invoiceDetails.clientName', ''));
      setValue(
        'clientAddress',
        get(response, 'data.data.invoiceDetails.clientAddress', ''),
      );
      setValue(
        'invoiceType',
        get(response, 'data.data.invoiceDetails.invoiceType', ''),
      );
      setValue(
        'poNumber',
        get(response, 'data.data.invoiceDetails.poNumber', ''),
      );
      // setPoDate(get(response, 'data.data.invoiceDetails.poDate', ''));
      const inVoice = get(response, 'data.data.invoiceDetails.invoiceType', '');
      setSubContractorHide(inVoice === 'SUB_CONTRACTOR');
      setShowTextBox1(inVoice === 'SUB_CONTRACTOR');
      if (inVoice === 'SUB_CONTRACTOR') {
        setShowTextBox2(false);
      }
      setShowTextBox2(inVoice === 'GST');
      setGstHide(inVoice === 'GST');
      setIsGstInvoice(inVoice === 'GST');
      const products = get(
        response,
        'data.data.invoiceDetails.invoiceBreakUP',
        [],
      );
      setTableData(products);
      setSubContractorIds(
        get(response, 'data.data.invoiceDetails.subContractorId', ''),
      );
      setsubContractorNames(
        get(response, 'data.data.invoiceDetails.subContractor', ''),
      );

      const siteId = get(response, 'data.data.invoiceDetails.siteId', '');
      const siteName = get(response, 'data.data.invoiceDetails.siteName', '');
      setCurrentSiteId(`${siteId}-${siteName}`);
      const monthAndYear = new Date(get(response, 'data.data.invoiceDetails.month', ''))
      setValues(monthAndYear)
      const years = monthAndYear.getFullYear();
      const months = monthAndYear.getMonth();
      const MonthNames = monthNames[months].label;
      setCurrentMonth(MonthNames);
      setCurrentYear(years);

      if (get(response, 'data.data.invoiceDetails.poDate', '')) {
        const poDates = new Date(
          get(response, 'data.data.invoiceDetails.poDate', ''),
        );
        const days = poDates.getUTCDate().toString().padStart(2, '0');
        const months = (poDates.getUTCMonth() + 1).toString().padStart(2, '0');
        const years = poDates.getUTCFullYear();
        const formattedDateStrings = `${years}-${months}-${days}`;
        setPoDate(formattedDateStrings);
      }

      setCgstPercentage(
        get(response, 'data.data.invoiceDetails.totalCgstPercentage', ''),
      );
      setInvoiceNo(get(response, 'data.data.invoiceDetails.gstNumber', ''));
      setCgstAmount(
        get(response, 'data.data.invoiceDetails.totalCgstAmount', ''),
      );
      setsgstPercentage(
        get(response, 'data.data.invoiceDetails.totalSgstPercentage', ''),
      );
      setsgstAmount(
        get(response, 'data.data.invoiceDetails.totalSgstAmount', ''),
      );
      setIgstPercentage(
        get(response, 'data.data.invoiceDetails.totalIgstPercentage', ''),
      );
      setIgstAmount(
        get(response, 'data.data.invoiceDetails.totalIgstAmount', ''),
      );
    }
  };

  const handleChange = (date) => {
    setValues(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    const MonthNames = monthNames[month].label;
    setCurrentMonth(MonthNames);
    setCurrentYear(year);
  };

  return (
    <Card
      as={Form}
      onSubmit={handleSubmit(onSubmitData)}
      className="theme-wizard mb-5"
    >
      <Card.Header className="bg-shape modal-shape-header px-4 position-relative">
        <div className="position-relative z-index-1 light">
          <h5 className="mb-0 text-white">Create Manual Invoice</h5>
        </div>
      </Card.Header>
      <Card.Body className="fw-normal px-md-6 py-4">
        <Row className="g-2 mb-3">
          <Col md="6">
            <WizardInput
              label="Invoice Type"
              defaultValue={['GST']}
              placeholder="Select Invoice Type" 
              name="invoiceType"
              type="select"
              options={['GST', 'SUB_CONTRACTOR']}
              errors
              disabled={isEditing} 
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps={{
                ...register('invoiceType'),
                onChange: handleMonthlyAdvanceChanges,
                disabled: isEditing, 
              }}
            />
          </Col>
          {subContractorHide && (
            <Col md={6}>
              <label>Sub-Contractor Name</label>
              <select
                name="Sub-Contractor Name"
                onChange={handleSubContractorChange}
                className="form-control"
                value={subContractorIds}
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
        </Row>
        <Row className="g-2 mb-3">
          <Col md="6">
            <label>Invoice Date (DD/MM/YYYY)</label>
            <input
              label="Date (DD-MM-YYYY)"
              name="date"
              type="date"
              value={dates}
              onChange={handleChangeDate}
              className="form-control"
            />
          </Col>
          {showTextBox2 && (
            <Col span={6}>
              <label>Gst Number</label>
              <input
                type="string"
                label="Invoice No"
                name="invoiceNo"
                className="form-control"
                value={invoiceNo}
                disabled={isEditing} 
                onChange={(e) => setInvoiceNo(e.target.value)}
              />
            </Col>
          )}
          {(showTextBox1 || showTextBox2) && (
            <Col md={6}>
              <label>Unit Code</label>
              <Select
                defaultValue={currentSiteId}
                value={currentSiteId}
                showSearch
                placeholder="Select a Unit code"
                optionFilterProp="children"
                onChange={handleChangeSiteId}
                disabled={isEditing} 
                // onSearch={onSearch}
                filterOption={filterOption}
                options={siteIdsOptions}
                size="large"
                style={{ width: '100%' }}
              />
            </Col>
          )}
        </Row>
        <Row className="g-2 mb-3">
          <Col span={6}>
            <WizardInput
              label="PO Number"
              name="poNumber"
              type="string"
              errors
              formGroupProps={{ as: Col, sm: 12 }}
              formControlProps={{
                ...register('poNumber'),
              }}
            />
          </Col>
          <Col md="6">
            <label>PO Date (DD/MM/YYYY)</label>
            <input
              label="Date (DD-MM-YYYY)"
              name="date"
              type="date"
              value={poDate}
              onChange={handleChangePoDate}
              className="form-control"
            />
          </Col>
        </Row>
        <Row className="g-2 mb-3">
          {clientNameHide && (
            <Col span={6}>
              <label>Client Name</label>
              <input
                type="string"
                label="Invoice No"
                name="invoiceNo"
                className="form-control"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </Col>
          )}
          {clientAddressHide && (
            <Col md={6}>
              <WizardInput
                label="Client Address"
                name="clientAddress"
                type="textarea"
                errors
                formGroupProps={{ as: Col, sm: 12 }}
                formControlProps={{
                  ...register('clientAddress'),
                }}
              />
            </Col>
          )}
        </Row>
        <Row className="g-1 mb-2">
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
          <Col span={6}> </Col>
        </Row>
        <InvoiceTable
          rows={tableData}
          setRows={setTableData}
          setValue={setValue}
        />
        {gstHide && (
          <Row className="g-2 mb-3">
            <Col md="6">
              <label>CGST (%)</label>
              <Input
                type="number"
                className="form-control"
                label="CGST (%)"
                name="cGST"
                value={cgstPercentage}
                onChange={handlePercentage}
              />
            </Col>
            <Col md="6">
              <label>CGST Amount</label>
              <Input
                type="number"
                className="form-control"
                value={cgstAmount}
                readOnly
              />
            </Col>
            <Col md="6">
              <label>SGST (%)</label>
              <Input
                type="number"
                className="form-control"
                value={sgstPercentage}
                onChange={sgsthandlePercentage}
              />
            </Col>
            <Col md="6">
              <label> SGST Amount</label>
              <Input
                type="number"
                name="sGST"
                className="form-control"
                value={sgstAmount}
                readOnly
              />
            </Col>
          </Row>
        )}
        {gstHide && (
          <Row className="g-2 mb-3">
            <Col md="6">
              <label>IGST (%)</label>
              <Input
                type="number"
                className="form-control"
                name="iGST"
                value={igstPercentage}
                onChange={igsthandlePercentage}
              />
            </Col>
            <Col md="6">
              <label>IGST Amount</label>
              <Input
                type="number"
                className="form-control"
                name="iGST"
                value={igstAmount}
                readOnly
              />
            </Col>
            <Col md={4}></Col>
            <Col md={4}>
              <label>Grant Total</label>
              <Input
                type="number"
                value={calculateFinalAmount()}
                name="grantTotal"
                className="form-control"
                readOnly
              />
            </Col>
          </Row>
        )}
      </Card.Body>
      <Card.Footer>
        <Row className="g-2 mb-3">
          <Col md={4}></Col>
          <Col md={4}>
            <Button type="submit" color="primary" className="mt-3 w-100">
              {addInvoiceAPI.loading && (
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
  );
};

export default CreateManualInvoice;
