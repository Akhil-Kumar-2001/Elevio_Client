import { z } from 'zod';

// Login validation schema
export const loginSchema = z.object({
  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email must be less than 100 characters" }),
  
  password: z.string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" })
});

// Type for login form data
export type LoginFormData = z.infer<typeof loginSchema>;

// Validation function that returns field-specific errors
export const validateLoginForm = (data: LoginFormData) => {
  try {
    loginSchema.parse(data);
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