import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { TemplateCV1 } from "@/pages/user/my-cv/components/CVTemplate/TemplateCV1";
import React, { useEffect, useState } from "react";
import { useCreateCV } from "@/pages/user/my-cv/contexts/CreateCVContext";
import TemplateCV2 from "./CVTemplate/TemplateCV2";
import TemplateCV3 from "./CVTemplate/TemplateCV3";
import TemplateCV4 from "./CVTemplate/TemplateCV4";
import sampleDataCV4 from "./CVTemplate/sampleDataCV4";

const prepareFormToApiData = (formData) => {
  if (!formData) return null;

  const data = JSON.parse(JSON.stringify(formData));

  if (data.skills && Array.isArray(data.skills)) {
    data.skills = data.skills.map((skill) => {
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

  if (data.about && !data.profile) {
    data.profile = data.about;
  } else if (data.profile && !data.about) {
    data.about = data.profile;
  }

  data.personalInfo = data.personalInfo || data.personal || {};
  data.experiences = data.experiences || data.workExperience || [];
  data.education = data.education || data.educations || [];
  data.projects = data.projects || [];
  data.languages = data.languages || [];
  data.interests = data.interests || data.hobbies || [];
  data.certificates = data.certificates || [];
  data.activities = data.activities || [];
  data.consultants = data.consultants || data.references || [];

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
  console.log("Draft from localStorage:", draft ? JSON.parse(draft) : null);

  useEffect(() => {
    if (cvData) {
      console.log("Using data from props:", cvData);
      setPreviewData(prepareApiToFormData(cvData));
      setCvName(cvData.name || cvData.cvName || "Untitled CV");
      return;
    }

    try {
      const formValues = getValues ? getValues() : {};
      const localCvName = draft
        ? JSON.parse(draft).name || JSON.parse(draft).cvName
        : null;
      const formDataCvName = formValues.name || formValues.cvName;

      setCvName(formDataCvName || localCvName || "Untitled CV");
      setPreviewData(prepareFormToApiData(formValues));
    } catch (error) {
      console.error("Error getting CV data:", error);
    }
  }, [getValues, cvData, draft]);

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
                      return <TemplateCV3 data={sampleDataCV4} />;
                    case 4:
                      return <TemplateCV4 data={sampleDataCV4} />;
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
                    return <TemplateCV3 data={sampleDataCV4} />;
                  case 4:
                    return <TemplateCV4 data={sampleDataCV4} />;
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
