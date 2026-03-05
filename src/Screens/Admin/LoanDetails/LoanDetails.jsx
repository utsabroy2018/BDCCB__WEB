import React, { useEffect, useMemo, useState } from "react"
import Sidebar from "../../../Components/Sidebar"
import axios from "axios"
import { url } from "../../../Address/BaseUrl"
import { Message } from "../../../Components/Message"
import { Spin, Button, Modal, Tooltip, DatePicker, Popconfirm, Tag } from "antd"
import {
	LoadingOutlined,
	SearchOutlined,
	PrinterOutlined,
	FileExcelOutlined,
	CheckCircleOutlined,
} from "@ant-design/icons"
import TDInputTemplateBr from "../../../Components/TDInputTemplateBr"
import { formatDateToYYYYMMDD } from "../../../Utils/formateDate"

import { saveAs } from "file-saver"
import * as XLSX from "xlsx"
import { printTableRegular } from "../../../Utils/printTableRegular"
import { exportToExcel } from "../../../Utils/exportToExcel"
import {
	absenteesReportHeader,
	attendanceReportHeader,
} from "../../../Utils/Reports/headerMap"
import DynamicTailwindAccordion from "../../../Components/Reports/DynamicTailwindAccordion"
import DynamicTailwindTable from "../../../Components/Reports/DynamicTailwindTable"
import Radiobtn from "../../../Components/Radiobtn"
import { printTableReport } from "../../../Utils/printTableReport"
import { useNavigate } from "react-router"
import { routePaths } from "../../../Assets/Data/Routes"
import { getLocalStoreTokenDts } from "../../../Components/getLocalforageTokenDts"
import { useFormik } from "formik"
import * as Yup from "yup"
import VError from "../../../Components/VError"
import BtnComp from "../../../Components/BtnComp"

// const { RangePicker } = DatePicker
// const dateFormat = "YYYY/MM/DD"

const options = [
	{
		label: "All",
		value: "",
	},
	{
		label: "Late In",
		value: "L",
	},
	{
		label: "Early Out",
		value: "E",
	},
	// {
	// 	label: "Absent",
	// 	value: "A",
	// },
]

function LoanDetails() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""
	const [loading, setLoading] = useState(false)

	const navigate = useNavigate()


	const initialValues = {
		socie_loan_ac_no: "",
	}

	const [formValues, setValues] = useState(initialValues)


	const validationSchema = Yup.object({
			socie_loan_ac_no: Yup.string().required("Type Society Loan A/C No. is required"),
		})

	const onSubmit = async (values) => {
		// setVisible(true)
		// if (params?.id > 0) {
		// 	editGroup(values)
		// }
		
		handleSubmit(values)
			
	}


	const formik = useFormik({
		initialValues: initialValues,
		onSubmit,
		validationSchema,
		validateOnChange: true,
		validateOnBlur: true,
		enableReinitialize: true,
		validateOnMount: true,
	})


	const handleSubmit = (values) => {
		console.log(values, 'formDataformDataformDataformDataccccccccccc');
	}
	

	return (
		<div>
			{/* <Sidebar mode={2} /> */}
			<Spin
				indicator={<LoadingOutlined spin />}
				size="large"
				className="text-slate-800 dark:text-gray-400"
				spinning={loading}
			>
				<main className="px-4 pb-5 bg-slate-50 rounded-lg shadow-lg h-auto my-10 mx-32">
					<div className="flex flex-row gap-3 py-3 rounded-xl">
						<div className="text-3xl text-slate-700 font-bold">
							Loan Details
						</div>
					</div>

					

					<div className="grid grid-cols-3 gap-5 mt-5">
						{/* {searchType2 !== "A" && ( */}
						<div>
							<TDInputTemplateBr
							placeholder="Society Loan A/C No..."
							type="text"
							label="Type Society Loan A/C No."
							name="socie_loan_ac_no"
							handleChange={formik.handleChange}
							handleBlur={formik.handleBlur}
							formControlName={formik.values.socie_loan_ac_no}
							mode={1}
							/>
							{formik.errors.socie_loan_ac_no && formik.touched.socie_loan_ac_no ? (
							<VError title={formik.errors.socie_loan_ac_no} />
							) : null}

						</div>
						{/* )} */}
						

						<div className="flex col-span-3">
							<button
								className={`inline-flex items-center px-4 py-2 mt-0 ml-0 sm:mt-0 text-sm font-small text-center text-white border hover:border-green-600 border-teal-500 bg-teal-500 transition ease-in-out hover:bg-green-600 duration-300 rounded-full  dark:focus:ring-primary-900`}
								onClick={formik.handleSubmit}
							>
								<SearchOutlined /> <span className={`ml-2`}>Search</span>
							</button>
							{/* <BtnComp mode="A" onReset={formik.resetForm} /> */}
						</div>
					</div>
					<div className="grid grid-cols-3 gap-5 mt-5">
						{/* {JSON.stringify(groupData, null, 2)} */}
						sdfsdfsdf
					</div>
					
					
				</main>
			</Spin>
		</div>
	)
}

export default LoanDetails
