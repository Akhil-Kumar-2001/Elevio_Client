// import { basicType, userType } from "@/types/types"


// const emailPattern = /^(?!.\.\d)(?=[a-zA-Z0-9._%+-][a-zA-Z]{3,}\d*@)[a-zA-Z0-9._%+-]+@[a-z]{3,}\.[a-z]{2,}$/i
// const passwordPattern = /^(?=(.*[A-Za-z]){3,})(?=.*\d).{6,}$/
// const usernamePattern = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*$/


// export const signupValidation = (data: basicType) => {
//     const { username, email, password } = data;

//     if (!username.trim() || username.trim() == '' || !usernamePattern.test(username)) {
//         console.log("❌ Invalid username detected!");
//         return { status: false, message: "Enter a valid username (only letters, no numbers or special characters)" };
//     }
//     else if (!email.trim() || email.trim() == '' || !emailPattern.test(email)) {
//         return { status: false, message: "Email is not in the proper format" };
//     }
//     else if (!password.trim() || password.trim() == '' || !passwordPattern.test(password)) {
//         return { status: false, message: "Enter a valid password" };
//     }
//     else {
//         return { status: true };
//     }
// };


// export const loginValidation = (data: userType) => {
//     const { email, password } = data;
//     if (!email.trim() || email.trim() == '' || !emailPattern.test(email)) {
//         return { status: false, message: "Email is not in the proper format" };
//     }
//     else if (!password.trim() || password.trim() == '' || !passwordPattern.test(password)) {
//         return { status: false, message: "Enter a valid password" };
//     }
//     else {
//         return { status: true };
//     }
// };


