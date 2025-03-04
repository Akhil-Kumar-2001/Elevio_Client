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
  
  export interface TokenPayload {
    email: string;
    role: string;
    iat: number;
    exp: number;
  }

  export interface TutorVerificationFormData {
    _id:string;
    isVerified: "pending" | "approved" | "rejected"; 
    profile: {
      bio: string;
      documents: {
        fileUrl: string;
        type: "id_verification" | "experience_certificate" | string; 
      }[];
      experience: string;
      qualification: string;
      skills: string[];
    };
  }
  