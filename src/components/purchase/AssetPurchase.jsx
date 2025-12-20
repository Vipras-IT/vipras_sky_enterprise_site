import { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import useAPI from 'hooks/useApi';
import purchaseAPI from 'api/purchase';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import { Input, Select } from 'antd';
import vendorAPI from 'api/vendor';
import { useParams } from 'react-router-dom';
import Assets from './Assets';
const AssetPurchase = () => {
  const { user } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const addassetpurchaseAPI = useAPI(purchaseAPI.Addpurchase);
  const updateassetpurchaseAPI = useAPI(purchaseAPI.updatepurchasedetails);
  const getpurchaseAPI = useAPI(purchaseAPI.getpurchasedetails);
  const getVendordetailsAPI = useAPI(vendorAPI.getVendordetails);
  const [tableData, setTableData] = useState([]);
  const [vendorId, setVendorId] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [cgstPercentage, setCgstPercentage] = useState(0);
  const [cgstAmount, setCgstAmount] = useState(0);
  const [sgstPercentage, setsgstPercentage] = useState(0);
  const [sgstAmount, setsgstAmount] = useState(0);
  const [igstPercentage, setIgstPercentage] = useState(0);
  const [igstAmount, setIgstAmount] = useState(0);
  const [dates, setDates] = useState();
  const [invoiceNo, setInvoiceNo] = useState();

  const { reset } = useForm();
  useEffect(() => {
    if (
      get(addassetpurchaseAPI, 'data.success') &&
      !isEmpty(get(addassetpurchaseAPI, 'data.data'))
    ) {
      toast.success('Asset Purchase added successfully', {
        theme: 'colored',
      });
      navigate('/asset-purchaselist', { replace: true });
    } else if (get(addassetpurchaseAPI, 'data.message')) {
      toast.error(
        `Asset List added failed: ${addassetpurchaseAPI.data.message}`,
        {
          theme: 'colored',
        },
      );
    }
    // else {
    //   toast.error(`Asset List added failed`, {
    //     theme: 'colored'
    //   });
    // }
  }, [addassetpurchaseAPI.data]);
  useEffect(() => {
    if (addassetpurchaseAPI.error) {
      toast.error('Asset Purchase added failed', {
        theme: 'colored',
      });
    }
  }, [addassetpurchaseAPI.error]);
  useEffect(() => {
    if (updateassetpurchaseAPI.data) {
      if (
        get(updateassetpurchaseAPI, 'data.success') &&
        !isEmpty(get(updateassetpurchaseAPI, 'data.data'))
      ) {
        toast.success('Asset Purchase updated successfully', {
          theme: 'colored',
        });
        navigate('/asset-purchaselist', { replace: true });
      } else {
        toast.error('Asset Purchase updation failed', {
          theme: 'colored',
        });
      }
    }
  }, [updateassetpurchaseAPI.data]);
  useEffect(() => {
    if (!isEmpty(get(params, 'assetId'))) {
      getpurchaseAPI.request(params.assetId, get(user, 'token'));
    }
  }, [params.assetId]);
  const calculateFinalAmount = () => {
    const totalAmount = calculateTotalAmount();
    const totalAmount1 = totalAmount + sgstAmount + igstAmount + cgstAmount;
    return Math.round(totalAmount1);
  };
  useEffect(() => {
    if (getpurchaseAPI.data) {
      if (!isEmpty(get(params, 'assetId'))) {
        reset(getpurchaseAPI.data);
        setVendorName(get(getpurchaseAPI.data.data, 'vendorName', []));
        setVendorId(get(getpurchaseAPI.data.data, 'vendorCode', []));
        setCgstPercentage(get(getpurchaseAPI.data.data, 'cGSTPercentage', []));
        setsgstPercentage(get(getpurchaseAPI.data.data, 'sGSTPercentage', []));
        setIgstPercentage(get(getpurchaseAPI.data.data, 'iGSTPercentage', []));
        setsgstAmount(get(getpurchaseAPI.data.data, 'sGSTAmount', []));
        setIgstAmount(get(getpurchaseAPI.data.data, 'iGSTAmount', []));
        setCgstAmount(get(getpurchaseAPI.data.data, 'cGSTAmount', []));
        setInvoiceNo(get(getpurchaseAPI.data.data, 'invoiceNo', []));
        const selecteDate = get(getpurchaseAPI.data.data, 'date', []);
        const inputDate = new Date(selecteDate);
        const day = inputDate.getUTCDate().toString().padStart(2, '0');
        const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = inputDate.getUTCFullYear();
        const formattedDateString = `${year}-${month}-${day}`;
        setDates(formattedDateString);
        const products = get(getpurchaseAPI.data.data, 'products', []);
        const transformedData = products.map((product) => ({
          productId: String(product.productId),
          itemName: String(product.name),
          unitCode: String(product.unitCode),
          purchaseRate: Number(product.purchaseRate),
          location: String(product.location),
        }));
        setTableData(transformedData);
      }
    }
  }, [getpurchaseAPI.data]);

  const onSearch = (value) => {
    if (value) {
      getVendordetailsAPI.request(value, get(user, 'token'));
    }
  };

  const [siteIdsOptions, setSiteIdsOptions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await vendorAPI.getVentorNameDetails();
        const vendorDetails = get(response, 'data.data.items', []);
        const options = vendorDetails.map((vendor) => ({
          value: vendor.vendorCode,
          label: `${vendor.vendorCode} - ${vendor.vendorName}`,
        }));
        setSiteIdsOptions(options);
      } catch (error) {
        toast.error(error, {
          theme: 'colored',
        });
      }
    };
    fetchData();
  }, []);

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const handleVendorChange = (value, option) => {
    if (option) {
      const [id, name] = option.label.split(' - ');
      setVendorId(id);
      setVendorName(name);
    } else {
      setVendorId('');
      setVendorName('');
    }
  };

  const calculateTotalAmount = () => {
    let total = 0;

    for (const row of tableData) {
      total += row.purchaseRate;
    }

    return total;
  };

  const handlePercentage = (e) => {
    setCgstPercentage(e.target.value);
    const cgstAmount = getPercentage(e.target.value);
    setCgstAmount(cgstAmount);
  };

  const sgsthandlePercentage = (e) => {
    setsgstPercentage(e.target.value);
    const sgstAmount = getPercentage(e.target.value);
    setsgstAmount(sgstAmount);
  };
  const igsthandlePercentage = (e) => {
    setIgstPercentage(e.target.value);
    const igstAmount = getPercentage(e.target.value);
    setIgstAmount(igstAmount);
  };

  useEffect(() => {
    const total = calculateTotalAmount();
    if (total !== 0) {
      const CGST = getPercentage(cgstPercentage);
      const SGST = getPercentage(sgstPercentage);
      const IGST = getPercentage(igstPercentage);
      setsgstAmount(SGST);
      setIgstAmount(IGST);
      setCgstAmount(CGST);
    } else {
      setsgstAmount(0);
      setIgstAmount(0);
      setCgstAmount(0);
      setCgstPercentage(0);
      setsgstPercentage(0);
      setIgstPercentage(0);
    }
  }, [
    calculateTotalAmount(),
    cgstPercentage,
    sgstPercentage,
    igstPercentage,
    calculateFinalAmount(),
  ]);
  const getPercentage = (percentage) => {
    const total = calculateTotalAmount();
    console.log('total', total);
    if (total != 0) {
      const finalAmount = (total / 100) * percentage;
      return Math.round(finalAmount);
    } else {
      // toast.error(`Please add one purchases`, {
      //   theme: 'colored'
      // });
    }
  };

  useEffect(() => {
    if (getVendordetailsAPI.data) {
      if (
        get(getVendordetailsAPI, 'data.success') &&
        !isEmpty(get(getVendordetailsAPI, 'data.data.items'))
      ) {
        setVendorName(
          get(getVendordetailsAPI, 'data.data.items[0].vendorName', ''),
        );
      } else {
        toast.error('Vendor not found!', {
          theme: 'colored',
        });
        setVendorName('');
      }
    }
  }, [getVendordetailsAPI.data]);

  useEffect(() => {
    if (getVendordetailsAPI.error) {
      toast.error('Something went wrong please try again', {
        theme: 'colored',
      });
    }
  }, [getVendordetailsAPI.error]);

  const { handleSubmit, setValue } = useForm();

  const onSubmitData = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const postData = {
      date: dates,
      invoiceNo: String(invoiceNo),
      vendorName: String(vendorName),
      totalAmount: calculateTotalAmount(),
      cGSTPercentage: Number(cgstPercentage),
      sGSTPercentage: Number(sgstPercentage),
      iGSTPercentage: Number(igstPercentage),
      cGSTAmount: Number(cgstAmount),
      sGSTAmount: Number(sgstAmount),
      iGSTAmount: Number(igstAmount),
      createdBy: Number(userData.employeeId),
      grantTotal: Number(
        calculateTotalAmount() + sgstAmount + igstAmount + cgstAmount,
      ),
      purchaseType: 'ASSET',
      vendorCode: vendorId,
      products: tableData.map((product) => ({
        productId: String(product.productId),
        name: String(product.itemName),
        unitCode: String(product.unitCode),
        purchaseRate: Number(product.purchaseRate),
        location: String(product.location),
      })),
    };
    if (!isEmpty(get(params, 'assetId'))) {
      delete postData.createdOn;
      delete postData.updatedOn;
      const obj = params;
      const assetIdString = obj.assetId;
      const updatedData = { ...postData, id: assetIdString };
      updateassetpurchaseAPI.request(updatedData, get(user, 'token'));
    } else {
      addassetpurchaseAPI.request(postData, get(user, 'token'));
    }
  };

  return (
    <Card
      as={Form}
      onSubmit={handleSubmit(onSubmitData)}
      className="theme-wizard mb-5"
    >
      <Card.Body className="fw-normal px-md-6 py-4">
        <Row className="g-2 mb-3">
          <Col md="6">
            <label>Purchase Date (DD/MM/YYYY)</label>
            <input
              label="Date (DD-MM-YYYY)"
              name="date"
              type="date"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
              className="form-control"
            />
          </Col>
          <Col span={6}>
            <label>invoiceNo</label>
            <input
              type="string"
              label="Invoice No"
              name="invoiceNo"
              className="form-control"
              value={invoiceNo}
              onChange={(e) => setInvoiceNo(e.target.value)}
            />
          </Col>
        </Row>
        <Row className="g-2 mb-3">
          <Col md={6}>
            <label>Vendor Name</label>
            <Select
              showSearch
              size="large"
              placeholder="Select a Vendor"
              optionFilterProp="children"
              //className="form-control"
              onChange={handleVendorChange}
              onSearch={onSearch}
              filterOption={filterOption}
              options={siteIdsOptions}
              style={{ width: '100%' }}
            />
          </Col>
          {/* <Col span={6}>
            <Title level={5}>Vendor Code</Title>
            <Search
              name="vendorCode"
              size="large"
              placeholder="Vendor code"
              value={vendorId}
              onChange={handleEmployeeIdChange}
              onSearch={onSearch}
              enterButton
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('vendorCode')
              }}
            />
          </Col>
          <Col span={8} offset={1}>
            <Title level={5}>Vendor Name</Title>
            <Input
              name="vendorName"
              size="large"
              prefix={<UserOutlined />}
              value={vendorName}
              onChange={handleEmployeeNameChange}
              readOnly
              formGroupProps={{ as: Col, sm: 6 }}
              formControlProps={{
                ...register('vendorName')
              }}
            />
          </Col> */}
        </Row>
        <Assets rows={tableData} setRows={setTableData} setValue={setValue} />
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
              // disabled={disableInput1}
            />
          </Col>
          <Col md="6">
            <label>CGST Amount</label>
            <Input type="number" className="form-control" value={cgstAmount} />
          </Col>
          <Col md="6">
            <label>SGST (%)</label>
            <input
              type="number"
              className="form-control"
              value={sgstPercentage}
              onChange={sgsthandlePercentage}
              // disabled={disableInput2}
            />
          </Col>
          <Col md="6">
            <label> SGST Amount</label>
            <input
              type="number"
              name="sGST"
              className="form-control"
              value={sgstAmount}
            />
          </Col>
        </Row>
        <Row className="g-2 mb-3">
          <Col md="6">
            <label>IGST (%)</label>
            <input
              type="number"
              className="form-control"
              name="iGST"
              value={igstPercentage}
              onChange={igsthandlePercentage}
              //disabled={disableInput3}
            />
          </Col>
          <Col md="6">
            <label>IGST Amount</label>
            <input
              type="number"
              className="form-control"
              name="iGST"
              value={igstAmount}
            />
          </Col>
          <Col md={4}></Col>
          <Col md={4}>
            <label>Grant Total</label>
            <input
              type="number"
              value={calculateFinalAmount()}
              name="grantTotal"
              className="form-control"
              readOnly
            />
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer>
        <Row className="g-2 mb-3">
          <Col md={4}></Col>
          <Col md={4}>
            <Button type="submit" color="primary" className="mt-3 w-100">
              {addassetpurchaseAPI.loading && (
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

export default AssetPurchase;
