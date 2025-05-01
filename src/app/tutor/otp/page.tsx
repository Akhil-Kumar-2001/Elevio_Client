

import OTPVerification from "@/components/otp";
import { Suspense } from "react";

const OtpPage = () => {
  return (<Suspense fallback={<div>Loading...</div>}>
    <OTPVerification role="tutor" />
  </Suspense>)
}

export default OtpPage;