import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Book, Clock, MessageCircle } from 'lucide-react';

export default function StudentSection() {
    return (
        <section id="students" className="py-24 overflow-hidden bg-gradient-to-br from-pink-50 to-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    {/* Content Column */}
                    <div className="w-full lg:w-1/2">
                        <div className="max-w-lg mx-auto lg:mx-0">
                            <h2 className="text-sm font-semibold text-pink-600 uppercase tracking-wide">For Learners</h2>
                            <h3 className="mt-2 text-4xl font-bold text-gray-900 md:text-5xl">Expand Your Knowledge</h3>

                            <p className="mt-4 text-lg text-gray-600">
                                Access high-quality courses taught by industry experts. Learn at your own pace,
                                connect with tutors for personalized guidance, and achieve your learning goals.
                            </p>

                            <div className="mt-8 space-y-4">
                                {[
                                    {
                                        icon: <Book className="h-6 w-6 text-pink-600" />,
                                        title: 'Learn from the best',
                                        description: 'Access courses from top instructors in various fields'
                                    },
                                    {
                                        icon: <Clock className="h-6 w-6 text-pink-600" />,
                                        title: 'Study at your pace',
                                        description: 'Set your own schedule and learn when it works for you'
                                    },
                                    {
                                        icon: <MessageCircle className="h-6 w-6 text-pink-600" />,
                                        title: 'Get personalized support',
                                        description: 'Connect with instructors through chat and video calls'
                                    },
                                ].map((item, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="flex-shrink-0">{item.icon}</div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-medium text-gray-900">{item.title}</h4>
                                            <p className="mt-1 text-gray-500">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-10">
                                <Link
                                    href="/signup"
                                    className="inline-flex items-center rounded-full bg-pink-600 px-8 py-3 text-base font-medium text-white shadow-md transition-all hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                                >
                                    Start Learning Today
                                    <ChevronRight className="ml-2 h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Image Column */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative">
                            {/* Background elements */}
                            <div className="absolute -top-6 -right-6 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply opacity-70 animate-pulse-slow"></div>
                            <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply opacity-70"></div>

                            {/* Student image container */}
                            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl animate-fade-in-left">
                                <div className="aspect-[4/3] relative">
                                    <Image
                                        src="/images/StudentandParent.jpeg"
                                        alt="Student learning online"
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Progress card */}
                                <div className="absolute -bottom-1 left-0 ml-2 mb-2 bg-white rounded-xl shadow-lg p-4 animate-float-slow">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-2">
                                            <div className="text-xl font-bold text-pink-600">73%</div>
                                        </div>
                                        <div className="text-sm text-gray-500">Course Progress</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}