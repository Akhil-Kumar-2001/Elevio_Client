import ForgotOtpVerification from "@/components/forgototp";
import { Suspense } from 'react';

const OtpPage = () => {
  return (<Suspense fallback={<div>Loading...</div>}>
    <ForgotOtpVerification role="student" />
  </Suspense>)
}

export default OtpPage;