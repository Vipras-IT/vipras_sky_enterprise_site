/* eslint-disable react/prop-types */

import FalconCardHeader from 'components/common/FalconCardHeader';
import { Card } from 'react-bootstrap';
import AddressItem from './AddressItem';
import { get, isEmpty } from 'lodash';

const AddressView = ({ employeeData }) => {
  const addressDetails = [];
  addressDetails.push(get(employeeData, 'permanentAddress', {}));
  addressDetails.push(get(employeeData, 'localAddress', {}));
  return (
    <Card className="mb-3">
      <FalconCardHeader title="Address Details" light />
      <Card.Body className="fs--1">
        {!isEmpty(addressDetails) &&
          addressDetails.map((item, index) => (
            <AddressItem
              key={item.id}
              details={item}
              index={index}
              isLast={index === addressDetails.length - 1}
            />
          ))}
      </Card.Body>
    </Card>
  );
};

export default AddressView;
