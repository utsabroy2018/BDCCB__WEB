import React, { useState } from "react"
import Sidebar from "../../Components/Sidebar"
import Payroll from "../Admin/Payroll/Payroll"
import LoanDetails from "../Admin/LoanDetails/LoanDetails"

function LoanDetails_PACS_BDCCB() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""

	return (
		<div>
			<Sidebar mode={2} />
			<LoanDetails />
		</div>
	)
}

export default LoanDetails_PACS_BDCCB
