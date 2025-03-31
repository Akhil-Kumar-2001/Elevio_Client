'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, ChevronDown, ChevronUp, Plus, Edit, Trash2 } from 'lucide-react';
import TutorSidebar from '@/components/tutor/tutorSidebar';
import Navbar from '@/components/tutor/navbar';
import { createSection, createLecture, getSections, getLecturesBySection, updateSection, deleteSection, updateLecture, deleteLecture, uploadLectureVideo, applyReview } from '@/app/service/tutor/tutorApi';
import useAuthStore from '@/store/tutorAuthStore';
import { ISectionData, Lecture, Section } from '@/types/types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CourseContentManager = () => {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const { user } = useAuthStore();

  const [sections, setSections] = useState<Section[]>([]);
  const [lecturesBySection, setLecturesBySection] = useState<{ [sectionId: string]: Lecture[] }>({});
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionDesc, setNewSectionDesc] = useState('');
  const [newLectureTitle, setNewLectureTitle] = useState('');
  const [newLectureVideo, setNewLectureVideo] = useState<File | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [sectionId: string]: boolean }>({});
  const [uploadingLectureId, setUploadingLectureId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lecturesLoading, setLecturesLoading] = useState(false);
  const [showAddSection, setShowAddSection] = useState(false);
  const [editSectionId, setEditSectionId] = useState<string | null>(null);
  const [editSectionTitle, setEditSectionTitle] = useState('');
  const [editSectionDesc, setEditSectionDesc] = useState('');
  const [editLectureId, setEditLectureId] = useState<string | null>(null);
  const [editLectureTitle, setEditLectureTitle] = useState('');

  // Fetch sections from the backend when the component mounts
  useEffect(() => {
    const fetchSections = async () => {
      if (!courseId) {
        setError('No course ID provided');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const fetchedSections = await getSections(courseId);
        const sectionsData = fetchedSections.data || [];
        setSections(sectionsData);
        setLecturesBySection((prev) => {
          const updated = { ...prev };
          sectionsData.forEach((section: Section) => {
            if (!updated[section._id]) {
              updated[section._id] = [];
            }
          });
          return updated;
        });
      } catch (error) {
        console.error('Error fetching sections:', error);
        setError('Failed to fetch sections. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [courseId]);

  // Handle review submission with courseId
  const handleReview = async () => {
    if (!courseId) {
      setError('No course ID provided');
      return;
    }

    setLoading(true);
    try {
      const response = await applyReview(courseId);
      if (response.success) {
        toast.success(response.message);
        router.push('/tutor/courses');
      } else {
        toast.error(response.message || 'Failed to apply for review');
      }
    } catch (error) {
      console.error('Error while applying for review:', error);
      toast.error('Error while applying for review');
    } finally {
      setLoading(false);
    }
  };

  // Fetch lectures for all sections
  const fetchLecturesForSections = async () => {
    if (sections.length === 0) return;

    setLecturesLoading(true);
    setError(null);
    const lecturesMap = { ...lecturesBySection };

    for (const section of sections) {
      try {
        const lectures = await getLecturesBySection(section._id);
        lecturesMap[section._id] = lectures.data || lectures || [];
      } catch (error) {
        console.error(`Error fetching lectures for section ${section._id}:`, error);
        lecturesMap[section._id] = [];
        setError(`Failed to fetch lectures for section ${section.title}.`);
      }
    }

    setLecturesBySection(lecturesMap);
    setLecturesLoading(false);
  };

  useEffect(() => {
    fetchLecturesForSections();
  }, [sections]);

  // Add a new section
  const handleAddSection = async () => {
    if (!newSectionTitle || !newSectionDesc || !courseId || !user?.id) {
      setError('Please fill in all section fields');
      return;
    }

    setLoading(true);
    setError(null);

    const sectionData: ISectionData = {
      title: newSectionTitle,
      description: newSectionDesc,
    };

    try {
      const response = await createSection(courseId, sectionData);
      if (response) {
        const newSection = { _id: response.data._id, title: response.data.title, description: response.data.description } as Section;
        setSections((prev) => [...prev, newSection]);
        setLecturesBySection((prev) => ({
          ...prev,
          [newSection._id]: [],
        }));
        setNewSectionTitle('');
        setNewSectionDesc('');
        setShowAddSection(false);
        toast.success('Section created successfully!');
      }
    } catch (error) {
      console.error('Error creating section:', error);
      setError('Failed to create section. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Edit a section
  const handleEditSection = (section: Section) => {
    setEditSectionId(section._id);
    setEditSectionTitle(section.title);
    setEditSectionDesc(section.description);
  };

  const handleUpdateSection = async (sectionId: string) => {
    if (!editSectionTitle || !editSectionDesc) {
      setError('Please fill in all section fields');
      return;
    }

    setLoading(true);
    setError(null);

    const sectionData: ISectionData = {
      title: editSectionTitle,
      description: editSectionDesc,
    };

    try {
      const response = await updateSection(sectionId, sectionData);
      if (response) {
        setSections((prev) =>
          prev.map((section) =>
            section._id === sectionId ? { ...section, title: editSectionTitle, description: editSectionDesc } : section
          )
        );
        setEditSectionId(null);
        setEditSectionTitle('');
        setEditSectionDesc('');
        toast.success('Section updated successfully!');
      }
    } catch (error) {
      console.error('Error updating section:', error);
      setError('Failed to update section. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a section
  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section and all its lectures?')) return;

    setLoading(true);
    setError(null);

    try {
      await deleteSection(sectionId);
      setSections((prev) => prev.filter((section) => section._id !== sectionId));
      setLecturesBySection((prev) => {
        const updated = { ...prev };
        delete updated[sectionId];
        return updated;
      });
      setExpandedSections((prev) => {
        const updated = { ...prev };
        delete updated[sectionId];
        return updated;
      });
      toast.success('Section deleted successfully!');
    } catch (error) {
      console.error('Error deleting section:', error);
      setError('Failed to delete section. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle video file selection
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        setError('Please upload a valid video file');
        setNewLectureVideo(null);
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        setError('Video file size should be less than 100MB');
        setNewLectureVideo(null);
        return;
      }
      setError(null);
      setNewLectureVideo(file);
    }
  };

  // Add a new lecture to a section
  const handleAddLecture = async (sectionId: string) => {
    if (!newLectureTitle || !courseId || !sectionId) {
      setError('Please enter a lecture title');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const lectureResponse = await createLecture(courseId, sectionId, newLectureTitle);
      const newLecture = {
        _id: lectureResponse.data._id,
        title: lectureResponse.data.title,
        courseId: lectureResponse.data.courseId,
        sectionId: lectureResponse.data.sectionId,
        videoUrl: lectureResponse.data.videoUrl || undefined,
      } as Lecture;
      setLecturesBySection((prev) => {
        const updatedLectures = [...(prev[sectionId] || []), newLecture];
        return {
          ...prev,
          [sectionId]: updatedLectures,
        };
      });
      setNewLectureTitle('');
      setActiveSectionId(null);
      toast.success('Lecture created successfully!');
    } catch (error) {
      console.error('Error creating lecture:', error);
      setError('Failed to create lecture. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Edit a lecture
  const handleEditLecture = (lecture: Lecture) => {
    setEditLectureId(lecture._id);
    setEditLectureTitle(lecture.title);
  };

  const handleUpdateLecture = async (lectureId: string, sectionId: string) => {
    if (!editLectureTitle) {
      setError('Please enter a lecture title');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await updateLecture(lectureId, { title: editLectureTitle });
      if (response) {
        setLecturesBySection((prev) => ({
          ...prev,
          [sectionId]: prev[sectionId].map((lecture) =>
            lecture._id === lectureId ? { ...lecture, title: editLectureTitle } : lecture
          ),
        }));
        setEditLectureId(null);
        setEditLectureTitle('');
        toast.success('Lecture updated successfully!');
      }
    } catch (error) {
      console.error('Error updating lecture:', error);
      setError('Failed to update lecture. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a lecture
  const handleDeleteLecture = async (lectureId: string, sectionId: string) => {
    if (!confirm('Are you sure you want to delete this lecture?')) return;

    setLoading(true);
    setError(null);

    try {
      await deleteLecture(lectureId);
      setLecturesBySection((prev) => ({
        ...prev,
        [sectionId]: prev[sectionId].filter((lecture) => lecture._id !== lectureId),
      }));
      toast.success('Lecture deleted successfully!');
    } catch (error) {
      console.error('Error deleting lecture:', error);
      setError('Failed to delete lecture. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Upload video to S3 via backend
  const handleUploadVideoForLecture = async (lectureId: string, sectionId: string) => {
    if (!newLectureVideo) {
      setError('Please select a video to upload');
      return;
    }

    setUploadingLectureId(lectureId);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('video', newLectureVideo);
      formData.append('lectureId', lectureId);

      const videoResponse = await uploadLectureVideo(formData);
      if (videoResponse) {
        const updatedLectures = lecturesBySection[sectionId].map((lecture) =>
          lecture._id === lectureId ? { ...lecture, videoUrl: videoResponse.videoUrl } : lecture
        );
        setLecturesBySection((prev) => ({
          ...prev,
          [sectionId]: updatedLectures,
        }));
        toast.success('Video uploaded successfully!');
      }
      setNewLectureVideo(null);
    } catch (error) {
      console.error('Error uploading video:', error);
      setError('Failed to upload video. Please try again.');
    } finally {
      setUploadingLectureId(null);
    }
  };

  // Toggle section expansion with lecture fetch
  const toggleSection = async (sectionId: string) => {
    setExpandedSections((prev) => {
      const isExpanding = !prev[sectionId];
      if (isExpanding) {
        setLecturesLoading(true);
        getLecturesBySection(sectionId)
          .then((lectures) => {
            setLecturesBySection((prev) => ({
              ...prev,
              [sectionId]: lectures.data || lectures || [],
            }));
          })
          .catch((error) => {
            console.error(`Error fetching lectures on toggle for section ${sectionId}:`, error);
            setError(`Failed to fetch lectures for section ${sectionId}.`);
          })
          .finally(() => setLecturesLoading(false));
      }
      return {
        ...prev,
        [sectionId]: !prev[sectionId],
      };
    });
  };

  const handleBack = () => {
    router.push('/tutor/courses');
  };

  // Render sections with edit and delete options
  const renderSections = () => {
    if (loading && sections.length === 0) {
      return <p className="text-gray-500 text-center">Loading sections...</p>;
    }
    if (sections.length === 0) {
      return <p className="text-gray-500 text-center">No sections added yet.</p>;
    }

    return sections.map((section) => (
      <div key={section._id} className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between p-4">
          {editSectionId === section._id ? (
            <div className="flex-1">
              <input
                type="text"
                value={editSectionTitle}
                onChange={(e) => setEditSectionTitle(e.target.value)}
                placeholder="Section Title"
                className="w-full px-4 py-2 border text-gray-700 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2"
              />
              <textarea
                value={editSectionDesc}
                onChange={(e) => setEditSectionDesc(e.target.value)}
                placeholder="Section Description"
                className="w-full px-4 py-2 border text-gray-700 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none h-20"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleUpdateSection(section._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  disabled={loading}
                >
                  Save
                </button>
                <button
                  onClick={() => setEditSectionId(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div
                className="flex-1 cursor-pointer hover:bg-gray-50 p-2 rounded transition-all"
                onClick={() => toggleSection(section._id)}
              >
                <h3 className="text-lg font-medium text-gray-800">{section.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{section.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditSection(section)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDeleteSection(section._id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                {expandedSections[section._id] ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </div>
            </>
          )}
        </div>

        {expandedSections[section._id] && (
          <div className="p-4 border-t border-gray-200">
            <div className="ml-4">
              {lecturesLoading ? (
                <p className="text-gray-500 text-sm">Loading lectures...</p>
              ) : (
                (() => {
                  const lectures = lecturesBySection[section._id] || [];
                  return lectures.length === 0 ? (
                    <p className="text-gray-500 text-sm">No lectures added yet.</p>
                  ) : (
                    lectures.map((lecture) => (
                      <div
                        key={lecture._id}
                        className="flex items-center justify-between py-2 px-4 bg-gray-50 rounded-lg mb-2"
                      >
                        {editLectureId === lecture._id ? (
                          <div className="flex-1 flex items-center gap-2">
                            <input
                              type="text"
                              value={editLectureTitle}
                              onChange={(e) => setEditLectureTitle(e.target.value)}
                              placeholder="Lecture Title"
                              className="w-full px-4 py-2 border text-gray-700 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                            <button
                              onClick={() => handleUpdateLecture(lecture._id, section._id)}
                              className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                              disabled={loading}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditLectureId(null)}
                              className="px-3 py-1 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                              disabled={loading}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1 flex items-center gap-2">
                              <p className="text-gray-700 font-medium">{lecture.title}</p>
                              {lecture.videoUrl && (
                                <video
                                  src={lecture.videoUrl}
                                  controls
                                  className="w-24 h-16 object-cover rounded-md"
                                  preload="metadata"
                                />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {lecture.videoUrl ? (
                                <p className="text-green-600 text-sm">Video Uploaded</p>
                              ) : (
                                <>
                                  <label className="flex items-center cursor-pointer">
                                    <input
                                      type="file"
                                      accept="video/*"
                                      onChange={handleVideoChange}
                                      className="hidden"
                                      disabled={uploadingLectureId === lecture._id}
                                    />
                                    <div className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-all">
                                      <Plus className="w-4 h-4" />
                                      <span className="text-sm">Upload Video</span>
                                    </div>
                                  </label>
                                  {newLectureVideo && (
                                    <button
                                      onClick={() => handleUploadVideoForLecture(lecture._id, section._id)}
                                      className="text-sm text-blue-600 hover:text-blue-800 underline transition-all"
                                      disabled={uploadingLectureId === lecture._id}
                                    >
                                      {uploadingLectureId === lecture._id ? 'Uploading...' : 'Confirm Upload'}
                                    </button>
                                  )}
                                </>
                              )}
                              <button
                                onClick={() => handleEditLecture(lecture)}
                                className="p-1 text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteLecture(lecture._id, section._id)}
                                className="p-1 text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  );
                })()
              )}

              {activeSectionId === section._id ? (
                <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                  <input
                    type="text"
                    value={newLectureTitle}
                    onChange={(e) => setNewLectureTitle(e.target.value)}
                    placeholder="Lecture Title"
                    className="w-full px-4 py-3 border text-gray-700 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 mb-3 transition-all"
                    disabled={loading}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAddLecture(section._id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Lecture'}
                    </button>
                    <button
                      onClick={() => {
                        setActiveSectionId(null);
                        setNewLectureVideo(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setActiveSectionId(section._id)}
                  className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                  disabled={loading}
                >
                  Add Lecture
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 h-[calc(100vh-64px)]">
        <div className="w-64 bg-white">
          <TutorSidebar />
        </div>
        <div className="flex-1 overflow-y-auto bg-gray-100">
          <div className="flex justify-center items-start min-h-full py-10 px-4">
            <div className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center mb-8">
                <button onClick={handleBack} className="mr-4">
                  <ChevronLeft className="w-6 h-6 text-gray-600 hover:text-gray-800 transition-colors" />
                </button>
                <h1 className="text-3xl font-bold text-gray-800">Manage Course Content</h1>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              {!courseId ? (
                <p className="text-gray-500 text-center">Please select a course to manage its content.</p>
              ) : (
                <>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Course Sections</h2>
                    <div>{renderSections()}</div>
                    <button
                      onClick={() => setShowAddSection(!showAddSection)}
                      className="mt-6 px-4 py-2 border border-gray-700 text-black bg-transparent rounded-lg hover:bg-purple-50 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Section</span>
                    </button>
                    {showAddSection && (
                      <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Section</h2>
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={newSectionTitle}
                            onChange={(e) => setNewSectionTitle(e.target.value)}
                            placeholder="Section Title"
                            className="w-full px-4 py-3 border text-gray-700 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                            disabled={loading}
                          />
                          <textarea
                            value={newSectionDesc}
                            onChange={(e) => setNewSectionDesc(e.target.value)}
                            placeholder="Section Description"
                            className="w-full px-4 py-3 border text-gray-700 bg-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none h-32 transition-all"
                            disabled={loading}
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={handleAddSection}
                              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all"
                              disabled={loading || !newSectionTitle || !newSectionDesc}
                            >
                              {loading ? 'Adding...' : 'Add Section'}
                            </button>
                            <button
                              onClick={() => setShowAddSection(false)}
                              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                              disabled={loading}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end mt-8 gap-4">
                    <button
                      onClick={() => handleReview()}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                      disabled={loading}
                    >
                      Send for Review
                    </button>
                    <button
                      onClick={() => router.push('/tutor/courses')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                      disabled={loading}
                    >
                      Finish
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseContentManager;