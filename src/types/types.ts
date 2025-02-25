export type basicType = {
    username:string,
    email:string,
    image?:string;
    password?:string
}

export type userType = {
    email:string,
    password:string
}

export type resetPasswordType = {
    password:string;
    confirmPassword:string
}

 export type Student = {
    _id: string;
    username: string;
    email: string;
    status: number;
    role: string;
    createdAt: string;
  };
  