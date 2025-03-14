import { z } from 'zod';

// Base schema for both student and tutor signup
export const baseSignupSchema = z.object({
  username: z.string()
    .min(1, { message: "Full Name is required" }) // First check is always if field is empty
    .regex(/^[a-zA-Z\s]+$/, { message: "Full Name can only contain letters and spaces" })
    .max(50, { message: "Full Name must be less than 50 characters" }),
  
  email: z.string()
    .min(1, { message: "Email is required" }) // First check is always if field is empty
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email must be less than 100 characters" }),
  
  password: z.string()
    .min(1, { message: "Password is required" }) // First check is always if field is empty
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
      message: "Password must include uppercase, lowercase, number, and special character"
    }),
  
  confirmPassword: z.string()
    .min(1, { message: "Confirm Password is required" }) // First check is always if field is empty
});

// Complete signup schema with password match validation
export const signupSchema = baseSignupSchema.refine(
  (data) => data.password === data.confirmPassword, 
  { 
    message: "Passwords do not match", 
    path: ["confirmPassword"] 
  }
);

// Type for form data
export type SignupFormData = z.infer<typeof signupSchema>;

// Validation function that returns field-specific errors
export const validateSignupForm = (data: SignupFormData) => {
  try {
    signupSchema.parse(data);
    return { 
      status: true, 
      errors: {} 
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Sort errors to prioritize "required" messages
      const sortedErrors = error.errors.sort((a) => 
        a.message.includes("is required") ? -1 : 1
      );

      // Create an object with field-specific errors
      const fieldErrors = sortedErrors.reduce((acc, err) => {
        const path = err.path[0] as string;
        // Only add the first error for each field
        if (!acc[path]) {
          acc[path] = err.message;
        }
        return acc;
      }, {} as Record<string, string>);

      return { 
        status: false, 
        errors: fieldErrors 
      };
    }
    return { 
      status: false, 
      errors: { general: "An unknown error occurred" } 
    };
  }
};