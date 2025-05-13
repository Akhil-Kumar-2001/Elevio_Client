
import ResetPasswordPage from '@/components/student/studentpasswordreset'
import React, { Suspense } from 'react'

const ResetPassowrd = () => {
  return (<Suspense fallback={<div>Loading...</div>}>
    <ResetPasswordPage />
  </Suspense>)
}

export default ResetPassowrd
