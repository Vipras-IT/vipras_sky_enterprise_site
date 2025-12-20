/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import IconButton from 'components/common/IconButton';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Card, Col, Row, Table } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import SimpleBarReact from 'simplebar-react';
import invoiceAPI from 'api/invoiceApi';
import { get, upperCase } from 'lodash';
import { Select, Space } from 'antd';
import { formattedAmount, disableFutureDates } from 'helpers/utils';
import { DatePicker } from 'rsuite';
import { BsCalendar2MonthFill } from 'react-icons/bs';

const MonthlyBreakUp = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });
  const downloadPDF = async () => {
    try {
      const contentElement = document.getElementById('pdf-content');
      if (!contentElement) {
        console.error('Element with ID "pdf-content" not found.');
        return;
      }
      const canvas = await html2canvas(contentElement, {
        useCORS: true,
        scale: 2,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'px', 'a4');
      const aspectRatio = canvas.width / canvas.height;
      const pdfWidth = pdf.internal.pageSize.width;
      const pdfHeight = pdfWidth / aspectRatio;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().slice(0, 10);
      const filename = `Sub-Contractor Invoice-${formattedDate}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('Error capturing content:', error);
    }
  };

  const todayDate = new Date();
  // const monthNameList = getPreviousMonthNames(todayDate.getFullYear());
  // const [monthOptions, setMonthOptions] = useState(monthNameList);
  const [value, setValue] = useState(todayDate);
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth());
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());

  // const handleChangeMonth = value => {
  //   setCurrentMonth(value);
  // };

  // const yearOptions = [
  //   {
  //     value: 2023,
  //     label: '2023'
  //   },
  //   {
  //     value: 2024,
  //     label: '2024'
  //   },
  //   {
  //     value: 2025,
  //     label: '2025'
  //   }
  // ];
  const [currentSiteId, setCurrentSiteId] = useState();
  const siteIdsString = window.localStorage.getItem('siteIds');
  const siteIds = siteIdsString ? JSON.parse(siteIdsString) : [];
  let siteIdsOptions = [];
  siteIds.map((item) => {
    const siteIdArray = item.split('-');
    siteIdsOptions.push({
      value: siteIdArray[0],
      label: item,
    });
  });
  const handleChangeSiteId = (value) => {
    setCurrentSiteId(value);
  };

  const onSearch = (value) => {
    console.log('search:', value);
  };

  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  // const handleChangeYear = value => {
  //   if (value === todayDate.getFullYear()) {
  //     setCurrentMonth(todayDate.getMonth());
  //   }
  //   setCurrentYear(value);
  // };
  const handleChange = (date) => {
    setValue(date);
    const year = date.getFullYear();
    const month = date.getMonth();
    setCurrentMonth(month);
    setCurrentYear(year);
  };
  const getAttendaceData = () => {
    const token = 'token';
    invoiceAPI
      .getInvoiceMonthly(currentSiteId, currentYear, currentMonth)
      .then((response) => {
        const attendanceData = get(response, 'data.data.monthlyBreakUp', []);
        const totals = attendanceData.reduce(
          (acc, item) => {
            acc.totalDuty += item.totalDuty || 0;
            acc.totalAmount += item.totalAmount || 0;
            acc.headCount += item.headCount || 0;
            return acc;
          },
          { totalDuty: 0, totalAmount: 0, headCount: 0 },
        );

        console.log(totals);
        attendanceData.push({
          role: 'TOTAL',
          totalDuty: totals.totalDuty,
          totalAmount: totals.totalAmount,
          headCount: totals.headCount,
        });

        setAttendanceData(attendanceData);
      })
      .catch(() => {});
  };

  useEffect(() => {
    getAttendaceData();
  }, [currentSiteId, value]);

  const style = {
    padding: '8px 0',
  };

  return (
    <>
      <Card className="mb-3">
        <Card.Body>
          <Row className="justify-content-between align-items-center">
            <Col md>
              <h5 className="mb-2 mb-md-0">INVOICE BREAKUP</h5>
            </Col>
            <Col xs="auto">
              <IconButton
                variant="falcon-default"
                size="sm"
                icon="arrow-down"
                className="me-1 mb-2 mb-sm-0"
                iconClassName="me-1"
                onClick={downloadPDF}
              >
                Download (.pdf)
              </IconButton>
              <IconButton
                variant="falcon-default"
                size="sm"
                icon="print"
                iconClassName="me-1"
                className="me-1 mb-2 mb-sm-0"
                onClick={handlePrint}
              >
                Print
              </IconButton>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="mb-3" id="pdf-content" ref={contentRef}>
        <Card.Body>
          <Row align="middle">
            <Col style={style} offset={1}>
              <Space wrap>
                <Select
                  defaultValue={currentSiteId}
                  showSearch
                  placeholder="Select a site"
                  optionFilterProp="children"
                  onChange={handleChangeSiteId}
                  onSearch={onSearch}
                  filterOption={filterOption}
                  options={siteIdsOptions}
                  style={{
                    width: 410,
                  }}
                />
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
                  options={monthOptions}
                /> */}
                <DatePicker
                  format="MMM yyyy"
                  caretAs={BsCalendar2MonthFill}
                  value={value}
                  onChange={handleChange}
                  shouldDisableDate={disableFutureDates}
                />
              </Space>
            </Col>
          </Row>
          <div id="pdf-content" className="print-page" ref={contentRef}>
            <Card
              className="mb-3 print-subpage"
              id="pdf-content"
              ref={contentRef}
            >
              {/* <Card.Body> */}
              <div className="fs--1">
                <SimpleBarReact>
                  <Table className="border-bottom">
                    <thead className="light">
                      <tr className="bg-primary text-white dark__bg-1000 invoice-th">
                        <th className="border-0 table-font">Description</th>
                        <th className="border-0 text-center table-font">
                          Head Count
                        </th>
                        <th className="border-0 text-end table-font">
                          No.of Duty
                        </th>
                        <th className="border-0 text-center table-font">
                          Quantity
                        </th>
                        <th className="border-0 text-center table-font">
                          Rate
                        </th>
                        <th className="border-0 text-center table-font">
                          Amount
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {attendanceData.map((item, index) => {
                        return (
                          <tr key={index} className="">
                            <td className="align-middle ">
                              <h6 className="mb-0 text-nowrap text-color-black table-paraFont">
                                {upperCase(get(item, 'role', ''))}
                              </h6>
                            </td>
                            <td className="align-middle text-center text-color-black table-paraFont">
                              {get(item, 'headCount', 0)}
                            </td>
                            <td className="align-middle text-center text-color-black table-paraFont">
                              {get(item, 'totalDuty', 0)}
                            </td>
                            <td className="align-middle text-center text-color-black table-paraFont">
                              {get(item, 'qty', 0)}
                            </td>
                            <td className="align-middle text-center text-color-black table-paraFont">
                              {formattedAmount(get(item, 'rate', 0))}
                            </td>
                            <td className="align-middle text-center text-color-black table-paraFont">
                              {formattedAmount(get(item, 'totalAmount', 0))}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </SimpleBarReact>
              </div>
              {/* </Card.Body> */}
            </Card>
          </div>
        </Card.Body>
        <Card.Footer className="bg-light">
          <p className="fs--1 mb-0"></p>
        </Card.Footer>
      </Card>
    </>
  );
};

export default MonthlyBreakUp;
