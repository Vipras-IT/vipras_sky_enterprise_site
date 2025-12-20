/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import reportAPI from 'api/reportGenerate';
import salaryApi from 'api/salary';
import { get } from 'lodash';
import { toast } from 'react-toastify';
import ReportsBySite from './ReportsBySite';
import Loading from './Loading';
// import { Select } from "antd";
import { monthNames, disableFutureDates } from 'helpers/utils';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';

const GeneratedReportsBySiteContainer = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const todayDate = new Date();
  // const monthNameList = getMonthNamesNew(todayDate.getFullYear());
  // const [monthOptions, setMonthOptions] = useState(monthNameList);
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [reportData, setReportData] = useState([]);
  const [value, setValue] = useState(todayDate);

  const getTodayAttendanceReport = () => {
    setModalVisible(true);
    reportAPI
      .getGeneratedReport(currentMonth, currentYear)
      .then((response) => {
        const report = get(response, 'data.data', []);
        console.log(report);
        setReportData(report);
        setModalVisible(false);
      })
      .catch(() => {
        toast.error('Get Attendance failed!', {
          theme: 'colored',
        });
        setModalVisible(false);
      });
  };

  useEffect(() => {
    getTodayAttendanceReport();
  }, [value]);

  const generateReport = (type, unitCode, name) => {
    if (type === 'Salary') {
      setModalVisible(true);
      salaryApi
        .generateSalaryReportBySiteId(unitCode, currentMonth, currentYear)
        .then((response) => {
          console.log(response);
          setModalVisible(false);
          const currentMonthName = monthNames[currentMonth].label;
          const data = {
            unitCode,
            name,
            month: `${currentMonthName}-${currentYear}`,
            isInvoiceGenerated: false,
            isSitePlGenerated: false,
            isSalaryGenerated: true,
          };
          reportAPI
            .createReport(data)
            .then((response) => {
              console.log(response);
              getTodayAttendanceReport();
              setModalVisible(false);
            })
            .catch(() => {
              toast.error('Get Report failed!', {
                theme: 'colored',
              });
              setModalVisible(false);
            });
        })
        .catch(() => {
          toast.error('Get Attendance failed!', {
            theme: 'colored',
          });
          setModalVisible(false);
        });
    }
  };
  const invoiceGenerateReport = (type, unitCode, name) => {
    if (type === 'Invoice') {
      setModalVisible(true);
      salaryApi
        .generateInvoiceReportBySiteId(unitCode, currentMonth, currentYear)
        .then((response) => {
          const currentMonthName = monthNames[currentMonth].label;
          console.log(response);
          setModalVisible(false);
          const data = {
            unitCode,
            name,
            month: `${currentMonthName}-${currentYear}`,
            isInvoiceGenerated: true,
            isSalaryGenerated: false,
            isSitePlGenerated: false,
          };
          reportAPI
            .createReport(data)
            .then((response) => {
              console.log(response);
              getTodayAttendanceReport();
              setModalVisible(false);
            })
            .catch(() => {
              toast.error('Get Report failed!', {
                theme: 'colored',
              });
              setModalVisible(false);
            });
        })
        .catch(() => {
          toast.error('Get Attendance failed!', {
            theme: 'colored',
          });
          setModalVisible(false);
        });
    }
  };

  const generateProfitLoseReport = (type, unitCode, name) => {
    if (type === 'Profit') {
      setModalVisible(true);
      salaryApi
        .generateSitePLReportBySiteId(unitCode, currentMonth, currentYear)
        .then((response) => {
          console.log(response);
          setModalVisible(false);
          const currentMonthName = monthNames[currentMonth].label;
          const data = {
            unitCode,
            name,
            month: `${currentMonthName}-${currentYear}`,
            isSitePlGenerated: true,
            isInvoiceGenerated: false,
            isSalaryGenerated: false,
          };
          reportAPI
            .createReport(data)
            .then((response) => {
              console.log(response);
              getTodayAttendanceReport();
              setModalVisible(false);
            })
            .catch(() => {
              toast.error('Get Report failed!', {
                theme: 'colored',
              });
              setModalVisible(false);
            });
        })
        .catch(() => {
          toast.error('Get site wise p&l failed!', {
            theme: 'colored',
          });
          setModalVisible(false);
        });
    }
  };

  // const yearOptions = [
  //   {
  //     value: 2023,
  //     label: "2023",
  //   },
  //   {
  //     value: 2024,
  //     label: "2024",
  //   },
  //   {
  //     value: 2025,
  //     label: "2025",
  //   },
  //   {
  //     value: 2026,
  //     label: "2026",
  //   },
  // ];
  // const handleChangeMonth = (value) => {
  //   const currentMonthName = monthNames[value].value;
  //   setCurrentMonth(currentMonthName);
  // };

  // const handleChangeYear = (value) => {
  //   setCurrentYear(value);
  //   console.log(value);
  // };

  const handleChange = (date) => {
    setValue(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    setCurrentMonth(month);
    setCurrentYear(year);
  };

  return (
    <>
      <Loading visible={modalVisible} />
      {/* <Select
        defaultValue={currentYear}
        style={{
          width: 120
        }}
        onChange={handleChangeYear}
        options={yearOptions}
      />
      <Select
        defaultValue={currentMonth}
        value={currentMonth}
        style={{
          width: 120
        }}
        onChange={handleChangeMonth}
        options={getMonthNamesNew(currentMonth)}
      /> */}
      <DatePicker
        format="MMM yyyy"
        caretAs={BsCalendar2MonthFill}
        value={value}
        onChange={handleChange}
        shouldDisableDate={disableFutureDates}
      />
      <ReportsBySite
        products={reportData}
        generateReport={generateReport}
        invoiceGenerateReport={invoiceGenerateReport}
        generateProfitLoseReport={generateProfitLoseReport}
      />
    </>
  );
};

export default GeneratedReportsBySiteContainer;
