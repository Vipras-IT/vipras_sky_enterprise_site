import { Tabs } from 'antd';
import StorePurchase from 'components/purchase/StorePurchase';
import AssetPurchase from 'components/purchase/AssetPurchase';
import HKPurchase from 'components/purchase/HKPurchase';
//import { propTypes } from 'react-bootstrap/esm/Image';
import PropTypes from 'prop-types';
const items = [
  {
    key: '1',
    label: 'Store Purchase',
    children: <StorePurchase />,
  },
  {
    key: '2',
    label: 'Asset Purchase',
    children: <AssetPurchase />,
  },
  {
    key: '3',
    label: 'Consumable Purchase',
    children: <HKPurchase />,
  },
];
const PurchaseContainer = ({ activeKey }) => {
  return (
    <div>
      <Tabs defaultActiveKey={activeKey} type="card" size="large" items={items}>
        {items.map((item) => (
          <Tabs.TabPane key={item.key} tab={item.label}>
            {item.children}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};
PurchaseContainer.propTypes = {
  activeKey: PropTypes.string.isRequired,
};
export default PurchaseContainer;
