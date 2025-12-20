/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import IconButton from 'components/common/IconButton';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Card, Col, Row, Table, Button } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import SimpleBarReact from 'simplebar-react';
import { useParams } from 'react-router-dom';
import invoiceAPI from 'api/invoiceApi';
import { get, upperCase } from 'lodash';
import { toast } from 'react-toastify';
import { ToWords } from 'to-words';
import { formattedAmount } from 'helpers/utils';
import { Input } from 'antd';

const GstInvoiceEdit = () => {
  const params = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [siteData, setSiteData] = useState({});
  const [invoiceData, setInvoiceData] = useState();
  const [grandTotal, setGrandTotal] = useState(0);
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
          get(response, 'data.data.invoiceDetails.invoieBreakUP', []),
        );

        const totalAmount = get(
          response,
          'data.data.invoiceDetails.totalAmount',
          0,
        );
        const totalSgstAmount = get(
          response,
          'data.data.invoiceDetails.totalSgstAmount',
          0,
        );

        setGrandTotal(totalAmount + totalSgstAmount);
        setSiteData(get(response, 'data.data.siteDetails', []));
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  useEffect(() => {
    getInvoiceData();
  }, []);

  const [editable, setEditable] = useState(-1);
  const toggleEditable = (index) => {
    setEditable(index === setEditable ? -1 : index);
  };

  const handleQtyChange = (e, index) => {
    const newQty = parseFloat(e.target.value);
    const updatedAttendanceData = [...attendanceData];
    updatedAttendanceData[index].qty = newQty;
    console.log(updatedAttendanceData);
    console.log(JSON.stringify(updatedAttendanceData));
    setInvoiceData(updatedAttendanceData);
  };

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

      <Card className="mb-3" id="pdf-content" ref={contentRef}>
        <Card.Body>
          {/* <Row className="text-center mb-3">
            <Col sm={6} className="text-sm-start">
              <img
                className="invoice-logo-img"
                src={logoInvoice}
                alt="invoice"
                width={250}
                height={100}
              />
              <h5>
                {upperCase('Vipras Facility Management Solutions Pvt Ltd')}
              </h5>
              <p className="salary-text mb-0">
                {upperCase('No-495A, Village High Road,')}
                <br /> {upperCase('Sholinganallur, Chennai - 600119')}
              </p>
            </Col>
            <Col sm="auto" className="ms-auto">
              <div className="table-responsive">
                <Table borderless size="sm" className="salary-text">
                  <tbody>
                    <tr>
                      <th className="text-end text-900">GSTIN :</th>
                      <td className="align-middle text-start">
                        33AAECV9986D1ZX
                      </td>
                    </tr>
                    <tr>
                      <th className="text-end text-900">INVOICE NO :</th>
                      <td className="align-middle text-start">581</td>
                    </tr>
                    <tr>
                      <th className="text-end text-900">DATE :</th>
                      <td className="align-middle text-start">01/01/2024</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
            <Col xs={12}>
              <hr />
            </Col>
          </Row> */}
          <Row className="align-items-center">
            <Col>
              <div>
                <h5>{get(siteData, 'siteName', '')}</h5>
                <h6 className="salary-text">
                  {upperCase(get(siteData, 'city', ''))}
                </h6>
                <h6 className="salary-text">
                  {upperCase(get(siteData, 'location', ''))}
                </h6>
                <h6 className="salary-text">
                  {upperCase(get(siteData, 'state', ''))}
                </h6>
              </div>
            </Col>
            <Col sm="auto" className="ms-auto">
              <h6 className="salary-text">
                GST NUMBER : {upperCase(get(invoiceData, 'gstInvoiceNo', ''))}
              </h6>
            </Col>
          </Row>

          <div className="mt-4 fs--1">
            <SimpleBarReact>
              <Table striped className="border-bottom">
                <thead className="light">
                  <tr className="bg-primary text-white dark__bg-1000">
                    <th className="border-0">Description</th>
                    <th className="border-0 text-center">HSN/SAC Code</th>
                    <th className="border-0 text-end">Qty</th>
                    <th className="border-0 text-center">Rate</th>
                    <th className="border-0 text-end">Total Amount</th>
                    <th className="border-0 text-center">Taxable Value</th>
                    <th className="border-0 text-center">
                      CGST<br></br>Rate % &nbsp;&nbsp;&nbsp;&nbsp; Amount
                    </th>
                    <th className="border-0 text-center">
                      SGST<br></br>Rate % &nbsp;&nbsp;&nbsp;&nbsp; Amount
                    </th>
                    <th className="border-0 text-center">
                      IGST<br></br>Rate % &nbsp;&nbsp;&nbsp;&nbsp; Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {attendanceData.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="align-middle">
                          <h6 className="mb-0 text-nowrap">
                            {upperCase(get(item, 'role'))}
                            {/* role */}
                          </h6>
                        </td>
                        <td className="align-middle text-center">
                          {get(item, 'hsnCode', '998513')}
                        </td>
                        <td
                          className="align-middle text-end"
                          onClick={() => toggleEditable(index)}
                        >
                          {editable === index ? (
                            // <input
                            //   type="text"
                            //   value={Math.round(get(item, 'qty') * 100) / 100}
                            //   onChange={e => handleQtyChange(e, index)}
                            // />
                            <Input
                              type="text"
                              style={{ width: '20%' }}
                              onChange={(e) => handleQtyChange(e, index)}
                              value={Math.round(get(item, 'qty') * 100) / 100}
                              placeholder="Basic usage"
                            />
                          ) : (
                            Math.round(get(item, 'qty') * 100) / 100
                          )}
                        </td>
                        <td className="align-middle text-center">
                          {' '}
                          {formattedAmount(get(item, 'rate'))}
                        </td>
                        <td className="align-middle text-end">
                          {' '}
                          {formattedAmount(get(item, 'totalAmount'))}
                        </td>
                        <td className="align-middle text-center">
                          {' '}
                          {formattedAmount(get(item, 'taxableValue'))}
                        </td>
                        <td className="align-middle text-center text-left">
                          &nbsp; {get(item, 'cgstPercentage')} &nbsp;
                          <span style={{ paddingLeft: 33 }}>
                            {formattedAmount(get(item, 'cgstAmount'))}
                          </span>
                        </td>
                        <td className="align-middle text-center text-left">
                          &nbsp; {get(item, 'sgstPercentage')} &nbsp;
                          <span style={{ paddingLeft: 33 }}>
                            {' '}
                            {formattedAmount(get(item, 'sgstAmount'))}
                          </span>
                        </td>
                        <td className="align-middle text-center text-left">
                          &nbsp; {get(item, 'igstPercentage')} &nbsp;
                          <span style={{ paddingLeft: 33 }}>
                            {formattedAmount(get(item, 'igstAmount'))}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </SimpleBarReact>
            <Row className="g-2 mb-3">
              <Col md={4}></Col>
              <Col md={4}>
                <Button
                  onClick={() => toggleEditable(-1)}
                  color="primary"
                  className="mt-3 w-100"
                >
                  Save
                </Button>
              </Col>
              <Col md={4}></Col>
            </Row>
          </div>
          {/* <Row className="align-items-center">
            <Col></Col>
            <Col sm="auto" className="ms-auto">
              <div className="table-responsive">
                <Table borderless size="sm" className="fs--1 text-end">
                  <tbody>
                    <tr>
                      <th className="text-900">Total Taxable Value :</th>
                      <td className="fw-semi-bold">
                        {formattedAmount(
                          get(invoiceData, 'totalSgstAmount', '')
                        )}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-900">Total Amount :</th>
                      <td className="fw-semi-bold">
                        {formattedAmount(get(invoiceData, 'totalAmount', ''))}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-900">Grand Total Rs .</th>
                      <td className="fw-semi-bold">
                        {formattedAmount(grandTotal)}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row> */}
          {/* <br></br>
          <Col xs={12}>
            <p>RUPEES : {toWords.convert(grandTotal).toUpperCase()} ONLY</p>
            <hr />
          </Col> */}
          {/* <br></br>
          <br></br>
          <br></br>
          <div className="d-flex justify-content-between">
            <h5>Receiver's Signature</h5>
            <h5>Authorized Signature</h5>
            <div className="align-items-center border-top border-top-2 fw-bolder text-900"></div>
          </div> */}
        </Card.Body>
        <Card.Footer className="bg-light">
          <p className="fs--1 mb-0"></p>
        </Card.Footer>
      </Card>
    </>
  );
};

export default GstInvoiceEdit;
