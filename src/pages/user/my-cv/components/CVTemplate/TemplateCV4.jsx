import React from "react";
import { Document, Page, Text, View, Font, Svg, Path } from "@react-pdf/renderer";
import { htmlToText } from "html-to-text";

const ensureArray = (data) => {
  if (!data) return [];
  if (typeof data === "string") {
    return data.split(",").map((item) => item.trim());
  }
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === "object") {
    return data.map((item) => {
      if (item.name && item.description)
        return `${item.name}: ${item.description}`;
      if (item.name && item.position) return `${item.name} - ${item.position}`;
      if (item.name && item.proficiency)
        return `${item.name} - ${item.proficiency}`;
      return item.name || "";
    });
  }
  return data;
};

const renderTechnologies = (technologies) => {
  if (typeof technologies === "string") {
    return technologies.split(",").map((tech) => tech.trim());
  }
  return technologies || [];
};

// Star SVG for Skills
const StarIcon = ({ filled }) => (
  <Svg viewBox="0 0 24 24" width={12} height={12}>
    <Path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={filled ? "#9CA3AF" : "#E5E7EB"}
    />
  </Svg>
);

// Software Engineer Template (Dark sidebar with photo)
const TemplateCV4 = ({ data }) => {
  return (
    <Document>
      <Page 
        size="A4" 
        style={{
          padding: 32, // equivalent to p-8
        }}
      >
        <View style={{ marginBottom: 32, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'light', textTransform: 'uppercase', letterSpacing: 2, color: '#1F2937' }}>
            {data.personalInfo?.fullName || "Your Name"}
          </Text>
          <Text style={{ marginTop: 4, fontSize: 14, fontWeight: 'light', textTransform: 'uppercase', letterSpacing: 1, color: '#6B7280' }}>
            {data.personalInfo?.jobPosition || "Your Position"}
          </Text>
          <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'center', fontSize: 10, color: '#4B5563' }}>
            <Text style={{ marginHorizontal: 8 }}>{data.personalInfo?.email || "email@example.com"}</Text>
            <Text style={{ marginHorizontal: 8 }}>{data.personalInfo?.phone || "123-456-7890"}</Text>
            <Text style={{ marginHorizontal: 8 }}>{data.personalInfo?.city || "City, Country"}</Text>
          </View>
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={{ textAlign: 'center', fontSize: 10, color: '#4B5563' }}>
            {htmlToText(data.introduction || "", { wordwrap: false }).trim() || "Professional summary goes here"}
          </Text>
        </View>

        <View style={{ height: 1, backgroundColor: '#D1D5DB', marginBottom: 24 }} />

        <View style={{ marginBottom: 32 }}>
          <Text style={{ marginBottom: 16, textAlign: 'center', fontSize: 14, fontWeight: 'light', textTransform: 'uppercase', letterSpacing: 1, color: '#1F2937' }}>
            Experience
          </Text>
          
          {(data.workExperience || []).map((exp, index) => (
            <View key={index} style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 11, fontWeight: 'medium', color: '#1F2937' }}>
                  {exp.position || "Position"}
                </Text>
                <Text style={{ fontSize: 9, color: '#6B7280' }}>
                  {exp.duration || "Duration"}
                </Text>
              </View>
              <Text style={{ fontSize: 10, fontStyle: 'italic', color: '#4B5563' }}>
                {exp.company || "Company"}
              </Text>
              <Text style={{ marginTop: 8, fontSize: 9, color: '#4B5563' }}>
                {htmlToText(exp.description || "", { wordwrap: false }).trim() || "Description"}
              </Text>
              <View style={{ marginTop: 8, flexDirection: 'row', flexWrap: 'wrap' }}>
                {renderTechnologies(exp.technologies).map((tech, i) => (
                  <Text key={i} style={{ fontSize: 8, color: '#6B7280', marginRight: 8, marginBottom: 4 }}>
                    {tech}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        <View style={{ height: 1, backgroundColor: '#D1D5DB', marginBottom: 24 }} />

        <View style={{ marginBottom: 32 }}>
          <Text style={{ marginBottom: 16, textAlign: 'center', fontSize: 14, fontWeight: 'light', textTransform: 'uppercase', letterSpacing: 1, color: '#1F2937' }}>
            Education
          </Text>
          
          {(data.education || []).map((edu, index) => (
            <View key={index} style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 11, fontWeight: 'medium', color: '#1F2937' }}>
                  {edu.school || "University"}
                </Text>
                <Text style={{ fontSize: 9, color: '#6B7280' }}>
                  {edu.duration || "Duration"}
                </Text>
              </View>
              <Text style={{ fontSize: 10, fontStyle: 'italic', color: '#4B5563' }}>
                {edu.degree || "Degree"}
              </Text>
              <Text style={{ marginTop: 4, fontSize: 9, color: '#4B5563' }}>
                {htmlToText(edu.description || "", { wordwrap: false }).trim() || "Description"}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 1, backgroundColor: '#D1D5DB', marginBottom: 24 }} />

        <View style={{ marginBottom: 32 }}>
          <Text style={{ marginBottom: 16, textAlign: 'center', fontSize: 14, fontWeight: 'light', textTransform: 'uppercase', letterSpacing: 1, color: '#1F2937' }}>
            Skills
          </Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {(data.skills || []).map((skill, index) => (
              <View key={index} style={{ width: '33%', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 10, fontWeight: 'medium', color: '#4B5563' }}>
                  {skill.name || "Skill"}
                </Text>
                <View style={{ marginTop: 4, flexDirection: 'row' }}>
                  {[...Array(5)].map((_, i) => (
                    <View key={i} style={{ marginHorizontal: 1 }}>
                      <StarIcon filled={i < (skill.rating || 0)} />
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: '#D1D5DB', marginBottom: 24 }} />

        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ marginBottom: 12, textAlign: 'center', fontSize: 14, fontWeight: 'light', textTransform: 'uppercase', letterSpacing: 1, color: '#1F2937' }}>
              Languages
            </Text>
            <View style={{ alignItems: 'center' }}>
              {(data.languages || []).map((lang, index) => (
                <Text key={index} style={{ fontSize: 10, color: '#4B5563', marginBottom: 4 }}>
                  {lang.language || "Language"} - {lang.proficiency || "Level"}
                </Text>
              ))}
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ marginBottom: 12, textAlign: 'center', fontSize: 14, fontWeight: 'light', textTransform: 'uppercase', letterSpacing: 1, color: '#1F2937' }}>
              Interests
            </Text>
            <View style={{ alignItems: 'center' }}>
              {ensureArray(data.hobbies || []).map((hobby, index) => (
                <Text key={index} style={{ fontSize: 10, color: '#4B5563', marginBottom: 4 }}>
                  {hobby}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TemplateCV4;
