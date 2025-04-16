'use client'

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminSidebar from '@/components/admin/adminsidebar';
import { getCourseDetails,getCagoryName, getSectionsByCourse, getLecturesBySection } from '@/app/service/admin/adminApi';
import { toast } from 'react-toastify';
import { Course, ISection, ILecture } from '@/types/types';
import CourseVerificationModal from '@/components/admin/courseVerificationModal';
import Link from 'next/link';

interface SectionWithLectures extends ISection {
  lectures: ILecture[];
}

const CoursePreview = () => {
  const { id } = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [categoryName,setCategoryName] = useState("")
  const [sections, setSections] = useState<SectionWithLectures[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLecture, setSelectedLecture] = useState<ILecture | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await getCourseDetails(id as string);
      if (response && response.success) {
        setCourse(response.data);
      } else {
        toast.error('Failed to fetch course details');
        router.push('/admin/courseverification');
      }
    } catch (error) {
      console.error('Error fetching course details:', error);
      toast.error('Failed to fetch course details');
      router.push('/not-found');
    }
  };
  
  const fetchCategoryName = async() => {
    if(!course || !course.category) return;
    try {
      const categoryId = typeof course.category === 'string' 
        ? course.category 
        : course.category._id;
        
      const response = await getCagoryName(categoryId);
      setCategoryName(response.data);
    } catch (error) {
      console.log("Error while getting category name", error);
    }
}
  useEffect(()=>{
    fetchCategoryName();
  },[course])

  const fetchSectionsAndLectures = async () => {
    try {
      const sectionResponse = await getSectionsByCourse(id as string);
      if (sectionResponse && sectionResponse.success) {
        const sectionsData: ISection[] = sectionResponse.data;

        const sectionsWithLectures: SectionWithLectures[] = await Promise.all(
          sectionsData.map(async (section) => {
            const lectureResponse = await getLecturesBySection(section._id);
            const lectures = lectureResponse && lectureResponse.success ? lectureResponse.data : [];
            return { ...section, lectures };
          })
        );

        sectionsWithLectures.sort((a, b) => a.order - b.order);
        sectionsWithLectures.forEach((section) => {
          section.lectures.sort((a, b) => a.order - b.order);
        });

        setSections(sectionsWithLectures);

        if (sectionsWithLectures.length > 0 && sectionsWithLectures[0].lectures.length > 0) {
          setSelectedLecture(sectionsWithLectures[0].lectures[0]);
          setExpandedSection(sectionsWithLectures[0]._id);
        }
      } else {
        toast.error('Failed to fetch sections');
      }
    } catch (error) {
      console.error('Error fetching sections and lectures:', error);
      toast.error('Failed to fetch sections and lectures');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCourseDetails();
      fetchSectionsAndLectures();
    }
  }, [id]);

  const handleSectionClick = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleLectureClick = (lecture: ILecture) => {
    setSelectedLecture(lecture);
  };

  const getCategoryName = (category: string | { _id: string; name: string }) => {
    if (!category) return 'Uncategorized';
    if (typeof category === 'string') return category;
    return category.name || 'Uncategorized';
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-black text-white p-4 border-b border-gray-700 flex justify-between items-center">
      <Link href={`/admin/dashboard`} className="text-xl font-bold">Elevio</Link>        <div></div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div>
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-black text-white overflow-auto">
          <div className="p-8 flex flex-col h-full">
            {/* Title and Back Button */}
            <div className="flex justify-between items-center mb-6">
              <div className="space-x-8 border-b border-gray-700">
                <button className="text-lg font-medium border-b-2 border-white pb-2 mr-4 text-white">
                  Course Preview
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/admin/courseverification')}
                  className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Back to Verification
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-gray-400">Loading...</div>
            ) : course ? (
              <div className="flex-1 flex flex-col">
                <div className="flex gap-6 flex-1">
                  {/* Left Side: Video Player and Course Info */}
                  <div className="flex-1 flex flex-col">
                    {/* Video Player */}
                    <div className="bg-gray-900 rounded-lg overflow-hidden mb-6">
                      {selectedLecture ? (
                        <video
                          controls
                          className="w-full h-[400px] object-cover"
                          src={selectedLecture.videoUrl || ''}
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <div className="w-full h-[400px] flex items-center justify-center bg-gray-800">
                          <p className="text-gray-400">Select a lecture to play</p>
                        </div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                      <p className="text-gray-400 mb-4">{course.subtitle}</p>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="bg-gray-700 text-white text-sm font-medium px-3 py-1 rounded-full">
                          {getCategoryName(categoryName)}
                        </span>
                        <span className="text-xl font-bold">₹{course.price}</span>
                      </div>
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Description</h3>
                        <p className="text-gray-300">{course.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Sections and Lectures List */}
                  <div className="w-1/3 bg-gray-900 rounded-lg p-4 h-[calc(100vh-12rem)] overflow-y-auto">
                    <h3 className="text-lg font-semibold mb-4">Course Content</h3>
                    {sections.length > 0 ? (
                      sections.map((section) => (
                        <div key={section._id} className="mb-2">
                          {/* Section Header */}
                          <button
                            onClick={() => handleSectionClick(section._id)}
                            className="w-full text-left px-4 py-2 bg-gray-800 rounded-md hover:bg-gray-700 flex justify-between items-center"
                          >
                            <span>{section.title}</span>
                            <span>{expandedSection === section._id ? '▼' : '▶'}</span>
                          </button>

                          {/* Lectures List */}
                          {expandedSection === section._id && (
                            <div className="ml-4 mt-2">
                              {section.lectures.length > 0 ? (
                                section.lectures.map((lecture) => (
                                  <button
                                    key={lecture._id}
                                    onClick={() => handleLectureClick(lecture)}
                                    className={`w-full text-left px-4 py-2 rounded-md hover:bg-gray-700 ${
                                      selectedLecture?._id === lecture._id
                                        ? 'bg-gray-700 text-white'
                                        : 'text-gray-300'
                                    }`}
                                  >
                                    {lecture.title}
                                  </button>
                                ))
                              ) : (
                                <p className="text-gray-400 ml-4">No lectures available</p>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400">No sections available</p>
                    )}
                  </div>
                </div>

                {/* Bottom Section: Course Status and Buttons */}
                {course?.status && (
                  <div className="mt-6 flex justify-between items-center mb-12">
                    {/* Course Status on the Left */}
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Course Status</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          course.status === 'Published'
                            ? 'bg-green-900 text-green-300'
                            : 'bg-yellow-900 text-yellow-300'
                        }`}
                      >
                        {course.status}
                      </span>
                    </div>

                    {/* Approve and Reject Buttons on the Right */}
                    {course.status === 'pending' && (
                      <div className="flex gap-3">
                        <CourseVerificationModal courseId={id as string} tutorId={course.tutorId} type="reject" />
                        <CourseVerificationModal courseId={id as string} tutorId={course.tutorId} type="approve" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-400">Course not found</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;