import { Tabs } from 'antd';
import PropTypes from 'prop-types';
import ViprasMartProfitAndLossReport from './ViprasMartProfitAndLossReport';
import ViprasPestControlProfitAndLoss from './ViprasPestControlProfitAndLoss';
import ViprasLaundryProfitAndLossReport from './ViprasLaundryProfitAndLossReport';
import ViprasCleaningProfitAndLossReport from './ViprasCleaningProfitAndLossReport';
// import HkConsumableComparision from './HkConsumableComparision';
// import OverHeadCalculation from './OverHeadCalculation';
import GarbageProfitAndLossReport from './GarbageProfitAndLossReport';
// import DepartmentComparison from './DepartmentComparison';
import ManpowerComparison from './ManpowerComparison';
import IfmsComparison from './IfmsComparison';
import SecurityComparison from './SecurityComparison';
import HouseKeepingComparison from './HouseKeepingComparison';
// import AdminComparison from './AdminComparison';

const items = [
  {
    key: '1',
    label: 'IFMS',
    children: <IfmsComparison />,
  },
  {
    key: '2',
    label: 'SECURITY',
    children: <SecurityComparison />,
  },
  {
    key: '3',
    label: 'HOUSE KEEPING',
    children: <HouseKeepingComparison />,
  },
  {
    key: '4',
    label: 'MAN POWER',
    children: <ManpowerComparison />,
  },
  {
    key: '5',
    label: 'DEEP CLEANING',
    children: <ViprasCleaningProfitAndLossReport />,
  },
  {
    key: '6',
    label: 'V MART',
    children: <ViprasMartProfitAndLossReport />,
  },
  {
    key: '7',
    label: 'PEST CONTROL',
    children: <ViprasPestControlProfitAndLoss />,
  },
  {
    key: '8',
    label: 'LAUNDRY',
    children: <ViprasLaundryProfitAndLossReport />,
  },
  {
    key: '9',
    label: 'GARBAGE DISPOSAL',
    children: <GarbageProfitAndLossReport />,
  },
];
const ProfitAndLossContainer = ({ activeKey }) => {
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
ProfitAndLossContainer.propTypes = {
  activeKey: PropTypes.string.isRequired,
};
export default ProfitAndLossContainer;
