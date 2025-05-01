import ResetPasswordPage from "@/components/resetpassword";
import { Suspense } from "react";

const ResetPassword = () => {
    return (<Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordPage role="student" />
    </Suspense>)
}

export default ResetPassword;