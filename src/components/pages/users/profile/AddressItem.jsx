/* eslint-disable react/prop-types */
import Avatar from 'components/common/Avatar';
import Flex from 'components/common/Flex';
import VerifiedBadge from 'components/common/VerifiedBadge';
import logoaddress from 'assets/map-marker.png';

import { Link } from 'react-router-dom';

export const AddressItem = ({ details, isLast, index }) => {
  const { address, district, pincode, state, verified, contactNumber } =
    details;

  const addressName = index === 0 ? 'Permanent Address' : 'Local Address';
  return (
    <Flex>
      <Link to="#!">
        <Avatar size="3xl" src={logoaddress} width={56} />
      </Link>
      <div className="flex-1 position-relative ps-3">
        <h6 className="fs-0 mb-0">
          <Link to="#!">{addressName}</Link>
          {verified && <VerifiedBadge />}
        </h6>
        <p className="mb-1">{address}</p>
        <p className="text-1000 mb-0">{district}</p>
        <p className="text-1000 mb-0">
          {state} - {pincode}
        </p>
        <p className="text-1000 mb-0">{contactNumber}</p>
        {!isLast && <div className="border-dashed border-bottom my-3"></div>}
      </div>
    </Flex>
  );
};

export default AddressItem;
