import React, { useState } from "react";
import { FileText, Code, Briefcase, GraduationCap } from "lucide-react";

// Simple self-contained tabs implementation for candidate details
export const CandidateDetailTabs = ({ candidate }) => {
  const [activeTab, setActiveTab] = useState("evaluation");

  const handleTabClick = (tabValue) => {
    console.log(`Changing tab to: ${tabValue}`);
    setActiveTab(tabValue);
  };

  return (
    <div className="candidate-tabs">
      {/* Tabs navigation */}
      <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground mb-4">
        {[
          { value: "evaluation", label: "Chi tiết ĐG" },
          { value: "skills", label: "Kỹ năng" },
          { value: "experience", label: "Kinh nghiệm" },
          { value: "education", label: "Học vấn" }
        ].map(tab => (
          <button
            key={tab.value}
            type="button"
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
              activeTab === tab.value
                ? "bg-background text-foreground shadow"
                : "hover:bg-background/50 hover:text-foreground"
            }`}
            onClick={() => handleTabClick(tab.value)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Evaluation tab content */}
      {activeTab === "evaluation" && (
        <div className="space-y-3">
          {/* Full explanation text display */}
          <div className="p-3 bg-muted/30 rounded-md mb-4">
            <h3 className="font-semibold flex items-center gap-2 text-base mb-2">
              <FileText className="h-5 w-5 text-primary" /> 
              Giải thích đầy đủ
            </h3>
            <p className="text-sm whitespace-pre-line">
              {typeof candidate.explanation === 'string' ? candidate.explanation : 'Không có giải thích.'}
            </p>
          </div>

          <h3 className="font-semibold flex items-center gap-2 text-base">
            <FileText className="h-5 w-5 text-primary" /> 
            Phân tích theo các mục
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {candidate.explanationDetails && typeof candidate.explanationDetails === 'object' && 
             Object.keys(candidate.explanationDetails).length > 0 ? (
              Object.entries(candidate.explanationDetails)
                .filter(([key, value]) => key && typeof value === 'string' && value.length > 0) // Ensure value is not empty
                .map(([key, value], idx) => (
                  <div key={idx} className="p-3 border rounded-md bg-background shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full p-2 bg-primary/10 text-primary flex-shrink-0">
                        {getExplanationIcon(key)}
                      </div>
                      <div>
                        <div className="font-medium capitalize">{key.replace(/_/g, ' ')}</div>
                        <p className="text-sm text-muted-foreground">{value}</p>
                      </div>
                    </div>
                  </div>
              ))
            ) : (
              <div className="col-span-1 md:col-span-2 p-4 text-center text-muted-foreground">
                Không có phân tích chi tiết nào.
              </div>
            )}
            {candidate.explanationDetails && Object.keys(candidate.explanationDetails).length > 0 && 
             Object.entries(candidate.explanationDetails).filter(([key, value]) => key && typeof value === 'string' && value.length > 0).length === 0 && (
              <div className="col-span-1 md:col-span-2 p-4 text-center text-muted-foreground">
                Không có phân tích chi tiết nào được hiển thị (có thể do nội dung trống).
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skills tab content */}
      {activeTab === "skills" && (
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2 text-base">
            <Code className="h-5 w-5 text-blue-500" /> Đánh giá kỹ năng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Array.isArray(candidate.skills) && candidate.skills.length > 0 ? 
              candidate.skills.map((skill, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-md bg-background shadow-sm">
                  <div className="font-medium">{skill?.name || 'Kỹ năng'}</div>
                  {getMatchBadge(skill?.match || 'medium')}
                </div>
              ))
            : ( <div className="col-span-1 md:col-span-2 p-4 text-center text-muted-foreground"> Không có thông tin kỹ năng. </div> )}
          </div>
        </div>
      )}

      {/* Experience tab content */}
      {activeTab === "experience" && (
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2 text-base">
            <Briefcase className="h-5 w-5 text-amber-600" /> Đánh giá kinh nghiệm
          </h3>
          <div className="space-y-3">
            {Array.isArray(candidate.experience) && candidate.experience.length > 0 ? 
              candidate.experience.map((exp, index) => (
                <div key={index} className="p-3 border rounded-md bg-background shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{exp?.title || 'Kinh nghiệm'}</h4>
                      <p className="text-sm text-muted-foreground">
                        {exp?.company || 'N/A'} {exp?.duration && `• ${exp.duration}`}
                      </p>
                    </div>
                    {getMatchBadge(exp?.match || 'medium')}
                  </div>
                </div>
              ))
            : ( <div className="p-4 text-center text-muted-foreground"> Không có thông tin kinh nghiệm. </div> )}
          </div>
        </div>
      )}

      {/* Education tab content */}
      {activeTab === "education" && (
        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2 text-base">
            <GraduationCap className="h-5 w-5 text-indigo-500" /> Đánh giá học vấn
          </h3>
          <div className="space-y-3">
            {Array.isArray(candidate.education) && candidate.education.length > 0 ? 
              candidate.education.map((edu, index) => (
                <div key={index} className="p-3 border rounded-md bg-background shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{edu?.degree || 'Học vấn'}</h4>
                      <p className="text-sm text-muted-foreground">
                        {edu?.institution || 'N/A'} {edu?.year && `• ${edu.year}`}
                      </p>
                    </div>
                    {getMatchBadge(edu?.match || 'medium')}
                  </div>
                </div>
              ))
            : ( <div className="p-4 text-center text-muted-foreground"> Không có thông tin học vấn. </div> )}
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get match badge for skills, experience, etc.
function getMatchBadge(match) {
  if (typeof match !== 'string') {
    return <Badge className="bg-yellow-500">Phù hợp TB</Badge>;
  }
  const matchLower = match.toLowerCase();
  switch (matchLower) {
    case "high": return <Badge className="bg-green-500 text-white">Phù hợp cao</Badge>;
    case "medium": return <Badge className="bg-yellow-500 text-black">Phù hợp TB</Badge>;
    case "low": return <Badge className="bg-red-500 text-white">Phù hợp thấp</Badge>;
    default: return <Badge className="bg-gray-400">Chưa rõ</Badge>;
  }
}

// Badge component needed for the getMatchBadge function
const Badge = ({ children, className, variant = "default" }) => {
  const variantStyles = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    outline:
      "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none ${variantStyles[variant]} ${
        className || ""
      }`}
    >
      {children}
    </span>
  );
};

// Helper function to determine the icon for different types of explanations
function getExplanationIcon(key) {
  if (typeof key !== 'string') return <div className="h-4 w-4" />; // Default icon for unknown key type

  const normalizedKey = key.toLowerCase().replace(/\s+/g, '_'); // Normalize: "Work Experience" -> "work_experience"
  
  const iconMap = {
    skills: <Code className="h-5 w-5" />,
    experience: <Briefcase className="h-5 w-5" />,
    education: <GraduationCap className="h-5 w-5" />,
    default: <FileText className="h-5 w-5" />, // Default for keys not explicitly mapped
  };
  
  // Try direct match, then try matching parts of the key
  if (iconMap[normalizedKey]) return iconMap[normalizedKey];
  if (normalizedKey.includes('skill')) return iconMap.skills;
  if (normalizedKey.includes('experi')) return iconMap.experience;
  if (normalizedKey.includes('educat')) return iconMap.education;
  
  return iconMap.default;
}
