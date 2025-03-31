export type basicType = {
  username: string,
  email: string,
  image?: string;
  password?: string
}

export type userType = {
  email: string,
  password: string
}

export type resetPasswordType = {
  password: string;
  confirmPassword: string
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
  _id: string;
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
    profilePicture: string;
    skills: string[];
    documents: { type: string; fileUrl: string }[]; // Adjust based on actual document structure
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
  subtitle: string;
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
  category: string;
  purchasedStudents:string[];
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

export interface ISectionData {
  title: string,
  description: string,
}

export interface ISectionData {
  title: string;
  description: string;
}

export interface Section {
  _id: string;
  title: string;
  description: string;
}

export interface Lecture {
  _id: string;
  title: string;
  videoUrl?: string;
  courseId: string;
  sectionId: string;
}

// types/types.ts
export interface ILecture {
  _id: string;
  sectionId: string;
  courseId: string;
  title: string;
  videoUrl?: string;
  duration: number;
  order: number;
  status: "processing" | "processed";
  isPreview?: boolean;
}

export interface ISection {
  _id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  totalLectures?: number;
  totalDuration?: number;
  lectures?: ILecture[];
  isPublished?: boolean;
}

export interface ICategory {
  _id: string;
  name: string;
}


export interface FrontendCourse {
  title: string;
  price: number;
  image: string;
  rating: number;
  students: number;
}

export interface EditStudentType {
  username:string;
  profilePicture:string | null;
}

export interface CartItem {
  courseId: string;
  price: number;
  courseTitle: string;
  courseSubtitle: string;
  courseDuration: number;
  courseLectures: number;
  courseImage: string;
}