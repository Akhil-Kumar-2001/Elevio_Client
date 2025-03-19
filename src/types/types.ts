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

  export interface Tutor {
    _id: string;
    username: string;
    email: string;
    role: string;
    status: number;
    isVerified: string;
    profile: {
      profilePicture:string;
      skills: string[];
      documents: { name: string; url: string }[]; // Adjust based on actual document structure
      bio: string;
      experience: string;
      qualification: string;
    };
  }

  export interface TutorType {
    username: string;
    email: string;
    profile: {
      bio?: string;
      profilePicture?: string;
      qualification?: string;
      experience?: string;
      skills?: string[];
      documents?: {
        fileUrl: string;
        type: "id_verification" | "experience_certificate" | string;
      }[];
    };
  }

  export interface CourseData {
    tutorId: string;
    title: string;
    subtitle:string;
    price: number;
    category: string;
    imageThumbnail: string;
    description: string;
  }

  export interface Course {
    _id: string;
    tutorId: string;
    title: string;
    price: number;
    subtitle: string;
    description: string;
    category: string | { _id: string, name: string }; // Allow category to be either an ID or an object with a name
    totalDuration: number;
    totalLectures: number;
    totalSections: number;
    isBlocked: boolean;
    status: string;
    rejectedReason: string;
    imageThumbnail: string;
    createdAt: string;
    updatedAt: string;
}
  export interface ICourse {
    _id: string;
    tutorId: string;
    title: string;
    price: number;
    subtitle: string;
    description: string;
    category:string;
    totalDuration: number;
    totalLectures: number;
    totalSections: number;
    isBlocked: boolean;
    status: string;
    rejectedReason: string;
    imageThumbnail: string;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
  _id: string; 
  name: string;
  status?: number;
}
  
  