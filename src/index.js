import React, { lazy, Suspense } from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { Democontext } from "./Context/Democontext"
import Loader from "./Components/Loader"
import CircularProgress from "@mui/material/CircularProgress"
import RejectDisbursement from "./Screens/BMHome/Loans/RejectDisbursement"
import SearchMemberBM from "./Screens/BMHome/SearchMemberBM"

// const LoanTransactionsMain = lazy(() => import("./Screens/Reports/LoanTransactions/LoanTransactionsMain.jsx__BDCCB"));
// const PreviousLoanTransaction = lazy(()=> import('./Screens/Reports/PreviousLoanTransactions/PreviousLoanTransactions.jsx__BDCCB'));
// const TestPage = lazy(() => import("./Screens/Reports/LoanTransactions/testPage.jsx__BDCCB"));
// const LoanStatementMain =  lazy(() => import("./Screens/Reports/LoanStatements/LoanStatementMain.jsx__BDCCB"));
// const DemandReportsMain = lazy(() => import("./Screens/Reports/DemandReports/DemandReportsMain.jsx__BDCCB"));
// const DemandVsCollectionMain = lazy(() => import("./Screens/Reports/DemandVsCollectionReport/DemandVsCollectionMain.jsx__BDCCB"));
// const AdvanceCollectionReportMain = lazy(() => import("./Screens/Reports/AdvanceCollectionReport/AdvanceCollectionReportMain.jsx__BDCCB"));
// const GroupClose =  lazy(() => import("./Screens/Reports/GroupClose/GroupClose.jsx__BDCCB"));
// const OutstaningReportMain =  lazy(() => import("./Screens/Reports/OutstandingReports/OutstaningReportMain.jsx__BDCCB"));
// const OverdueReport = lazy(() => import("./Screens/Reports/OverdueReport/OverdueReport.jsx__BDCCB"));
// const GroupReport = lazy(() => import("./Screens/Reports/GroupReport/GroupReport.jsx__BDCCB"));
// const PortfolioReport =  lazy(() => import("./Screens/Reports/PortfolioReport/PortfolioReport.jsx__BDCCB"));
// const FundwiseMain = lazy(() => import("./Screens/Reports/SummaryReports/FundwiseReport/FundwiseMain.jsx__BDCCB"));
// const SchemewiseMain = lazy(() => import("./Screens/Reports/SummaryReports/SchemewiseReport/SchemewiseMain.jsx__BDCCB"));

// const Landing = lazy(() => import("./Screens/Landing/Landing.jsx__BDCCB"));

// const DisbursedLoanApproveSingleBM =  lazy(() => import("./Screens/BMHome/DisbursedLoanApproveSingleBM.jsx__BDCCB"));
// const ApproveMemberTransfer = lazy(() => import("./Screens/BMHome/ApproveMemberTransfer.jsx__BDCCB"));
// const AttendanceBM = lazy(() => import("./Screens/BMHome/AttendanceBM.jsx__BDCCB"));


////////////////////////////////////////////// BDCCB Start //////////////////////////////////////////////

const LandingOutlet = lazy(() => import("./Screens/Landing/LandingOutlet"));
const Notfound = lazy(() => import("./Screens/Notfound/Notfound"));
const SignInPage = lazy(() => import("./Screens/Login/SignInPage"));

//////////////// BDCCB ADMIN Start ////////////////
const HomeAdmin = lazy(() => import("./Screens/Admin/HomeAdmin"));
const AdminDashboard = lazy(() => import("./Screens/Admin/Dashboard/AdminDashboard"));

const MasterDistricts = lazy(() => import("./Screens/Admin/Master/Districts/MasterDistricts"));
const EditMasterDistricts = lazy(() => import("./Screens/Admin/Master/Districts/EditMasterDistricts"));

const MasterBlocks = lazy(() => import("./Screens/Admin/Master/Blocks/MasterBlocks"));
const EditMasterBlocks = lazy(() => import("./Screens/Admin/Master/Blocks/EditMasterBlocks"));

const PostMaster = lazy(() => import("./Screens/Admin/Master/PostMaster/PostMaster"));
const EditPostMaster = lazy(() => import("./Screens/Admin/Master/PostMaster/EditPostMaster"));

const PoliceStationMaster = lazy(() => import("./Screens/Admin/Master/PoliceStationMaster/PoliceStationMaster"));
const EditPoliceStationMaster = lazy(() => import("./Screens/Admin/Master/PoliceStationMaster/EditPoliceStationMaster"));

const GPListMaster = lazy(() => import("./Screens/Admin/Master/GPListMaster/GPListMaster"));
const EditGPListMaster = lazy(() => import("./Screens/Admin/Master/GPListMaster/EditGPListMaster"));

const VillageMaster = lazy(() => import("./Screens/Admin/Master/VillageMaster/VillageMaster"));
const EditVillageMaster = lazy(() => import("./Screens/Admin/Master/VillageMaster/EditVillageMaster"));

const BranchMaster = lazy(() => import("./Screens/Admin/Master/BranchMaster/BranchMaster"));
const EditBranchMaster = lazy(() => import("./Screens/Admin/Master/BranchMaster/EditBranchMaster"));

//////////////// BDCCB ADMIN End ////////////////

//////////////// BDCCB BM Start ////////////////

const HomeBM = lazy(() => import("./Screens/BMHome/HomeBM"))
const Dashboard = lazy(() => import("./Screens/BMHome/Dashboard/Dashboard"));

const SearchGroupBM = lazy(() => import("./Screens/BMHome/SearchGroupBM"))
const EditGroupFormBM = lazy(() => import("./Screens/BMHome/EditGroupFormBM.jsx"))

// const SearchGroupMemberBM = lazy(() => import("./Screens/BMHome/SearchGroupMemberBM.jsx__BDCCB"))
// const EditMemberGroupFormBM = lazy(() => import("./Screens/BMHome/EditMemberGroupFormBM.jsx__BDCCB"))

const SearchSahayikaBM = lazy(() => import("./Screens/BMHome/SearchSahayikaBM"))
const EditSahayikaFormBM = lazy(() => import("./Screens/BMHome/EditSahayikaFormBM"))

const EditDisburseFormBM_BDCCB = lazy(() => import("./Screens/BMHome/EditDisburseFormBM_BDCCB"))
const SearchMemberForDisburseBM_BDCCB = lazy(() => import("./Screens/BMHome/SearchMemberForDisburseBM_BDCCB.jsx"))

//////////////// BDCCB BM End ////////////////

//////////////// BDCCB PACS Start ////////////////

const HomePACS = lazy(() => import("./Screens/PACSHome/HomePACS"))
const PACSDashboard = lazy(() => import("./Screens/PACSHome/Dashboard/PACSDashboard"));

const EditDisburseFormPACS_BDCCB = lazy(() => import("./Screens/PACSHome/EditDisburseFormPACS_BDCCB.jsx"))
const SearchMemberForDisbursePACS_BDCCB = lazy(() => import("./Screens/PACSHome/SearchMemberForDisbursePACS_BDCCB.jsx"))

const DisbursedLoanApproveSinglePACS_BDCCB =  lazy(() => import("./Screens/PACSHome/DisbursedLoanApproveSinglePACS_BDCCB.jsx"));
const AcceptDisburseFormPACS_BDCCB =  lazy(() => import("./Screens/PACSHome/AcceptDisburseFormPACS_BDCCB.jsx"));

//////////////// BDCCB PACS End ////////////////

//////////////// BDCCB Transaction Open Start ////////////////

const EditTransactionFormBM_BDCCB = lazy(() => import("./Screens/BMHome/EditTransactionFormBM_BDCCB.jsx"))
const SearchTransactionBM_BDCCB = lazy(() => import("./Screens/BMHome/SearchTransactionBM_BDCCB.jsx"))

//////////////// BDCCB Transaction Open End ////////////////


////////////////////////////////////////////// BDCCB End //////////////////////////////////////////////



const MasterEmployees = lazy(() => import("./Screens/Admin/Master/Employees/MasterEmployees.jsx__BDCCB"));
const EditMasterEmployee = lazy(() => import("./Screens/Admin/Master/Employees/EditMasterEmployee"));


const CreateUser = lazy(() => import("./Screens/Admin/UserManagement/CreateUser"));
const ManageUser = lazy(() => import("./Screens/Admin/UserManagement/ManageUser"));
const TransferUserManage = lazy(() => import("./Screens/Admin/UserManagement/TransferUserManage"));
const TransferUser = lazy(() => import("./Screens/Admin/UserManagement/TransferUser"));
const AuditReport = lazy(()=> import('./Screens/Admin/UserManagement/AuditReport'))
const ALoanStatementMain = lazy(() => import("./Screens/Admin/Reports/LoanStatements/ALoanStatementMain"));
const ALoanTransactionsMain = lazy(() => import("./Screens/Admin/Reports/LoanTransactions/ALoanTransactionsMain"));
const ADemandReportsMain = lazy(() => import("./Screens/Admin/Reports/DemandReports/ADemandReportsMain"));
const AOutstandingReportMain = lazy(() => import("./Screens/Admin/Reports/OutstandingReports/AOutstandingReportMain"));

const AFundwiseMain = lazy(() => import("./Screens/Admin/Reports/SummaryReports/FundwiseReport/AFundwiseMain"));
const ASchemewiseMain = lazy(() => import("./Screens/Admin/Reports/SummaryReports/SchemewiseReport/ASchemewiseMain"));
const ADemandVsCollectionMain = lazy(() => import("./Screens/Admin/Reports/DemandVsCollectionReports/ADemandVsCollectionMain"));
const AttendanceDashboard = lazy(() => import("./Screens/Admin/Attendance/AttendanceDashboard"));

const MasterDesignations = lazy(() => import("./Screens/Admin/Master/Designations/MasterDesignations"));
const EditMasterDesignations = lazy(() => import("./Screens/Admin/Master/Designations/EditMasterDesignations"));
const TranceferCO = lazy(() => import("./Screens/BMHome/TranceferCO"));
const TransferCOScreen = lazy(() => import("./Screens/BMHome/TransferCOScreen"));
const TranceferCOApproveForm = lazy(() => import("./Screens/BMHome/TranceferCOApproveForm"));
const TransferCOApprovalUnic = lazy(() => import("./Screens/BMHome/TransferCOApprovalUnic"));
const MemberTransfer = lazy(() => import("./Screens/BMHome/MemberTransfer"));
const EditMemberTransfer = lazy(() => import("./Screens/Admin/Master/Employees/EditMemberTransfer"));

const ApproveEditMemberTrans = lazy(() => import("./Screens/Admin/Master/Employees/ApproveEditMemberTrans"));
const ViewMemberTransfer = lazy(() => import("./Screens/BMHome/ViewMemberTransfer"));
const TransferMemberViewScreen = lazy(() => import("./Screens/BMHome/TransferMemberViewScreen"));
const MonthEnd = lazy(() => import("./Screens/Admin/UserManagement/MonthEnd"));
const MonthOpen = lazy(() => import("./Screens/Admin/UserManagement/MonthOpen"));

const Payroll = lazy(() => import("./Screens/Admin/Payroll/Payroll"));

const RejectTransaction = lazy(() => import("./Screens/BMHome/Loans/RejectTransaction"));

const MasterBanks = lazy(() =>
	import("./Screens/Admin/Master/Banks/MasterBanks")
)
const EditMasterBank = lazy(() =>
	import("./Screens/Admin/Master/Banks/EditMasterBank")
)
const EditRecoveryApproveFormBM = lazy(() =>
	import("./Screens/BMHome/EditRecoveryApproveFormBM")
)
const SearchViewLoanBM = lazy(() => import("./Screens/BMHome/SearchViewLoanBM"))
const EditViewLoanFormBM = lazy(() =>
	import("./Screens/BMHome/EditViewLoanFormBM")
)
const MemberLoanDetailsBM = lazy(() =>
	import("./Screens/BMHome/MemberLoanDetailsBM")
)
const MemberwiseRecoveryReport = lazy(() =>
	import("./Screens/Reports/MemberwiseRecoveryReport")
)
const GroupwiseRecoveryReport = lazy(() =>
	import("./Screens/Reports/GroupwiseRecoveryReport")
)
const CatchError = lazy(() => import("./Screens/CatchError"))
const ForgotPassMis = lazy(() => import("./Screens/MISAssistant/ForgotPassMis"))
const HomeMis = lazy(() => import("./Screens/MISAssistantHome/HomeMis"))
const HomeScreenMis = lazy(() =>
	import("./Screens/MISAssistantHome/HomeScreenMis")
)
const EditGRTFormMis = lazy(() =>
	import("./Screens/MISAssistantHome/EditGRTFormMis")
)
// const EditGroupForm = lazy(() => import("./Screens/MISAssistantHome/EditGroupForm"))

// const HomeScreenBM = lazy(() => import("./Screens/BMHome/HomeScreenBM.jsx__BDCCB"))
// const EditGRTFormBM = lazy(() => import("./Screens/BMHome/EditGRTFormBM.jsx__BDCCB"))

const DashboardMis = lazy(() =>	import("./Screens/MISAssistantHome/DashboardMis"))
const SearchGRTFormMis = lazy(() =>
	import("./Screens/MISAssistantHome/SearchGRTFormMis")
)
// const SearchGroupMis = lazy(() => import("./Screens/MISAssistantHome/SearchGroupMis"))
const SearchGRTFormBM = lazy(() => import("./Screens/BMHome/SearchGRTFormBM"))
const SearchMemberMis = lazy(() =>
	import("./Screens/MISAssistantHome/SearchMemberMis")
)
const SignUp = lazy(() => import("./Screens/MISAssistant/SignUp"))

const HomeCO = lazy(() => import("./Screens/COHome/HomeCO"))
const DashboardCO = lazy(() => import("./Screens/COHome/DashboardCO"))
const HomeScreenCO = lazy(() => import("./Screens/COHome/HomeScreenCO"))
const SearchGRTFormCO = lazy(() => import("./Screens/COHome/SearchGRTFormCO"))
// const SearchGroupCO = lazy(() => import("./Screens/COHome/SearchGroupCO"))
const EditGRTFormCO = lazy(() => import("./Screens/COHome/EditGRTFormCO"))
const SearchMemberCO = lazy(() => import("./Screens/COHome/SearchMemberCO"))
// const EditGroupFormCO = lazy(() => import("./Screens/COHome/EditGroupFormCO"))

const SearchMemberForDisburseCO = lazy(() =>
	import("./Screens/COHome/SearchMemberForDisburseCO")
)
const DisbursedLoanApproveBM = lazy(() =>
	import("./Screens/BMHome/DisbursedLoanApproveBM")
)
const EditDisburseApproveFormBM = lazy(() =>
	import("./Screens/BMHome/EditDisburseApproveFormBM")
)

/*** Scheme Screen Including Add Or Update */
const SchemeLayout = lazy(() => import("./Screens/Admin/Master/Scheme/SchemeLayout"));
const SchemeListPage = lazy(() =>import("./Screens/Admin/Master/Scheme/SchemeList"));
const SchemeAddOrUpdatePage = lazy(() =>import("./Screens/Admin/Master/Scheme/AddOrUpdateScheme"));
/**** End */

/*** Funds Screen Including Drawer */
const FundsListPage = lazy(() =>import("./Screens/Admin/Master/Funds/FundsList"));
/*** End */

const LoanCalculator = lazy(() =>import("./Screens/BMHome/Loans/LoanCalculator/index"))

// const AuthBr = lazy(() => import("./Screens/BranchManager/AuthBr"))

const root = ReactDOM.createRoot(document.getElementById("root"))


// window.addEventListener("beforeunload", (ev) => {
// 	ev.preventDefault()

// 	localStorage.clear()
// })

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "",
				element: <LandingOutlet />,
				children: [
					// {
					// 	path: "",
					// 	element: <Landing />,
					// },
					{
						path: "",
						element: <SignInPage />,
					},
					{
						path: "loan",
						// element: <SigninMis />,
						element: <SignInPage />,
					},
					{
						path: "payroll",
						element: <></>,
					},
					{
						path: "ssvws_fin",
						element: <></>,
					},
					{
						path: "signup",
						element: <SignUp />,
					},
					{
						path: "forgotpassword",
						element: <ForgotPassMis />,
					},
					{
						path: "homemis",
						element: <HomeMis />,
						children: [
							{
								path: "",
								element: <DashboardMis />,
							},
							// {
							// 	path: "grtappls",
							// 	element: <HomeScreenMis />,
							// },
							// {
							// 	path: "searchform",
							// 	element: <SearchGRTFormMis />,
							// },
							// {
							// 	path: "searchgroup",
							// 	element: <SearchGroupMis />,
							// },
							// {
							// 	path: "searchmember",
							// 	element: <SearchMemberMis />,
							// },
							// {
							// 	path: "editgroupform/:id",
							// 	element: <EditGroupForm />,
							// },
							// {
							// 	path: "editgrtform/:id",
							// 	element: <EditGRTFormMis />,
							// },
						],
					},
					{
						path: "homebm",
						element: <HomeBM />,
						children: [
							{
								path: "",
								element: <Dashboard />,
							},
							// {
							// 	path: "grtappls",
							// 	element: <HomeScreenBM />,
							// },
							// {
							// 	path: "searchform",
							// 	element: <SearchGRTFormBM />,
							// },
							{
								path: "searchgroup",
								element: <SearchGroupBM />,
							},
							{
								path: "editgroupform/:id",
								element: <EditGroupFormBM />,
							},
							// {
							// 	path: "searchGroupMember",
							// 	element: <SearchGroupMemberBM />,
							// },
							// {
							// 	path: "editMemberGroupForm/:id",
							// 	element: <EditMemberGroupFormBM />,
							// },
							{
								path: "searchSahayikaBM",
								element: <SearchSahayikaBM />,
							},
							{
								path: "editSahayikaFormBM/:id",
								element: <EditSahayikaFormBM />,
							},
							// {
							// 	path: "attendancebm",
							// 	element: <AttendanceBM />,
							// },
							{
								path: "disburseloan",
								element: <SearchMemberForDisburseBM_BDCCB />,
							},
							{
								path: "disburseloan/:id",
								element: <EditDisburseFormBM_BDCCB />,
							},

							{
								path: "transaction",
								element: <SearchTransactionBM_BDCCB />,
							},
							{
								path: "transaction/:id",
								element: <EditTransactionFormBM_BDCCB />,
							},
							{
								path: "manageuser/:id",
								element: <CreateUser />,
							},
							{
								path: "manageuser",
								element: <ManageUser />,
							},

							// {
							// 	path: "transfermember",
							// 	element: <MemberTransfer />,
							// },
							// {
							// 	path: "transfermember/:id",
							// 	element: <EditMemberTransfer />,
							// },
							// {
							// 	path: "approvemembertransfer",
							// 	element: <ApproveMemberTransfer />,
							// },
							// {
							// 	path: "approvemembertransfer/:id",
							// 	element: <ApproveEditMemberTrans />,
							// },
							// {
							// 	path:'loancalculator',
							// 	element: <LoanCalculator />,
							// },
							// {
							// 	path: "rejecttxn",
							// 	element: <RejectTransaction />,
							// },
							// {
							// 	path: "rejecdisbursement",
							// 	element: <RejectDisbursement />,
							// },
							// {
							// 	path: "approveloan",
							// 	element: <DisbursedLoanApproveBM />,
							// },
							// {
							// 	path: "approvedisbursed",
							// 	element: <DisbursedLoanApproveSingleBM />,
							// },
							// {
							// 	path: "approveloan/:id",
							// 	element: <EditDisburseApproveFormBM />,
							// },
							// {
							// 	path: "recoveryloan/:id",
							// 	element: <EditRecoveryApproveFormBM />,
							// },
							// {
							// 	path: "viewloan",
							// 	element: <SearchViewLoanBM />,
							// },
							// {
							// 	path: "viewloan/:id",
							// 	element: <EditViewLoanFormBM />,
							// },
							// {
							// 	path: "memberloandetails/:id",
							// 	element: <MemberLoanDetailsBM />,
							// },
							// {
							// 	path: "editgrtform/:id",
							// 	element: <EditGRTFormBM />,
							// },
							// {
							// 	path: "memberwiserecoveryreport",
							// 	element: <MemberwiseRecoveryReport />,
							// },
							// {
							// 	path: "groupwiserecoveryreport",
							// 	element: <GroupwiseRecoveryReport />,
							// },
							// {
							// 	path: "searchmember",
							// 	element: <SearchMemberBM />,
							// },
							// {
							// 	path: "loanstatements",
							// 	element: <LoanStatementMain />,
							// },
							// {
							// 	path: "loantxns",
							// 	element: <LoanTransactionsMain />,
							// },
							// {
							// 	path:'previous-loantxns',
							// 	element:<PreviousLoanTransaction/>
							// },
							// {
							// 	path: "testpage",
							// 	element: <TestPage />,
							// },
							// {
							// 	path: "demandreport",
							// 	element: <DemandReportsMain />,
							// },
							// {
							// 	path: "outstasndingreport",
							// 	element: <OutstaningReportMain />,
							// },
							// {
							// 	path: "demandvscollectionreport",
							// 	element: <DemandVsCollectionMain />,
							// },
							// {
							// 	path: "advancecollectionreport",
							// 	element: <AdvanceCollectionReportMain />,
							// },
							// {
							// 	path: "overduereport",
							// 	element: <OverdueReport />,
							// },
							// {
							// 	path:"groupreport",
							// 	element:<GroupReport/>
							// },
							// {
							// 	path: "portfolioreport",
							// 	element: <PortfolioReport />,
							// },
							// {
							// 	path: "fundwisesummary",
							// 	element: <FundwiseMain />,
							// },
							// {
							// 	path: "schemewisesummary",
							// 	element: <SchemewiseMain />,
							// },
							// {
							// 	path: "groupclosereport",
							// 	element: <GroupClose />,
							// },
							// {
							// 	path: "trancefercofrom",
							// 	element: <TranceferCO />,
							// },
							// {
							// 	path: "tranceferco",
							// 	element: <TransferCOScreen />,
							// },
							// {
							// 	path: "trancefercofrom/:id",
							// 	element: <TranceferCO />,
							// },
							// {
							// 	path: "trancefercofromapprove/:id",
							// 	element: <TranceferCOApproveForm />,
							// },
							// {
							// 	path: "trancefercofromapprove-unic",
							// 	element: <TransferCOApprovalUnic />,
							// },
							// {
							// 	path: "viewmembertransfer",
							// 	element: <ViewMemberTransfer />,
							// },
							// {
							// 	path: "viewmembertransfer/:id",
							// 	element: <TransferMemberViewScreen />,
							// },
						],
					},
					{
						path: "homepacs",
						element: <HomePACS />,
						children: [
							{
								path: "",
								element: <PACSDashboard />,
							},
							{
								path: "disburseloan",
								element: <SearchMemberForDisbursePACS_BDCCB />,
							},
							{
								path: "disburseloan/:id",
								element: <EditDisburseFormPACS_BDCCB />,
							},
							{
								path: "approvedisbursed",
								element: <DisbursedLoanApproveSinglePACS_BDCCB />,
							},
							{
								path: "approvedisbursed/:id",
								element: <AcceptDisburseFormPACS_BDCCB />,
							},
							
						],
					},
					{
						path: "homeadmin",
						element: <HomeAdmin />,
						children: [
							{
								path: "",
								element: <AdminDashboard />,
							},
							{
								path: "masterbanks",
								element: <MasterBanks />,
							},
							// {
							// 	path:"masterschemes",
							// 	element: <SchemeLayout />,
							// 	children: [
							// 		{
							// 			path: "",
							// 			element: <SchemeListPage />,
							// 		},
							// 		{
							// 			path: ":scheme_id",
							// 			element: <SchemeAddOrUpdatePage />,
							// 		}
							// 	]
							// },
							// {
							// 	path:'masterfunds',
							// 	element: <FundsListPage />,
							// },
							// {
							// 	path: "masterbanks/:id",
							// 	element: <EditMasterBank />,
							// },
							// {
							// 	path: "masteremployees",
							// 	element: <MasterEmployees />,
							// },
							// {
							// 	path: "masteremployees/:id",
							// 	element: <EditMasterEmployee />,
							// },
							// {
							// 	path: "masterdesignations",
							// 	element: <MasterDesignations />,
							// },
							// {
							// 	path: "masterdesignations/:id",
							// 	element: <EditMasterDesignations />,
							// },
							{
								path: "masterdistricts",
								element: <MasterDistricts />,
							},
							{
								path: "masterdistricts/:id",
								element: <EditMasterDistricts />,
							},
							{
								path: "masterblocks",
								element: <MasterBlocks />,
							},
							{
								path: "masterblocks/:id",
								element: <EditMasterBlocks />,
							},
							{
								path: "postMaster",
								element: <PostMaster />,
							},
							{
								path: "postMaster/:id",
								element: <EditPostMaster />,
							},
							{
								path: "policeStationMaster",
								element: <PoliceStationMaster />,
							},
							{
								path: "policeStationMaster/:id",
								element: <EditPoliceStationMaster />,
							},
							{
								path: "gplistMaster",
								element: <GPListMaster />,
							},
							{
								path: "gplistMaster/:id",
								element: <EditGPListMaster />,
							},
							{
								path: "villageMaster",
								element: <VillageMaster />,
							},
							{
								path: "villageMaster/:id",
								element: <EditVillageMaster />,
							},
							{
								path: "branchMaster",
								element: <BranchMaster />,
							},
							{
								path: "branchMaster/:id",
								element: <EditBranchMaster />,
							},
		// 					{
		// 						path: "createuser/:id",
		// 						element: <CreateUser />,
		// 					},
		// 					{
		// 						path: "manageuser",
		// 						element: <ManageUser />,
		// 					},
		// 					{
		// 						path: "transferuser/:id",
		// 						element: <TransferUser />,
		// 					},
		// 					{
		// 						path:'audit_report',
		// 						element:<AuditReport/>
		// 					},
		// 					{
		// 						path: "monthend",
		// 						element: <MonthEnd />,
		// 					},
		// {
		// 						path: "monthopen",
		// 						element: <MonthOpen />,
		// 					},
							
		// 					{
		// 						path: "transferusermanage",
		// 						element: <TransferUserManage />,
		// 					},
		// 					{
		// 						path: "attendancedashboard",
		// 						element: <AttendanceDashboard />,
		// 					},
		// 					{
		// 						path: "loanstatements",
		// 						element: <ALoanStatementMain />,
		// 					},
		// 					{
		// 						path: "loantxns",
		// 						element: <ALoanTransactionsMain />,
		// 					},
		// 					{
		// 						path: "demandreport",
		// 						element: <ADemandReportsMain />,
		// 					},
		// 					{
		// 						path: "outstasndingreport",
		// 						element: <AOutstandingReportMain />,
		// 					},
		// 					{
		// 						path: "fundwisesummary",
		// 						element: <AFundwiseMain />,
		// 					},
		// 					{
		// 						path: "schemewisesummary",
		// 						element: <ASchemewiseMain />,
		// 					},
		// 					{
		// 						path: "demandvscollectionreport",
		// 						element: <ADemandVsCollectionMain />,
		// 					},
						],
					},
					// {
					// 	path: "homeco",
					// 	element: <HomeCO />,
					// 	children: [
					// 		{
					// 			path: "",
					// 			element: <DashboardCO />,
					// 		},
					// 		{
					// 			path: "searchform",
					// 			element: <SearchGRTFormCO />,
					// 		},

					// 		{
					// 			path: "searchmember",
					// 			element: <SearchMemberCO />,
					// 		},
					// 		{
					// 			path: "disburseloan",
					// 			element: <SearchMemberForDisburseCO />,
					// 		},
					// 		{
					// 			path: "disburseloan/:id",
					// 			element: <EditDisburseFormBM />,
					// 		},
					// 		{
					// 			path: "editgrtform/:id",
					// 			element: <EditGRTFormCO />,
					// 		},
					// 	],
					// },
				],
			},
		],
	},
	{
		path: "attendance_report",
		element: <Payroll />,
	},
	{
		path: "error/:id/:message",
		element: <CatchError />,
	},
	{
		path: "*",
		element: <Notfound />,
	},
])

root.render(
	<Democontext>
		<Suspense
			fallback={
				<div className="bg-gray-200 h-screen flex justify-center items-center">
					<CircularProgress disableShrink color="error" />
				</div>
			}
		>
			<Loader />
			<RouterProvider router={router} />
		</Suspense>
	</Democontext>
)

reportWebVitals()
