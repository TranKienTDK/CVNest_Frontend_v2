import React from "react";
import {
  Document,
  Font,
  Image,
  Page,
  Path,
  Svg,
  Text,
  View,
} from "@react-pdf/renderer";
import { htmlToText } from "html-to-text";
import robotoFont from "@/assets/Roboto-VariableFont_wdth,wght.ttf";
import dayjs from "dayjs";

// Register font
Font.register({
  family: "Roboto",
  src: robotoFont,
});

const Icon = ({ path }) => (
  <Svg viewBox="0 0 24 24" width={12} height={12} style={{ marginRight: 4 }}>
    <Path d={path} fill="#FFFFFF" />
  </Svg>
);

// Icon paths
const paths = {
  phone:
    "M2 3.75A.75.75 0 0 1 2.75 3h2.36a.75.75 0 0 1 .737.598l.548 2.741a.75.75 0 0 1-.212.703l-1.21 1.21a16.5 16.5 0 0 0 6.364 6.364l1.21-1.21a.75.75 0 0 1 .703-.212l2.741.548A.75.75 0 0 1 21 18.89v2.36a.75.75 0 0 1-.75.75h-.5C9.455 22 2 14.545 2 5.25v-.5z",
  email:
    "M2.25 4.5A2.25 2.25 0 0 1 4.5 2.25h15a2.25 2.25 0 0 1 2.25 2.25v15a2.25 2.25 0 0 1-2.25 2.25h-15A2.25 2.25 0 0 1 2.25 19.5v-15zm2.26.75a.75.75 0 0 0-.26.56v.084l7.75 5.033 7.75-5.033v-.084a.75.75 0 0 0-.26-.56H4.51z",
  location:
    "M12 2.25c-4.386 0-7.95 3.564-7.95 7.95 0 5.251 7.65 11.55 7.95 11.8.3-.25 7.95-6.55 7.95-11.8 0-4.386-3.564-7.95-7.95-7.95zm0 10.2a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5z",
  linkedin:
    "M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-6a6 6 0 0 1 6-6z M2 9h4v12H2z M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4z",
  github: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303...",
  briefcase:
    "M6 7V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1h1.5A1.5 1.5 0 0 1 21 8.5v11A1.5 1.5 0 0 1 19.5 21h-15A1.5 1.5 0 0 1 3 19.5v-11A1.5 1.5 0 0 1 4.5 7H6zm2.25-1v1h7.5V6a.75.75 0 0 0-.75-.75h-6a.75.75 0 0 0-.75.75z",
  academicCap:
    "M11.7 1.5a1.5 1.5 0 0 1 .6 0l9 3a1.5 1.5 0 0 1 0 2.828l-9 3a1.5 1.5 0 0 1-.6 0l-9-3a1.5 1.5 0 0 1 0-2.828l9-3zm9.3 7.63v4.12a1.5 1.5 0 0 1-.832 1.341l-7.5 3.75a1.5 1.5 0 0 1-1.336 0l-7.5-3.75A1.5 1.5 0 0 1 3 13.25V9.13l8.4 2.8a3 3 0 0 0 1.2 0l8.4-2.8z",
};

const SectionTitle = ({ children }) => (
  <View style={{ marginBottom: 8 }}>
    <Text
      style={{
        fontSize: 14,
        fontWeight: "bold",
        color: "#1E3A8A",
        textTransform: "uppercase",
        borderBottomWidth: 2,
        borderBottomColor: "#1E3A8A",
        paddingBottom: 2,
        marginBottom: 8,
      }}
    >
      {children}
    </Text>
  </View>
);

const LeftSectionTitle = ({ children }) => (
  <View style={{ marginBottom: 8, width: "100%" }}>
    <Text
      style={{
        fontSize: 12,
        fontWeight: "bold",
        color: "white",
        textTransform: "uppercase",
        borderBottomWidth: 1,
        borderBottomColor: "#6B7280",
        paddingBottom: 2,
        marginBottom: 6,
      }}
    >
      {children}
    </Text>
  </View>
);

export const TemplateCV2 = ({ data = {} }) => {
  console.log("TemplateCV2 data:", data);

  return (
    <Document>
      <Page
        size="A4"
        style={{
          fontFamily: "Roboto",
          flexDirection: "row",
          padding: 0,
        }}
      >
        {/* Left Column */}
        <View
          style={{
            width: "33%",
            backgroundColor: "#1E3A8A",
            padding: 20,
            color: "white",
            height: "100%",
            alignItems: "center",
          }}
        >
          {/* Profile Image & Name */}
          <View style={{ marginBottom: 24, alignItems: "center" }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "white",
                marginBottom: 12,
                overflow: "hidden",
                border: "4 solid white",
              }}
            >
              {data.avatar && (
                <Image
                  src={
                    data.avatar || "http://localhost:5173/src/assets/temp1.jpg"
                  }
                  style={{ width: 100, height: 100, objectFit: "cover" }}
                />
              )}
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 2,
                color: "white",
              }}
            >
              {data.personalInfo?.fullname || "Full Name"}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: "#D1D5DB",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {data.personalInfo?.position || "Position"}
            </Text>
          </View>

          {/* Contact Section */}
          <View style={{ width: "100%", marginBottom: 20 }}>
            <LeftSectionTitle>Contact</LeftSectionTitle>
            <View style={{ gap: 6 }}>
              {data.personalInfo?.phone && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon path={paths.phone} />
                  <Text style={{ fontSize: 10 }}>
                    {data.personalInfo.phone}
                  </Text>
                </View>
              )}

              {data.personalInfo?.email && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon path={paths.email} />
                  <Text style={{ fontSize: 10 }}>
                    {data.personalInfo.email}
                  </Text>
                </View>
              )}

              {data.personalInfo?.address && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon path={paths.location} />
                  <Text style={{ fontSize: 10 }}>
                    {data.personalInfo.address}
                  </Text>
                </View>
              )}

              {data.personalInfo?.linkedin && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon path={paths.linkedin} />
                  <Text style={{ fontSize: 10 }}>
                    {data.personalInfo.linkedin}
                  </Text>
                </View>
              )}

              {data.personalInfo?.github && (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Icon path={paths.github} />
                  <Text style={{ fontSize: 10 }}>
                    {data.personalInfo.github}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Education Section */}
          {data.education?.some((edu) => !!edu.school) && (
            <View style={{ width: "100%", marginBottom: 20 }}>
              <LeftSectionTitle>Education</LeftSectionTitle>
              {data.education.map((edu, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text style={{ fontSize: 10, fontWeight: "bold" }}>
                    {edu.school}
                  </Text>
                  <Text style={{ fontSize: 9 }}>{edu.field}</Text>
                  <Text style={{ fontSize: 9, color: "#D1D5DB" }}>
                    {edu.startDate && dayjs(edu.startDate).format("MM/YYYY")}
                    {edu.startDate && (edu.endDate || !edu.endDate)
                      ? " - "
                      : ""}
                    {edu.endDate
                      ? dayjs(edu.endDate).format("MM/YYYY")
                      : "Đang học tại đây"}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Skills Section */}
          {data.skills?.some((skill) => !!skill.name || !!skill.skill) && (
            <View style={{ width: "100%", marginBottom: 20 }}>
              <LeftSectionTitle>Skills</LeftSectionTitle>
              <View style={{ paddingLeft: 12 }}>
                {data.skills.map((skill, index) => (
                  <Text key={index} style={{ fontSize: 10, marginBottom: 4 }}>
                    • {skill.name || skill.skill}
                  </Text>
                ))}
              </View>
            </View>
          )}

          {/* Languages Section */}
          {data.languages?.some((lang) => !!lang.language) && (
            <View style={{ width: "100%", marginBottom: 20 }}>
              <LeftSectionTitle>Languages</LeftSectionTitle>
              <View style={{ paddingLeft: 12 }}>
                {data.languages.map((lang, index) => (
                  <Text key={index} style={{ fontSize: 10, marginBottom: 4 }}>
                    • {lang.language} - {lang.level}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Right Column */}
        <View
          style={{
            width: "67%",
            backgroundColor: "white",
            padding: 24,
          }}
        >
          {/* Profile Section */}
          {data.introduction && (
            <View style={{ marginBottom: 24 }}>
              <SectionTitle>Profile</SectionTitle>
              <Text style={{ fontSize: 10, color: "#4B5563", lineHeight: 1.5 }}>
                {htmlToText(data.introduction, {
                  wordwrap: false,
                  preserveNewlines: true,
                })
                  .split("\n")
                  .filter((line) => line.trim() !== "")}
              </Text>
            </View>
          )}

          {/* Work Experience Section */}
          {data.experiences?.some((exp) => !!exp.company) && (
            <View style={{ marginBottom: 24 }}>
              <SectionTitle>Work Experience</SectionTitle>
              {data.experiences.map((exp, index) => (
                <View key={index} style={{ marginBottom: 16 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 2,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "#1F2937",
                      }}
                    >
                      {exp.position || "Position"}
                    </Text>
                    <Text style={{ fontSize: 10, color: "#6B7280" }}>
                      {exp.startDate && dayjs(exp.startDate).format("MM/YYYY")}
                      {exp.startDate && exp.endDate ? " - " : ""}
                      {exp.endDate && dayjs(exp.endDate).format("MM/YYYY")}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#2563EB",
                      fontWeight: "medium",
                      marginBottom: 4,
                    }}
                  >
                    {exp.company || "Company"}
                  </Text>
                  <Text
                    style={{ fontSize: 9, color: "#4B5563", paddingLeft: 10 }}
                  >
                    {htmlToText(exp.description, {
                      wordwrap: false,
                      preserveNewlines: true,
                    })
                      .split("\n")
                      .filter((line) => line.trim() !== "")}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Projects Section */}
          {data.projects?.some((project) => !!project.project) && (
            <View style={{ marginBottom: 24 }}>
              <SectionTitle>Projects</SectionTitle>
              {data.projects.map((project, index) => (
                <View key={index} style={{ marginBottom: 12 }}>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "bold",
                      color: "#1F2937",
                      marginBottom: 2,
                    }}
                  >
                    {project.project}
                  </Text>
                  <Text
                    style={{ fontSize: 10, color: "#6B7280", marginBottom: 2 }}
                  >
                    {project.startDate &&
                      dayjs(project.startDate).format("MM/YYYY")}
                    {project.startDate && project.endDate ? " - " : ""}
                    {project.endDate &&
                      dayjs(project.endDate).format("MM/YYYY")}
                  </Text>
                  <Text style={{ fontSize: 9, color: "#4B5563" }}>
                    {htmlToText(project.description, {
                      wordwrap: false,
                      preserveNewlines: true,
                    })
                      .split("\n")
                      .filter((line) => line.trim() !== "")}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* References Section */}
          {data.consultants?.some((ref) => !!ref.name) && (
            <View style={{ marginBottom: 24 }}>
              <SectionTitle>References</SectionTitle>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {data.consultants.map((ref, index) => (
                  <View
                    key={index}
                    style={{ width: "50%", paddingRight: 8, marginBottom: 8 }}
                  >
                    <Text
                      style={{
                        fontSize: 10,
                        fontWeight: "bold",
                        color: "#1F2937",
                      }}
                    >
                      {ref.name}
                    </Text>
                    {ref.position && (
                      <Text style={{ fontSize: 9, color: "#4B5563" }}>
                        {ref.position}
                      </Text>
                    )}
                    {ref.email && (
                      <Text style={{ fontSize: 9, color: "#4B5563" }}>
                        {ref.email}
                      </Text>
                    )}
                    {ref.phone && (
                      <Text style={{ fontSize: 9, color: "#4B5563" }}>
                        {ref.phone}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Activities Section */}
          {data.activities?.some((activity) => !!activity.activity) && (
            <View style={{ marginBottom: 24 }}>
              <SectionTitle>Activities</SectionTitle>
              {data.activities.map((activity, index) => (
                <View key={index} style={{ marginBottom: 8 }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "bold",
                      color: "#1F2937",
                    }}
                  >
                    {activity.activity}
                  </Text>
                  <Text style={{ fontSize: 9, color: "#6B7280" }}>
                    {activity.startDate &&
                      dayjs(activity.startDate).format("MM/YYYY")}
                    {activity.startDate && activity.endDate ? " - " : ""}
                    {activity.endDate &&
                      dayjs(activity.endDate).format("MM/YYYY")}
                  </Text>
                  <Text style={{ fontSize: 9, color: "#4B5563" }}>
                    {activity.description &&
                      htmlToText(activity.description, {
                        wordwrap: false,
                        preserveNewlines: true,
                      })
                        .split("\n")
                        .filter((line) => line.trim() !== "")}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Certificates Section */}
          {data.certificates?.some((cert) => !!cert.certificate) && (
            <View style={{ marginBottom: 24 }}>
              <SectionTitle>Certificates</SectionTitle>
              {data.certificates.map((cert, index) => (
                <View key={index} style={{ marginBottom: 8 }}>
                  <Text
                    style={{
                      fontSize: 10,
                      fontWeight: "bold",
                      color: "#1F2937",
                    }}
                  >
                    {cert.certificate}
                  </Text>
                  {cert.date && (
                    <Text style={{ fontSize: 9, color: "#6B7280" }}>
                      {dayjs(cert.date).format("MM/YYYY")}
                    </Text>
                  )}
                  {cert.description && (
                    <Text style={{ fontSize: 9, color: "#4B5563" }}>
                      {htmlToText(cert.description, {
                        wordwrap: false,
                        preserveNewlines: true,
                      })
                        .split("\n")
                        .filter((line) => line.trim() !== "")}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* Additional Information */}
          {data.additionalInfo && (
            <View style={{ marginBottom: 24 }}>
              <SectionTitle>Additional Information</SectionTitle>
              <Text style={{ fontSize: 10, color: "#4B5563" }}>
                {htmlToText(data.additionalInfo, {
                  wordwrap: false,
                  preserveNewlines: true,
                })
                  .split("\n")
                  .filter((line) => line.trim() !== "")}
              </Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default TemplateCV2;
