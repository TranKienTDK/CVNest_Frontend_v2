import React from "react";
import { Document, Page, Text, View, Font, Svg, Path, pdf } from "@react-pdf/renderer";
import { htmlToText } from "html-to-text";
import robotoFont from '@/assets/Roboto-VariableFont_wdth,wght.ttf';
import dayjs from 'dayjs';

pdf.enableCORS = true;

Font.register({
  family: 'Roboto',
  fonts: [
    { src: robotoFont, fontStyle: 'normal', fontWeight: 'normal' },
    { src: robotoFont, fontStyle: 'italic', fontWeight: 'normal' }
  ]
});

const hasContentInArray = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return false;
  
  return arr.some(item => {
    if (typeof item === 'object') {
      return Object.entries(item).some(([key, val]) => 
        !['id', '_id', 'userId', 'updatedAt', 'createdAt'].includes(key) && 
        val && 
        typeof val === 'string' && 
        val.trim() !== ''
      );
    }
    return item && typeof item === 'string' && item.trim() !== '';
  });
};

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

const StarIcon = ({ filled }) => (
  <Svg viewBox="0 0 24 24" width={12} height={12}>
    <Path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={filled ? "#9CA3AF" : "#E5E7EB"}
    />
  </Svg>
);

const SectionTitle = ({ children }) => (
  <Text 
    style={{ 
      marginBottom: 16, 
      textAlign: 'center', 
      fontSize: 14, 
      fontWeight: 'light', 
      textTransform: 'uppercase', 
      letterSpacing: 1, 
      color: '#1F2937' 
    }}
    break
  >
    {children}
  </Text>
);

const paths = {
  phone: 'M2 3.75A.75.75 0 0 1 2.75 3h2.36a.75.75 0 0 1 .737.598l.548 2.741a.75.75 0 0 1-.212.703l-1.21 1.21a16.5 16.5 0 0 0 6.364 6.364l1.21-1.21a.75.75 0 0 1 .703-.212l2.741.548A.75.75 0 0 1 21 18.89v2.36a.75.75 0 0 1-.75.75h-.5C9.455 22 2 14.545 2 5.25v-.5z',
  email: 'M2.25 4.5A2.25 2.25 0 0 1 4.5 2.25h15a2.25 2.25 0 0 1 2.25 2.25v15a2.25 2.25 0 0 1-2.25 2.25h-15A2.25 2.25 0 0 1 2.25 19.5v-15zm2.26.75a.75.75 0 0 0-.26.56v.084l7.75 5.033 7.75-5.033v-.084a.75.75 0 0 0-.26-.56H4.51z',
  location: 'M12 2.25c-4.386 0-7.95 3.564-7.95 7.95 0 5.251 7.65 11.55 7.95 11.8.3-.25 7.95-6.55 7.95-11.8 0-4.386-3.564-7.95-7.95-7.95zm0 10.2a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5z',
  linkedin: 'M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-6a6 6 0 0 1 6-6z M2 9h4v12H2z M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
};

const Icon = ({ path, color = '#6B7280' }) => (
  <Svg viewBox="0 0 24 24" width={12} height={12} style={{ marginRight: 4 }}>
    <Path d={path} fill={color} />
  </Svg>
);

const TemplateCV4 = ({ data }) => {
  if (!data) {
    data = {};
  }
  
  const personalInfo = data.personalInfo || {};
  
  return (
    <Document>
      <Page 
        size="A4" 
        style={{
          padding: 32,
          fontFamily: 'Roboto',
        }}
      >
        {/* Header */}
        <View style={{ marginBottom: 32, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'light', textTransform: 'uppercase', letterSpacing: 2, color: '#1F2937' }}>
            {personalInfo.fullName || personalInfo.fullname || "Your Name"}
          </Text>
          <Text style={{ marginTop: 4, fontSize: 14, fontWeight: 'light', textTransform: 'uppercase', letterSpacing: 1, color: '#6B7280' }}>
            {personalInfo.jobPosition || personalInfo.position || "Your Position"}
          </Text>
          
          {/* Contact info - first row */}
          <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
            {personalInfo.email && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 }}>
                <Icon path={paths.email} />
                <Text style={{ fontSize: 10, color: '#4B5563' }}>{personalInfo.email}</Text>
              </View>
            )}
            
            {personalInfo.phone && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 }}>
                <Icon path={paths.phone} />
                <Text style={{ fontSize: 10, color: '#4B5563' }}>{personalInfo.phone}</Text>
              </View>
            )}
            
            {(personalInfo.address || personalInfo.city) && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 }}>
                <Icon path={paths.location} />
                <Text style={{ fontSize: 10, color: '#4B5563' }}>
                  {personalInfo.address && personalInfo.city
                    ? `${personalInfo.address}, ${personalInfo.city}`
                    : personalInfo.address || personalInfo.city}
                </Text>
              </View>
            )}
          </View>
          
          {/* Social media */}
          <View style={{ marginTop: 4, flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' }}>
            {personalInfo.linkedin && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 }}>
                <Icon path={paths.linkedin} />
                <Text style={{ fontSize: 10, color: '#4B5563' }}>LinkedIn: {personalInfo.linkedin}</Text>
              </View>
            )}
            
            {personalInfo.github && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 }}>
                <Icon path={paths.github} />
                <Text style={{ fontSize: 10, color: '#4B5563' }}>GitHub: {personalInfo.github}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Introduction */}
        <View style={{ marginBottom: 32 }}>
          <Text style={{ textAlign: 'center', fontSize: 10, color: '#4B5563' }}>
            {htmlToText(data.introduction || "", { wordwrap: false }).trim() || "Professional summary goes here"}
          </Text>
        </View>

        <View style={{ height: 1, backgroundColor: '#D1D5DB', marginBottom: 24 }} />

        {/* Work Experience */}
        <View style={{ marginBottom: 32 }}>
          <SectionTitle>Experience</SectionTitle>
          
          {(data.workExperience || data.experiences || []).map((exp, index) => (
            <View key={index} style={{ marginBottom: 24 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 11, fontWeight: 'medium', color: '#1F2937' }}>
                  {exp.position || "Position"}
                </Text>
                <Text style={{ fontSize: 9, color: '#6B7280' }}>
                  {exp.duration || 
                   (exp.startDate && dayjs(exp.startDate).format("MM/YYYY")) + 
                   ((exp.startDate && exp.endDate) ? " - " : "") + 
                   (exp.endDate ? dayjs(exp.endDate).format("MM/YYYY") : "")}
                </Text>
              </View>
              <Text style={{ 
                fontSize: 10, 
                fontStyle: 'normal',
                color: '#4B5563' 
              }}>
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

        {/* Education */}
        <View style={{ marginBottom: 32 }}>
          <SectionTitle>Education</SectionTitle>
          
          {(data.education || []).map((edu, index) => (
            <View key={index} style={{ marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 11, fontWeight: 'medium', color: '#1F2937' }}>
                  {edu.school || "University"}
                </Text>
                <Text style={{ fontSize: 9, color: '#6B7280' }}>
                  {edu.duration || 
                   (edu.startDate && dayjs(edu.startDate).format("MM/YYYY")) + 
                   ((edu.startDate && edu.endDate) ? " - " : "") + 
                   (edu.endDate ? dayjs(edu.endDate).format("MM/YYYY") : "Present")}
                </Text>
              </View>
              <Text style={{ 
                fontSize: 10, 
                fontStyle: 'normal',
                color: '#4B5563' 
              }}>
                {edu.degree || edu.field || "Degree"}
              </Text>
              <Text style={{ marginTop: 4, fontSize: 9, color: '#4B5563' }}>
                {htmlToText(edu.description || "", { wordwrap: false }).trim() || "Description"}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ height: 1, backgroundColor: '#D1D5DB', marginBottom: 24 }} />

        {/* Skills */}
        <View style={{ marginBottom: 32 }}>
          <SectionTitle>Skills</SectionTitle>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {(data.skills || []).map((skill, index) => (
              <View key={index} style={{ width: '33%', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontSize: 10, fontWeight: 'medium', color: '#4B5563' }}>
                  {skill.name || skill.skill || "Skill"}
                </Text>
                <View style={{ marginTop: 4, flexDirection: 'row' }}>
                  {[...Array(5)].map((_, i) => (
                    <View key={i} style={{ marginHorizontal: 1 }}>
                      <StarIcon filled={i < (skill.rating || skill.rate || 0)} />
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <Text break>{"\u00A0"}</Text>

        <View style={{ height: 1, backgroundColor: '#D1D5DB', marginBottom: 24 }} />

        {/* Projects */}
        {hasContentInArray(data.projects) && (
          <View style={{ marginBottom: 32 }}>
            <SectionTitle>Projects</SectionTitle>
            
            {(data.projects || []).map((project, index) => (
              <View key={index} style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 11, fontWeight: 'medium', color: '#1F2937' }}>
                    {project.name || project.project || "Project Name"}
                  </Text>
                  <Text style={{ fontSize: 9, color: '#6B7280' }}>
                    {(project.startDate && dayjs(project.startDate).format("MM/YYYY")) + 
                     ((project.startDate && project.endDate) ? " - " : "") + 
                     (project.endDate ? dayjs(project.endDate).format("MM/YYYY") : "Present")}
                  </Text>
                </View>
                <Text style={{ marginTop: 4, fontSize: 9, color: '#4B5563' }}>
                  {htmlToText(project.description || "", { wordwrap: false }).trim() || "Project description"}
                </Text>
                <View style={{ marginTop: 4, flexDirection: 'row', flexWrap: 'wrap' }}>
                  {renderTechnologies(project.technologies).map((tech, i) => (
                    <Text key={i} style={{ fontSize: 8, color: '#6B7280', marginRight: 8, marginBottom: 4 }}>
                      {tech}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 1, backgroundColor: '#D1D5DB', marginBottom: 24 }} />

        {/* Certificates */}
        {data.certificates?.some(cert => !!cert.certificate) && (
          <View style={{ marginBottom: 32 }}>
            <SectionTitle>Certificates</SectionTitle>
            
            {data.certificates.map((cert, index) => (
              <View key={index} style={{ marginBottom: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 11, fontWeight: 'medium', color: '#1F2937' }}>
                    {cert.certificate || "Certificate Name"}
                  </Text>
                  {cert.date && (
                    <Text style={{ fontSize: 9, color: '#6B7280' }}>
                      {dayjs(cert.date).format("MM/YYYY")}
                    </Text>
                  )}
                </View>
                {cert.description && (
                  <Text style={{ marginTop: 4, fontSize: 9, color: '#4B5563' }}>
                    {htmlToText(cert.description || "", { wordwrap: false }).trim()}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 1, backgroundColor: '#D1D5DB', marginBottom: 24 }} />

        {/* Languages and Interests */}
        {(data.languages?.some(lang => lang.language && lang.language.trim() !== '') || 
          hasContentInArray(data.hobbies || data.interests)) && (
          <>
            {data.languages?.some(lang => lang.language && lang.language.trim() !== '') && 
              hasContentInArray(data.hobbies || data.interests) ? (
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <SectionTitle>Languages</SectionTitle>
                  <View style={{ alignItems: 'center' }}>
                    {(data.languages || [])
                      .filter(lang => lang.language && lang.language.trim() !== '')
                      .map((lang, index) => (
                        <Text key={index} style={{ fontSize: 10, color: '#4B5563', marginBottom: 4 }}>
                          {lang.language} - {lang.proficiency || lang.level || "Level"}
                        </Text>
                      ))}
                  </View>
                </View>

                <View style={{ flex: 1 }}>
                  <SectionTitle>Interests</SectionTitle>
                  <View style={{ alignItems: 'center' }}>
                    {ensureArray(data.hobbies || data.interests)
                      .filter(hobby => hobby && (typeof hobby === 'string' ? hobby.trim() !== '' : 
                        (hobby.interest && hobby.interest.trim() !== '')))
                      .map((hobby, index) => (
                        <Text key={index} style={{ fontSize: 10, color: '#4B5563', marginBottom: 4 }}>
                          {typeof hobby === 'object' ? hobby.interest : hobby}
                        </Text>
                      ))}
                  </View>
                </View>
              </View>
            ) : (
              <View>
                {data.languages?.some(lang => lang.language && lang.language.trim() !== '') && (
                  <>
                    <SectionTitle>Languages</SectionTitle>
                    <View style={{ alignItems: 'center' }}>
                      {(data.languages || [])
                        .filter(lang => lang.language && lang.language.trim() !== '')
                        .map((lang, index) => (
                          <Text key={index} style={{ fontSize: 10, color: '#4B5563', marginBottom: 4 }}>
                            {lang.language} - {lang.proficiency || lang.level || "Level"}
                          </Text>
                        ))}
                    </View>
                  </>
                )}

                {hasContentInArray(data.hobbies || data.interests) && (
                  <>
                    <SectionTitle>Interests</SectionTitle>
                    <View style={{ alignItems: 'center' }}>
                      {ensureArray(data.hobbies || data.interests)
                        .filter(hobby => hobby && (typeof hobby === 'string' ? hobby.trim() !== '' : 
                          (hobby.interest && hobby.interest.trim() !== '')))
                        .map((hobby, index) => (
                          <Text key={index} style={{ fontSize: 10, color: '#4B5563', marginBottom: 4 }}>
                            {typeof hobby === 'object' ? hobby.interest : hobby}
                          </Text>
                        ))}
                    </View>
                  </>
                )}
              </View>
            )}
          </>
        )}

        {/* Activities */}
        {data.activities?.some(activity => 
          activity.activity && activity.activity.trim() !== '' || 
          activity.name && activity.name.trim() !== ''
        ) && (
          <>
            <View style={{ height: 1, backgroundColor: '#D1D5DB', marginTop: 24, marginBottom: 24 }} />
            <View style={{ marginBottom: 32 }}>
              <SectionTitle>Activities</SectionTitle>
              
              {data.activities
                .filter(activity => 
                  (activity.activity && activity.activity.trim() !== '') || 
                  (activity.name && activity.name.trim() !== '')
                )
                .map((activity, index) => (
                  <View key={index} style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 11, fontWeight: 'medium', color: '#1F2937' }}>
                      {activity.activity || activity.name || "Activity"}
                    </Text>
                    {(activity.startDate || activity.endDate) && (
                      <Text style={{ fontSize: 9, color: '#6B7280' }}>
                        {activity.startDate && dayjs(activity.startDate).format("MM/YYYY")}
                        {activity.startDate && (activity.endDate || activity.isCurrent === true) && " - "}
                        {activity.endDate ? dayjs(activity.endDate).format("MM/YYYY") : 
                         activity.isCurrent === false ? "" : "Now"}
                      </Text>
                    )}
                    {activity.description && (
                      <Text style={{ marginTop: 4, fontSize: 9, color: '#4B5563' }}>
                        {htmlToText(activity.description || "", { wordwrap: false }).trim()}
                      </Text>
                    )}
                  </View>
                ))}
            </View>
          </>
        )}
      </Page>
    </Document>
  );
};

export default TemplateCV4;
