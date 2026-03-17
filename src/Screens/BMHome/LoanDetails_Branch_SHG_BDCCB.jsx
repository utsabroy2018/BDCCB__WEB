import React, { useState } from "react"
import Sidebar from "../../Components/Sidebar"
import Payroll from "../Admin/Payroll/Payroll"
import LoanDetails from "../Admin/LoanDetails/LoanDetails"
import LoanDetailsBranch from "../Admin/LoanDetailsBranchSOCI/LoanDetailsBranchSOCI"
import LoanDetailsBranchSOCI from "../Admin/LoanDetailsBranchSOCI/LoanDetailsBranchSOCI"
import LoanDetailsBranchSHG from "../Admin/LoanDetailsBranchSHG/LoanDetailsBranchSHG"

function LoanDetails_Branch_SHG_BDCCB() {
	const userDetails = JSON.parse(localStorage.getItem("user_details")) || ""

	return (
		<div>
			<Sidebar mode={2} />
			<LoanDetailsBranchSHG />
			
		</div>
	)
}

export default LoanDetails_Branch_SHG_BDCCB
