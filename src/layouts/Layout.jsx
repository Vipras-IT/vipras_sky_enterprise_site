import { useContext, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import is from 'is_js';
import MainLayout from './MainLayout';

import ErrorLayout from './ErrorLayout';
import { ToastContainer } from 'react-toastify';
import { CloseButton } from 'components/common/Toast';

import Error404 from 'components/errors/Error404';
import Error500 from 'components/errors/Error500';

import SplitLogin from 'components/authentication/split/Login';
import SplitLogout from 'components/authentication/split/Logout';
import SplitForgetPassword from 'components/authentication/split/ForgetPassword';
import SplitPasswordReset from 'components/authentication/split/PasswordReset';
import SplitConfirmMail from 'components/authentication/split/ConfirmMail';
import SplitLockScreen from 'components/authentication/split/LockScreen';

import RegistrationWizard from 'components/Registration/RegistrationWizard';
// import Registration from 'components/Registration/LayoutForm';

import Dashboard from 'components/dashboards/default';
import AppContext from '../context/Context';
import EmployeeSingleView from 'components/employees/EmployeeSingleView';
import SiteCreation from 'components/Registration/site-details/SiteCreation';
import LeadGeneration from 'components/Registration/LeadGeneration';
import SiteList from 'components/Registration/site-details/SiteList';
import LeadList from 'components/Registration/LeadList';
import AddAttendanceContainer from 'components/attendance/AddEmployeeAttendanceContainer';
import ShiftScheduleContainer from 'components/attendance/ShiftScheduleContainer';
import SiteAssest from 'components/Registration/site-details/SiteAssest';
import AttendanceReportsContainer from 'components/attendance/AttendanceReportsContainer';
import UpdateAttendance from 'components/attendance/UpdateAttendance';
import ManualAttendanceReport from 'components/attendance/ManualAttendanceReport';
import HomeFormSuvery from 'components/site-survey/HomeForm';
import { QueryClientProvider, QueryClient } from 'react-query';
import SiteManpowerSalary from 'components/Registration/site-details/SiteManpowerSalary';
import SiteSingleView from 'components/Registration/site-details/SiteSingleView';
import EmployeeReports from 'components/Reports/EmployeeReports';
import SiteReport from 'components/Reports/SiteReport';
import StockMaintenance from 'components/Registration/stock-maintenance/StockMaintenance';
import ImprestHolderCredit from 'components/accounts-transaction/AccountsTransaction';
import ImprestHolderCreditList from 'components/accounts-transaction/AccountsTransactionList';
import ProductList from 'components/Registration/master-data/ProductList';
import AddNewRental from 'components/Registration/master-data/AddNewRental';
import RentalRoomList from 'components/Registration/master-data/RentalRoomList';
import AddList from 'components/Registration/Usermanagement/AddList';
import ListUser from 'components/Registration/Usermanagement/ListUser';
import Sale from 'components/Registration/Sales/Sale';
import Salesdetails from 'components/Registration/Sales/Salesdetails';
import ProductTable from 'components/Registration/Sales/ProductTable';
import AddProduct from 'components/Registration/master-data/AddNewProduct';
import AddDocument from 'components/documents/AddDocument';
import AddPhotos from 'components/documents/AddPhoto';
import SaleSingleView from 'components/Registration/Sales/SaleSingleView';
import RentalSingleView from 'components/Registration/master-data/RentalSingleView';
import AddVendor from 'components/Registration/master-data/AddVendor';
import VendorList from 'components/Registration/master-data/VendorList';
import PurchaseContainer from 'components/purchase/PurchaseContainer';
import PurchaseListContainer from 'components/purchase/PurchaseListContainer';
import SubContractorTransaction from 'components/Registration/SubcontractorTransaction/SubcontractorTransaction';
import SubContractorTransactionList from 'components/Registration/SubcontractorTransaction/SubcontractorTransactionList';
import StorePurchaseSingleView from 'components/purchase/StorePurchaseSingleView';
import AssetPurchaseSingleView from 'components/purchase/AssetPurchaseSingleView';
import AssetMovementRegister from 'components/AssetMovementRegister/AssetMovementRegister';
import AssetRegisterList from 'components/AssetMovementRegister/AssetRegisterList';
import OtherDeductions from 'components/other-deductions/otherDeductions';
import OtherDeductionsList from 'components/other-deductions/otherDeductionsList';
import OtherDeductionsSingleView from 'components/other-deductions/OtherDeductionsSingleView';
import SaleReturn from 'components/Registration/saleReturn/AddSaleReturn';
import SaleReturnDetails from 'components/Registration/saleReturn/saleReturndetails';
// import StoreVendorManagement from 'components/StoreVendorManagement/StoreVendorManagement';
import StoreVendorPaymentManagement from 'components/StoreVendorManagement/StoreVendorPaymentManagement';
import ImprestHolderTransaction from 'components/imprestHolderTransaction/ImprestHolderTransaction';
import ImprestHolderTransactionList from 'components/imprestHolderTransaction/ImprestHolderTransactionList';
import StoreVendorReport from 'components/StoreVendorManagement/StoreVendorReport';
import ImprestHolderList from 'components/imprest-holder/ImprestHolderList';
import ImpresHolderProfile from 'components/imprest-holder/ImpresHolderProfile';
import YourManualAttendanceReport from 'components/imprest-holder/YourManualAttendanceReport';
import YourAttendanceReports from 'components/imprest-holder/YourAttendanceReports';
import YourPayload from '../components/employeeSalary/YourPayload';
import Salary from 'components/employeeSalary/Salary';
import SalaryReport from 'components/employeeSalary/SalaryReport';
import Invoice from 'components/employeeSalary/Invoice';
import EmployeeList from 'components/employees/EmployeeList';
import GstInvoice from 'components/employeeSalary/gstInvoice';
import FmCall from 'components/crm/FmCall';
import LeadListFms from 'components/Registration/LeadListFms';
import LeadListDc from 'components/Registration/LeadListDc';
import LeadListForm from 'components/Registration/LeadListForm';
import TicketList from 'components/imprest-holder/TicketList';
import Tickets from 'components/imprest-holder/Tickets';
import InternalCall from 'components/crm/InternalCall';
import InternalTicketList from 'components/imprest-holder/InternalTicketList';
import InternalEditCall from 'components/crm/InternalEditCall';
import ExternalListContainar from 'components/imprest-holder/ExternalListContainar';
import OtherTicketEdit from 'components/imprest-holder/OtherTicketEdit';
import DcCallTicketEdit from 'components/imprest-holder/DcCallTicketEdit';
import GeneratedReports from 'components/attendance/ReportsBySiteContainer';
import GstInvoiceReport from 'components/employeeSalary/gstInvoiceReport';
import GstInvoiceEdit from 'components/employeeSalary/GstInvoiceEdit';
import AddNotification from 'components/notification/AddNotification';
import CreateManualInvoice from 'components/employeeSalary/CreateManualInvoice';
import ManualInvoiceReport from 'components/employeeSalary/ManualInvoiceReport';
import AddRole from 'components/notification/Role';
import InActiveEmployeSalaryReport from 'components/employeeSalary/InActiveEmployeSalaryReport';
import MonthlyBreakUp from 'components/breakUp/monthlyBreakup';
import DailyBreakUp from 'components/breakUp/dailyBreakUp';
import BulkAttendance from 'components/bulkAttendance/BulkAttendance';
import BulkAttendanceReport from 'components/bulkAttendance/BulkAttendanceReport';
import SiteAttendanceReports from 'components/attendance/SiteAttendanceReport';
import SiteAttendanceList from 'components/attendance/SiteAttendanceList';
import SiteAttendanceByEmployee from 'components/attendance/SiteAttendanceByEmployee';
import PendingVerification from 'components/employees/PendingVerification';
import EmployeeVerificationView from 'components/employees/EmployeeVerificationView';
import AddExpenses from 'components/expenses/AddExpenses';
import PendingImprestHolderTransactionList from 'components/imprest-holder/PendingImprestHolderList';
import PendingRejectDetails from 'components/imprest-holder/PendingRejectDetails';
import SubContracterInvoiceReport from 'components/employeeSalary/SubContracterInvoiceReport';
import ClubedSalaryreport from 'components/employeeSalary/ClubedSalaryreport';
import SubcontractorRepords from 'components/Reports/SubcontractorRepords';
import ProfitLossReport from 'components/ExpensesReports/ProfitAndLoss';
import SiteExpensesReport from 'components/ExpensesReports/SiteExpensesReports';
import ImprestExpensesReport from 'components/ExpensesReports/ImprestExpensesReport';
import SiteShiftSchedule from 'components/Registration/site-details/SiteShift';
import DmrReport from 'components/documents/DmrReport';
import AddDmrDocument from 'components/documents/AddDmrDocument';
import DmrDailyReport from 'components/documents/DmrDailyReport';
import ShiftPlan from 'components/attendance/ShiftPlan';
import SiteWisePlReport from 'components/ExpensesReports/SiteWisePlReport';
import AllRolesList from 'components/notification/AllRolesList';
import OutStandingCreation from 'components/outStanding/OutStandingCreation';
import OutStandingList from 'components/outStanding/OutStandingList';
import ProfitAndLossContainer from 'components/ExpensesReports/ProfitAndLossContainer';
import GrossProfitAndLoss from 'components/ExpensesReports/GrossProfitAndLoss';
import SubContractorOutStandingList from 'components/outStanding/SubContractorOutStandingList';
import CollectionExpensesReport from 'components/ExpensesReports/CollectionExpensesReport';
import AccessMenu from 'components/navbar/access/AccessMenu';
import CompareAgreedAcutal from 'components/employeeSalary/CompareAgreedAcutal';
import HkConsumableComparision from 'components/ExpensesReports/HkConsumableComparision';
import OverHeadCalculation from 'components/ExpensesReports/OverHeadCalculation';
import AdminComparison from 'components/ExpensesReports/AdminComparison';
import AxiosInterceptor from '../api/AxiosInterceptor';
import AddNewBranch from '../components/Registration/master-data/AddNewBranch';
import BranchList from '../components/Registration/master-data/BranchList';
import AddResume from '../components/resume/AddResume';
import AddLiability from '../components/liability/AddLiability';
import ResumeList from '../components/resume/ResumeList';
import LiabilityList from '../components/liability/LiabilityList';
import FaceList from '../components/resume/FaceList';
import SubcontractorRepordsTemp from '../components/Reports/SubcontractorRepordsTemp';
import SubcontractorMonthlyReports from '../components/Reports/SubcontractorMonthlyReports';
import LeaveManagement from '../components/Leave-Management/LeaveManagement';

const queryClient = new QueryClient();

const Layout = () => {
  const HTMLClassList = document.getElementsByTagName('html')[0].classList;
  const {
    config: { navbarPosition },
  } = useContext(AppContext);

  useEffect(() => {
    if (is.windows()) {
      HTMLClassList.add('windows');
    }
    if (is.chrome()) {
      HTMLClassList.add('chrome');
    }
    if (is.firefox()) {
      HTMLClassList.add('firefox');
    }
    if (is.safari()) {
      HTMLClassList.add('safari');
    }
  }, [HTMLClassList]);

  useEffect(() => {
    if (navbarPosition === 'double-top') {
      HTMLClassList.add('double-top-nav-layout');
    }
    return () => HTMLClassList.remove('double-top-nav-layout');
  }, [navbarPosition]);

  return (
    <>
      <AxiosInterceptor>
        <Routes>
          <Route element={<ErrorLayout />}>
            <Route path="/404" element={<Error404 />} />
            <Route path="/500" element={<Error500 />} />
          </Route>
          {/*- ------------- Authentication ---------------------------  */}

          <Route path="/login" element={<SplitLogin />} />
          <Route path="/logout" element={<SplitLogout />} />
          <Route path="/forgot-password" element={<SplitForgetPassword />} />
          <Route path="/reset-password" element={<SplitPasswordReset />} />
          <Route path="/confirm-mail" element={<SplitConfirmMail />} />
          <Route path="/lock-screen" element={<SplitLockScreen />} />

          {/* <Route element={<WizardAuth />}>
          <Route path="/registration" element={<Wizard validation={true} />} />
        </Route>

        <Route element={<WizardAuth />}>
          <Route
            path="/registration1"
            element={<RegistrationWizard validation={true} />}
          />
  </Route> */}

          {/* //--- MainLayout Starts  */}

          <Route element={<MainLayout />}>
            {/*Dashboard*/}
            <Route path="/" element={<Dashboard />} />
            <Route
              path="/employeeList"
              element={
                <QueryClientProvider client={queryClient}>
                  <EmployeeList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/pending-verification"
              element={
                <QueryClientProvider client={queryClient}>
                  <PendingVerification />
                </QueryClientProvider>
              }
            />
            <Route path="/accessmenu" element={<AccessMenu />} />
            <Route
              path="/registration"
              element={<RegistrationWizard validation={true} />}
            />
            <Route path="/invoice" element={<Invoice />} />
            <Route path="/monthly-breakup" element={<MonthlyBreakUp />} />
            <Route path="/daily-breakup" element={<DailyBreakUp />} />
            <Route path="/profit-loss" element={<ProfitLossReport />} />
            <Route
              path="/gross-profit-loss"
              element={
                <QueryClientProvider client={queryClient}>
                  <GrossProfitAndLoss />
                </QueryClientProvider>
              }
            />
            <Route
              path="/department-profit-loss"
              element={
                <QueryClientProvider client={queryClient}>
                  <ProfitAndLossContainer validation={true} />
                </QueryClientProvider>
              }
            />
            <Route
              path="/collection-expenses"
              element={
                <QueryClientProvider client={queryClient}>
                  <CollectionExpensesReport validation={true} />
                </QueryClientProvider>
              }
            />

            <Route
              path="/site-expenses-report"
              element={<SiteExpensesReport />}
            />

            <Route path="/site-wise-pl-report" element={<SiteWisePlReport />} />
            <Route
              path="/imprest-expenses-report"
              element={<ImprestExpensesReport />}
            />
            <Route path="/manual-invoice" element={<ManualInvoiceReport />} />
            <Route path="/invoice/:id" element={<Invoice />} />
            <Route path="/gstinvoice" element={<GstInvoice />} />
            <Route path="/gstinvoice/:id" element={<GstInvoice />} />
            <Route
              path="/registration/:employeeid"
              element={<RegistrationWizard validation={true} />}
            />
            <Route
              path="/employeeview/:employeeid"
              element={<EmployeeSingleView />}
            />
            <Route
              path="/employee-verification/:employeeid"
              element={<EmployeeVerificationView />}
            />
            <Route
              path="/impress-list"
              element={
                <QueryClientProvider client={queryClient}>
                  <ImprestHolderList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/pending-impress-list"
              element={
                <QueryClientProvider client={queryClient}>
                  <PendingImprestHolderTransactionList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/external-list"
              element={
                <QueryClientProvider client={queryClient}>
                  <ExternalListContainar />
                </QueryClientProvider>
              }
            />
            <Route
              path="/tickets-list"
              element={
                <QueryClientProvider client={queryClient}>
                  <TicketList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/internal-tickets-list"
              element={
                <QueryClientProvider client={queryClient}>
                  <InternalTicketList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/your-manual-attendance-report"
              element={
                <QueryClientProvider client={queryClient}>
                  <YourManualAttendanceReport />
                </QueryClientProvider>
              }
            />
            <Route
              path="/your-attendance-report"
              element={
                <QueryClientProvider client={queryClient}>
                  <YourAttendanceReports />
                </QueryClientProvider>
              }
            />
            <Route
              path="/your-attendance-report/:employeeId/:month/:year"
              element={
                <QueryClientProvider client={queryClient}>
                  <YourAttendanceReports />
                </QueryClientProvider>
              }
            />
            <Route path="/impress-profile" element={<ImpresHolderProfile />} />
            {/*<Route path="/location" element={<Location />} />*/}
            <Route
              path="/sitecreation"
              element={<SiteCreation validation={true} />}
            />
            <Route path="/leadgeneration" element={<LeadGeneration />} />
            <Route path="/add-liability" element={<AddLiability />} />

            <Route path="/internal" element={<InternalCall />} />
            <Route path="/leadgeneration/:id" element={<LeadGeneration />} />
            <Route path="/fmcall" element={<FmCall />} />
            <Route
              path="/sitelist"
              element={
                <QueryClientProvider client={queryClient}>
                  <SiteList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/your-payroll"
              element={
                <QueryClientProvider client={queryClient}>
                  <YourPayload />
                </QueryClientProvider>
              }
            />
            <Route
              path="/sitecreation/:siteId"
              element={<SiteCreation validation={true} />}
            />
            <Route path="/leadlistform" element={<LeadListForm />} />
            <Route path="/leadlist" element={<LeadList />} />
            <Route path="/leadlistfms" element={<LeadListFms />} />
            <Route path="/leadlistdc" element={<LeadListDc />} />
            <Route path="/attendance" element={<AddAttendanceContainer />} />
            <Route path="/update-attendance" element={<UpdateAttendance />} />
            <Route path="/bulk-attendance" element={<BulkAttendance />} />
            <Route
              path="/update-attendance/:id"
              element={<UpdateAttendance />}
            />
            <Route path="/shiftschedule" element={<ShiftScheduleContainer />} />
            <Route path="/site-shiftschedule" element={<SiteShiftSchedule />} />
            <Route path="/shiftplan" element={<ShiftPlan />} />
            <Route path="/siteassest" element={<SiteAssest />} />
            <Route
              path="/attendance-report"
              element={<AttendanceReportsContainer />}
            />
            <Route
              path="/site-attendance-report"
              element={<SiteAttendanceReports />}
            />
            <Route
              path="/site-attendance-employee"
              element={<SiteAttendanceByEmployee />}
            />

            <Route
              path="/site-attendance-list"
              element={
                <QueryClientProvider client={queryClient}>
                  <SiteAttendanceList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/site-attendance-list/:Id/:day/:month/:year"
              element={
                <QueryClientProvider client={queryClient}>
                  <SiteAttendanceList />
                </QueryClientProvider>
              }

            />
            {/* <Route
            path="/attendance-report/:employeeId"
            element={<AttendanceReportsContainer />}
          /> */}
            <Route path="/sitesuvey" element={<HomeFormSuvery />} />
            <Route path="/sitemanpower" element={<SiteManpowerSalary />} />
            <Route
              path="/sitesingleview/:siteId"
              element={<SiteSingleView />}
            />
            <Route
              path="/salesingleview/:saleId"
              element={<SaleSingleView />}
            />
            <Route
              path="/leave-management"
              element={
                <QueryClientProvider client={queryClient}>
                  <LeaveManagement />
                </QueryClientProvider>
              }
            />
            <Route path="/salary" element={<Salary />} />
            <Route path="/salary/:employeeNumber" element={<Salary />} />
            <Route
              path="/rentalsingleview/:roomId"
              element={<RentalSingleView />}
            />
            <Route path="/employeereport" element={<EmployeeReports />} />
            <Route path="/sitereport" element={<SiteReport />} />
            <Route path="/addlist" element={<AddList validation={true} />} />
            <Route
              path="/addlist/:userId"
              element={<AddList validation={true} />}
            />
            <Route
              path="/listuser"
              element={
                <QueryClientProvider client={queryClient}>
                  <ListUser />
                </QueryClientProvider>
              }
            />
            <Route path="/sale" element={<Sale validation={true} />} />
            <Route path="/sale/:saleId" element={<Sale validation={true} />} />
            <Route path="/producttable" element={<ProductTable />} />
            <Route
              path="/salesdetails"
              element={
                <QueryClientProvider client={queryClient}>
                  <Salesdetails />
                </QueryClientProvider>
              }
            />
            <Route
              path="/dmr-report"
              element={
                <QueryClientProvider client={queryClient}>
                  <DmrReport />
                </QueryClientProvider>
              }
            />
            <Route
              path="/dmr-fm-report"
              element={
                <QueryClientProvider client={queryClient}>
                  <DmrDailyReport />
                </QueryClientProvider>
              }
            />
            <Route
              path="/add-dmr-document"
              element={
                <QueryClientProvider client={queryClient}>
                  <AddDmrDocument />
                </QueryClientProvider>
              }
            />
            <Route
              path="/saleReturnDetails"
              element={
                <QueryClientProvider client={queryClient}>
                  <SaleReturnDetails />
                </QueryClientProvider>
              }
            />
            <Route
              path="/stockmaintenance"
              element={
                <QueryClientProvider client={queryClient}>
                  <StockMaintenance />
                </QueryClientProvider>
              }
            />
            <Route
              path="/stockmaintenance"
              element={
                <QueryClientProvider client={queryClient}>
                  <StockMaintenance />
                </QueryClientProvider>
              }
            />
            <Route
              path="/manual-attendance-report"
              element={
                <QueryClientProvider client={queryClient}>
                  <ManualAttendanceReport />
                </QueryClientProvider>
              }
            />
            <Route
              path="/bulk-attendance-report"
              element={
                <QueryClientProvider client={queryClient}>
                  <BulkAttendanceReport />
                </QueryClientProvider>
              }
            />
            <Route path="/addbranch" element={<AddNewBranch />} />
            <Route path="/addproduct" element={<AddProduct />} />
            <Route
              path="/addproduct/:id"
              element={
                <QueryClientProvider client={queryClient}>
                  <AddProduct />
                </QueryClientProvider>
              }
            />
            <Route path="/adddocument" element={<AddDocument />} />
            <Route path="/addphotos" element={<AddPhotos />} />
            <Route
              path="/imprestholder-credit"
              element={<ImprestHolderCredit validation={true} />}
            />
            <Route
              path="/imprestholder-credit/:id"
              element={<ImprestHolderCredit validation={true} />}
            />
            <Route
              path="/add-new-rental-rooms"
              element={<AddNewRental validation={true} />}
            />
            <Route
              path="/add-resume"
              element={<AddResume validation={true} />}
            />
            <Route
              path="/tickets/:id"
              element={<Tickets validation={true} />}
            />
            <Route
              path="/other-tickets/:id"
              element={<OtherTicketEdit validation={true} />}
            />
            <Route
              path="/dc-tickets/:id"
              element={<DcCallTicketEdit validation={true} />}
            />

            <Route
              path="/internal-tickets/:id"
              element={<InternalEditCall validation={true} />}
            />
            <Route
              path="/pending-details/:id"
              element={<PendingRejectDetails validation={true} />}
            />
            <Route path="/tickets" element={<Tickets validation={true} />} />
            <Route
              path="/sub-contaracter"
              element={<SubcontractorRepords validation={true} />}
            />
            <Route
              path="/sub-contractor-monthly"
              element={<SubcontractorMonthlyReports validation={true} />}
            />
            {/* //0452 have to remove  start */}
            <Route
              path="/sub-contaracter-report"
              element={<SubcontractorRepordsTemp validation={true} />}
            />
            {/* //0452 have to remove  end */}

            <Route
              path="/add-new-rental-rooms/:roomId"
              element={<AddNewRental validation={true} />}
            />
            {/* <Route
            path="/imprestholder-creditlist/:id"
            element={
              <QueryClientProvider client={queryClient}>
                <ImprestHolderCreditList />
              </QueryClientProvider>
            }
          /> */}
            <Route
              path="/imprestholder-creditlist"
              element={
                <QueryClientProvider client={queryClient}>
                  <ImprestHolderCreditList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/comparision-agreed-acutal"
              element={<CompareAgreedAcutal />}
            />
            <Route
              path="/subcontractorTransaction"
              element={
                <QueryClientProvider client={queryClient}>
                  <SubContractorTransaction />
                </QueryClientProvider>
              }
            />
            <Route
              path="/imprestholder-Transaction/:id"
              element={
                <QueryClientProvider client={queryClient}>
                  <ImprestHolderTransaction />
                </QueryClientProvider>
              }
            />
            <Route
              path="/imprestholder-Transaction"
              element={
                <QueryClientProvider client={queryClient}>
                  <ImprestHolderTransaction />
                </QueryClientProvider>
              }
            />
            <Route
              path="/imprestholder-transaction-list"
              element={
                <QueryClientProvider client={queryClient}>
                  <ImprestHolderTransactionList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/subcontractorTransaction/:subId"
              element={
                <QueryClientProvider client={queryClient}>
                  <SubContractorTransaction />
                </QueryClientProvider>
              }
            />
            <Route
              path="/subcontractorTransactionList"
              element={
                <QueryClientProvider client={queryClient}>
                  <SubContractorTransactionList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/outstanding"
              element={
                <QueryClientProvider client={queryClient}>
                  <OutStandingCreation />
                </QueryClientProvider>
              }
            />
            <Route
              path="/outstanding-list"
              element={
                <QueryClientProvider client={queryClient}>
                  <OutStandingList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/sub-contractor-outstanding-list"
              element={
                <QueryClientProvider client={queryClient}>
                  <SubContractorOutStandingList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/sub-contractor-outstanding-list"
              element={
                <QueryClientProvider client={queryClient}>
                  <SubContractorOutStandingList />
                </QueryClientProvider>
              }
            />

            <Route
              path="/productlist"
              element={
                <QueryClientProvider client={queryClient}>
                  <ProductList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/branchlist"
              element={
                <QueryClientProvider client={queryClient}>
                  <BranchList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/hkconsumableComparision"
              element={
                <QueryClientProvider client={queryClient}>
                  <HkConsumableComparision />
                </QueryClientProvider>
              }
            />

            <Route
              path="/overhead-calculation"
              element={
                <QueryClientProvider client={queryClient}>
                  <OverHeadCalculation />
                </QueryClientProvider>
              }
            />

            <Route
              path="/admin-comparison"
              element={
                <QueryClientProvider client={queryClient}>
                  <AdminComparison />
                </QueryClientProvider>
              }
            />

            <Route
              path="/rental-rooms-list"
              element={
                <QueryClientProvider client={queryClient}>
                  <RentalRoomList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/storevendor-report"
              element={
                <QueryClientProvider client={queryClient}>
                  <StoreVendorReport />
                </QueryClientProvider>
              }
            />
            <Route
              path="/store-vendor-payment-management/:id"
              element={
                <QueryClientProvider client={queryClient}>
                  <StoreVendorPaymentManagement />
                </QueryClientProvider>
              }
            />
            <Route
              path="/add-new-vendor"
              element={
                <QueryClientProvider client={queryClient}>
                  <AddVendor />
                </QueryClientProvider>
              }
            />
            <Route
              path="/addnotifications"
              element={
                <QueryClientProvider client={queryClient}>
                  <AddNotification />
                </QueryClientProvider>
              }
            />
            <Route
              path="/addrole"
              element={
                <QueryClientProvider client={queryClient}>
                  <AddRole />
                </QueryClientProvider>
              }
            />
            <Route
              path="/role-list"
              element={
                <QueryClientProvider client={queryClient}>
                  <AllRolesList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/addexpenses"
              element={
                <QueryClientProvider client={queryClient}>
                  <AddExpenses />
                </QueryClientProvider>
              }
            />
            <Route
              path="/add-new-vendor/:id"
              element={
                <QueryClientProvider client={queryClient}>
                  <AddVendor />
                </QueryClientProvider>
              }
            />
            <Route
              path="/gstinvoice-edit/:id"
              element={
                <QueryClientProvider client={queryClient}>
                  <GstInvoiceEdit />
                </QueryClientProvider>
              }
            />
            <Route
              path="/salaryreport"
              element={
                <QueryClientProvider client={queryClient}>
                  <SalaryReport />
                </QueryClientProvider>
              }
            />
            <Route
              path="/clubedSalaryreport"
              element={
                <QueryClientProvider client={queryClient}>
                  <ClubedSalaryreport />
                </QueryClientProvider>
              }
            />
            <Route
              path="/inactive-employe-salaryreport"
              element={
                <QueryClientProvider client={queryClient}>
                  <InActiveEmployeSalaryReport />
                </QueryClientProvider>
              }
            />
            <Route
              path="/gstinvoice-report"
              element={
                <QueryClientProvider client={queryClient}>
                  <GstInvoiceReport />
                </QueryClientProvider>
              }
            />
            <Route
              path="/sub-contracter-invoice-report"
              element={
                <QueryClientProvider client={queryClient}>
                  <SubContracterInvoiceReport />
                </QueryClientProvider>
              }
            />
            <Route path="/generatereport" element={<GeneratedReports />} />
            <Route
              path="/vendor-list"
              element={
                <QueryClientProvider client={queryClient}>
                  <VendorList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/other-deductions"
              element={
                <QueryClientProvider client={queryClient}>
                  <OtherDeductions />
                </QueryClientProvider>
              }
            />
            <Route
              path="/other-deductions/:id"
              element={
                <QueryClientProvider client={queryClient}>
                  <OtherDeductions />
                </QueryClientProvider>
              }
            />
            <Route
              path="/other-deductions-singleView/:id"
              element={<OtherDeductionsSingleView />}
            />
            <Route
              path="/other-deductions-list"
              element={
                <QueryClientProvider client={queryClient}>
                  <OtherDeductionsList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/resume-list"
              element={
                <QueryClientProvider client={queryClient}>
                  <ResumeList />
                </QueryClientProvider>
              }
            />

            <Route
              path="/face-list"
              element={
                <QueryClientProvider client={queryClient}>
                  <FaceList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/liability"
              element={
                <QueryClientProvider client={queryClient}>
                  <LiabilityList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/asset-movement-register-list"
              element={
                <QueryClientProvider client={queryClient}>
                  <AssetRegisterList />
                </QueryClientProvider>
              }
            />
            <Route
              path="/asset-movement-register"
              element={
                <QueryClientProvider client={queryClient}>
                  <AssetMovementRegister />
                </QueryClientProvider>
              }
            />
            {/* <Route
            path="/store-vendor-management"
            element={
              <QueryClientProvider client={queryClient}>
                <StoreVendorManagement />
              </QueryClientProvider>
            }
          />
          <Route
            path="/store-vendor-management"
            element={<StoreVendorManagement />}
          /> */}
            <Route
              path="/purchase"
              element={<PurchaseContainer validation={true} />}
            />
            <Route
              path="/profit-and-loss"
              element={<ProfitAndLossContainer validation={true} />}
            />
            <Route
              path="/create-manual-invoice/:id"
              element={<CreateManualInvoice />}
            />
            <Route
              path="/create-manual-invoice"
              element={<CreateManualInvoice />}
            />
            <Route
              path="/purchase/:id"
              element={<PurchaseContainer validation={true} />}
            />
            <Route
              path="/assetpurchase/:assetId"
              element={<PurchaseContainer validation={true} activeKey={'2'} />}
            />
            <Route
              path="/hkpurchase/:id"
              element={<PurchaseContainer validation={true} activeKey={'3'} />}
            />
            <Route
              path="/storepurchasesingleview/:id"
              element={<StorePurchaseSingleView />}
            />
            <Route
              path="/assetpurchasesingleview/:id"
              element={<AssetPurchaseSingleView />}
            />

            <Route
              path="/purchasedetails"
              element={<PurchaseListContainer />}
            />
            <Route
              path="/consumable-purchase"
              element={
                <QueryClientProvider client={queryClient}>
                  <PurchaseListContainer validation={true} activeKey={'3'} />
                </QueryClientProvider>
              }
            />
            <Route
              path="/asset-purchaselist"
              element={
                <QueryClientProvider client={queryClient}>
                  <PurchaseListContainer validation={true} activeKey={'2'} />
                </QueryClientProvider>
              }
            />
            <Route
              path="/assetpurchasedetails/:id"
              element={<PurchaseListContainer validation={true} />}
            />
            <Route
              path="/saleReturn"
              element={
                <QueryClientProvider client={queryClient}>
                  <SaleReturn />
                </QueryClientProvider>
              }
            />
          </Route>
          {/* //--- MainLayout end  */}

          {/* <Navigate to="/errors/404" /> */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>

        <ToastContainer
          closeButton={CloseButton}
          icon={false}
          position="bottom-center"
        />
      </AxiosInterceptor>
    </>
  );
};

export default Layout;
