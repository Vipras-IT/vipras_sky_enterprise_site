/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Row, Button } from 'react-bootstrap';
import { isEmpty, get } from 'lodash';
import { toast } from 'react-toastify';
import { Option } from 'antd/es/mentions';
import { Select } from 'antd';

function ProductTable({ rows, setRows, productData }) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedRate, setSelectedRate] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [amount, setAmount] = useState(0);
  const [currentProduct, setCurrentProduct] = useState({});

  const calculateTotalAmount = () => {
    let total = 0;

    for (const row of rows) {
      total += row.amount;
    }

    return total;
  };

  const productOptions = productData?.map((product) => ({
    value: product.productId,
    label: product.productName,
  }));

  useEffect(() => {
    if (!isEmpty(productData) && !isEmpty(selectedProduct)) {
      const currentSelectedProduct = productData.find(
        (prod) => selectedProduct === get(prod, 'productId', ''),
      );
      setSelectedRate(get(currentSelectedProduct, 'salesRate', 0));
      setCurrentProduct(currentSelectedProduct);
    }
  }, [selectedProduct]);

  useEffect(() => {
    const calculatedAmount = quantity * selectedRate;
    setAmount(calculatedAmount);
  }, [quantity, selectedRate]);

  const addRow = (event) => {
    event.preventDefault();
    if (isEmpty(selectedProduct) || quantity === 0) {
      toast.error('Please add product and  quantity', {
        theme: 'colored',
      });
    } else if (get(currentProduct, 'availableQuantity', 0) < quantity) {
      toast.error(
        `Available quantity:${get(
          currentProduct,
          'availableQuantity',
          0,
        )}, but you selected more!`,
        {
          theme: 'colored',
        },
      );
    } else {
      console.log('selectedProduct', selectedProduct);
      console.log('currentProduct', currentProduct.productName);
      const newRow = {
        id: Math.random().toString(16).slice(2),
        productId: selectedProduct,
        name: currentProduct.productName,
        quantity: quantity,
        salesRate: selectedRate,
        amount: amount,
      };
      setRows([...rows, newRow]);
      // Clear the input fields for the next row
      setSelectedProduct('');
      setSelectedRate(0);
      setQuantity(0);
      setAmount(0);
      setCurrentProduct({});
    }
  };

  const removeRow = (event, index) => {
    event.preventDefault();
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };
  const handleProductChange = (value, option) => {
    setSelectedProduct(value);
    setCurrentProduct(option.children);
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
            <th style={{ border: '1px solid #000' }}>Quantity</th>
            <th style={{ border: '1px solid #000' }}>Rate</th>
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
                onChange={e => setSelectedProduct(e.target.value)}
                className="form-select"
              >
                <option value="">Select Product</option>
                {productOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
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
                {productOptions.map((option) => (
                  <Option key={option.label} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
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
                  readOnly
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
              <td style={{ border: '1px solid #000' }}>{row.quantity}</td>
              <td style={{ border: '1px solid #000' }}>{row.salesRate}</td>
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
