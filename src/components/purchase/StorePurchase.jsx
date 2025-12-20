import { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'hooks/useAuth';
import useAPI from 'hooks/useApi';
import purchaseAPI from 'api/purchase';
import { toast } from 'react-toastify';
import { get, isEmpty } from 'lodash';
import ProductTable from 'components/purchase/Product';
import { Input, Select } from 'antd';
import vendorAPI from 'api/vendor';
import { useParams } from 'react-router-dom';

const StorePurchase = () => {
  const { user } = useAuth();
  const params = useParams();
  const [siteIdsOptions, setSiteIdsOptions] = useState([]);
  const navigate = useNavigate();
  const addpurchaseAPI = useAPI(purchaseAPI.Addpurchase);
  const updatepurchaseAPI = useAPI(purchaseAPI.updatepurchasedetails);
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
    if (
      get(addpurchaseAPI, 'data.success') &&
      !isEmpty(get(addpurchaseAPI, 'data.data'))
    ) {
      toast.success('Purchase List added successfully', {
        theme: 'colored',
      });
      navigate('/purchasedetails', { replace: true });
    } else if (get(addpurchaseAPI, 'data.message')) {
      toast.error(
        `Purchase List added failed: ${addpurchaseAPI.data.message}`,
        {
          theme: 'colored',
        },
      );
    }
  }, [addpurchaseAPI.data]);

  useEffect(() => {
    if (addpurchaseAPI.error) {
      toast.error('Purchase List added failed', {
        theme: 'colored',
      });
    }
  }, [addpurchaseAPI.error]);

  useEffect(() => {
    if (updatepurchaseAPI.data) {
      if (
        get(updatepurchaseAPI, 'data.success') &&
        !isEmpty(get(updatepurchaseAPI, 'data.data'))
      ) {
        toast.success('purchase updated successfully', {
          theme: 'colored',
        });
        navigate('/purchasedetails', { replace: true });
      } else {
        toast.error('purchase updation failed', {
          theme: 'colored',
        });
      }
    }
  }, [updatepurchaseAPI.data]);
  useEffect(() => {
    if (!isEmpty(get(params, 'id'))) {
      getpurchaseAPI.request(params.id, get(user, 'token'));
    }
  }, [params.id]);

  const calculateFinalAmount = () => {
    const totalAmount = calculateTotalAmount();
    const totalAmount1 = totalAmount + sgstAmount + igstAmount + cgstAmount;
    return Math.round(totalAmount1);
  };
  const [newVendorOption, setNewVendorOption] = useState({});
  useEffect(() => {
    if (getpurchaseAPI.data) {
      if (!isEmpty(get(params, 'id'))) {
        reset(getpurchaseAPI.data);
        const vendorNames = get(getpurchaseAPI.data.data, 'vendorName', '');
        const vendorNameId = get(getpurchaseAPI.data.data, 'vendorCode', '');
        setNewVendorOption({
          value: vendorNameId,
          label: `${vendorNameId} - ${vendorNames}`,
        });
        setSiteIdsOptions([newVendorOption]);

        setCgstPercentage(get(getpurchaseAPI.data.data, 'cGSTPercentage', []));
        setCgstAmount(get(getpurchaseAPI.data.data, 'cGSTAmount', []));
        setsgstPercentage(get(getpurchaseAPI.data.data, 'sGSTPercentage', []));
        setsgstAmount(get(getpurchaseAPI.data.data, 'sGSTAmount', []));
        setIgstPercentage(get(getpurchaseAPI.data.data, 'iGSTPercentage', []));
        setIgstAmount(get(getpurchaseAPI.data.data, 'iGSTAmount', []));
        setInvoiceNo(get(getpurchaseAPI.data.data, 'invoiceNo', []));
        setVendorId(get(getpurchaseAPI.data.data, 'vendorCode', []));
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
  }, [getpurchaseAPI.data]);

  useEffect(() => {
    setSiteIdsOptions([newVendorOption]);
  }, [vendorId, vendorName]);

  const onSearch = (value) => {
    if (value) {
      getVendordetailsAPI.request(value, get(user, 'token'));
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
    console.log(cgstAmount);
    setCgstAmount(cgstAmount);
  };

  const igsthandlePercentage = (e) => {
    setIgstPercentage(e.target.value);
    const igstAmount = getPercentage(e.target.value);
    console.log(igstAmount);
    setIgstAmount(igstAmount);
  };

  const sgsthandlePercentage = (e) => {
    setsgstPercentage(e.target.value);
    const sgstAmount = getPercentage(e.target.value);
    console.log(sgstAmount);
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
    if (total !== 0) {
      const finalAmount = (total / 100) * percentage;
      return Math.round(finalAmount);
    } else {
      // toast.error(`Please add one purchases`, {
      //   theme: 'colored'
      // });
    }
  };

  const { handleSubmit, setValue } = useForm();

  const onSubmitData = async (data) => {
    if (tableData.length > 0) {
      const userData = JSON.parse(localStorage.getItem('user'));
      const postData = {
        ...data,
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
        purchaseType: 'STORE',
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
      //await addpurchaseAPI.request(postData, get(user, 'token'));
      if (!isEmpty(get(params, 'id'))) {
        delete postData.createdOn;
        delete postData.updatedOn;
        const assetIdString = params.id;
        const updatedData = { ...postData, id: assetIdString };
        updatepurchaseAPI.request(updatedData, get(user, 'token'));
      } else {
        addpurchaseAPI.request(postData, get(user, 'token')).catch((error) => {
          console.error('Error fetching data:', error);
        });
      }
    } else {
      toast.error('Please add one product', {
        theme: 'colored',
      });
    }
  };
  // const { Search } = Input;
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
            <br />
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
      </Card.Body>
      <Card.Footer>
        <Row className="g-2 mb-3">
          <Col md={4}></Col>
          <Col md={4}>
            <Button type="submit" color="primary" className="mt-3 w-100">
              {addpurchaseAPI.loading && (
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

export default StorePurchase;
