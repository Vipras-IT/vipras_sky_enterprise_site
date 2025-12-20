/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Row, Button } from 'react-bootstrap';
import { Option } from 'antd/es/mentions';
import { Select } from 'antd';

function ProductTable({ rows, setRows, serviceTypes }) {
  const [selectedServicetype, setSelectedServicetype] = useState('');
  const [selectedRate, setSelectedRate] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [takeHomeRate, setTakeHomeRate] = useState(0);
  const [currentServicetype, setCurrentServicetype] = useState({});

  //console.log('manPowerList', manPowerList);
  //console.log('serviceTypes', serviceTypes);
  // const productOptions = setManPowerList?.map(product => ({
  //   value: product.serviceName,
  //   label: product.serviceName
  // }));

  // useEffect(() => {
  //   if (!isEmpty(setManPowerList) && !isEmpty(selectedProduct)) {
  //     const currentSelectedProduct = setManPowerList.find(
  //       prod => selectedProduct === get(prod, 'serviceName', '')
  //     );
  //     setSelectedRate(get(currentSelectedProduct, 'salesRate', 0));
  //     setCurrentProduct(currentSelectedProduct);
  //   }
  // }, [selectedProduct]);

  const addRow = () => {
    // console.log('selectedProduct', selectedProduct);
    console.log('currentServicetype', selectedServicetype);
    const newRow = {
      id: Math.random().toString(16).slice(2),
      name: selectedServicetype,
      noOfDuties: quantity,
      fixedSalary: selectedRate,
      takeHomeRate: takeHomeRate,
    };
    setRows([...rows, newRow]);
    setSelectedServicetype('');
    setSelectedRate(0);
    setQuantity(0);
    setCurrentServicetype({});
  };

  const removeRow = (event, index) => {
    event.preventDefault();
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
  };
  const handleProductChange = (value) => {
    setSelectedServicetype(value);
    setCurrentServicetype(value);
    console.log(value);
    console.log('currentServicetype', currentServicetype);
  };
  const roleDegination = window.localStorage.getItem('role');
  const roles = roleDegination ? JSON.parse(roleDegination) : [];
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
            <th style={{ border: '1px solid #000' }}>Service Name</th>
            <th style={{ border: '1px solid #000' }}>Head Count</th>
            <th style={{ border: '1px solid #000' }}>Rate</th>
            <th style={{ border: '1px solid #000' }}>Take Home</th>
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
                value={selectedServicetype}
                showSearch
                placeholder="Select a Product"
                onChange={handleProductChange}
                size="large"
                style={{
                  width: 300,
                }}
              >
                <Option value="">Select Designation</Option>
                {roles.map((option) => (
                  <Option key={option} value={option}>
                    {option}
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
                  onChange={(e) => setSelectedRate(Number(e.target.value))}
                />
              </Row>
            </td>
            <td style={{ border: '1px solid #000' }}>
              <Row className="g-2 mb-3">
                <input
                  type="number"
                  name="takeHomeRate"
                  className="form-control"
                  value={takeHomeRate}
                  onChange={(e) => setTakeHomeRate(Number(e.target.value))}
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
              <td style={{ border: '1px solid #000' }}>{row.noOfDuties}</td>
              <td style={{ border: '1px solid #000' }}>{row.fixedSalary}</td>
              <td style={{ border: '1px solid #000' }}>{row.takeHomeRate}</td>
              <td style={{ border: '1px solid #000' }}>
                <Button onClick={(event) => removeRow(event, index)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* <h5>Total Amount: {calculateTotalAmount()}</h5> */}
    </div>
  );
}

export default ProductTable;
