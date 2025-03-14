"use client"

import React, { useState } from 'react';

const CourseCreator = () => {
  const [sections, setSections] = useState([
    // {
    //   id: 1,
    //   title: 'Section 1: Introduction',
    //   lectures: [
    //     { id: 1, title: 'Lecture 1: Course Overview', content: '', expanded: false },
    //     { id: 2, title: 'Lecture 2: Getting Started', content: '', expanded: false }
    //   ],
    //   expanded: true
    // },
    // {
    //   id: 2,
    //   title: 'Section 2: sdfsdfsd',
    //   lectures: [
    //     { id: 3, title: 'Lecture 3: wserfsd', content: '', expanded: false },
    //     { id: 4, title: 'Lecture 4: sdfsdfs', content: '', expanded: false }
    //   ],
    //   expanded: true
    // }
  ]);
  
  const [addingSectionId, setAddingSectionId] = useState(null);
  const [addingLectureId, setAddingLectureId] = useState(null);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionObjective, setNewSectionObjective] = useState('');
  const [newLectureTitle, setNewLectureTitle] = useState('');
  
  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setSections(sections.map(section => 
      section.id === sectionId ? { ...section, expanded: !section.expanded } : section
    ));
  };
  
  // Toggle lecture expansion
  const toggleLecture = (sectionId, lectureId) => {
    setSections(sections.map(section => 
      section.id === sectionId ? {
        ...section,
        lectures: section.lectures.map(lecture => 
          lecture.id === lectureId ? { ...lecture, expanded: !lecture.expanded } : lecture
        )
      } : section
    ));
  };
  
  // Add new section form handler
  const handleAddSection = () => {
    setAddingSectionId('new');
    setNewSectionTitle('');
    setNewSectionObjective('');
  };
  
  // Save new section
  const saveNewSection = () => {
    if (newSectionTitle.trim()) {
      const newId = Math.max(...sections.map(s => s.id), 0) + 1;
      setSections([...sections, {
        id: newId,
        title: `Section ${newId}: ${newSectionTitle}`,
        lectures: [],
        expanded: true,
        objective: newSectionObjective
      }]);
      setAddingSectionId(null);
    }
  };
  
  // Cancel adding section
  const cancelAddSection = () => {
    setAddingSectionId(null);
  };
  
  // Add new lecture form handler
  const handleAddLecture = (sectionId) => {
    setAddingLectureId(sectionId);
    setNewLectureTitle('');
  };
  
  // Save new lecture
  const saveNewLecture = (sectionId) => {
    if (newLectureTitle.trim()) {
      setSections(sections.map(section => {
        if (section.id === sectionId) {
          const newLectureId = Math.max(...section.lectures.map(l => l.id), 0) + 1;
          return {
            ...section,
            lectures: [...section.lectures, {
              id: newLectureId,
              title: `Lecture ${newLectureId}: ${newLectureTitle}`,
              content: '',
              expanded: false
            }]
          };
        }
        return section;
      }));
      setAddingLectureId(null);
    }
  };
  
  // Cancel adding lecture
  const cancelAddLecture = () => {
    setAddingLectureId(null);
  };
  
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-black">Course Builder</h1>
        <button className="bg-black text-white px-4 py-2 rounded">Save Course</button>
      </div>
      
      {/* Course Sections */}
      <div className="mb-6">
        {sections.map((section) => (
          <div key={section.id} className="border rounded mb-4">
            <div className="flex justify-between items-center p-4 bg-gray-50">
              <div className="flex items-center">
                <button 
                  onClick={() => toggleSection(section.id)}
                  className="mr-2 text-black"
                >
                  {section.expanded ? '▼' : '►'}
                </button>
                <span className="font-medium text-black">{section.title}</span>
              </div>
              <div>
                <button className="text-blue-600 hover:text-blue-800">Edit</button>
              </div>
            </div>
            
            {section.expanded && (
              <div className="px-4 py-2">
                {/* Lectures */}
                {section.lectures.map((lecture) => (
                  <div key={lecture.id} className="border rounded mb-2">
                    <div className="flex justify-between items-center p-3">
                      <div className="flex items-center text-black">
                        <input type="checkbox" className="mr-3" />
                        <span>{lecture.title}</span>
                      </div>
                      <div className="flex">
                        <button 
                          className="ml-2 px-3 py-1 bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
                          onClick={() => toggleLecture(section.id, lecture.id)}
                        >
                          + Content
                        </button>
                        <button className="ml-2">▼</button>
                      </div>
                    </div>
                    
                    {lecture.expanded && (
                      <div className="p-3 border-t">
                        <textarea 
                          className="w-full p-2 border rounded"
                          placeholder="Add lecture content here..."
                          rows="4"
                        ></textarea>
                        <div className="mt-2 flex justify-end">
                          <button className="px-3 py-1 bg-black text-white rounded">Save Content</button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Add Lecture Button/Form */}
                {addingLectureId === section.id ? (
                  <div className="p-3 border rounded mt-2">
                    <div className="flex items-center">
                      <span className="mr-2 text-black">New Lecture:</span>
                      <input
                        type="text"
                        className="flex-1 p-2 border rounded text-black"
                        placeholder="Enter a Title"
                        value={newLectureTitle}
                        onChange={(e) => setNewLectureTitle(e.target.value)}
                        maxLength={80}
                      />
                    </div>
                    <div className="mt-2 flex justify-end">
                      <button 
                        className="px-3 py-1 mr-2 text-black"
                        onClick={cancelAddLecture}
                      >
                        Cancel
                      </button>
                      <button 
                        className="px-3 py-1 bg-purple-600 text-white rounded"
                        onClick={() => saveNewLecture(section.id)}
                      >
                        Add Lecture
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="flex items-center text-purple-600 mt-2"
                    onClick={() => handleAddLecture(section.id)}
                  >
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Curriculum item
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Add Section Button/Form */}
      {addingSectionId ? (
        <div className="border rounded p-4 relative">
          <button 
            className="absolute top-2 right-2"
            onClick={cancelAddSection}
          >
            ×
          </button>
          <div className="mb-4">
            <label className="block mb-1 text-black">New Section:</label>
            <input
              type="text"
              className="w-full p-2 border rounded text-black"
              placeholder="Enter a Title"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
              maxLength={80}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-black">What will students be able to do at the end of this section?</label>
            <textarea
              className="w-full p-2 border rounded text-black"
              placeholder="Enter a Learning Objective"
              value={newSectionObjective}
              onChange={(e) => setNewSectionObjective(e.target.value)}
              maxLength={200}
              rows="3"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button 
              className="px-3 py-1 mr-2 text-black"
              onClick={cancelAddSection}
            >
              Cancel
            </button>
            <button 
              className="px-3 py-1 bg-purple-600 text-white rounded"
              onClick={saveNewSection}
            >
              Add Section
            </button>
          </div>
        </div>
      ) : (
        <button 
          className="flex items-center border rounded px-4 py-2 text-purple-600"
          onClick={handleAddSection}
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Section
        </button>
      )}
    </div>
  );
};

export default CourseCreator;