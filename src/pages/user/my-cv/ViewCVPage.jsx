import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Header from "@/components/header/Header";
import cvAPI from '@/api/cv';
import ExportToPDFButton from '@/components/cv/ExportToPDFButton';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ViewCVPage = () => {
  const { id } = useParams();
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Ref to the CV content container to capture HTML for PDF export
  const cvContentRef = useRef(null);
  
  // HTML and CSS for PDF export
  const [exportData, setExportData] = useState({
    htmlContent: '',
    cssContent: ''
  });

  useEffect(() => {
    const fetchCV = async () => {
      try {
        setLoading(true);
        const response = await cvAPI.getCVById(id);
        if (response.data) {
          setCV(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching CV:', err);
        setError('Failed to load CV. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCV();
    }
  }, [id]);

  // Prepare HTML and CSS for export when CV is loaded
  useEffect(() => {
    if (cv && cvContentRef.current) {
      // Capture current HTML content
      const html = cvContentRef.current.innerHTML;
      
      // Get all applied CSS styles for proper rendering in PDF
      const styles = Array.from(document.styleSheets)
        .filter(stylesheet => {
          try {
            return !stylesheet.href || stylesheet.href.startsWith(window.location.origin);
          } catch (e) {
            return false;
          }
        })
        .reduce((css, stylesheet) => {
          try {
            const rules = Array.from(stylesheet.cssRules || []);
            return css + rules.map(rule => rule.cssText).join('\n');
          } catch (e) {
            // Security error accessing cross-origin stylesheets
            return css;
          }
        }, '');
      
      setExportData({
        htmlContent: html,
        cssContent: styles
      });
    }
  }, [cv, loading]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-gray-600">Loading CV...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-red-500">{error}</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!cv) {
    return (
      <div>
        <Header />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p className="text-gray-600">CV not found.</p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="w-full max-w-5xl mx-auto mt-24 mb-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{cv.cvName}</h1>
          <ExportToPDFButton
            cvId={cv.id}
            htmlContent={exportData.htmlContent}
            cssContent={exportData.cssContent}
            className="bg-[#D83B01] hover:bg-[#b43000]"
          />
        </div>
        
        <div 
          ref={cvContentRef}
          className="bg-white p-6 shadow-md rounded-lg"
        >
          {/* CV Content - Template {cv.templateId} */}
          <div className="cv-template">
            {/* Basic Info Section */}
            {cv.info && (
              <div className="mb-8 border-b pb-4">
                <h2 className="text-xl font-bold mb-4">{cv.info.fullName}</h2>
                <div className="grid grid-cols-2 gap-4">
                  <p><strong>Position:</strong> {cv.info.position}</p>
                  {cv.info.email && <p><strong>Email:</strong> {cv.info.email}</p>}
                  {cv.info.phone && <p><strong>Phone:</strong> {cv.info.phone}</p>}
                  {cv.info.address && <p><strong>Address:</strong> {cv.info.address}</p>}
                  {cv.info.linkedin && <p><strong>LinkedIn:</strong> {cv.info.linkedin}</p>}
                  {cv.info.github && <p><strong>GitHub:</strong> {cv.info.github}</p>}
                </div>
              </div>
            )}

            {/* Profile Section */}
            {cv.profile && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-2 border-b pb-2">Profile</h3>
                <div className="whitespace-pre-line">{cv.profile}</div>
              </div>
            )}

            {/* Experience Section */}
            {cv.experiences && cv.experiences.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-2 border-b pb-2">Experience</h3>
                {cv.experiences.map((exp, index) => (
                  <div key={exp.id || index} className="mb-4">
                    <div className="flex justify-between">
                      <h4 className="font-bold">{exp.position} at {exp.company}</h4>
                      <span className="text-gray-500">
                        {exp.startDate && new Date(exp.startDate).toLocaleDateString()} - 
                        {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present'}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="mt-1 whitespace-pre-line">{exp.description}</p>
                    )}
                    {exp.usageTechnologies && (
                      <p className="mt-1"><strong>Technologies:</strong> {exp.usageTechnologies}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Education Section */}
            {cv.educations && cv.educations.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-2 border-b pb-2">Education</h3>
                {cv.educations.map((edu, index) => (
                  <div key={edu.id || index} className="mb-4">
                    <div className="flex justify-between">
                      <h4 className="font-bold">{edu.field} at {edu.school}</h4>
                      <span className="text-gray-500">
                        {edu.startDate && new Date(edu.startDate).toLocaleDateString()} - 
                        {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'Present'}
                      </span>
                    </div>
                    {edu.description && (
                      <p className="mt-1 whitespace-pre-line">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Skills Section */}
            {cv.skills && cv.skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-2 border-b pb-2">Skills</h3>
                <div className="grid grid-cols-2 gap-4">
                  {cv.skills.map((skill, index) => (
                    <div key={skill.id || index} className="mb-2">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">{skill.name}:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span 
                              key={i} 
                              className={`w-4 h-4 rounded-full mx-0.5 ${i < skill.rate ? 'bg-[#D83B01]' : 'bg-gray-300'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages Section */}
            {cv.languages && cv.languages.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-2 border-b pb-2">Languages</h3>
                <div className="grid grid-cols-2 gap-4">
                  {cv.languages.map((lang, index) => (
                    <div key={lang.id || index} className="mb-2">
                      <span className="font-medium">{lang.language}:</span> {lang.level}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Section */}
            {cv.projects && cv.projects.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-2 border-b pb-2">Projects</h3>
                {cv.projects.map((project, index) => (
                  <div key={project.id || index} className="mb-4">
                    <div className="flex justify-between">
                      <h4 className="font-bold">{project.project}</h4>
                      <span className="text-gray-500">
                        {project.startDate && new Date(project.startDate).toLocaleDateString()} - 
                        {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Present'}
                      </span>
                    </div>
                    {project.description && (
                      <p className="mt-1 whitespace-pre-line">{project.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Certificates Section */}
            {cv.certificates && cv.certificates.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-bold mb-2 border-b pb-2">Certificates</h3>
                {cv.certificates.map((cert, index) => (
                  <div key={cert.id || index} className="mb-4">
                    <div className="flex justify-between">
                      <h4 className="font-bold">{cert.certificate}</h4>
                      <span className="text-gray-500">
                        {cert.date && new Date(cert.date).toLocaleDateString()}
                      </span>
                    </div>
                    {cert.description && (
                      <p className="mt-1 whitespace-pre-line">{cert.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Additional sections can be added here for Activities, Interests, etc. */}

            {/* Additional Info Section */}
            {cv.additionalInfo && (
              <div className="mb-4">
                <h3 className="text-lg font-bold mb-2 border-b pb-2">Additional Information</h3>
                <div className="whitespace-pre-line">{cv.additionalInfo}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCVPage;