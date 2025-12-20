/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import attendanceAPI from 'api/attendance';
import moment from 'moment';
import { get, isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import AttendanceReportsBySite from './AttendanceReportsBySite';
import Loading from './Loading';

const AttendanceReportsBySiteContainer = ({ siteId }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const getTodayAttendanceReport = () => {
    setModalVisible(true);
    const date = moment().format('YYYY-MM-DD');
    attendanceAPI
      .getAttendanceReportForAllSite(date)
      .then((response) => {
        const todayAttendance = get(response, 'data.data', []);
        const finalAttendance =
          !isEmpty(siteId) && siteId[0] === 'ALL'
            ? todayAttendance
            : todayAttendance.filter((item) => siteId.includes(item.unitcode));
        setAttendanceData(finalAttendance);
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
  }, []);

  return (
    <>
      <Loading visible={modalVisible} />
      <AttendanceReportsBySite products={attendanceData} />
    </>
  );
};

export default AttendanceReportsBySiteContainer;
