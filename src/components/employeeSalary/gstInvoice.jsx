/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import IconButton from 'components/common/IconButton';
import logoInvoice from 'assets/vipras_logonew.svg';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Card, Col, Row, Table } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import SimpleBarReact from 'simplebar-react';
import { useParams } from 'react-router-dom';
import invoiceAPI from 'api/invoiceApi';
import { get, upperCase } from 'lodash';
import { toast } from 'react-toastify';
import { ToWords } from 'to-words';
import { formattedAmount } from 'helpers/utils';

const GstInvoice = () => {
  const params = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [siteData, setSiteData] = useState({});
  const [invoiceData, setInvoiceData] = useState();
  const [grandTotal, setGrandTotal] = useState(0);
  const [totalTaxable, setTotalTaxable] = useState(0);
  const [taxable, setTaxable] = useState(0);
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
  const toWords = new ToWords({
    localeCode: 'en-IN',
  });

  const getInvoiceData = () => {
    const invoiceId = get(params, 'id');
    invoiceAPI
      .getByIdInvoicedetails(invoiceId)
      .then((response) => {
        setInvoiceData(get(response, 'data.data.invoiceDetails', []));
        setAttendanceData(
          get(response, 'data.data.invoiceDetails.invoiceBreakUP', []),
        );

        const totalTaxableAmount = get(
          response,
          'data.data.invoiceDetails.invoiceBreakUP',
          [],
        ).reduce((sum, item) => sum + item.totalAmount, 0);

        const totalAmountInvoice = get(
          response,
          'data.data.invoiceDetails.invoiceBreakUP',
          [],
        );
        const totalTaxableValue = totalAmountInvoice.reduce((sum, item) => sum + item.taxableValue, 0);
        setTaxable(totalTaxableValue);
        setTotalTaxable(totalTaxableAmount);
        setGrandTotal(totalTaxableValue + totalTaxableAmount);
        setSiteData(get(response, 'data.data.siteDetails', []));
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleDateFormted = (date) => {
    if (date == null) {
      return;
    } else {
      const saleDate = new Date(date);
      const month = saleDate.getMonth() + 1;
      const monthValue = month < 10 ? `0${month}` : `${month}`;
      const day = saleDate.getDate();
      const dayValue = day < 10 ? `0${day}` : `${day}`;
      const formatDate = `${dayValue}/${monthValue}/${saleDate.getFullYear()}`;
      return <>{formatDate}</>;
    }
  };

  useEffect(() => {
    getInvoiceData();
  }, []);

  const address = get(siteData, 'location', '').split(',');

  return (
    <>
      <Card className="mb-3">
        <Card.Body>
          <Row className="justify-content-between align-items-center">
            <Col md>
              <h5 className="mb-2 mb-md-0">GST INVOICE</h5>
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
        <Card className="mb-3 print-subpage" id="pdf-content" ref={contentRef}>
          <Card.Body>
            <h4 className="invoice-title">TAX INVOICE</h4>
            <Row className="text-center mb-1">
              <Col sm={7} className="text-sm-start">
                <img
                  className="invoice-logo-img"
                  src={logoInvoice}
                  alt="invoice"
                  width={250}
                  height={100}
                />
                <p className="mb-0 salary-head fw-semibold ">
                  {'VIPRAS FACILITY MANAGEMENT SOLUTIONS PVT LTD'}
                </p>
                <p className="salary-text mb-0 ">
                  {'NO-495A, VILLAGE HIGH ROAD,'}
                  <br /> {'SHOLINGANALLUR,'}
                  <br />
                  {'CHENNAI - 600119'}
                </p>
              </Col>
              <Col sm={5} className="ms-auto">
                <div className="table-responsive">
                  <Table borderless size="sm" className="salary-text-table">
                    <tbody>
                      <tr>
                        <th className="text-end text-900 salary-text-table-td">
                          GSTIN :
                        </th>
                        <td className="align-middle text-start salary-text-table-td">
                          33AAECV9986D1ZX
                        </td>
                      </tr>
                      <tr>
                        <th className="text-end text-900 salary-text-table-td">
                          PAN NO :
                        </th>
                        <td className="align-middle text-start salary-text-table-td">
                          AAECV9986D
                        </td>
                      </tr>
                      <tr>
                        <th className="text-end text-900 salary-text-table-td">
                          INVOICE NO :
                        </th>
                        <td className="align-middle text-start salary-text-table-td">
                          {get(invoiceData, 'gstInvoiceNo', '')}
                        </td>
                      </tr>
                      <tr>
                        <th className="text-end text-900 salary-text-table-td">
                          INVOICE DATE :
                        </th>
                        <td className="align-middle text-start salary-text-table-td">
                          {handleDateFormted(get(invoiceData, 'date', ''))}
                        </td>
                      </tr>
                      <tr>
                        <th className="text-end text-900 salary-text-table-td">
                          PO NO :
                        </th>
                        <td className="align-middle text-start salary-text-table-td">
                          {get(invoiceData, 'poNumber', '')}
                        </td>
                      </tr>
                      <tr>
                        <th className="text-end text-900 salary-text-table-td">
                          PO DATE :
                        </th>
                        <td className="align-middle text-start salary-text-table-td">
                          {handleDateFormted(get(invoiceData, 'poDate', ''))}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col>
                <div>
                <h5 className="salary-text">
                  {get(invoiceData, "siteName", "") && get(invoiceData, "clientName", "") && get(invoiceData, "clientAddress", "") 
                    ? `${get(invoiceData, "clientName", "")}`
                    : get(invoiceData, "siteName", "")}
                </h5>
                    {get(invoiceData, "siteName", "") &&
                    get(invoiceData, "clientName", "") &&
                    get(invoiceData, "clientAddress", "") ? (
                      <h6 className="salary-text">
                        {get(invoiceData, "clientAddress", "")}
                      </h6>
                    ) : (
                      <>
                        {address.map((item) => (
                          <h6 key={item} className="salary-text">
                            {item},
                          </h6>
                        ))}
                        <h6 className="salary-text">{get(siteData, "state", "")}</h6>
                      </>
                    )}
                </div>
              </Col>
              <Col sm="auto" className="ms-auto">
                <h6 className="salary-text">
                  GST NUMBER : {get(invoiceData, 'gstNumber', '')}
                </h6>
              </Col>
            </Row>

            <div className="fs--1">
              <SimpleBarReact>
                <Table className="border-bottom">
                  <thead className="light">
                    <tr className="bg-primary text-white dark__bg-1000 invoice-th">
                      <th className="border-0">Description</th>
                      <th className="border-0 text-end">TotalDuty</th>
                      <th className="border-0 text-center">HSN/SAC Code</th>
                      <th className="border-0 text-end">Qty</th>
                      <th className="border-0 text-center">Rate</th>
                      <th className="border-0 text-center">Total Amount</th>
                      {get(attendanceData[0], 'cgstAmount', 0) > 0 && (
                        <>
                          <th className="border-0 text-center">
                            CGST<br></br>{' '}
                            <p className="d-flex mb-0">
                              <span>Rate %</span>
                              <span className="ms-2">Amount</span>
                            </p>
                          </th>
                          <th className="border-0 text-center">
                            SGST<br></br>
                            <p className="d-flex mb-0">
                              <span>Rate %</span>
                              <span className="ms-2">Amount</span>
                            </p>
                            {/* Rate % &nbsp;&nbsp;&nbsp;&nbsp; Amount */}
                          </th>
                        </>
                      )}
                      {get(attendanceData[0], 'igstAmount', 0) > 0 && (
                        <>
                          <th className="border-0 text-center">
                            IGST<br></br>{' '}
                            <p className="d-flex mb-0">
                              <span>Rate %</span>
                              <span className="ms-2">Amount</span>
                            </p>
                          </th>
                        </>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {attendanceData.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="align-middle">
                            <h6 className="mb-0 text-nowrap text-color-black">
                              {upperCase(get(item, 'role', ''))}
                            </h6>
                          </td>
                          <td className="align-middle text-end text-color-black">
                            {get(item, 'totalDuty', 0)}
                          </td>
                          <td className="align-middle text-center text-color-black">
                            {get(item, 'hsnCode', '998513')}
                          </td>
                          <td className="align-middle text-center text-color-black">
                            {Math.round(get(item, 'qty', 0))}
                          </td>
                          <td className="align-middle text-center text-color-black">
                            {formattedAmount(get(item, 'rate', 0))}
                          </td>
                          <td className="align-middle text-center text-color-black">
                            {formattedAmount(get(item, 'totalAmount', 0))}
                          </td>
                          {get(attendanceData[0], 'cgstAmount', 0) > 0 && (
                            <>
                              <td className="align-middle text-center text-left text-color-black">
                                &nbsp; {get(item, 'cgstPercentage')} &nbsp;
                                <span style={{ paddingLeft: 33 }}>
                                  {formattedAmount(get(item, 'cgstAmount', 0))}
                                </span>
                              </td>
                              <td className="align-middle text-center text-left text-color-black">
                                &nbsp; {get(item, 'sgstPercentage')} &nbsp;
                                <span style={{ paddingLeft: 33 }}>
                                  {formattedAmount(get(item, 'sgstAmount', 0))}
                                </span>
                              </td>
                            </>
                          )}
                          {get(attendanceData[0], 'igstAmount', 0) > 0 && (
                            <td className="align-middle text-center text-left">
                              &nbsp; {get(item, 'igstPercentage', 0)} &nbsp;
                              <span style={{ paddingLeft: 33 }}>
                                {formattedAmount(get(item, 'igstAmount', 0))}
                              </span>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </SimpleBarReact>
            </div>
            <Row className="align-items-center">
              <Col></Col>
              <Col sm="auto" className="ms-auto">
                <div className="table-responsive">
                  <Table borderless size="sm" className="fs--1 text-end">
                    <tbody>
                      <tr className="d-flex align-items-center justify-content-center">
                        <th className="text-900 mw-150">
                          Total Taxable Value Rs:
                        </th>
                        <td className="fw-semi-bold text-color-black mw-75">
                          {formattedAmount(totalTaxable)}
                        </td>
                      </tr>
                      <tr className="d-flex align-items-center justify-content-center">
                        <th className="text-900 mw-150">
                          Total Tax Amount Rs:
                        </th>
                        <td className="fw-semi-bold text-color-black mw-75">
                          {formattedAmount(
                            taxable,
                          )}
                        </td>
                      </tr>
                      <tr className="d-flex align-items-center justify-content-center">
                        <th className="text-900 mw-150">Grand Total Rs:</th>
                        <td className="fw-semi-bold text-color-black mw-75">
                          {formattedAmount(
                            grandTotal
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
            <Col xs={12}>
              <p className="salary-text">
                RUPEES : {toWords.convert(grandTotal).toUpperCase()} ONLY
              </p>
              <hr />
            </Col>
            <Row className="text-center mb-3">
              <Col className="text-sm-start">
                <p className="salary-head1 mb-2">
                  BENIFICIARY NAME: VIPRAS FACILITY MANAGEMENT SOLUTIONS PVT LTD
                </p>
                <p className="salary-text mb-0 d-flex flex-column gap-1">
                  <span>
                    ACCOUNT NO: <span className="ms-1">603751000144</span>
                  </span>
                  <span>
                    {' '}
                    BANK: <span className="ms-1">ICICI BANK</span>
                  </span>
                  <span>
                    BRANCH: <span className="ms-1">SELAIYUR BRANCH</span>
                  </span>
                  <span>
                    {' '}
                    IFSC CODE : <span className="ms-1">ICIC0006037</span>
                  </span>
                </p>
              </Col>
            </Row>
            <div className="d-flex justify-content-end">
              <h5 className="salary-text">Authorized Signature</h5>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default GstInvoice;
