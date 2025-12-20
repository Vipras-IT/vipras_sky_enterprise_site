/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import IconButton from 'components/common/IconButton';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Card, Col, Row, Table } from 'react-bootstrap';
import { useReactToPrint } from 'react-to-print';
import SimpleBarReact from 'simplebar-react';
import { get, upperCase } from 'lodash';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import invoiceApi from 'api/invoiceApi';
import { formattedAmount } from 'helpers/utils';
// import { toast } from 'react-toastify';

const Invoice = () => {
  const params = useParams();
  const [attendanceData, setAttendanceData] = useState([]);
  const [siteData, setSiteData] = useState({});
  const [bankDetails, setBankDetails] = useState({});
  const [employee, setEmployee] = useState({});
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

  const getInvoiceData = () => {
    const invoiceId = get(params, 'id');
    invoiceApi
      .getByIdInvoicedetails(invoiceId)
      .then((response) => {
        setInvoiceData(get(response, 'data.data.invoiceDetails', []));
        setAttendanceData(
          get(response, 'data.data.invoiceDetails.invoiceBreakUP', []),
        );
        setBankDetails(
          get(response, 'data.data.invoiceDetails.bankDetails', {}),
        );
        setEmployee(get(response, 'data.data.employee', {}));

        // const totalAmount = get(
        //   response,
        //   'data.data.invoiceDetails.totalAmount',
        //   0
        // );
        // const totalSgstAmount = get(
        //   response,
        //   'data.data.invoiceDetails.totalSgstAmount',
        //   0
        // );

        // setGrandTotal(totalAmount + totalSgstAmount);
        setSiteData(get(response, 'data.data.siteDetails', []));
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const handleDateFormted = (date) => {
    const saleDate = new Date(date);
    const month = saleDate.getMonth() + 1;
    const monthValue = month < 10 ? `0${month}` : `${month}`;
    const day = saleDate.getDate();
    const dayValue = day < 10 ? `0${day}` : `${day}`;
    const formatDate = `${dayValue}/${monthValue}/${saleDate.getFullYear()}`;
    return <>{formatDate}</>;
  };

  useEffect(() => {
    getInvoiceData();
  }, []);
  return (
    <>
      <Card className="mb-3">
        <Card.Body>
          <Row className="justify-content-between align-items-center">
            <Col md>
              <h5 className="mb-2 mb-md-0">SUB-CONTRACTOR INVOICE</h5>
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

      {/* <Card className="mb-3" id="pdf-content" ref={componentRef}>
        <Card.Body>
          <Row className="align-items-center">
            <Col>
              <div>
                <h5>NAME : {get(bankDetails, 'accountHolderName', '')}</h5>
                <h6 className="salary-text">
                  A/C NO : {get(bankDetails, 'accountNumber', '')}
                </h6>
                <h6 className="salary-text">
                  IFSC : {get(bankDetails, 'ifscode', '')}
                </h6>
                <h6 className="salary-text">
                  BANK NAME : {get(bankDetails, 'bankName', '')}
                </h6>
                <h6 className="salary-text">
                  BRANCH : {get(bankDetails, 'branch', '')}
                </h6>
                <h6 className="salary-text">
                  PAN : {get(invoiceData, 'panCardNumber', '')}
                </h6>
              </div>
            </Col>
            <Col sm="auto" className="ms-auto">
              <div className="table-responsive">
                <Table borderless size="sm" className="salary-text">
                  <tbody>
                    <tr>
                      <th className="text-sm-end">Date:</th>
                      <td>{handleDateFormted(get(invoiceData, 'date', ''))}</td>
                    </tr>
                    <tr>
                      <th className="text-sm-end">Site :</th>
                      <td>
                        {get(invoiceData, 'siteId', '')}-
                        {get(invoiceData, 'siteName', '')}
                      </td>
                    </tr>
                    <tr>
                      <th className="text-sm-end">For The Month Of :</th>
                      <td>{get(invoiceData, 'month', '')}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>

          <div className="mt-4 fs--1">
            <SimpleBarReact>
              <Table striped className="border-bottom">
                <thead className="light">
                  <tr className="bg-primary text-white dark__bg-1000">
                    <th className="border-0">Particulars</th>
                    <th className="border-0 text-center">Quantity</th>
                    <th className="border-0 text-end">Unit Rate</th>
                    <th className="border-0 text-end">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td className="align-middle">
                          <h6 className="mb-0 text-nowrap">
                            {upperCase(get(item, 'role'))}
                          </h6>
                        </td>
                        <td className="align-middle text-center">
                          {get(item, 'qty')}
                        </td>
                        <td className="align-middle text-end">
                          {formattedAmount(get(item, 'rate'))}
                        </td>
                        <td className="align-middle text-end">
                          {get(item, 'totalAmount')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </SimpleBarReact>
          </div>

          <Row className="justify-content-end">
            <Col xs="auto">
              <Table borderless size="sm" className="fs--1 text-end">
                <tbody>
                  <tr className="border-top border-top-2 fw-bolder text-900">
                    <tr className="d-flex align-items-center justify-content-center">
                      <th className="text-900 mw-150">Grand Total Rs:</th>
                      <td className="fw-semi-bold text-color-black mw-75">
                        {formattedAmount(get(invoiceData, 'totalAmount', ''))}
                      </td>
                    </tr>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          <div>
            <h5>Authorized Signatory</h5>
            <div className="align-items-center border-top border-top-2 fw-bolder text-900"></div>
          </div>
        </Card.Body>
        <Card.Footer className="bg-light">
          <p className="fs--1 mb-0"></p>
        </Card.Footer>
      </Card> */}
      <div id="pdf-content" className="print-page" ref={contentRef}>
        <Card className="mb-3 print-subpage" id="pdf-content" ref={contentRef}>
          <Card.Body>
            <h4 className="invoice-title">TAX INVOICE</h4>
            <Row>
              <Col>
                <div>
                  <h5 className="salary-text">
                    NAME : {get(bankDetails, 'accountHolderName', '')}
                  </h5>

                  <h6 className="salary-text">
                    A/C NO : {get(bankDetails, 'accountNumber', '')}
                  </h6>
                  <h6 className="salary-text">
                    IFSC : {get(bankDetails, 'ifscode', '')}
                  </h6>
                  <h6 className="salary-text">
                    BANK NAME : {get(bankDetails, 'bankName', '')}
                  </h6>
                  <h6 className="salary-text">
                    BRANCH : {get(bankDetails, 'branch', '')}
                  </h6>
                  <h6 className="salary-text">
                    PAN : {get(invoiceData, 'panCardNumber', '')}
                  </h6>
                </div>
              </Col>
              <Col sm="auto" className="ms-auto">
                <h6 className="salary-text">
                  Date: {handleDateFormted(get(invoiceData, 'date', ''))}
                </h6>
                <h6 className="salary-text">
                  Client Name: {get(invoiceData, 'clientName', '')}
                </h6>
                <h6 className="salary-text">
                  Po Date:{' '}
                  {get(invoiceData, 'poDate', '')
                    ? handleDateFormted(get(invoiceData, 'poDate', ''))
                    : ''}
                </h6>
                <h6 className="salary-text">
                  po Number: {get(invoiceData, 'poNumber', '')}
                </h6>
                <h6 className="salary-text">
                  Invoice Number: {get(invoiceData, 'invoiceNo', '')}
                </h6>
              </Col>
            </Row>

            <div className="fs--1">
              <SimpleBarReact>
                <Table className="border-bottom">
                  <thead className="light">
                    <tr className="bg-primary text-white dark__bg-1000 invoice-th">
                      <th className="border-0">Particulars</th>
                      <th className="border-0 text-center">Quantity</th>
                      <th className="border-0 text-end">Unit Rate</th>
                      <th className="border-0 text-center">Amount</th>
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
                          <td className="align-middle text-center text-color-black">
                            {get(item, 'qty')}
                          </td>
                          <td className="align-middle text-center text-color-black">
                            {Math.round(get(item, 'rate', 0))}
                          </td>
                          <td className="align-middle text-center text-color-black">
                            {get(item, 'totalAmount')}
                          </td>
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
                        <th className="text-900 mw-150">Grand Total Rs:</th>
                        <td className="fw-semi-bold text-color-black mw-75">
                          {formattedAmount(get(invoiceData, 'totalAmount', ''))}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
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

export default Invoice;
