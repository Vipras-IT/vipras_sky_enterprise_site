import axios from './api';
import { get } from 'lodash';
import { calculateGrandTotalAmount, formattedAmount } from 'helpers/utils';

const AddSubContractorTransaction = (data) =>
  axios.post(`/api/v1/subcontractor`, data);

const getSubTransdetails = (subId) => {
  return axios.get(`/api/v1/subcontractor/${subId}`);
};

const getSubContractorReport = (month, year) => {
  return axios.get(
    `/api/v1/impresttransaction/subcontractor/report/${month}/${year}`,
  );
};

const getSubContractorReportTemp = (month, year) => {
  return axios.get(
    `/api/v1/impresttransaction/subcontractor/report/temp/${month}/${year}`,
  );
};

const updateSubTransdetails = (data) =>
  axios.post(`/api/v1/subcontractor/${data.id}`, data);

const fetchSubContractorTransactionData = async (
  page,
  pageSize,
  pageFilter,
) => {
  const offset = page + 1;
  let defaultFilter = {
    from: null,
    to: null,
  };

  const serializedData = JSON.stringify(defaultFilter);
  let url = `/api/v1/subcontractor?filter=${serializedData}&page=${offset}&limit=${pageSize}`;

  // if (trim(pageFilter.key).length > 1) {
  //   const filter = { [`${pageFilter.key}`]: pageFilter.value };
  //   const serializedData = JSON.stringify(filter);
  //   url = `/api/v1/subcontractor?filter=${serializedData}`;
  // }

  if (
    (pageFilter.from && pageFilter.from !== null) ||
    (pageFilter.to && pageFilter.to !== null) ||
    pageFilter.value.trim().length > 1
  ) {
    let filter = {
      from: pageFilter.from,
      to: pageFilter.to,
    };
    if (pageFilter.value.trim().length > 1) {
      filter = { ...filter, [`${pageFilter.key}`]: pageFilter.value };
    }
    const serializedData = JSON.stringify(filter);
    url = `/api/v1/subcontractor?filter=${serializedData}`;
  }

  try {
    const response = await axios.get(url);
    const results = get(response, 'data.data.items', []) || [];

    const defaultDate = 'TOTAL';
    const receivedDate = 'receivedDate';
    // Prepare final total data with the 'TOTAL' row
    const finalTotal = [...results];
    finalTotal.push({
      date: defaultDate,
      receivedDate: receivedDate,
      totalAmount: formattedAmount(
        calculateGrandTotalAmount(results, 'totalAmount') || 0,
      ),
      receivedAmount: formattedAmount(
        calculateGrandTotalAmount(results, 'receivedAmount') || 0,
      ),
      tdsAmount: formattedAmount(
        calculateGrandTotalAmount(results, 'tdsAmount') || 0,
      ),
      otherDeduction: formattedAmount(
        calculateGrandTotalAmount(results, 'otherDeduction') || 0,
      ),
      handOverToMD: formattedAmount(
        calculateGrandTotalAmount(results, 'handOverToMD') || 0,
      ),
      imprestByMyself: formattedAmount(
        calculateGrandTotalAmount(results, 'imprestByMyself') || 0,
      ),
    });

    const hasError = get(response, 'data.success');

    const data = {
      results: finalTotal,
      count: get(response, 'data.data.totalItems'),
      hasError,
    };
    return data;
  } catch (e) {
    throw new Error(`API error:${e?.message}`);
  }
};

export default {
  AddSubContractorTransaction,
  fetchSubContractorTransactionData,
  getSubTransdetails,
  updateSubTransdetails,
  getSubContractorReport,
  getSubContractorReportTemp
};
