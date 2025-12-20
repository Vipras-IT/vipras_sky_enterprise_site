import { get } from 'lodash';
import axios from './api';
// import { get } from 'lodash';

const addResume = (data) => axios.post(`/api/v1/resume`, data);

const addLiability = (data) => axios.post(`/api/v1/liability`, data);


const deleteLiability = (id) => axios.delete(`/api/v1/liability/${id}`);


const fetchResume = async (page, pageSize, pageFilter) => {
    const offset = page + 1;
    const defaultFilter = { from: null, to: null };
    const serializedData = JSON.stringify(defaultFilter);
    let url = `/api/v1/resume?filter=${serializedData}&page=${offset}&limit=${pageSize}`;

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
        url = `/api/v1/resume?filter=${serializedData}`;
    }

    try {
        const response = await axios.get(url);
        const results = get(response, 'data.data.items', []) || [];
        const hasError = get(response, 'data.success');
        const data = {
            results: results,
            count: get(response, 'data.data.totalItems'),
            hasError,
        };
        return data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};



const getFaceAttendance = async (page, pageSize, pageFilter) => {

    let url = `api/v1/employee-face-attendace`;

    try {
        const response = await axios.get(url);
        const results = get(response, 'data.data.items', []) || [];
        const hasError = get(response, 'data.success');
        const data = {
            results: results,
            count: get(response, 'data.data.totalItems'),
            hasError,
        };
        return data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};


const fetchLiability = async (page, pageSize, pageFilter) => {
    const offset = page + 1;
    const defaultFilter = { from: null, to: null };
    const serializedData = JSON.stringify(defaultFilter);
    let url = `/api/v1/liability?filter=${serializedData}&page=${offset}&limit=${pageSize}`;

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
        url = `/api/v1/liability?filter=${serializedData}`;
    }

    try {
        const response = await axios.get(url);
        const results = get(response, 'data.data.items', []) || [];
        const hasError = get(response, 'data.success');
        const data = {
            results: results,
            count: get(response, 'data.data.totalItems'),
            hasError,
        };
        return data;
    } catch (e) {
        throw new Error(`API error:${e?.message}`);
    }
};

export default {
    addResume,
    addLiability,
    fetchResume,
    fetchLiability,
    deleteLiability,
    getFaceAttendance,
};