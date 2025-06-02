import React from "react";
import { Document, Page, Text, View, StyleSheet, Font, Svg, Path, pdf, Image } from "@react-pdf/renderer";
import { htmlToText } from "html-to-text";
import robotoFont from '@/assets/Roboto-VariableFont_wdth,wght.ttf';
import notoFont from "@/assets/NotoSans-Regular.ttf";
import dayjs from 'dayjs';

pdf.enableCORS = true;

Font.register({
  family: 'Roboto',
  fonts: [
    { src: robotoFont, fontStyle: 'normal', fontWeight: 'normal' },
    { src: robotoFont, fontStyle: 'italic', fontWeight: 'normal' }
  ]
});

Font.register({
  family: 'NotoSans',
  src: notoFont,
});

const standardFont = 'Helvetica';

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

const paths = {
  phone: 'M2 3.75A.75.75 0 0 1 2.75 3h2.36a.75.75 0 0 1 .737.598l.548 2.741a.75.75 0 0 1-.212.703l-1.21 1.21a16.5 16.5 0 0 0 6.364 6.364l1.21-1.21a.75.75 0 0 1 .703-.212l2.741.548A.75.75 0 0 1 21 18.89v2.36a.75.75 0 0 1-.75.75h-.5C9.455 22 2 14.545 2 5.25v-.5z',
  email: 'M2.25 4.5A2.25 2.25 0 0 1 4.5 2.25h15a2.25 2.25 0 0 1 2.25 2.25v15a2.25 2.25 0 0 1-2.25 2.25h-15A2.25 2.25 0 0 1 2.25 19.5v-15zm2.26.75a.75.75 0 0 0-.26.56v.084l7.75 5.033 7.75-5.033v-.084a.75.75 0 0 0-.26-.56H4.51z',
  location: 'M12 2.25c-4.386 0-7.95 3.564-7.95 7.95 0 5.251 7.65 11.55 7.95 11.8.3-.25 7.95-6.55 7.95-11.8 0-4.386-3.564-7.95-7.95-7.95zm0 10.2a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5z',
  linkedin: 'M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-6a6 6 0 0 1 6-6z M2 9h4v12H2z M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303...',
  briefcase: "M6 7V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1h1.5A1.5 1.5 0 0 1 21 8.5v11A1.5 1.5 0 0 1 19.5 21h-15A1.5 1.5 0 0 1 3 19.5v-11A1.5 1.5 0 0 1 4.5 7H6zm2.25-1v1h7.5V6a.75.75 0 0 0-.75-.75h-6a.75.75 0 0 0-.75.75z",
  academicCap: "M11.7 1.5a1.5 1.5 0 0 1 .6 0l9 3a1.5 1.5 0 0 1 0 2.828l-9 3a1.5 1.5 0 0 1-.6 0l-9-3a1.5 1.5 0 0 1 0-2.828l9-3zm9.3 7.63v4.12a1.5 1.5 0 0 1-.832 1.341l-7.5 3.75a1.5 1.5 0 0 1-1.336 0l-7.5-3.75A1.5 1.5 0 0 1 3 13.25V9.13l8.4 2.8a3 3 0 0 0 1.2 0l8.4-2.8z",
};

const Icon = ({ path, color = '#6B46C1' }) => (
  <Svg viewBox="0 0 24 24" width={12} height={12} style={{ marginRight: 4 }}>
    <Path d={path} fill={color} />
  </Svg>
);

const StarIcon = ({ filled }) => (
  <Svg viewBox="0 0 24 24" width={8} height={8} style={{ marginRight: 1 }}>
    <Path
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
      fill={filled ? '#DB2777' : 'none'}
      stroke={'#DB2777'}
      strokeWidth={0.5}
    />
  </Svg>
);

const renderTechnologies = (technologies) => {
  if (typeof technologies === "string") {
    return technologies.split(",").map((tech) => tech.trim());
  }
  return technologies || [];
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
    backgroundColor: '#FDFCFB',
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
    fontFamily: 'Roboto',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B46C1',
    fontFamily: 'Roboto',
  },
  position: {
    fontSize: 16,
    color: '#DB2777',
    marginBottom: 8,
    fontFamily: standardFont,
  },
  contactInfo: {
    fontSize: 10,
    color: '#4B5563',
    marginBottom: 2,
    fontFamily: 'Roboto',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginVertical: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
    marginVertical: 2,
  }, section: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 4,
    borderLeftWidth: 3,
    borderLeftColor: '#6B46C1',
    borderLeftStyle: 'solid',
    fontFamily: 'Roboto',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B46C1',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9FE',
    paddingBottom: 4,
    fontFamily: 'Roboto',
  },
  content: {
    fontSize: 10,
    marginBottom: 8,
    color: '#374151',
    lineHeight: 1.4,
    fontFamily: 'Roboto',
  },
  workItem: {
    marginBottom: 10,
  }, companyName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1F2937',
    fontFamily: 'Roboto',
  }, jobTitle: {
    fontSize: 11,
    color: '#DB2777',
    textDecoration: 'underline',
    fontFamily: standardFont,
  }, duration: {
    fontSize: 9,
    color: '#6B7280',
    fontFamily: 'Roboto',
  },
  description: {
    fontSize: 9,
    marginTop: 4,
    color: '#4B5563',
    lineHeight: 1.4,
    fontFamily: 'Roboto',
  },
  technologies: {
    fontSize: 8,
    marginTop: 4,
    color: '#6B7280',
    fontFamily: 'Roboto',
  },
  skillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  skillItem: {
    width: '33%',
    marginBottom: 8,
  }, skillName: {
    fontSize: 10,
    color: '#4B5563',
    fontFamily: 'Roboto',
  },
  skillStars: {
    flexDirection: 'row',
    marginTop: 2,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  tag: {
    fontSize: 8,
    color: '#6B7280',
    marginRight: 5,
    marginBottom: 3,
    fontFamily: 'Roboto',
  },
  twoColumnContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  column: {
    width: '48%',
    paddingHorizontal: 5,
    marginHorizontal: '1%',
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 10,
  },
});

const SectionTitle = ({ children, style }) => (
  <Text style={[styles.sectionTitle, style]} break>
    {children}
  </Text>
);

const hasContentInArray = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) return false;

  return arr.some(item => {
    if (typeof item === 'object') {
      return Object.values(item).some(val =>
        val && typeof val === 'string' && val.trim() !== ''
      );
    }
    return item && typeof item === 'string' && item.trim() !== '';
  });
};

const TemplateCV3 = ({ data }) => {
  if (!data) {
    data = {};
  }

  const avatar = data.personalInfo?.avatar || "http://localhost:5173/src/assets/temp1.jpg";
  const personalInfo = data.personalInfo || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName || personalInfo.fullname || "Your Name"}</Text>
          <Text style={styles.position}>{personalInfo.jobPosition || personalInfo.position || "Your Position"}</Text>

          {/* Contact info */}
          <View style={styles.contactRow}>
            {personalInfo.email && (
              <View style={styles.contactItem}>
                <Icon path={paths.email} color="#DB2777" />
                <Text style={styles.contactInfo}>{personalInfo.email}</Text>
              </View>
            )}

            {personalInfo.phone && (
              <View style={styles.contactItem}>
                <Icon path={paths.phone} color="#DB2777" />
                <Text style={styles.contactInfo}>{personalInfo.phone}</Text>
              </View>
            )}

            {(personalInfo.address || personalInfo.city) && (
              <View style={styles.contactItem}>
                <Icon path={paths.location} color="#DB2777" />
                <Text style={styles.contactInfo}>
                  {personalInfo.address && personalInfo.city
                    ? `${personalInfo.address}, ${personalInfo.city}`
                    : personalInfo.address || personalInfo.city}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.contactRow}>
            {personalInfo.linkedin && (
              <View style={styles.contactItem}>
                <Icon path={paths.linkedin} color="#DB2777" />
                <Text style={styles.contactInfo}>LinkedIn: {personalInfo.linkedin}</Text>
              </View>
            )}

            {personalInfo.github && (
              <View style={styles.contactItem}>
                <Icon path={paths.github} color="#DB2777" />
                <Text style={styles.contactInfo}>GitHub: {personalInfo.github}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.content}>
            {htmlToText(data.profile || "", { wordwrap: false }).trim() || "Professional summary goes here"}
          </Text>
        </View>

        {/* Work Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {(data.workExperience || data.experiences || []).map((exp, index) => (
            <View key={index} style={styles.workItem}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.jobTitle}>{exp.position}</Text>
                <Text style={styles.duration}>
                  {exp.duration ||
                    (exp.startDate && dayjs(exp.startDate).format("MM/YYYY")) +
                    ((exp.startDate && exp.endDate) ? " - " : "") +
                    (exp.endDate ? dayjs(exp.endDate).format("MM/YYYY") : "")}
                </Text>
              </View>
              <Text style={styles.companyName}>{exp.company}</Text>              <Text style={styles.description}>
                {htmlToText(exp.description || "", { wordwrap: false, preserveNewlines: false }).trim() || "Job description"}
              </Text>
              <View style={styles.tagContainer}>
                {renderTechnologies(exp.technologies).map((tech, i) => (
                  <Text key={i} style={styles.tag}>
                    • {tech}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* Education */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {(data.education || []).map((edu, index) => (
            <View key={index} style={styles.workItem}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.companyName}>{edu.school}</Text>
                <Text style={styles.duration}>
                  {edu.duration ||
                    (edu.startDate && dayjs(edu.startDate).format("MM/YYYY")) +
                    ((edu.startDate && edu.endDate) ? " - " : "") +
                    (edu.endDate ? dayjs(edu.endDate).format("MM/YYYY") : "Present")}
                </Text>
              </View>
              <Text style={styles.jobTitle}>{edu.degree || edu.field}</Text>
              <Text style={styles.description}>
                {htmlToText(edu.description || "", { wordwrap: false }).trim() || "Education description"}
              </Text>
            </View>
          ))}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillRow}>
            {(data.skills || []).map((skill, index) => (
              <View key={index} style={styles.skillItem}>
                <Text style={styles.skillName}>
                  {skill.name || skill.skill}
                </Text>
                <View style={styles.skillStars}>
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <StarIcon key={i} filled={i < (skill.rating || skill.rate || 0)} />
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        <Text break>{"\u00A0"}</Text>

        <View style={styles.twoColumnContainer}>
          {/* Projects and Certificates in left column */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {(data.projects || []).map((project, index) => (
              <View key={index} style={styles.workItem}>
                <Text style={styles.companyName}>{project.name || project.project}</Text>
                {(project.startDate || project.endDate) && (
                  <Text style={styles.duration}>
                    {(project.startDate && dayjs(project.startDate).format("MM/YYYY")) +
                      ((project.startDate && project.endDate) ? " - " : "") +
                      (project.endDate ? dayjs(project.endDate).format("MM/YYYY") : "Present")}
                  </Text>
                )}
                <Text style={styles.description}>
                  {htmlToText(project.description || "", { wordwrap: false }).trim() || "Project description"}
                </Text>
                <View style={styles.tagContainer}>
                  {renderTechnologies(project.technologies).map((tech, i) => (
                    <Text key={i} style={styles.tag}>
                      • {tech}
                    </Text>
                  ))}
                </View>
              </View>
            ))}

            {/* Certificates */}
            {data.certificates?.some(cert => !!cert.certificate) && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Certificates</Text>
                {data.certificates.map((cert, index) => (
                  <View key={index} style={styles.workItem}>
                    <Text style={styles.companyName}>{cert.certificate}</Text>
                    {cert.date && (
                      <Text style={styles.duration}>
                        {dayjs(cert.date).format("MM/YYYY")}
                      </Text>
                    )}
                    {cert.description && (
                      <Text style={styles.description}>
                        {htmlToText(cert.description || "", { wordwrap: false }).trim()}
                      </Text>
                    )}
                  </View>
                ))}
              </>
            )}
          </View>

          {/* Languages  */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Languages</Text>
            {(data.languages || []).map((lang, index) => (
              <Text key={index} style={styles.content}>
                {lang.language} - {lang.proficiency || lang.level}
              </Text>
            ))}

            <Text style={[styles.sectionTitle, { marginTop: 15 }]}>Hobbies & Activities</Text>

            {/* Hobbies section */}
            {hasContentInArray(data.hobbies || data.interests) && (
              <View style={styles.tagContainer}>
                {Array.isArray(data.hobbies || data.interests) && ensureArray(data.hobbies || data.interests).map((hobby, index) => (
                  <Text key={index} style={styles.tag}>
                    {typeof hobby === 'object' ? hobby.interest : hobby}
                  </Text>
                ))}
              </View>
            )}

            {/* Activities section */}
            {hasContentInArray(data.activities) && (
              <View style={styles.tagContainer}>
                {Array.isArray(data.activities) && data.activities.map((activity, index) => (
                  <View key={index} style={styles.workItem}>
                    <Text style={styles.skillName}>
                      • {activity.activity || activity.name}
                    </Text>
                    {activity.description && (
                      <Text style={styles.description}>
                        {htmlToText(activity.description || "", { wordwrap: false }).trim()}
                      </Text>
                    )}
                    {(activity.startDate || activity.endDate) && (
                      <Text style={styles.duration}>
                        {activity.startDate && dayjs(activity.startDate).format("MM/YYYY")}
                        {activity.startDate && (activity.endDate || activity.isCurrent === true) && " - "}
                        {activity.endDate ? dayjs(activity.endDate).format("MM/YYYY") :
                          activity.isCurrent === false ? "" : "Now"}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TemplateCV3;