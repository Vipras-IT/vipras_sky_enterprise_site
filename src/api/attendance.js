import api from './api';

const getTodayAttendance = (siteId, date, month) => {
  return api.get(`/api/v1/employee-attendace/by/${siteId}/${date}/${month}`);
};

const addTodayAttendance = (data) =>
  api.post(`/api/v1/employee-attendace`, data);

const addTodayNewAttendance = (data) =>
  api.post(`/api/v1/employee-attendace/add`, data);

const updateAttendance = (data) =>
  api.post(`/api/v1/manualAttendace/${data.id}`, data);

const getAttendancedetails = (id) => {
  return api.get(`/api/v1/manualAttendace/${id}`);
};

const updateAttendanceByEmployee = (employeeNumber, data) =>
  api.post(`/api/v1/employee-attendace/update/${employeeNumber}`, data);

const getAttendanceReport = (siteId, month, year, filter) => {
  const serializedData = JSON.stringify(filter);
  if (filter) {
    return api.get(
      `/api/v1/employee-attendace/bySite/${siteId}/${month}/${year}?filter=${serializedData}`,
    );
  } else {
    return api.get(
      `/api/v1/employee-attendace/bySite/${siteId}/${month}/${year}`,
    );
  }

  // return api.get(
  //   `/api/v1/employee-attendace/bySite/${siteId}/${month}/${year}`,
  // );
};
const getAttendanceReportByEmployee = (siteId, month, year) => {
  return api.get(
    `/api/v1/employee-attendace/bySiteAttendance/${siteId}/${month}/${year}`,
  );
};
const getDailyBreakUp = (currentMonth, currentYear, currentSiteId) => {
  return api.get(
    `/api/v1/employee-attendace/siteAttendanceByRole/${currentSiteId}/${currentMonth}/${currentYear}`,
  );
};
const getSiteAttendanceReport = (month, year) => {
  return api.get(
    `/api/v1/employee-attendace/bySiteAttendance/${month}/${year}`,
  );
};

const EmployeeInfoData = (employeeId, currentmonth) => {
  const filter = { employeeIDNumber: employeeId, month: currentmonth };
  const serializedData = JSON.stringify(filter);
  return api.get(`/api/v1/salary?filter=${serializedData}`);
};

const getYourAttendanceReport = (employeeId, month, year) => {
  return api.get(
    `/api/v1/employee-attendace/byEmployee/${employeeId}/${month}/${year}`,
  );
};

const getAttendanceReportForAllSite = (date) => {
  return api.get(`/api/v1/employee-attendace/allSite/${date}`);
};

const getAttendanceReportForInvoice = (siteId, month, year) => {
  return api.get(
    `/api/v1/employee-attendace/byInvoice/${siteId}/${month}/${year}`,
  );
};

export default {
  getTodayAttendance,
  addTodayAttendance,
  addTodayNewAttendance,
  updateAttendanceByEmployee,
  getAttendanceReport,
  getAttendanceReportForAllSite,
  getYourAttendanceReport,
  updateAttendance,
  getAttendancedetails,
  getAttendanceReportForInvoice,
  getSiteAttendanceReport,
  getAttendanceReportByEmployee,
  getDailyBreakUp,
  EmployeeInfoData,
};
