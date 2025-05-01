// import ForgotOtpVerification from "@/components/forgototp";

// const OtpPage = () =>{
//   return <ForgotOtpVerification role="tutor"  />
// }

// export default OtpPage;



import ForgotOtpVerification from "@/components/forgototp";
import { Suspense } from 'react';

const OtpPage = () => {
  return (<Suspense fallback={<div>Loading...</div>}>
    <ForgotOtpVerification role="tutor" />
  </Suspense>)
}

export default OtpPage;