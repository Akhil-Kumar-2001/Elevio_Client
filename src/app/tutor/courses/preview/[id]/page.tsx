'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ChevronDown, ChevronUp, Star, Play } from 'lucide-react';
import Navbar from '@/components/tutor/navbar';
import TutorSidebar from '@/components/tutor/tutorSidebar';
import { toast } from 'react-toastify';
import { getCourseDetailsForPreview, getSectionsByCourseForPreview, getLecturesBySectionForPreview, getReviewsByCourse, replyReview, deleteReply } from '@/app/service/tutor/tutorApi';
import { ICourse, ISection, IReview, ILecture, ICoursePreview } from '@/types/types';
import ReactPlayer from 'react-player';

// Update the interface to match the actual schema structure
interface IReviewWithUser extends IReview {
    _id: string;
    reply: string | null; 
}

const TutorCoursePreview = () => {
    const router = useRouter();
    const { id } = useParams();
    const [course, setCourse] = useState<ICoursePreview | null>(null);
    const [sections, setSections] = useState<ISection[]>([]);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [currentLecture, setCurrentLecture] = useState<ILecture | null>(null);
    const [reviews, setReviews] = useState<IReviewWithUser[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [expanded, setExpanded] = useState<boolean>(true); // Sync with TutorSidebar
    const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});
    const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null); // State for delete confirmation modal

    const fetchCourseDetails = async () => {
        try {
            setLoading(true);
            const response = await getCourseDetailsForPreview(id as string);
            if (response.success) {
                setCourse(response.data);
            } else {
                toast.error(response.message || "Failed to load course details");
            }
        } catch (error) {
            console.error("Error fetching course details:", error);
            toast.error("Failed to load course details");
        } finally {
            setLoading(false);
        }
    };

    const fetchCourseSections = async () => {
        try {
            const response = await getSectionsByCourseForPreview(id as string);
            if (response.success) {
                setSections(response.data);
                const initialExpandedState: Record<string, boolean> = {};
                response.data.forEach((section: ISection, index: number) => {
                    initialExpandedState[section._id.toString()] = index === 0;
                });
                setExpandedSections(initialExpandedState);
                if (response.data.length > 0 && response.data[0].totalLectures > 0) {
                    const firstSectionId = response.data[0]._id.toString();
                    fetchSectionLectures(firstSectionId, true);
                }
            }
        } catch (error) {
            console.error("Error fetching course sections:", error);
            toast.error("Failed to load course sections");
        }
    };

    const fetchSectionLectures = async (sectionId: string, setFirstAsCurrent = false) => {
        try {
            const response = await getLecturesBySectionForPreview(sectionId);
            if (response.success) {
                setSections(prev =>
                    prev.map(section =>
                        section._id.toString() === sectionId
                            ? { ...section, lectures: response.data }
                            : section
                    )
                );
                if (setFirstAsCurrent && response.data.length > 0) {
                    setCurrentLecture(response.data[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching lectures:", error);
            toast.error("Failed to load lectures");
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await getReviewsByCourse(id as string);
            if (response.success) {
                const reviewsWithUser = response.data.map((review: IReview) => ({
                    ...review,
                    userId: {
                        username: review.userId.username || 'Anonymous',
                    },
                }));
                setReviews(reviewsWithUser || []);
            } else {
                setReviews([]);
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setReviews([]);
        }
    };

    const handleReplySubmit = async (reviewId: string) => {
        const replyContent = replyInputs[reviewId]?.trim();
        if (!replyContent) {
            toast.error("Reply cannot be empty");
            return;
        }

        try {
            const response = await replyReview(reviewId, replyContent);
            if (response.success) {
                setReviews(reviews.map(review =>
                    review._id === reviewId
                        ? { ...review, reply: response.data.reply }
                        : review
                ));
                setReplyInputs(prev => ({ ...prev, [reviewId]: '' }));
                toast.success(response.message || "Reply submitted successfully");
                fetchReviews();
            } else {
                toast.error(response.message || "Failed to submit reply");
            }
        } catch (error) {
            console.error("Error submitting reply:", error);
            toast.error("Failed to submit reply");
        }
    };

    const handleReplyEdit = async (reviewId: string) => {
        const replyContent = replyInputs[reviewId]?.trim();
        if (!replyContent) {
            toast.error("Reply cannot be empty");
            return;
        }

        try {
            const response = await replyReview(reviewId, replyContent);
            if (response.success) {
                setReviews(reviews.map(review =>
                    review._id === reviewId
                        ? { ...review, reply: response.data.reply }
                        : review
                ));
                setReplyInputs(prev => ({ ...prev, [reviewId]: '' }));
                setEditingReplyId(null);
                toast.success(response.message || "Reply updated successfully");
                fetchReviews();
            } else {
                toast.error(response.message || "Failed to update reply");
            }
        } catch (error) {
            console.error("Error updating reply:", error);
            toast.error("Failed to update reply");
        }
    };

    const handleReplyDelete = async (reviewId: string) => {
        try {
            const response = await deleteReply(reviewId);
            if (response) {
                setReviews(reviews.map(review =>
                    review._id === reviewId
                        ? { ...review, reply: null }
                        : review
                ));
                setReplyInputs(prev => ({ ...prev, [reviewId]: '' }));
                setEditingReplyId(null);
                toast.success(response.message || "Reply deleted successfully");
                fetchReviews();
            } else {
                toast.error(response.message || "Failed to delete reply");
            }
        } catch (error) {
            console.error("Error deleting reply:", error);
            toast.error("Failed to delete reply");
        } finally {
            setShowDeleteModal(null); // Close modal after deletion
        }
    };

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
        if (!expandedSections[sectionId]) {
            const section = sections.find(s => s._id.toString() === sectionId);
            if (section && (!section.lectures || section.lectures.length === 0)) {
                fetchSectionLectures(sectionId);
            }
        }
    };

    const handleLectureSelect = (lecture: ILecture) => {
        setCurrentLecture(lecture);
    };

    useEffect(() => {
        if (id) {
            fetchCourseDetails();
            fetchCourseSections();
            fetchReviews();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-blue-600 text-xl">Loading course preview...</div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="text-red-600 text-xl">Course not found</div>
            </div>
        );
    }

    const averageRating = reviews.length > 0
        ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <div className="fixed top-0 left-0 right-0 z-10 bg-white">
                <Navbar />
            </div>

            <div className="flex pt-16 h-full">
                <div className="fixed left-0 top-16 bottom-0 z-10 bg-white">
                    <TutorSidebar expanded={expanded} setExpanded={setExpanded} />
                </div>

                <div className={`flex-1 bg-gray-50 transition-all duration-300 ${expanded ? 'pl-64' : 'pl-24'}`}>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-xl font-medium text-gray-800">Course Preview</h1>
                            <div className="group relative">
                                <button
                                    onClick={() => router.push(`/tutor/courses/course-details/${id}`)}
                                    className="p-2.5 bg-gray-500 text-white rounded-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors duration-200"
                                    type="button"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="absolute invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 top-12 right-0 bg-gray-500 text-white text-xs rounded py-1 px-3 whitespace-nowrap z-50 min-w-max">
                                    Back to Course Details
                                    <div className="absolute top-[-4px] right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-500" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row w-full">
                            <div className="lg:w-3/4 h-full flex flex-col">
                                <div className="relative bg-black w-full" style={{ paddingTop: '56.25%' }}>
                                    {currentLecture ? (
                                        <ReactPlayer
                                            url={currentLecture.videoUrl || '/placeholder-video.mp4'}
                                            className="absolute top-0 left-0 w-full h-full"
                                            style={{ objectFit: 'contain' }}
                                            width="100%"
                                            height="100%"
                                            controls
                                        />
                                    ) : (
                                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white">
                                            Select a lecture to preview
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 bg-white border-b">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
                                    <p className="text-gray-600 mb-4">{course.subtitle}</p>
                                    {currentLecture && (
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                            <h2 className="font-semibold text-gray-800">
                                                Now Playing: {currentLecture.title}
                                            </h2>
                                            <p className="text-sm text-gray-600 mt-1">
                                                Duration: {currentLecture.duration} minutes
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-6 p-6 bg-white border-t">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Student Reviews</h2>
                                    {reviews.length > 0 ? (
                                        <>
                                            <div className="flex items-center mb-4">
                                                <div className="flex items-center">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            className={`w-5 h-5 ${star <= parseFloat(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                            fill={star <= parseFloat(averageRating) ? '#FBBF24' : 'none'}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="ml-2 text-lg text-gray-700 font-semibold">{averageRating}</span>
                                                <span className="ml-2 text-sm text-gray-600">({reviews.length} reviews)</span>
                                            </div>
                                            <div className="space-y-6">
                                                {reviews.map((review) => (
                                                    <div key={review._id} className="border-b pb-4">
                                                        <div className="flex items-center mb-2">
                                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                                {review.userId?.username?.slice(0, 2).toUpperCase() || 'AN'}
                                                            </div>
                                                            <div className="ml-3">
                                                                <p className="font-medium text-gray-800">
                                                                    {review.userId?.username || 'Anonymous'}
                                                                </p>
                                                                <div className="flex items-center">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <Star
                                                                            key={star}
                                                                            className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                            fill={star <= review.rating ? '#FBBF24' : 'none'}
                                                                        />
                                                                    ))}
                                                                    <span className="text-gray-500 text-sm ml-2">
                                                                        {new Date(review.createdAt).toLocaleDateString()}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-700">{review.review}</p>

                                                        {/* Display tutor's reply */}
                                                        {review.reply ? (
                                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                                <p className="text-sm text-gray-600 font-medium">{course.tutorId.username}'s Reply:</p>
                                                                <p className="text-gray-700">{review.reply}</p>
                                                                <div className="flex space-x-3 mt-3">
                                                                    <button
                                                                        onClick={() => {
                                                                            setEditingReplyId(review._id);
                                                                            setReplyInputs(prev => ({
                                                                                ...prev,
                                                                                [review._id]: review.reply!,
                                                                            }));
                                                                        }}
                                                                        className="inline-flex items-center px-3 py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium transition-colors"
                                                                    >
                                                                        Edit Reply
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setShowDeleteModal(review._id)}
                                                                        className="inline-flex items-center px-3 py-1.5 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium transition-colors"
                                                                    >
                                                                        Delete Reply
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : null}

                                                        {/* Input for adding or editing reply */}
                                                        {(editingReplyId === review._id || !review.reply) && (
                                                            <div className="mt-4">
                                                                <textarea
                                                                    value={replyInputs[review._id] || ''}
                                                                    onChange={(e) =>
                                                                        setReplyInputs(prev => ({
                                                                            ...prev,
                                                                            [review._id]: e.target.value,
                                                                        }))
                                                                    }
                                                                    className="w-full p-2 border text-gray-800 border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                                                    rows={3}
                                                                    placeholder="Write your reply to this review..."
                                                                />
                                                                <div className="flex space-x-2 mt-2">
                                                                    <button
                                                                        onClick={() =>
                                                                            editingReplyId
                                                                                ? handleReplyEdit(review._id)
                                                                                : handleReplySubmit(review._id)
                                                                        }
                                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                                                                    >
                                                                        {editingReplyId ? 'Update Reply' : 'Submit Reply'}
                                                                    </button>
                                                                    {editingReplyId && (
                                                                        <button
                                                                            onClick={() => {
                                                                                setEditingReplyId(null);
                                                                                setReplyInputs(prev => ({ ...prev, [review._id]: '' }));
                                                                            }}
                                                                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    ) : (
                                        <p className="text-gray-600">No reviews yet.</p>
                                    )}
                                </div>
                            </div>

                            <div className="lg:w-1/4 bg-white border-l h-full overflow-y-auto">
                                <div className="p-4 border-b bg-gray-50">
                                    <h2 className="text-lg font-semibold text-gray-800">Course Content</h2>
                                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                                        <span>{course.totalSections} sections</span>
                                        <span>{course.totalLectures} lectures</span>
                                        <span>{course.totalDuration} hours</span>
                                    </div>
                                </div>

                                <div className="divide-y">
                                    {sections.map((section) => {
                                        const sectionId = section._id.toString();
                                        return (
                                            <div key={sectionId} className="border-b">
                                                <button
                                                    className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                                                    onClick={() => toggleSection(sectionId)}
                                                >
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-800 text-left">{section.title}</h3>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {section.totalLectures} lectures • {section.totalDuration} min
                                                        </p>
                                                    </div>
                                                    {expandedSections[sectionId] ? (
                                                        <ChevronUp className="w-5 h-5 text-gray-500" />
                                                    ) : (
                                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                                    )}
                                                </button>

                                                {expandedSections[sectionId] && (
                                                    <div className="bg-gray-50 py-2">
                                                        {section.lectures && section.lectures.length > 0 ? (
                                                            section.lectures.map((lecture) => {
                                                                const isActive = currentLecture?._id === lecture._id;
                                                                return (
                                                                    <button
                                                                        key={lecture._id.toString()}
                                                                        className={`w-full p-3 flex items-center text-left hover:bg-gray-100 transition-colors ${isActive ? 'bg-blue-50' : ''}`}
                                                                        onClick={() => handleLectureSelect(lecture)}
                                                                    >
                                                                        <div className="w-6 flex-shrink-0">
                                                                            <Play className="w-5 h-5 text-blue-500" />
                                                                        </div>
                                                                        <div className="ml-2 flex-1">
                                                                            <p className={`${isActive ? 'text-blue-600 font-medium' : 'text-gray-800'}`}>
                                                                                {lecture.title}
                                                                            </p>
                                                                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                                                                <span>{lecture.duration} min</span>
                                                                                {lecture.isPreview && (
                                                                                    <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                                                                                        Preview
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })
                                                        ) : (
                                                            <div className="text-center text-gray-500 py-4">
                                                                No lectures available
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Delete</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to delete this reply? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReplyDelete(showDeleteModal)}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TutorCoursePreview;