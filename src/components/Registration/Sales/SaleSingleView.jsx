import { useState, useEffect } from 'react';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import saleAPI from 'api/deduction';
import useAPI from 'hooks/useApi';
import { useParams } from 'react-router-dom';
import { get, isEmpty } from 'lodash';
import { useAuth } from 'hooks/useAuth';
import SaleInfoview from './SaleInfoview';

const saleproduct = [
  {
    accessor: 'name',
    Header: 'Product Name',
    headerProps: { className: 'pe-1' },
  },
  // {
  //   accessor: 'size',
  //   Header: 'Product Size',
  //   headerProps: { className: 'pe-1' }
  // },
  {
    accessor: 'quantity',
    Header: 'Product Quantity',
    headerProps: { className: 'pe-1' },
  },
  {
    accessor: 'salesRate',
    Header: 'Product Rate',
    headerProps: { className: 'pe-1' },
  },
  {
    accessor: 'amount',
    Header: 'Product Amount',
    headerProps: { className: 'pe-1' },
  },
];

const SaleSingleView = () => {
  const params = useParams();
  const { user } = useAuth();
  const getSaleAPI = useAPI(saleAPI.getSaledetails);
  const [productData, setproductData] = useState([]);
  const [saleData, setsaleData] = useState({});

  useEffect(() => {
    if (!isEmpty(get(params, 'saleId'))) {
      getSaleAPI.request(params.saleId, get(user, 'token'));
    }
  }, [params.saleId]);

  useEffect(() => {
    if (getSaleAPI.data) {
      setsaleData(getSaleAPI.data.data);
      setproductData(get(getSaleAPI.data.data, 'products', []));
    }
  }, [getSaleAPI.data]);

  useEffect(() => {
    if (getSaleAPI.error) {
      setsaleData({});
    }
  }, [getSaleAPI.error]);

  return (
    <>
      <SaleInfoview saleData={saleData} />
      {!isEmpty(productData) && (
        <div className="mt-3 card ">
          <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-100 rounded-0">
            <div className="d-flex justify-content-between ">
              <h5 className="text-white">Sale Product details</h5>
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

export default SaleSingleView;
