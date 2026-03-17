import React, { useState } from "react"
import Sidebar from "../../Components/Sidebar"
import Payroll from "../Admin/Payroll/Payroll"
import LoanDetails from "../Admin/LoanDetails/LoanDetails"
import LoanDetailsBranch from "../Admin/LoanDetailsBranchSOCI/LoanDetailsBranchSOCI"
import LoanDetailsBranchSHG from "../Admin/LoanDetailsBranchSHG/LoanDetailsBranchSHG"
import LoanDetailsBranchSOCI from "../Admin/LoanDetailsBranchSOCI/LoanDetailsBranchSOCI"

function LoanDetails_Branch_SOCI_BDCCB() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""

	return (
		<div>
			<Sidebar mode={2} />
			<LoanDetailsBranchSOCI />
		</div>
	)
}

export default LoanDetails_Branch_SOCI_BDCCB
