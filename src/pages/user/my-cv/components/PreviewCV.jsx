import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { TemplateCV1 } from "@/pages/user/my-cv/components/CVTemplate/TemplateCV1";
import React, { useEffect, useState } from "react";
import { useCreateCV } from "@/pages/user/my-cv/contexts/CreateCVContext";
import TemplateCV2 from "./CVTemplate/TemplateCV2";
import TemplateCV3 from "./CVTemplate/TemplateCV3";
import TemplateCV4 from "./CVTemplate/TemplateCV4";
import sampleDataCV4 from "./CVTemplate/sampleDataCV4";

// Helper function to check if an object has meaningful data
const hasData = (obj) => {
  if (!obj || typeof obj !== 'object') return false;
  if (Array.isArray(obj)) return obj.length > 0 && obj.some(item => hasData(item));
  
  return Object.values(obj).some(value => {
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'number') return !isNaN(value) && value !== 0;
    if (typeof value === 'boolean') return true;
    if (value === null || value === undefined) return false;
    if (typeof value === 'object') return hasData(value);
    return Boolean(value);
  });
};

// Helper function to filter array items that have data
const filterItemsWithData = (array) => {
  if (!Array.isArray(array)) return [];
  return array.filter(item => hasData(item));
};

// Helper function to check if a string field has meaningful content
const hasStringContent = (str) => {
  return typeof str === 'string' && str.trim() !== '';
};

const prepareFormToApiData = (formData) => {
  if (!formData) return null;

  const data = JSON.parse(JSON.stringify(formData));

  // Filter skills to only include those with data
  if (data.skills && Array.isArray(data.skills)) {
    data.skills = data.skills
      .filter(skill => 
        hasStringContent(skill.name || skill.skill) || 
        (typeof skill.level === "number" && !isNaN(skill.level)) ||
        (typeof skill.rate === "number" && !isNaN(skill.rate))
      )
      .map((skill) => {
        let rateValue = 0;

        if (typeof skill.level === "number" && !isNaN(skill.level)) {
          rateValue = skill.level;
        } else if (typeof skill.rate === "number" && !isNaN(skill.rate)) {
          rateValue = skill.rate;
        }

        return {
          id: skill.id,
          skill: skill.name || skill.skill || "",
          rate: rateValue,
        };
      });
  }

  // Handle profile/about data
  if (data.about && !data.profile) {
    data.profile = data.about;
  } else if (data.profile && !data.about) {
    data.about = data.profile;
  }

  // Only include profile if it has content
  if (!hasStringContent(data.profile)) {
    data.profile = null;
  }

  // Set up basic data structures
  data.personalInfo = data.personalInfo || data.personal || {};
  
  // Filter experiences to only include those with meaningful data
  const rawExperiences = data.experiences || data.workExperience || [];
  data.experiences = filterItemsWithData(rawExperiences.filter(exp => 
    hasStringContent(exp.company) || 
    hasStringContent(exp.position) || 
    hasStringContent(exp.description)
  ));

  // Filter education to only include those with meaningful data
  const rawEducation = data.education || data.educations || [];
  data.education = filterItemsWithData(rawEducation.filter(edu => 
    hasStringContent(edu.school) || 
    hasStringContent(edu.field) || 
    hasStringContent(edu.description)
  ));

  // Filter projects to only include those with meaningful data
  const rawProjects = data.projects || [];
  data.projects = filterItemsWithData(rawProjects.filter(project => 
    hasStringContent(project.project) || 
    hasStringContent(project.description)
  ));

  // Filter languages to only include those with meaningful data
  const rawLanguages = data.languages || [];
  data.languages = filterItemsWithData(rawLanguages.filter(lang => 
    hasStringContent(lang.language) || 
    hasStringContent(lang.level)
  ));

  // Filter interests/hobbies to only include those with meaningful data
  const rawInterests = data.interests || data.hobbies || [];
  data.interests = filterItemsWithData(rawInterests.filter(interest => 
    hasStringContent(interest.interest) || 
    hasStringContent(interest.hobby)
  ));

  // Filter certificates to only include those with meaningful data
  const rawCertificates = data.certificates || [];
  data.certificates = filterItemsWithData(rawCertificates.filter(cert => 
    hasStringContent(cert.certificate) || 
    hasStringContent(cert.description)
  ));

  // Filter activities to only include those with meaningful data
  const rawActivities = data.activities || [];
  data.activities = filterItemsWithData(rawActivities.filter(activity => 
    hasStringContent(activity.activity) || 
    hasStringContent(activity.description)
  ));

  // Filter consultants/references to only include those with meaningful data
  const rawConsultants = data.consultants || data.references || [];
  data.consultants = filterItemsWithData(rawConsultants.filter(consultant => 
    hasStringContent(consultant.name) || 
    hasStringContent(consultant.position) || 
    hasStringContent(consultant.email) || 
    hasStringContent(consultant.phone)
  ));

  return data;
};

const prepareApiToFormData = (apiData) => {
  if (!apiData) return null;

  const data = JSON.parse(JSON.stringify(apiData));

  return data;
};

export default function PreviewCV({
  showPreviewModal,
  setShowPreviewModal,
  cvData = null,
}) {
  const { formCreate } = useCreateCV();
  const { getValues } = formCreate;
  const [cvName, setCvName] = useState("");
  const [previewData, setPreviewData] = useState(null);
  const [previewId, setPreviewId] = useState(null);
  const draft = localStorage.getItem("cv_draft");

  useEffect(() => {
    if (cvData) {
      console.log("Using data from props:", cvData);
      setPreviewData(prepareApiToFormData(cvData));
      setCvName(cvData.name || cvData.cvName || "Untitled CV");
      return;
    }

    try {
      // Get fresh data from form
      const formValues = getValues ? getValues() : {};
      const localCvName = draft
        ? JSON.parse(draft).name || JSON.parse(draft).cvName
        : null;
      const formDataCvName = formValues.name || formValues.cvName;

      setCvName(formDataCvName || localCvName || "Untitled CV");
      
      // Merge draft data with form data for most up-to-date preview
      const draftData = draft ? JSON.parse(draft) : {};
      const mergedData = {
        ...draftData,
        personalInfo: {
          ...draftData.personalInfo,
          fullname: formValues.fullname || draftData.personalInfo?.fullname,
          position: formValues.position || draftData.personalInfo?.position,
          email: formValues.email || draftData.personalInfo?.email,
          phone: formValues.phone || draftData.personalInfo?.phone,
          gender: formValues.gender || draftData.personalInfo?.gender,
          dob: formValues.dob || draftData.personalInfo?.dob,
          city: formValues.city || draftData.personalInfo?.city,  
          address: formValues.address || draftData.personalInfo?.address,
          linkedin: formValues.linkedin || draftData.personalInfo?.linkedin,
          github: formValues.github || draftData.personalInfo?.github,
          avatar: formValues.avatar || draftData.personalInfo?.avatar,
        },
        profile: formValues.about || draftData.profile || draftData.introduction,
        experiences: formValues.experiences || draftData.experiences || [],
        skills: formValues.skills || draftData.skills || [],
        education: formValues.educations || draftData.education || [],
        projects: formValues.projects || draftData.projects || [],
        languages: formValues.languages || draftData.languages || [],
        interests: formValues.interests || draftData.interests || [],
        certificates: formValues.certificates || draftData.certificates || [],
        activities: formValues.activities || draftData.activities || [],
        consultants: formValues.consultants || draftData.consultants || [],
      };
      
      setPreviewData(prepareFormToApiData(mergedData));
    } catch (error) {
      console.error("Error getting CV data:", error);
    }
  }, [getValues, cvData, draft, showPreviewModal]);

  useEffect(() => {
    setPreviewId(draft ? JSON.parse(draft).templateId : null);
  }, [draft]);

  useEffect(() => {
    console.log(
      "Preview data for template:",
      previewData || (getValues ? prepareFormToApiData(getValues()) : {})
    );
  }, [previewData, getValues]);

  const dataToUse =
    previewData || (getValues ? prepareFormToApiData(getValues()) : {});

  return (
    showPreviewModal && (
      <div
        className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center"
        onClick={() => setShowPreviewModal(false)}
      >
        <div
          className="bg-white shadow-xl rounded-lg p-4 w-[80%] h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col items-center gap-6 p-8">
            <h1 className="text-2xl font-bold">
              {cvName} - Live Resume Preview
            </h1>

            <div className="w-full h-[800px] border shadow-md">
              <PDFViewer width="100%" height="100%" showToolbar>
                {(() => {
                  switch (previewId) {
                    case 1:
                      return <TemplateCV1 data={dataToUse} />;
                    case 2:
                      return <TemplateCV2 data={dataToUse} />;
                    case 3:
                      return <TemplateCV3 data={dataToUse} />;
                    case 4:
                      return <TemplateCV4 data={dataToUse} />;
                    default:
                      return <TemplateCV1 data={dataToUse} />;
                  }
                })()}
              </PDFViewer>
            </div>

            {/* Download Button */}
            <PDFDownloadLink
              document={(() => {
                switch (previewId || dataToUse.templateId) {
                  case 1:
                    return <TemplateCV1 data={dataToUse} />;
                  case 2:
                    return <TemplateCV2 data={dataToUse} />;
                  case 3:
                    return <TemplateCV3 data={dataToUse} />;
                  case 4:
                    return <TemplateCV4 data={dataToUse} />;
                  default:
                    return <TemplateCV1 data={dataToUse} />;
                }
              })()}
              fileName={`${cvName.replace(/\s+/g, "_")}_CV.pdf`}
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {({ loading }) => (loading ? "Preparing PDF..." : "Download PDF")}
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    )
  );
}
