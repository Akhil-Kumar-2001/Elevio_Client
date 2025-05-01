'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react'; // Add this import
import { resetPassword as StudentResetPassword } from '@/app/service/user/userApi';
import { resetPassword as TutorResetPassword } from '@/app/service/tutor/tutorApi';
import Image from 'next/image';

interface ResetPasswordPageProps {
    role: 'student' | 'tutor';
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({ role }) => {
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false); // Add state for password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Add state for confirm password visibility
    const searchParams = useSearchParams();

    useEffect(() => {
        const emailFromQuery = searchParams.get('email');
        setEmail(emailFromQuery ?? '');
    }, []);

    const router = useRouter();
    const authImage = role === 'student' ? '/images/StudentLogin.png' : '/images/TutorLogin.png';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors(null);
    };

    const validatePasswords = () => {
        if (!formData.password) {
            setErrors('Password is required');
            return false;
        }
        if (formData.password.length < 8) {
            setErrors('Password must be at least 8 characters long');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setErrors('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (loading) return;

        if (!validatePasswords()) return;

        setLoading(true);

        try {
            const resetApi = role === 'student' ? StudentResetPassword : TutorResetPassword;
            const response = await resetApi(formData.password, email);
            if (response) {
                toast.success(response.message);
            }
            // role === 'student' ? router.push('/login') : router.push('/tutor/login');
            if (role === 'student') {
                router.push('/login');
            } else {
                router.push('/tutor/login');
            }
        } catch (error) {
            console.log(error)
            setErrors('Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Add toggle functions
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <div className="flex w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Left section - Image */}
                <div className="hidden md:flex md:w-1/2 items-center justify-center p-12">
                    <Image
                        src={authImage}
                        alt={role === 'student' ? 'Student studying' : 'Tutor teaching'}
                        width={500} // Adjust based on your design
                        height={500} // Adjust based on your design
                        className="w-full h-auto"
                    />
                </div>

                {/* Right section - Reset Password form */}
                <div className="w-full md:w-1/2 p-8">
                    <div className="h-full flex flex-col">
                        <h2 className="text-2xl font-semibold text-center mb-8 text-gray-800">
                            Reset Password
                        </h2>

                        <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6 max-w-sm mx-auto w-full">
                            <div className="relative flex items-center">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="New Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-4 p-1 text-gray-600 hover:text-gray-800 focus:outline-none"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5 stroke-[1.5]" />
                                    ) : (
                                        <Eye className="w-5 h-5 stroke-[1.5]" />
                                    )}
                                </button>
                            </div>

                            <div className="relative flex items-center">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm New Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-black pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={toggleConfirmPasswordVisibility}
                                    className="absolute right-4 p-1 text-gray-600 hover:text-gray-800 focus:outline-none"
                                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5 stroke-[1.5]" />
                                    ) : (
                                        <Eye className="w-5 h-5 stroke-[1.5]" />
                                    )}
                                </button>
                            </div>

                            {errors && <p className="text-red-500 text-sm text-center">{errors}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 rounded-lg font-medium transition-colors ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white'
                                    }`}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>

                            <div className="text-sm text-gray-500 text-center">
                                <p>Password must be at least 8 characters long</p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;                                   