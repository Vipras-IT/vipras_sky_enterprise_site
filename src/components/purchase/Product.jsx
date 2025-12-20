/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Row, Button } from 'react-bootstrap';
import { get, isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import { Option } from 'antd/es/mentions';
import { Select } from 'antd';
import { getErrorMessage } from '../../helpers/utils';
import productAPI from 'api/product';

function ProductTable({ rows, setRows }) {
  const [data, setData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedRate, setSelectedRate] = useState(0);

  const [purchaseRate, setPurchaseRate] = useState(0);
  const [productId, setProductId] = useState('');

  const [quantity, setQuantity] = useState(0);
  const [amount, setAmount] = useState(0);
  //const productArray = [selectedProduct,selectedSize,selectedRate,purchaseRate,quantity,amount];
  const calculateTotalAmount = () => {
    let total = 0;

    for (const row of rows) {
      total += row.amount;
    }

    return total;
  };
  const siteIdsOpt = data.map((product) => ({
    value: product.productId,
    label: product.productName,
  }));
  useEffect(() => {
    const fetchData = async () => {
     const response = await productAPI.getProductDetailsFilter({ type: 'STORE' });
    const errorMessage = getErrorMessage(response);
    if (errorMessage) {
      toast.error('Product not found!', {
        theme: 'colored',
      });
    } else {
      setData(get(response, 'data.data.items', []));
    }
    };
    fetchData();
  }, []);

  // const productOptions = data.map(product => product.productName);

  const sizeOptions =
    data.find((product) => product.productName === selectedProduct)?.size || [];

  useEffect(() => {
    const calculatedAmount = quantity * purchaseRate;
    setAmount(calculatedAmount);
  }, [quantity, purchaseRate]);

  const addRow = (event) => {
    event.preventDefault();
    if (isEmpty(selectedProduct) || quantity === 0) {
      toast.error('Please add product and  quantity', {
        theme: 'colored',
      });
    } else {
      const newRow = {
        // id: Math.random().toString(16).slice(2),
        productId: productId,
        name: selectedProduct,
        size: selectedSize,
        quantity: quantity,
        rate: selectedRate,
        // salesRate : purchaseRate,
        purchaseAmount: purchaseRate,
        amount: amount,
      };
      setRows([...rows, newRow]);

      // Clear the input fields for the next row
      setSelectedProduct('');
      setSelectedSize('');
      setQuantity(0);
      setAmount(0);
    }
  };

  const removeRow = (event, index) => {
    event.preventDefault();
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };

  const handleProductChange = (value, option) => {
    setProductId(value);
    setSelectedProduct(option.children);
    console.log(value);
    console.log(option.children);
  };

  return (
    <div className="App">
      <table className="table">
        <thead
          style={{
            fontWeight: 'bold',
            fontSize: '16px',
            backgroundColor: '#A91605',
            color: 'white',
          }}
        >
          <tr style={{ border: '1px solid #000' }}>
            <th style={{ border: '1px solid #000' }}>Product Name</th>
            <th style={{ border: '1px solid #000' }}>Size/Make</th>
            <th style={{ border: '1px solid #000' }}>Quantity</th>
            <th style={{ border: '1px solid #000' }}>Sales Rate</th>
            <th style={{ border: '1px solid #000' }}>Purchase Rate</th>
            <th style={{ border: '1px solid #000' }}>Amount</th>
            <th style={{ border: '1px solid #000' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #000' }}>
              {/* <select
                name="productName"
                value={selectedProduct}
                onChange={handleProductChange}
                // onChange={e => setSelectedProduct(e.target.value)
                // }
                className="form-select"
              >
                <option value="">Select Product</option>

                {data.map(product => (
                  <option key={product.productId} value={product.productName}>
                    {product.productName}
                  </option>
                ))}
              </select> */}
              <Select
                value={selectedProduct}
                showSearch
                placeholder="Select a Product"
                optionFilterProp="children"
                onChange={handleProductChange}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
                size="large"
                style={{
                  width: 300,
                }}
              >
                <Option value="">Select Product</Option>
                {siteIdsOpt.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </td>
            <td style={{ border: '1px solid #000' }}>
              {selectedProduct && sizeOptions.length > 0 && (
                <select
                  name="size"
                  value={selectedSize}
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="form-select"
                >
                  <option value="">Select Size</option>
                  {sizeOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </td>
            <td style={{ border: '1px solid #000' }}>
              <Row className="g-2 mb-3">
                <input
                  type="number"
                  name="quantity"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
              </Row>
            </td>

            <td style={{ border: '1px solid #000' }}>
              <Row className="g-2 mb-3">
                <input
                  type="number"
                  name="rate"
                  className="form-control"
                  value={selectedRate}
                  onChange={(e) => setSelectedRate(Number(e.target.value))}
                />
              </Row>
            </td>

            <td style={{ border: '1px solid #000' }}>
              <Row className="g-2 mb-3">
                <input
                  type="number"
                  name="Purchase rate"
                  className="form-control"
                  value={purchaseRate}
                  onChange={(e) => setPurchaseRate(Number(e.target.value))}
                />
              </Row>
            </td>
            <td style={{ border: '1px solid #000' }}>
              <Row className="g-2 mb-3">
                <input
                  type="number"
                  name="amount"
                  className="form-control"
                  value={amount}
                  readOnly
                />
              </Row>
            </td>
            <td style={{ border: '1px solid #000' }}>
              <Button onClick={addRow}>Add</Button>
            </td>
          </tr>
          {rows.map((row, index) => (
            <tr key={index} style={{ border: '1px solid #000' }}>
              <td style={{ border: '1px solid #000' }}>{row.name}</td>
              <td style={{ border: '1px solid #000' }}>{row.size}</td>
              <td style={{ border: '1px solid #000' }}>{row.quantity}</td>
              <td style={{ border: '1px solid #000' }}>{row.rate}</td>
              <td style={{ border: '1px solid #000' }}>{row.purchaseAmount}</td>
              {/* <td style={{ border: '1px solid #000' }}>{row.salesAmount}</td> */}
              <td style={{ border: '1px solid #000' }}>{row.amount}</td>
              <td style={{ border: '1px solid #000' }}>
                <Button onClick={(event) => removeRow(event, index)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h5>Total Amount: {calculateTotalAmount()}</h5>
    </div>
  );
}

export default ProductTable;
