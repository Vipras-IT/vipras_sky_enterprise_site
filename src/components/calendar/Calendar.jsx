/* eslint-disable no-unused-vars */

import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Row, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import employeeAPI from 'api/attendance';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { isEmpty, get } from 'lodash';
import { useParams } from 'react-router-dom';

const Calendar = () => {
  const calendarRef = useRef();

  const [eventList, setEventList] = useState([]);
  const [calendarApi, setCalendarApi] = useState({});
  const params = useParams();
  const [employeeInfo, setEmployeeInfo] = useState();

  const targetYear = !isEmpty(get(params, 'employeeId')) ? Number(params.year) : new Date().getFullYear();
  const targetMonth = !isEmpty(get(params, 'employeeId')) ? Number(params.month) : new Date().getMonth();

  const startDate = new Date(targetYear, targetMonth - 1, 26);
  const endDate = new Date(targetYear, targetMonth, 26); // Exclusive end

  const formatDate = (date) => {
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    const year = date.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('-');
  };

  const visibleRangeStart = formatDate(startDate);
  const visibleRangeEnd = formatDate(endDate);

  useEffect(() => {
    if (!isEmpty(get(params, 'employeeId'))) {
      getCalenderData(params.employeeId, Number(params.month), params.year);
    } else {
      const todayDate = new Date();
      const currentMonth = todayDate.getMonth();
      const year = todayDate.getFullYear();
      const datas = localStorage.getItem('user');
      const userData = JSON.parse(datas);
      const employeeId = Number(userData.employeeId);
      getCalenderData(employeeId, currentMonth, year);
    }
  }, []);

  const eventTimeFormat = {
    hour: 'numeric',
    minute: '2-digit',
    omitZeroMinute: true,
    meridiem: true,
  };

  useEffect(() => {
    setCalendarApi(calendarRef.current.getApi());
  }, []);

  const getCalenderData = (employeeId, month, year) => {
    const token = 'token';
    employeeAPI
      .getYourAttendanceReport(employeeId, month, year, token)
      .then((response) => {
        const eventList = get(
          response,
          'data.data.attemdanceReport',
          [],
        ).reduce(
          (acc, event) =>
            event.schedules
              ? acc.concat(event.schedules.concat(event))
              : acc.concat(event),
          [],
        );
        setEmployeeInfo({
          absent: get(response, 'data.data.absent', 0),
          bulkDuty: get(response, 'data.data.bulkDuty', 0),
          designation: get(response, 'data.data.designation', ''),
          employeeName: get(response, 'data.data.employeeName', ''),
          employeeNumber: get(response, 'data.data.employeeNumber', 0),
          nationalHoliday: get(response, 'data.data.nationalHoliday', 0),
          noOfDuty: get(response, 'data.data.noOfDuty', 0),
          present: get(response, 'data.data.present', 0),
          totalWorkingDays: get(response, 'data.data.totalWorkingDays', 0),
          weekOff: get(response, 'data.data.weekOff', 0),
        });
        setEventList(eventList);
      })
      .catch((error) => {
        toast.error('Error fetching data:', {
          description: error,
          theme: 'colored',
        });
      });
  };

  return (
    <>
      <Card>
        <Card.Header>
          <Row className="align-items-center gx-0">
            <Col
              xs="auto"
              className="d-flex w-100 justify-content-center order-md-2"
            >
              <h4 className="mb-2 fs-0 fs-sm-1 fs-lg-2">
                {`${calendarApi.currentDataManager?.data?.viewTitle} - ${get(
                  employeeInfo,
                  'employeeName',
                  '',
                )} - (${get(employeeInfo, 'employeeNumber', 0)})`}
              </h4>
            </Col>
          </Row>
          <Row>
            <Table bordered responsive>
              <thead>
                <tr>
                  <th scope="col">Present</th>
                  <th scope="col">Absent</th>
                  <th scope="col">Week Off</th>
                  <th scope="col">No of Duty</th>
                  {/* <th scope="col">Bulk duty</th> */}
                  <th scope="col">Total Duty</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{get(employeeInfo, 'present', 0)}</td>
                  <td>{get(employeeInfo, 'absent', 0)}</td>
                  <td>{get(employeeInfo, 'weekOff', 0)}</td>
                  <td>{get(employeeInfo, 'noOfDuty', 0)}</td>
                  <td>{get(employeeInfo, 'bulkDuty', 0)}</td>
                  <td>
                    {get(employeeInfo, 'noOfDuty', 0) +
                      get(employeeInfo, 'bulkDuty', 0)}
                  </td>
                </tr>
              </tbody>
            </Table>
          </Row>
        </Card.Header>
        <Card.Body className="p-0">
          <FullCalendar
            ref={calendarRef}
            headerToolbar={false}
            plugins={[
              dayGridPlugin,
              timeGridPlugin,
              interactionPlugin,
              listPlugin,
            ]}
            initialView="dayGrid"
            visibleRange={{
              start: visibleRangeStart,
              end: visibleRangeEnd
            }}
            themeSystem="bootstrap"
            dayMaxEvents={2}
            direction={'ltr'}
            height={800}
            stickyHeaderDates={false}
            editable
            selectable
            selectMirror
            select={() => {}}
            eventTimeFormat={eventTimeFormat}
            eventClick={() => {}}
            events={eventList}
          />
        </Card.Body>
      </Card>
    </>
  );
};

export default Calendar;
