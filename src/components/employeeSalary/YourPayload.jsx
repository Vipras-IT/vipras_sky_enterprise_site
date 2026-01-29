/* eslint-disable no-unused-vars */

import logoInvoice from 'assets/vipras_logonew.svg';
import skyExlogo from 'assets/Sky-Logo.jpeg'
import IconButton from 'components/common/IconButton';
import { useAuth } from 'hooks/useAuth';
import { isEmpty, get } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Card, Col, Row, Table } from 'react-bootstrap';
import SimpleBarReact from 'simplebar-react';
import { useParams } from 'react-router-dom';
import employeeAPI from 'api/getEmployeeBySite';
import salaryApi from 'api/salary';
import siteAPI from 'api/siteCreation'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useReactToPrint } from 'react-to-print';
import { BsCalendar2MonthFill } from 'react-icons/bs';
import { disableFutureDates } from 'helpers/utils';
import { DatePicker } from 'rsuite';
// import { salaryConstant } from 'helpers/appConstants'



const YourPayload = () => {
    const { user } = useAuth();
    const params = useParams();
    const searchParams = new URLSearchParams(location.search);
    // const month = 10;
    // const year = 2025;
    const todayDate = new Date();

    // State management
    const [dateValue, setDateValue] = useState(todayDate);
    const [month, setCurrentMonth] = useState(todayDate.getMonth() + 1);
    const [year, setCurrentYear] = useState(todayDate.getFullYear());
    const [employeeDetails, setEmployeeDetails] = useState(null);
    const [employeeSalary, setEmployeeSalary] = useState(null);
    const [tableData, setTableData] = useState([]);
    // const [siteDetails, setSiteDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Convert number to words
    const numberToWords = (num) => {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
            'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        const convertToWords = (n) => {
            if (n < 20) return ones[n];
            if (n < 100) return `${tens[Math.floor(n / 10)]} ${ones[n % 10]}`.trim();
            if (n < 1000) return `${ones[Math.floor(n / 100)]} Hundred ${convertToWords(n % 100)}`.trim();
            if (n < 100000) return `${convertToWords(Math.floor(n / 1000))} Thousand ${convertToWords(n % 1000)}`.trim();
            if (n < 10000000) return `${convertToWords(Math.floor(n / 100000))} Lakh ${convertToWords(n % 100000)}`.trim();
            return `${convertToWords(Math.floor(n / 10000000))} Crore ${convertToWords(n % 10000000)}`.trim();
        };

        return `${convertToWords(num)} Only`;
    };

    // PDF Download handler
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
            const filename = `Salary-${formattedDate}-${employeeDetails?.employeeNumber}.pdf`;
            pdf.save(filename);
        } catch (error) {
            console.error('Error capturing content:', error);
        }
    };

    const Print = () => {
        window.print();
    };
    const handleChange = (date) => {
        setDateValue(date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        setCurrentMonth(month);
        setCurrentYear(year);
    };
    const contentRef = useRef(null);
    const handlePrint = useReactToPrint({ contentRef });

    useEffect(() => {

        salaryApi
            .getSalaryByEmployee(
                user.employeeId,
                month,
                year,
                get(user, 'token'),
            )
            .then((response) => {
                setEmployeeSalary(response.data.data.employeeSalary);
                setEmployeeDetails(response.data.data.employee);
                const unitCode = response.data.data.employeeSalary?.unitCode || res.data.data.employee?.sitecode;
                if (unitCode) {
                    siteAPI
                        .getSitedetailsBySiteCode(unitCode)
                        .then((siteRes) => {
                            setSiteDetails(siteRes.data.data || {})
                        })
                        .catch((err) => {
                            console.log('Erroe fetching site details:', err);

                        })
                }
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
        employeeAPI
            .getOtherDeductions(
                user.employeeId,
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
        // }
    }, [dateValue]);
    const formattedMonth = new Date(
        `${Number(year)}-${Number(month)}`,
    ).toLocaleString('default', { month: 'long' });
    const formattedDate = `${formattedMonth} - ${year}`;
    return (
        <>
            {/* Header Card */}
            <Card className="mb-3">
                <Card.Body>
                    <Row className="justify-content-between align-items-center">
                        <Col md>
                            {/* <h5 className="mb-2 mb-md-0">{salaryConstant.SALARY_SLIP}</h5> */}
                            <h5 className="mb-2 mb-md-0">Salary Slip</h5>
                        </Col>
                        <Col>
                            <DatePicker
                                format="MMM yyyy"
                                caretAs={BsCalendar2MonthFill}
                                value={dateValue}
                                onChange={handleChange}
                                shouldDisableDate={disableFutureDates}
                            />
                        </Col>
                        <Col xs="auto">
                            <IconButton
                                variant="falcon-default"
                                size="sm"
                                icon="arrow-down"
                                className="me-1 mb-2 mb-sm-0"
                                iconClassName="me-1"
                                onClick={downloadPDF}
                                disabled={isLoading || !employeeSalary}
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
                                disabled={isLoading || !employeeSalary}
                            >
                                Print
                            </IconButton>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Salary Slip Content */}

            <div
                id="pdf-content"
                ref={contentRef}
                className="print-page container w-100 h-100"
            >

                <Card className="print-page container w-100 h-100" >{/*whole container*/}

                    {/* Header Section */}
                    <Card.Body className="container table border border-bottom-0 border-dark border-3 rounded m-0 w-100 h-50" >{/*Header container*/}
                        <Row>
                            <p className='text-center  text-white bg-dark w-100'><strong>Rule 78(1)(b) of TamilNadu Contract Labour (Regulation & Abolition) Rules, 1975 - Form XXVIII</strong></p>
                        </Row>
                        <Row className="text-center mb-1 ">

                            {/* <img src={skyExlogo} alt="invoice" width={0} height={100} />logo */}
                            <img
                                src={skyExlogo}
                                alt="invoice"
                                className="img-fluid mx-auto d-block w-25 h-25"
                            />

                            <p className="salary-text mb-0 fs-2 text-center">
                                Sky Express{' '}
                            </p>
                            <p className="salary-text mb-0">Door No.15, Pudukkottai Road, Airport Trichy,
                                <br />Thirunagar, Thiruchirappalli - 620007
                            </p>
                            {/* <Col className='mt-1 mb-1' xs={12}>
                                <hr />
                            </Col> */}
                        </Row>

                        <p className="text-center m-1 fs-1">(Pay Slip For The Month of {formattedDate})</p>

                    </Card.Body>

                    {/* Employee Details Section */}
                    <Row className="container table border border-bottom-0 border-dark border-3 rounded m-0">{/*information-Mid container */}
                        <div className="container m-1">
                            {employeeDetails ? (
                                <>
                                    <EmployeeDetailRow
                                        label1="Emp ID"
                                        value1={employeeDetails.employeeNumber}
                                        label2="Company"
                                        value2={employeeDetails.siteName}
                                    />
                                    <EmployeeDetailRow
                                        label1="EMP NAME"
                                        value1={employeeDetails.employeeName}
                                        label2="UAN NO"
                                        value2={employeeDetails.documents?.pfNumber}
                                    />
                                    <EmployeeDetailRow
                                        label1="BANK NAME"
                                        value1={employeeDetails.bankDetails?.bankName}
                                        label2="ESI NO"
                                        value2={employeeDetails.documents?.esiNumber}
                                    />
                                    <EmployeeDetailRow
                                        label1="ACCOUNT NUMBER"
                                        value1={employeeDetails.bankDetails?.accountNumber}
                                        label2="BRANCH"
                                        value2={employeeDetails.bankDetails?.branch}

                                    />
                                    <EmployeeDetailRow
                                        label1="IFSCODE"
                                        value1={employeeDetails.bankDetails?.ifscode}
                                    // label2=""
                                    // value2=''
                                    />
                                </>
                            ) : (
                                <p>No employee details available.</p>
                            )}
                        </div>
                    </Row>

                    {/* Salary Table */}
                    {employeeSalary ? (
                        <SalaryTable
                            salary={employeeSalary}
                            numberToWords={numberToWords}
                        />
                    ) : (
                        <p className="text-center p-4">No salary details available</p>
                    )}

                    {/* Footer */}
                    <div className="text-center mt-3 mb-5 p-2 border border-dark">
                        <strong>(COMPUTER GENERATED PAY SLIP — NO SIGNATURE REQUIRED)</strong>
                    </div>
                </Card>
            </div>
            <style>{`
  @media print {
    .print-page {
      margin: 0 !important;
      padding: 0 !important;
      width: 100% !important;
    }

    .container {
      width: 100% !important;
      max-width: 100% !important;
    }
  }
    
`}
            </style>
        </>

    );
};

// Employee Detail Row Component
const EmployeeDetailRow = ({ label1, value1, label2, value2 }) => (
    <div className="row p-1">
        <div className="col-3 fw-bold">{label1}</div>
        <div className="col-3">{value1 || '-'}</div>
        <div className="col-3 fw-bold">{label2}</div>
        <div className="col-3">{value2 || '-'}</div>
    </div>
);

// Salary Table Component
const SalaryTable = ({ salary, numberToWords }) => (
    <table className="table table-bordered border-0 w-100 border-dark border-3 text-center">{/*table-mid container*/}
        <thead className="table-dark">
            <tr>
                <th colSpan="3">EARNING</th>
                <th colSpan="4">DEDUCTION</th>
            </tr>
        </thead>
        <tbody>
            <SalaryRow
                earning={<b>NO OF DUTY</b>}
                earningAmount={salary.totalWorkingDays}
                earningTotal={salary.totalDuties}
                deduction1={"PF (12%)"}
                deductionAmount1={salary.employeePf > 0 ? salary.employeePf : "0"}
                deduction2="ADVANCE"
                deductionAmount2={salary.advances > 0 ? salary.advances : " - "}
            />
            <SalaryRow
                earning={<b>BASIC SALARY</b>}
                earningAmount={salary.basicSalary}
                earningTotal={salary.basicSalaryValue}
                deduction1={"ESI (0.75%)"}
                deductionAmount1={salary.employeeEsi > 0 ? salary.employeeEsi : "0"}
                deduction2="Transport"
                deductionAmount2={salary.transport > 0 ? salary.transport : " - "}
            />
            <SalaryRow
                earning={<b>DA</b>}
                earningAmount={salary.da}
                earningTotal={salary.daValue}
                deduction1=""
                deductionAmount1=""
                deduction2="FINE"
                deductionAmount2={salary.fine > 0 ? salary.fine : " - "}
            />
            <SalaryRow
                earning={<b>HRA</b>}
                earningAmount={salary.hra}
                earningTotal={salary.hraValue}
                deduction1=""
                deductionAmount1=""
                deduction2="EMI"
                deductionAmount2={salary.emi > 0 ? salary.emi : " - "}
            />
            <SalaryRow
                earning={<b>Other Allowance</b>}
                earningAmount={salary.otherAllowance}
                earningTotal={salary.otherAllowanceValue}
                deduction1=""
                deductionAmount1=""
                deduction2="ID CARD"
                deductionAmount2={salary.idcard > 0 ? salary.idcard : " - "}
            />

            <tr className="border-0">
                <th className="text-start border-start border-end bg-dark text-white border-dark">TOTAL SALARY </th>
                <th className="text-end border-end border-dark bg-dark text-white">{salary.totalsalary}</th>
                <td className="text-end border-end border-dark bg-dark text-white">{salary.totalDailyEarnings}</td>
                <td className="text-start border-end border-dark"></td>
                <td className="text-end border-end border-dark"></td>
                <td className="text-start border-end border-0 border-dark">OTHERS </td>
                <td className="text-end border-0 border-end border-dark">{salary.others > 0 ? salary.others : " - "} </td>
            </tr>
            <SalaryRow
                earning="ATTENDANCE BONUS"
                earningAmount={salary.attendanceBonus}
                earningTotal={salary.attendanceBonus}
            />
            <SalaryRow
                earning=""
                earningAmount=""
                earningTotal=""
            />
            <tr className="border-2 border-top-0 border-end border-start border-dark">
                <td className="text-start border-top-0 border border-end border-start border-dark"> </td>
                <td className="text-end border-end border-start border-dark"> </td>
                <td className="text-end border-end border-start border-dark"> </td>
                <td className="text-start border-0 border-start bg-dark text-white border-end border-dark">TOTAL ESI/PF </td>
                <td className="text-end border-0 border-end border-dark bg-dark text-white">{salary.totalEsiPf}</td>
                <td className="text-start border-start border-end border-dark bg-dark text-white">
                    TOTAL
                </td>
                <td className="text-end border-end border-dark bg-dark text-white">{salary.deduction}</td>
            </tr>



            <tr className="border-2 border border-end border-dark">
                <td colSpan="2" className="bg-light-gray border-end border-dark"><b>GROSS</b></td>
                <td className="text-end border-end border-dark">{salary.grossAB}</td>
                <td colSpan="2" className="bg-light-gray border-dark border-end"><b>TOTAL DEDUCTION</b></td>
                <td colSpan="2" className="text-end border-end border-dark bg-light-gray">
                    <strong><b>{salary.totalDeduction}</b></strong>
                </td>
            </tr>
        </tbody>
        <tbody>
            <tr>
                <td colSpan="4" className="text-center fs-2 border-bottom border-start border-dark text-dark">
                    <strong>RS. {numberToWords(salary.netSalary)}</strong>
                </td>
                <td className="bg-light border-start border-bottom border-dark fs-2">
                    <strong><b>NET PAY</b></strong>
                </td>
                <td className="text-end border-start border-bottom border-end border-dark bg-light fs-3" colSpan="2">
                    <strong>{salary.netSalary}</strong>
                </td>
            </tr>
        </tbody>
    </table>
);

// Salary Row Component
const SalaryRow = ({
    earning,
    earningAmount,
    earningTotal,
    deduction1,
    deductionAmount1,
    deduction2,
    deductionAmount2,
}) => (
    <tr className="border-0">
        <td className="text-start border-end border-start border-dark">{earning}</td>
        <td className="text-end border-end border-dark">{earningAmount}</td>
        <td className="text-end border-end border-dark">{earningTotal}</td>
        <td className="text-start border-end border-dark">{deduction1 || ''}</td>
        <td className="text-end border-start border-end border-dark">{deductionAmount1 || ''}</td>
        <td className="text-start border-end border-dark">{deduction2 || ''}</td>
        <td className="text-end border-end border-dark">{deductionAmount2 || ''}</td>
    </tr>
);

export default YourPayload;
