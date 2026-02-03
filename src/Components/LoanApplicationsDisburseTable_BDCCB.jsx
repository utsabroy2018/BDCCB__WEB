import React, { useEffect, useState } from "react"
import { routePaths } from "../Assets/Data/Routes"
import { Link } from "react-router-dom"
import Tooltip from "@mui/material/Tooltip"
import { Paginator } from "primereact/paginator"
import { motion } from "framer-motion"
import {
	CheckCircleOutlined,
	ClockCircleOutlined,
	EditOutlined,
	FileTextOutlined,
	SyncOutlined,
} from "@ant-design/icons"
import { useNavigate } from "react-router-dom"
import { Tag } from "antd"
import { Message } from "./Message"
import Column from "antd/es/table/Column"
import { DataTable } from "primereact/datatable"

function LoanApplicationsDisburseTable_BDCCB({
	loanAppData,
	setSearch,
	title,
	flag,
	showSearch = true,
	isForwardLoan = false,
	isRejected = false,
	approvalStat = "U",
}) {
	const navigate = useNavigate()

	const [first, setFirst] = useState(0)
	const [rows, setRows] = useState(10)
	const [AmountTd_, setAmountTd_] = useState(0)

	const onPageChange = (event) => {
		setFirst(event.first)
		setRows(event.rows)
	}

	useEffect(()=>{
		// setAmountTd_(loanAppData.reduce((sum, r) => sum + parseFloat(r.disb_amt || 0), 0).toFixed(2));

		if (loanAppData && loanAppData.length > 0) {
		const total = loanAppData.reduce(
		(sum, row) => sum + Number(row.disb_amt || 0),
		0
		);
		setAmountTd_(total.toFixed(2));
		}
		
	}, [loanAppData])

	return (
		<>
			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
			>
				<div
					className={`flex flex-col bg-slate-800
					 rounded-lg my-3 dark:bg-slate-800
					 md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-1.5`}
				>
					<div className="w-full">
						<div className="flex items-center justify-between">
							<motion.h2
								initial={{ opacity: 0, y: -50 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 1, type: "just" }}
								className="text-xl w-48 capitalize text-nowrap font-bold text-white dark:text-white sm:block hidden mx-4"
							>
								{title}
							</motion.h2>
							

							<label htmlFor="simple-search" className="sr-only">
								Search
							</label>
							{showSearch && (
								<div className="relative w-full -right-12 2xl:-right-12">
									<div className="absolute inset-y-0 left-0 flex items-center md:ml-4 pl-3 pointer-events-none">
										<svg
											aria-hidden="true"
											className="w-5 h-5 text-gray-500 dark:text-gray-400"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												fillRule="evenodd"
												d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
												clipRule="evenodd"
											/>
										</svg>
									</div>
									<motion.input
										type="text"
										id="simple-search"
										initial={{ opacity: 0, width: 0 }}
										animate={{ opacity: 1, width: "95%" }}
										transition={{ delay: 1.1, type: "just" }}
										className={`bg-white border rounded-lg  border-slate-700 bg-slate-300"
										 text-gray-800 block w-full h-12 pl-10 dark:bg-gray-800 md:ml-4 duration-300 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white text-lg `}
										placeholder="Search By Loan Account No."
										required=""
										onChange={(text) => setSearch(text.target.value)}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</motion.section>
			<motion.section
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.5, type: "spring", stiffness: 30 }}
			>

				{JSON.stringify(loanAppData, 2)} 
				

				<DataTable
									value={loanAppData?.map((item, i) => [{ ...item, id: i }]).flat()}
									selectionMode="checkbox"
									
									// selection={selectedProducts}
									// onSelectionChange={(e) => handleSelectionChange(e)}
									 scrollable scrollHeight="400px"
									
									tableStyle={{ minWidth: "50rem" }}
									dataKey="id"
									tableClassName="w-full text-sm text-left rtl:text-right shadow-lg text-green-900dark:text-gray-400 table_Custome table_Custome_1st" // Apply row classes
								>
									<Column
										header="Sl No."
										body={(rowData) => (
											<span style={{ fontWeight: "bold" }}>{rowData?.id + 1}</span>
										)}
									></Column>
									{/* <Column
										// selectionMode="single"
										selectionMode="multiple"
										headerStyle={{ width: "3rem" }}
									></Column> */}
				
									<Column
										field="trans_id"
										header="Transaction ID"
										footer={<span style={{ fontWeight: "bold" }}>Total</span>}
									></Column>
				
									<Column
										field="trans_dt"
										header="Transaction Date"
										body={(rowData) =>
											new Date(rowData?.trans_dt).toLocaleDateString("en-GB")
										}
										// footer={<span style={{ fontWeight: "bold" }}>{Outstanding}</span>}
									></Column>
				
									<Column
										field="loan_id"
										header="Loan Id"
									></Column>
				
									
									<Column
										field="loan_acc_no"
										header="Loan Account No. "
										// body={(rowData) =>
										// 	new Date(rowData?.loan_acc_no).toLocaleDateString("en-GB")
										// }
									></Column>
										<Column
										field="disb_dt"
										header="Disburse Date"
										body={(rowData) =>
											new Date(rowData?.disb_dt).toLocaleDateString("en-GB")
										}
										// footer={<span style={{ fontWeight: "bold" }}>{Outstanding}</span>}
									></Column>
				
									<Column
										field="disb_amt"
										header="Disburse Amount"
										footer={
											<span style={{ fontWeight: "bold", color: "#0694A2" }}>
												{AmountTd_}
											</span>
										}
									></Column>
				
									<Column
										// field="curr_prn"
										header="Action"
										body={(rowData) => (
										<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
										<button
										type="button"
										onClick={() => {
										console.log("ROW DATA:", rowData);
										navigate(
										`/homepacs/approvedisbursed/${rowData?.loan_id}`,
										{ state: rowData }
										);
										}}
										style={{ background: "transparent", border: "none", cursor: "pointer" }}
										>
										<EditOutlined className="text-md text-slate-800" />
										</button>
										</div>
										)}
									></Column>
								
								</DataTable>
								
				<Paginator
					first={first}
					rows={rows}
					totalRecords={loanAppData?.length}
					rowsPerPageOptions={[3, 5, 10, 15, 20, 30, loanAppData?.length]}
					onPageChange={onPageChange}
				/>
			</motion.section>
		</>
	)
}

export default LoanApplicationsDisburseTable_BDCCB
