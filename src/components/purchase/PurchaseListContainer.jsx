import { Tabs } from 'antd';
import { QueryClientProvider, QueryClient } from 'react-query';
import StorePurchaseList from 'components/purchase/StorePurchaseList';
import AssetPurchaseList from 'components/purchase/AssetPurchaseList';
import HKPurchaseList from 'components/purchase/HKPurchaseList';
import PropTypes from 'prop-types';
const queryClient = new QueryClient();

const items = [
  {
    key: '1',
    label: 'Store Purchase',
    children: (
      <QueryClientProvider client={queryClient}>
        <StorePurchaseList />
      </QueryClientProvider>
    ),
  },
  {
    key: '2',
    label: 'Asset Purchase',
    path: '/assetPurchaseList',
    children: (
      <QueryClientProvider client={queryClient}>
        <AssetPurchaseList />
      </QueryClientProvider>
    ),
  },
  {
    key: '3',
    label: 'Consumable Purchase',
    children: (
      <QueryClientProvider client={queryClient}>
        <HKPurchaseList />
      </QueryClientProvider>
    ),
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
