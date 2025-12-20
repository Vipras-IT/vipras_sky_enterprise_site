/* eslint-disable no-unused-vars */

import logoInvoice from 'assets/vipras_logonew.svg';
import IconButton from 'components/common/IconButton';
import { useAuth } from 'hooks/useAuth';
import { isEmpty, get } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Row, Table } from 'react-bootstrap';
import SimpleBarReact from 'simplebar-react';
import { useParams } from 'react-router-dom';
import employeeAPI from 'api/getEmployeeBySite';
import salaryApi from 'api/salary';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useReactToPrint } from 'react-to-print';

const Salary = () => {
  const { user } = useAuth();
  const params = useParams();
  const searchParams = new URLSearchParams(location.search);
  const month = searchParams.get('month');
  const year = searchParams.get('year');
  const [employeeDetails, setEmployeeDetails] = useState();
  const [employeeSalary, setEmployeeSalary] = useState();
  const [tableData, setTableData] = useState([]);
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
      const filename = `Salary-${formattedDate}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('Error capturing content:', error);
    }
  };

  const Print = () => {
    window.print();
  };
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });

  useEffect(() => {
    if (!isEmpty(get(params, 'employeeNumber'))) {
      salaryApi
        .getSalaryByEmployee(
          params.employeeNumber,
          month,
          year,
          get(user, 'token'),
        )
        .then((response) => {
          setEmployeeSalary(response.data.data.employeeSalary);
          setEmployeeDetails(response.data.data.employee);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
      employeeAPI
        .getOtherDeductions(
          params.employeeNumber,
          month,
          year,
          get(user, 'token'),
        )
        .then((res) => {
          setTableData(res.data.data);
          console.log('response', res.data.data);
        })
        .catch((err) => {
          console.log('response Error', err);
        });
    }
  }, [params.id]);
  const formattedMonth = new Date(
    `${Number(year)}-${Number(month)}`,
  ).toLocaleString('default', { month: 'long' });
  const formattedDate = `${formattedMonth} - ${year}`;
  return (
    <>
      <Card className="mb-3">
        <Card.Body>
          <Row className="justify-content-between align-items-center">
            <Col md>
              <h5 className="mb-2 mb-md-0">Salary</h5>
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
      <div id="pdf-content" className="print-page" ref={contentRef}>
        <Card className="mb-3 exclude-from-pdf print-subpage">
          <Card.Body>
            <Row className="text-center mb-3">
              <Col sm={6} className="text-sm-start">
                <img src={logoInvoice} alt="invoice" width={200} height={50} />
              </Col>
              <Col className="text-sm-end mt-3 mt-sm-0">
                <h3 className="mb-1 salary-text">{formattedDate}</h3>
                <p className="salary-text mb-0">
                  Vipras Facility Management Solutions Pvt Ltd{' '}
                </p>
                <p className="salary-text mb-0">
                  No-495A, Village High Road,
                  <br /> Sholinganallur, Chennai - 600119
                </p>
              </Col>
              <Col xs={12}>
                <hr />
              </Col>
            </Row>

            <Row className="align-items-center">
              <Col>
                {employeeDetails ? (
                  <div key={employeeDetails.employeeId}>
                    <p className="salary-text mb-1 fs-1 fw-semibold ">
                      {employeeDetails.employeeName}:{' '}
                      <span className="ms-1">
                        {employeeDetails.employeeNumber}
                      </span>{' '}
                    </p>
                    {/* <h6 className="salary-text">
                      {employeeDetails.employeeNumber}
                    </h6> */}
                    <h6 className="salary-text mb-2">{employeeDetails.role}</h6>
                    <p className="salary-text mb-0">
                      {employeeDetails.localAddress?.address}
                      <br />
                      {employeeDetails.localAddress?.district},
                      <span className="ms-1">
                        {employeeDetails.localAddress?.state}
                      </span>
                    </p>
                    <p className="salary-text">
                      {employeeDetails.localAddress?.contactNumber}
                    </p>
                  </div>
                ) : (
                  <p>No employee details available.</p>
                )}
              </Col>

              <Col sm="auto" className="ms-auto">
                {employeeSalary ? (
                  <div className="table-responsive">
                    <Table borderless size="sm" className="salary-text">
                      <tbody>
                        <tr>
                          <th className="text-sm-end">Site:</th>
                          <td>
                            {employeeSalary.unitCode}-{employeeSalary.UnitName}
                          </td>
                        </tr>
                        <tr>
                          <th className="text-sm-end">Account No:</th>
                          <td>{employeeSalary.accountNumber}</td>
                        </tr>
                        <tr>
                          <th className="text-sm-end">Bank Name:</th>
                          <td>{employeeSalary.bankName}</td>
                        </tr>
                        <tr>
                          <th className="text-sm-end">IFSC Code:</th>
                          <td>{employeeSalary.ifscCode}</td>
                        </tr>
                        <tr>
                          <th className="text-sm-end">ESI Number:</th>
                          <td>{employeeSalary.esiNumber}</td>
                        </tr>
                        <tr>
                          <th className="text-sm-end">PF Number:</th>
                          <td>{employeeSalary.uanNumber}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                ) : (
                  <p>No employee details available.</p>
                )}
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <hr />
              </Col>
              <div className="d-flex">
                <Col>
                  {employeeSalary ? (
                    <h6 className="attendance-text">
                      Total working days: {employeeSalary.totalWorkingDays}
                      <span className="">
                        Present: {employeeSalary.present}
                      </span>
                      <span className="">Absent: {employeeSalary.absent}</span>
                      <span className="">
                        Week Off: {employeeSalary.weekOff}
                      </span>
                      <span className="">
                        Duty: {employeeSalary.numberofDuty}
                      </span>
                      <span className="">
                        Bulk Duty: {employeeSalary.bulkDuty}
                      </span>
                      <span className="">
                        Total Duty: {employeeSalary.totalDuties}
                      </span>
                    </h6>
                  ) : (
                    <p>No employee details available.</p>
                  )}
                </Col>

                {employeeSalary && (
                  <Row className="justify-content-end">
                    <Col xs="auto">
                      <Table
                        borderless
                        size="sm"
                        className="salary-text text-end"
                      >
                        <tbody>
                          <tr className="d-flex align-items-center justify-content-end">
                            <th className="text-900 mw-150">Gross Salary:</th>
                            <td className="fw-semi-bold mw-75">
                              {employeeSalary.grossSalary}
                            </td>
                          </tr>
                          <tr className="d-flex align-items-center justify-content-end">
                            <th className="text-900 mw-150">
                              Total Earnings (+):
                            </th>
                            <td className="fw-semi-bold mw-75">
                              {employeeSalary.attendanceBonus}
                            </td>
                          </tr>
                          <tr className="d-flex align-items-center justify-content-end">
                            <th className="text-900 mw-150">
                              Total Deductions (-):
                            </th>
                            <td className="fw-semi-bold mw-75">
                              {employeeSalary.totalDeduction}
                            </td>
                          </tr>
                          <tr className="border-top d-flex align-items-center justify-content-end">
                            <th className="text-900 mw-150">Total:</th>
                            <td className="fw-semi-bold mw-75">
                              {employeeSalary.grossSalary +
                                employeeSalary.attendanceBonus -
                                employeeSalary.totalDeduction}
                            </td>
                          </tr>
                          <tr className="border-top border-top-2 fw-bolder text-900 d-flex align-items-center justify-content-end">
                            <th className="mw-150">Net Salary:</th>
                            <td className="mw-75">
                              {employeeSalary.netSalary}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                )}
              </div>
            </Row>
            {tableData.length > 0 && (
              <div className="mt-4 salary-text">
                <SimpleBarReact>
                  <Table striped className="border-bottom">
                    <thead className="light">
                      <tr className="bg-primary text-white dark__bg-1000">
                        <th className="border-0">Description</th>
                        <th className="border-0 text-end">Debit</th>
                        <th className="border-0 text-end">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((t, k) => (
                        // <th className="border-0 text-center" key={k} value={t[0]}>
                        //   {t[1]}
                        // </th>
                        <tr key={k}>
                          <td className="align-middle">
                            <p className="mb-0 salary-text">{t.description}</p>
                          </td>
                          <td className="align-middle text-end salary-text">
                            {t.debit}
                          </td>
                          <td className="align-middle text-end salary-text">
                            {t.credit}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </SimpleBarReact>
              </div>
            )}
          </Card.Body>
          <Card.Footer className="bg-light">
            <p className="fs--1 mb-0"></p>
          </Card.Footer>
        </Card>
      </div>
    </>
  );
};

export default Salary;
