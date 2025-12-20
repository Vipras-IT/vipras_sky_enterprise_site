/* eslint-disable react/prop-types */
import { useState } from 'react';
import { Row, Button } from 'react-bootstrap';
import { get, isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import { Select } from 'antd';

function Assets({ rows, setRows }) {
  const [itemName, setItemName] = useState('');
  const [purchaseRate, setPurchaseRate] = useState(0);
  // const [unitCode, setUnitCode] = useState('');
  const [location, setLocation] = useState('');

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
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
  const [unitCode, setUnitCode] = useState(get(siteIdsOpt[0], 'value', ''));
  const handleChangeSiteId = (value) => {
    const selectedOption = siteIdsOpt.find((option) => option.value === value);
    setUnitCode(selectedOption);
    console.log(selectedOption);
    console.log('Selected Value:', value);
    console.log('Label:', get(selectedOption, 'label'));
  };
  const calculateTotalAmount = () => {
    let total = 0;

    for (const row of rows) {
      total += row.purchaseRate;
    }

    return total;
  };

  const addRow = (event) => {
    event.preventDefault();
    if (isEmpty(itemName) || purchaseRate === 0) {
      toast.error('Please add Asset and  PurchaseRate', {
        theme: 'colored',
      });
    } else {
      const newRow = {
        id: Math.random().toString(16).slice(2),
        itemName: itemName,
        purchaseRate: purchaseRate,
        unitCode: unitCode.label,
        location: location,
      };
      setRows([...rows, newRow]);

      // Clear the input fields for the next row
      setItemName('');
      setPurchaseRate(0);
      setUnitCode('');
      setLocation('');
    }
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
            <th style={{ border: '1px solid #000' }}>Asset Name</th>
            <th style={{ border: '1px solid #000' }}>Purchase Rate</th>
            <th style={{ border: '1px solid #000' }}>UnitCode</th>
            <th style={{ border: '1px solid #000' }}>Location</th>
            <th style={{ border: '1px solid #000' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #000' }}>
              <Row className="g-2 mb-3">
                <input
                  type="text"
                  name="itemName"
                  className="form-control"
                  value={itemName}
                  onChange={(e) => setItemName(String(e.target.value))}
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
              {/* <select
                name="productName"
                value={unitCode}
                onChange={e => setUnitCode(e.target.value)}
                className="form-select"
              >
                <option value="">Select UnitCode</option>
                {siteIds.map(option => (
                  // eslint-disable-next-line react/jsx-key
                  <option value={option}>{option}</option>
                ))}
              </select> */}
              <Select
                defaultValue={unitCode}
                value={unitCode}
                showSearch
                placeholder="Select a Unit code"
                optionFilterProp="children"
                onChange={handleChangeSiteId}
                // onSearch={onSearch}
                filterOption={filterOption}
                options={siteIdsOpt}
                size="large"
                style={{
                  width: 330,
                }}
              />
            </td>
            <td style={{ border: '1px solid #000' }}>
              <Row className="g-2 mb-3">
                <input
                  type="text"
                  name="location"
                  className="form-control"
                  value={location}
                  onChange={(e) => setLocation(String(e.target.value))}
                />
              </Row>
            </td>
            <td style={{ border: '1px solid #000' }}>
              <Button onClick={addRow}>Add</Button>
            </td>
          </tr>
          {rows.map((row, index) => (
            <tr key={index} style={{ border: '1px solid #000' }}>
              <td style={{ border: '1px solid #000' }}>{row.itemName}</td>
              <td style={{ border: '1px solid #000' }}>{row.purchaseRate}</td>
              <td style={{ border: '1px solid #000' }}>{row.unitCode}</td>
              <td style={{ border: '1px solid #000' }}>{row.location}</td>
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

export default Assets;
