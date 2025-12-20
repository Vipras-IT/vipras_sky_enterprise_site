import { useState, useEffect } from 'react';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import storepurchaseAPI from 'api/purchase';
import useAPI from 'hooks/useApi';
import { useParams } from 'react-router-dom';
import { get, isEmpty } from 'lodash';
import { useAuth } from 'hooks/useAuth';
import StorePurchaseInfoview from './StorePurchaseInfoview';

const saleproduct = [
  {
    accessor: 'name',
    Header: 'Product Name',
    headerProps: { className: 'pe-1' },
  },
  {
    accessor: 'size',
    Header: 'Product Size',
    headerProps: { className: 'pe-1' },
  },
  {
    accessor: 'quantity',
    Header: 'Product Quantity',
    headerProps: { className: 'pe-1' },
  },
  {
    accessor: 'purchaseRate',
    Header: 'Purchase Rate',
    headerProps: { className: 'pe-1' },
  },
  {
    accessor: 'salesRate',
    Header: 'Sales Rate',
    headerProps: { className: 'pe-1' },
  },
  {
    accessor: 'amount',
    Header: 'Amount',
    headerProps: { className: 'pe-1' },
  },
];

const StorePurchaseSingleView = () => {
  const params = useParams();
  const { user } = useAuth();
  const getStorePurchaseAPI = useAPI(storepurchaseAPI.getpurchasedetailsbyid);
  const [productData, setproductData] = useState([]);
  const [storePurchaseData, setStorePurchaseData] = useState({});

  useEffect(() => {
    if (!isEmpty(get(params, 'id'))) {
      getStorePurchaseAPI.request(params.id, get(user, 'token'));
    }
  }, [params.id]);

  useEffect(() => {
    if (getStorePurchaseAPI.data) {
      setStorePurchaseData(getStorePurchaseAPI.data.data);
      setproductData(get(getStorePurchaseAPI.data.data, 'products', []));
    }
  }, [getStorePurchaseAPI.data]);

  useEffect(() => {
    if (getStorePurchaseAPI.error) {
      setStorePurchaseData({});
    }
  }, [getStorePurchaseAPI.error]);

  return (
    <>
      <StorePurchaseInfoview storePurchaseData={storePurchaseData} />
      {!isEmpty(productData) && (
        <div className="mt-3 card ">
          <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-100 rounded-0">
            <div className="d-flex justify-content-between ">
              <h5 className="text-white">Store Product details</h5>
            </div>
          </div>
          <AdvanceTableWrapper
            columns={saleproduct}
            data={productData}
            sortable
            pagination
            perPage={50}
            rowCount={productData.length}
          >
            <AdvanceTable
              table
              headerClassName="bg-200 text-900 text-nowrap align-middle"
              rowClassName="btn-reveal-trigger text-nowrap align-middle"
              tableProps={{
                bordered: true,
                striped: true,
                className: 'fs--1 mb-0 overflow-hidden',
              }}
            />
          </AdvanceTableWrapper>
        </div>
      )}
    </>
  );
};

export default StorePurchaseSingleView;
