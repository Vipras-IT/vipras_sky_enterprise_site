import api from "./api";
import { get } from "lodash";
const updateLeave = (id, data) =>
    api.post(`/api/v1/leaveManagement/${id}`, data);

const deleteLeave = (id) =>
    api.delete(`/api/v1/leaveManagement/${id}`);

export const getEmployeeLeaveData = async (page, pageSize, pageFilter, siteId) => {
    // console.log("getEmployeeLeaveData called", { page, pageSize, pageFilter, siteId });
    const offset = page + 1;
    let filter = {};

    if (siteId && siteId !== "ALL") {
        if (Array.isArray(siteId) && siteId.length > 0 && siteId[0] !== 'ALL') {
            filter['siteCode'] = { $in: siteId };
        } else if (!Array.isArray(siteId) && siteId !== 'ALL') {
            filter['siteCode'] = siteId;
        }
    }

    if (pageFilter && pageFilter.key && pageFilter.value) {
        if (pageFilter.key === 'isActive') {
            filter[pageFilter.key] = pageFilter.value;
        } else {
            filter[pageFilter.key] = pageFilter.value;
        }
    }
    const url = `/api/v1/leaveManagement`;

    try {
        const response = await api.get(url, {
            params: {
                page: offset,
                limit: pageSize,
                filter: filter
            }
        });

        const results = get(response, 'data.data.items', []) || [];
        const hasError = get(response, 'data.success');

        const data = {
            results: results,
            count: get(response, 'data.data.totalItems'),
            hasError,
        };
        return data;
    } catch (e) {
        console.error("API Error", e);
        return { results: [], count: 0, hasError: true };
    }
};

export default {
    updateLeave,
    deleteLeave,
    getEmployeeLeaveData
}