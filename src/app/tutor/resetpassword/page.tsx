import ResetPasswordPage from "@/components/resetpassword";
import { Suspense } from "react";

const ResetPassword = () => {
    return (<Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordPage role="tutor" />
    </Suspense>)
}

export default ResetPassword;