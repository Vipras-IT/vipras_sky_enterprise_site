/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import AdvanceTable from 'components/common/advance-table/AdvanceTable';
import AdvanceTableWrapper from 'components/common/advance-table/AdvanceTableWrapper';
import otherDeductionsAPI from 'api/otherDeductions';
import useAPI from 'hooks/useApi';
import { useNavigate, useParams } from 'react-router-dom';
import { get, isEmpty } from 'lodash';
import { useAuth } from 'hooks/useAuth';
import OtherDeductionsInfoview from './OtherDeductionsInfoview';
import { toast } from 'react-toastify';

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

const OtherDeductionsSingleView = () => {
  const params = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const getotherDeductionsAPI = useAPI(
    otherDeductionsAPI.getOtherDeductuiondetails,
  );
  const [productData, setproductData] = useState([]);
  const [storePurchaseData, setStorePurchaseData] = useState({});

  useEffect(() => {
    if (!isEmpty(get(params, 'id'))) {
      getotherDeductionsAPI.request(params.id);
    }
  }, [params.id]);

  const handleDeleteClick = () => {
    otherDeductionsAPI
      .deleteOtherDeductuion(get(params, 'id'))
      .then((response) => {
        toast.success('other Deduction Deleted successfully', {
          theme: 'colored',
        });
        navigate('/other-deductions-list', { replace: true });
      })
      .catch((e) => {
        toast.error('other Deduction Deleted faild', {
          theme: 'colored',
        });
      });
  };

  useEffect(() => {
    if (getotherDeductionsAPI.data) {
      setStorePurchaseData(getotherDeductionsAPI.data.data);
      setproductData(get(getotherDeductionsAPI.data.data, 'products', []));
    }
  }, [getotherDeductionsAPI.data]);

  useEffect(() => {
    if (getotherDeductionsAPI.error) {
      setStorePurchaseData({});
    }
  }, [getotherDeductionsAPI.error]);

  return (
    <>
      <OtherDeductionsInfoview
        storePurchaseData={storePurchaseData}
        onDelete={handleDeleteClick}
      />
      {!isEmpty(productData) && (
        <div className="mt-3 card ">
          <div className="bg-danger card-header notification border-x-0 border-bottom-0 border-100 rounded-0">
            <div className="d-flex justify-content-between ">
              <h5 className="text-white">Other Deductions details</h5>
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

export default OtherDeductionsSingleView;
