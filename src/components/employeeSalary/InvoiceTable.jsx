/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Row, Button } from 'react-bootstrap';

function InvoiceTable({ rows, setRows }) {
  const [rate, setRate] = useState(0);
  const [qty, setQty] = useState(0);
  const [totalDutys, setTotalDuty] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [role, setRole] = useState('');

  const calculateTotalAmount = () => {
    let total = 0;
    for (const row of rows) {
      total += row.totalAmount;
    }
    return total;
  };

  useEffect(() => {
    const calculatedAmount = qty * rate;
    setTotalAmount(calculatedAmount);
  }, [qty, rate]);

  const addRow = (event) => {
    event.preventDefault();
    const newRow = {
      role: role,
      totalDuty: totalDutys,
      qty: qty,
      rate: rate,
      totalAmount: totalAmount,
      // totalDuty: totalDuty
    };
    setRows([...rows, newRow]);
    setQty(0);
    setTotalDuty(0);
    setTotalAmount(0);
    setRate(0);
    setRole('');
  };

  const removeRow = (event, index) => {
    event.preventDefault();
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
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
            <th style={{ border: '1px solid #000' }}>Name</th>
            <th style={{ border: '1px solid #000' }}>No.of Duty</th>
            <th style={{ border: '1px solid #000' }}>Quantity</th>
            <th style={{ border: '1px solid #000' }}>Rate</th>
            <th style={{ border: '1px solid #000' }}>Amount</th>
            <th style={{ border: '1px solid #000' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #000' }}>
              <input
                type="text"
                name="name"
                className="form-control"
                value={role}
                onChange={(e) => setRole(String(e.target.value))}
              />
            </td>
            <td style={{ border: '1px solid #000' }}>
              <Row className="g-2 mb-3">
                <input
                  type="number"
                  name="totalDuty"
                  className="form-control"
                  value={totalDutys}
                  onChange={(e) => setTotalDuty(Number(e.target.value))}
                />
              </Row>
            </td>
            <td style={{ border: '1px solid #000' }}>
              <Row className="g-2 mb-3">
                <input
                  type="number"
                  name="quantity"
                  className="form-control"
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                />
              </Row>
            </td>
            <td style={{ border: '1px solid #000' }}>
              <Row className="g-2 mb-3">
                <input
                  type="number"
                  name="Purchase rate"
                  className="form-control"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                />
              </Row>
            </td>
            <td style={{ border: '1px solid #000' }}>
              <Row className="g-2 mb-3">
                <input
                  type="number"
                  name="amount"
                  className="form-control"
                  value={totalAmount}
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
              <td style={{ border: '1px solid #000' }}>{row.role}</td>
              <td style={{ border: '1px solid #000' }}>{row.totalDuty}</td>
              <td style={{ border: '1px solid #000' }}>{row.qty}</td>
              <td style={{ border: '1px solid #000' }}>{row.rate}</td>
              <td style={{ border: '1px solid #000' }}>{row.totalAmount}</td>
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

export default InvoiceTable;
