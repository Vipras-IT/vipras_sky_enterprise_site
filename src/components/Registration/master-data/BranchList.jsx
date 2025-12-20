import { useEffect, useState } from 'react';
import { Spin, Table } from 'antd';
import { toast } from 'react-toastify';
import { getBranchDetails } from '../../../api/branch';
import { get } from 'lodash';

const columns = [
  {
    title: 'Country Name',
    dataIndex: 'country',
    key: 'country',
  },
  {
    title: 'State Name',
    dataIndex: 'state',
    key: 'state',
  },
  {
    title: 'City Name',
    dataIndex: 'city',
    key: 'city',
  },
  {
    title: 'Branch Name',
    dataIndex: 'branchCode',
    key: 'branchCode',
  },
];

export default function BranchList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBranches = async () => {
    try {
      const response = await getBranchDetails();
      const branches = get(response, 'data.data.items', []);

      const formattedData = branches.map((item, index) => ({
        ...item,
        key: item.id || index,
      }));

      setData(formattedData);
    } catch (error) {
      toast.error('Failed to fetch branch data',{error});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <div>
      {loading ? <Spin /> : <Table columns={columns} dataSource={data} />}
    </div>
  );
}
