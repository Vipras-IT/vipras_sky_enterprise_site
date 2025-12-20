import { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import useAPI from 'hooks/useApi';
import purchaseAPI from 'api/purchase';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import ProductTable from 'components/purchase/HKProduct';
import { Input, Select } from 'antd';
import vendorAPI from 'api/vendor';
import { useParams } from 'react-router-dom';
const HKPurchase = () => {
  const { user } = useAuth();
  const params = useParams();
  const navigate = useNavigate();
  const siteIdsString = window.localStorage.getItem('siteIds');
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  const siteIdsOpt = [];
  siteIds.map((item) => {
    const siteIdArray = item.split('-');
    siteIdsOpt.push({
      value: siteIdArray[0],
      label: item,
    });
  });
  const addPurchaseApi = useAPI(purchaseAPI.Addpurchase);
  const updatePurchaseApi = useAPI(purchaseAPI.updatepurchasedetails);
  const getPurchaseApi = useAPI(purchaseAPI.getpurchasedetails);
  const getVendorDetailsApi = useAPI(vendorAPI.getVendordetails);

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
  const [currentSiteId, setCurrentSiteId] = useState(
    get(siteIdsOpt[0], 'value', ''),
  );
  const { reset } = useForm();

  const handleChangeSiteId = (value, option) => {
    // const selectedOption = siteIdsOpt.find((option) => option.value === value);
    setCurrentSiteId(option);
  };

  useEffect(() => {
    if (
      get(addPurchaseApi, 'data.success') &&
      !isEmpty(get(addPurchaseApi, 'data.data'))
    ) {
      toast.success('HK List added successfully', {
        theme: 'colored',
      });
      navigate('/consumable-purchase', { replace: true });
    } else if (get(addPurchaseApi, 'data.message')) {
      toast.error(`HK List added failed: ${addPurchaseApi.data.message}`, {
        theme: 'colored',
      });
    }
    // else {
    //   toast.error(`HK List added failed`, {
    //     theme: 'colored'
    //   });
    // }
  }, [addPurchaseApi.data]);

  useEffect(() => {
    if (addPurchaseApi.error) {
      toast.error('HK List added failed', {
        theme: 'colored',
      });
    }
  }, [addPurchaseApi.error]);
  useEffect(() => {
    if (updatePurchaseApi.data) {
      if (
        get(updatePurchaseApi, 'data.success') &&
        !isEmpty(get(updatePurchaseApi, 'data.data'))
      ) {
        toast.success('HK updated successfully', {
          theme: 'colored',
        });
        navigate('/consumable-purchase', { replace: true });
      } else {
        toast.error('HK updation failed', {
          theme: 'colored',
        });
      }
    }
  }, [updatePurchaseApi.data]);
  useEffect(() => {
    if (!isEmpty(get(params, 'id'))) {
      getPurchaseApi.request(params.id, get(user, 'token'));
    }
  }, [params.id]);

  const calculateFinalAmount = () => {
    const totalAmount = calculateTotalAmount();
    const totalAmount1 = totalAmount + sgstAmount + igstAmount + cgstAmount;
    return Math.round(totalAmount1);
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
        toast.error('Vendor not found!', error, {
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
  useEffect(() => {
    if (getPurchaseApi.data) {
      if (!isEmpty(get(params, 'id'))) {
        reset(getPurchaseApi.data);
        setVendorName(get(getPurchaseApi.data.data, 'vendorName', []));
        setVendorId(get(getPurchaseApi.data.data, 'vendorCode', []));
        setCgstPercentage(get(getPurchaseApi.data.data, 'cGSTPercentage', []));
        setCgstAmount(get(getPurchaseApi.data.data, 'cGSTAmount', []));
        setsgstPercentage(get(getPurchaseApi.data.data, 'sGSTPercentage', []));
        const unitCode = get(getPurchaseApi.data.data, 'unitCodeWithName', []);
        setCurrentSiteId(unitCode);
        setsgstAmount(get(getPurchaseApi.data.data, 'sGSTAmount', []));
        setIgstPercentage(get(getPurchaseApi.data.data, 'iGSTPercentage', []));
        setIgstAmount(get(getPurchaseApi.data.data, 'iGSTAmount', []));
        setInvoiceNo(get(getPurchaseApi.data.data, 'invoiceNo', []));
        const selecteDate = get(getPurchaseApi.data.data, 'date', []);
        const inputDate = new Date(selecteDate);
        const day = inputDate.getUTCDate().toString().padStart(2, '0');
        const month = (inputDate.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = inputDate.getUTCFullYear();
        const formattedDateString = `${year}-${month}-${day}`;
        setDates(formattedDateString);
        const products = get(getPurchaseApi.data.data, 'products', []);
        const transformedData = products.map((product) => ({
          productId: String(product.productId),
          name: String(product.name),
          size: String(product.size),
          quantity: Number(product.quantity),
          rate: Number(product.salesRate),
          purchaseAmount: Number(product.purchaseRate),
          amount: Number(product.amount),
        }));
        setTableData(transformedData);
      }
    }
  }, [getPurchaseApi.data]);

  const onSearch = (value) => {
    if (value) {
      getVendorDetailsApi.request(value, get(user, 'token'));
    }
  };

  const calculateTotalAmount = () => {
    let total = 0;

    for (const row of tableData) {
      total += row.amount;
    }

    return total;
  };

  const handlePercentage = (e) => {
    setCgstPercentage(e.target.value);
    const cgstAmount = getPercentage(e.target.value);
    setCgstAmount(cgstAmount);
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
    if (getVendorDetailsApi.data) {
      if (
        get(getVendorDetailsApi, 'data.success') &&
        !isEmpty(get(getVendorDetailsApi, 'data.data.items'))
      ) {
        setVendorName(
          get(getVendorDetailsApi, 'data.data.items[0].vendorName', ''),
        );
      } else {
        toast.error('Vendor not found!', {
          theme: 'colored',
        });
        setVendorName('');
      }
    }
  }, [getVendorDetailsApi.data]);

  useEffect(() => {
    if (getVendorDetailsApi.error) {
      toast.error('Something went wrong please try again', {
        theme: 'colored',
      });
    }
  }, [getVendorDetailsApi.error]);

  const { handleSubmit, setValue } = useForm();

  const onSubmitData = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const postData = {
      date: dates,
      invoiceNo: String(invoiceNo),
      vendorName: String(vendorName),
      unitCode: String(currentSiteId.value),
      unitCodeWithName: String(currentSiteId.label),
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
      purchaseType: 'HK',
      vendorCode: vendorId,
      products: tableData.map((product) => ({
        productId: String(product.productId),
        name: String(product.name),
        size: String(product.size),
        quantity: Number(product.quantity),
        purchaseRate: Number(product.purchaseAmount),
        salesRate: Number(product.rate),
        amount: Number(product.amount),
      })),
    };
    if (!isEmpty(get(params, 'id'))) {
      delete postData.createdOn;
      delete postData.updatedOn;
      const assetIdString = params.id;
      const updatedData = { ...postData, id: assetIdString };
      updatePurchaseApi.request(updatedData, get(user, 'token'));
    } else {
      addPurchaseApi.request(postData, get(user, 'token'));
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
              // className="form-control"
              onChange={handleVendorChange}
              onSearch={onSearch}
              filterOption={filterOption}
              options={siteIdsOptions}
              style={{ width: '100%' }}
            />
          </Col>
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
                  options={siteIdsOpt}
                  size="large"
                  style={{ width: '100%' }}
                />
              </Col>
        </Row>
        <ProductTable
          rows={tableData}
          setRows={setTableData}
          setValue={setValue}
        />
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
            <Input type="number" className="form-control" value={cgstAmount} />
          </Col>
          <Col md="6">
            <label>SGST (%)</label>
            <input
              type="number"
              className="form-control"
              value={sgstPercentage}
              onChange={sgsthandlePercentage}
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
              {addPurchaseApi.loading && (
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

export default HKPurchase;
