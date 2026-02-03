import React, { useEffect, useState } from "react"
import Sidebar from "../../Components/Sidebar"
import axios from "axios"
import { url, url_bdccb } from "../../Address/BaseUrl"
import { Message } from "../../Components/Message"
import { Spin, Button } from "antd"
import { LoadingOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons"
import LoanApplicationsTableViewBr from "../../Components/LoanApplicationsTableViewBr.jsx__BDCCB"
import Radiobtn from "../../Components/Radiobtn"
import LoanApplicationsDisburseTable from "../../Components/LoanApplicationsDisburseTable"
import { getLocalStoreTokenDts } from "../../Components/getLocalforageTokenDts"
import { useNavigate } from "react-router"
import { routePaths } from "../../Assets/Data/Routes"
import DisbursmentForm_BDCCB from "../Forms/DisbursmentForm_BDCCB"
import LoanApplicationsDisburseTable_BDCCB from "../../Components/LoanApplicationsDisburseTable_BDCCB"
import { motion } from "framer-motion"

const options_Disburs = [
	{
		label: "Pending Disbursement",
		value: "U",
	},
	{
		label: "Approved Disbursement",
		value: "A",
	}
]

function SearchMemberForDisburseBM_BDCCB() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)

	const [searchKeywords, setSearchKeywords] = useState(() => "")
	const [loanApplications, setLoanApplications] = useState(() => [])
	const [copyLoanApplications, setCopyLoanApplications] = useState(() => [])

	const [disbursementStatus, setDisbursementStatus] = useState("U")
	const navigate = useNavigate()

	const onChange = (e) => {
		console.log("radio1 checked", e)
		setDisbursementStatus(e)
	}

	useEffect(() => {
		fetchApproveUapprove()
	}, [disbursementStatus])


	const fetchApproveUapprove = async () => {
		setLoading(true)
		const creds = {
			branch_id: userDetails[0]?.brn_code,
			approval_status: disbursementStatus
		}
		const tokenValue = await getLocalStoreTokenDts(navigate);
		await axios
			// .post(`${url}/admin/fetch_loan_application_dtls`, creds)
			.post(`${url_bdccb}/loan/show_loan_status`, creds, {
				headers: {
					Authorization: `${tokenValue?.token}`, // example header
					"Content-Type": "application/json", // optional
				},
			})
			.then((res) => {

				if(res?.data?.success){
					console.log(res?.data?.data, 'dataaaaaaaaaaa', creds);
					
					setLoanApplications(res?.data?.data)
					setCopyLoanApplications(res?.data?.data)
				} else {
					Message('error', res?.data?.msg)
					navigate(routePaths.LANDING)
					localStorage.clear()
					
				}
				

			})
			.catch((err) => {
				Message("error", "Some error occurred while searching...")
			})
		setLoading(false)
	}

		const setSearch = (word) => {
		console.log(word, "wordwordwordword")
		setLoanApplications(
			copyLoanApplications?.filter(
				(e) =>
					e?.loan_acc_no
						?.toString()
						?.toLowerCase()
						.includes(word?.toLowerCase()) ||
					e?.loan_acc_no
						?.toString()
						?.toLowerCase()
						?.includes(word?.toLowerCase())
			)
		)
	}



	return (
		<div>
			<Sidebar mode={2} />
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-slate-800 dark:text-gray-400"
				spinning={loading}
			>
				<main className="px-4 h-auto my-10 mx-32">

					<Radiobtn
						data={options_Disburs}
						val={disbursementStatus}
						onChangeVal={(value) => {
							onChange(value)
						}}
					/>
					<div className="mt-0">
						<label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
						<div className="relative mt-5">
							<div className="absolute inset-y-0  start-0 flex items-center ps-3 pointer-events-none">
								<svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
									<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
								</svg>
							</div>
							<input type="search" id="default-search" className="block mt-5 w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-slate-500 dark:focus:border-slate-500" placeholder="Search by Group No./Group Name"

								// onChange={(e) => setSearchKeywords(e.target.value)}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<button type="submit" className="text-white absolute end-2.5 disabled:bg-slate-800 bottom-2.5 bg-slate-800 bg-slate-800 focus:ring-4 
		focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
								// onClick={fetchSearchedApplication}
								onClick={() => {
									navigate(`/homepacs/disburseloan/0`)
								}}
							><PlusOutlined className="text-xl" /> New Disburse </button>



						</div>
					</div>


					{/* <DisbursmentForm_BDCCB /> */}
					{/* {JSON.stringify(loanApplications, 2)}  */}
					<LoanApplicationsDisburseTable_BDCCB
						flag="BM"
						loanAppData={loanApplications}
						title="Disburse Loan"
					// showSearch={false}
					setSearch={(data) => setSearch(data)}
					/>

					{/* <DialogBox
					visible={visible}
					flag={flag}
					onPress={() => setVisible(false)}
				/> */}
				</main>
			</Spin>
		</div>
	)
}

export default SearchMemberForDisburseBM_BDCCB
