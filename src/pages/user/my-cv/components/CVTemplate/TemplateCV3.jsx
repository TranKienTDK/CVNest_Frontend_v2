import React from "react";
import { Star } from "lucide-react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
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

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B46C1',
  },
  position: {
    fontSize: 16,
    color: '#DB2777',
    marginBottom: 8,
  },
  contactInfo: {
    fontSize: 10,
    color: '#4B5563',
    marginBottom: 2,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B46C1',
    marginBottom: 8,
  },
  content: {
    fontSize: 10,
    marginBottom: 8,
    color: '#374151',
  },
  workItem: {
    marginBottom: 8,
  },
  companyName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  jobTitle: {
    fontSize: 11,
    fontStyle: 'italic',
    color: '#DB2777',
  },
  duration: {
    fontSize: 9,
    color: '#6B7280',
  },
  description: {
    fontSize: 9,
    marginTop: 4,
    color: '#4B5563',
  },
  technologies: {
    fontSize: 8,
    marginTop: 4,
    color: '#6B7280',
  },
  skillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  skillItem: {
    width: '33%',
    marginBottom: 8,
  },
  skillName: {
    fontSize: 10,
    color: '#4B5563',
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
  },
  twoColumnContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  column: {
    width: '50%',
    paddingHorizontal: 5,
  },
});

// PDF Version of the template
const TemplateCV3 = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.fullName}</Text>
          <Text style={styles.position}>{data.personalInfo.jobPosition}</Text>
          <Text style={styles.contactInfo}>
            {data.personalInfo.email} | {data.personalInfo.phone} | {data.personalInfo.city}
          </Text>
          {data.personalInfo.linkedin && (
            <Text style={styles.contactInfo}>LinkedIn: {data.personalInfo.linkedin}</Text>
          )}
          {data.personalInfo.github && (
            <Text style={styles.contactInfo}>GitHub: {data.personalInfo.github}</Text>
          )}
        </View>

        {/* Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Me</Text>
          <Text style={styles.content}>
            {htmlToText(data.introduction || "", { wordwrap: false }).trim()}
          </Text>
        </View>

        {/* Work Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {data.workExperience.map((exp, index) => (
            <View key={index} style={styles.workItem}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.jobTitle}>{exp.position}</Text>
                <Text style={styles.duration}>{exp.duration}</Text>
              </View>
              <Text style={styles.companyName}>{exp.company}</Text>
              <Text style={styles.description}>
                {htmlToText(exp.description || "", { wordwrap: false }).trim()}
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
          {data.education.map((edu, index) => (
            <View key={index} style={styles.workItem}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={styles.companyName}>{edu.school}</Text>
                <Text style={styles.duration}>{edu.duration}</Text>
              </View>
              <Text style={styles.jobTitle}>{edu.degree}</Text>
              <Text style={styles.description}>
                {htmlToText(edu.description || "", { wordwrap: false }).trim()}
              </Text>
            </View>
          ))}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillRow}>
            {data.skills.map((skill, index) => (
              <View key={index} style={styles.skillItem}>
                <Text style={styles.skillName}>
                  {skill.name} {[1, 2, 3, 4, 5].slice(0, skill.rating).map(() => "★").join("")}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Projects and Languages */}
        <View style={styles.twoColumnContainer}>
          {/* Projects */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((project, index) => (
              <View key={index} style={styles.workItem}>
                <Text style={styles.companyName}>{project.name}</Text>
                <Text style={styles.description}>
                  {htmlToText(project.description || "", { wordwrap: false }).trim()}
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
          </View>

          {/* Languages and Hobbies */}
          <View style={styles.column}>
            <Text style={styles.sectionTitle}>Languages</Text>
            {data.languages.map((lang, index) => (
              <Text key={index} style={styles.content}>
                {lang.language} - {lang.proficiency}
              </Text>
            ))}

            <Text style={[styles.sectionTitle, {marginTop: 15}]}>Hobbies & Activities</Text>
            <View style={styles.tagContainer}>
              {ensureArray(data.hobbies).map((hobby, index) => (
                <Text key={index} style={styles.tag}>
                  • {hobby}
                </Text>
              ))}
              {ensureArray(data.activities).map((activity, index) => (
                <Text key={index} style={styles.tag}>
                  • {activity}
                </Text>
              ))}
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

// Web version of the template (original HTML/CSS)
// const TemplateCV3 = ({ data }) => {
//   return (
//     <div className="min-h-full bg-gradient-to-r from-purple-50 to-pink-50 p-8 font-sans">
//       <header className="mb-8 rounded-lg bg-white p-6 shadow-md">
//         <h1 className="text-3xl font-bold text-purple-800">
//           {data.personalInfo.fullName}
//         </h1>
//         <h2 className="text-xl text-pink-600">
//           {data.personalInfo.jobPosition}
//         </h2>
//         <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
//           <div className="rounded-full bg-purple-100 px-3 py-1">
//             {data.personalInfo.email}
//           </div>
//           <div className="rounded-full bg-pink-100 px-3 py-1">
//             {data.personalInfo.phone}
//           </div>
//           <div className="rounded-full bg-purple-100 px-3 py-1">
//             {data.personalInfo.city}
//           </div>
//           {data.personalInfo.linkedin && (
//             <div className="rounded-full bg-pink-100 px-3 py-1">
//               LinkedIn: {data.personalInfo.linkedin}
//             </div>
//           )}
//           {data.personalInfo.github && (
//             <div className="rounded-full bg-purple-100 px-3 py-1">
//               GitHub: {data.personalInfo.github}
//             </div>
//           )}
//         </div>
//       </header>

//       <section className="mb-8 rounded-lg bg-white p-6 shadow-md">
//         <h3 className="mb-3 text-xl font-bold text-purple-800">About Me</h3>
//         <p className="text-gray-700">{data.introduction}</p>
//       </section>

//       <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//         <section className="rounded-lg bg-white p-6 shadow-md">
//           <h3 className="mb-4 text-xl font-bold text-purple-800">
//             Work Experience
//           </h3>
//           {data.workExperience.map((exp, index) => (
//             <div key={index} className="mb-4 border-l-4 border-pink-400 pl-4">
//               <div className="flex justify-between">
//                 <h4 className="font-semibold text-gray-800">{exp.position}</h4>
//                 <span className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-800">
//                   {exp.duration}
//                 </span>
//               </div>
//               <div className="text-sm font-medium text-pink-600">
//                 {exp.company}
//               </div>
//               <p className="mt-1 text-sm text-gray-600">{exp.description}</p>
//               <div className="mt-2 flex flex-wrap gap-1">
//                 {renderTechnologies(exp.technologies).map((tech, i) => (
//                   <span
//                     key={i}
//                     className="rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-700"
//                   >
//                     {tech}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </section>

//         <section className="rounded-lg bg-white p-6 shadow-md">
//           <h3 className="mb-4 text-xl font-bold text-purple-800">Education</h3>
//           {data.education.map((edu, index) => (
//             <div key={index} className="mb-4 border-l-4 border-purple-400 pl-4">
//               <div className="flex justify-between">
//                 <h4 className="font-semibold text-gray-800">{edu.school}</h4>
//                 <span className="rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-800">
//                   {edu.duration}
//                 </span>
//               </div>
//               <div className="text-sm font-medium text-purple-600">
//                 {edu.degree}
//               </div>
//               <p className="mt-1 text-sm text-gray-600">{edu.description}</p>
//             </div>
//           ))}
//         </section>
//       </div>

//       <section className="mt-6 rounded-lg bg-white p-6 shadow-md">
//         <h3 className="mb-4 text-xl font-bold text-purple-800">Skills</h3>
//         <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
//           {data.skills.map((skill, index) => (
//             <div
//               key={index}
//               className="rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 p-3 text-center"
//             >
//               <div className="text-sm font-medium text-gray-800">
//                 {skill.name}
//               </div>
//               <div className="mt-1 flex justify-center">
//                 {[...Array(5)].map((_, i) => (
//                   <Star
//                     key={i}
//                     size={14}
//                     className={
//                       i < skill.rating
//                         ? "fill-purple-500 text-purple-500"
//                         : "text-gray-300"
//                     }
//                   />
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
//         <section className="rounded-lg bg-white p-6 shadow-md">
//           <h3 className="mb-3 text-xl font-bold text-purple-800">Projects</h3>
//           {data.projects.map((project, index) => (
//             <div key={index} className="mb-3">
//               <h4 className="font-semibold text-gray-800">{project.name}</h4>
//               <p className="mt-1 text-sm text-gray-600">
//                 {project.description}
//               </p>
//               <div className="mt-1 flex flex-wrap gap-1">
//                 {renderTechnologies(project.technologies).map((tech, i) => (
//                   <span
//                     key={i}
//                     className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-700"
//                   >
//                     {tech}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </section>

//         <div className="grid grid-cols-1 gap-6">
//           <section className="rounded-lg bg-white p-6 shadow-md">
//             <h3 className="mb-3 text-xl font-bold text-purple-800">
//               Languages
//             </h3>
//             <div className="flex flex-wrap gap-2">
//               {data.languages.map((lang, index) => (
//                 <span
//                   key={index}
//                   className="rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-800"
//                 >
//                   {lang.language} - {lang.proficiency}
//                 </span>
//               ))}
//             </div>
//           </section>

//           <section className="rounded-lg bg-white p-6 shadow-md">
//             <h3 className="mb-3 text-xl font-bold text-purple-800">
//               Hobbies & Activities
//             </h3>
//             <div className="flex flex-wrap gap-2">
//               {ensureArray(data.hobbies).map((hobby, index) => (
//                 <span
//                   key={index}
//                   className="rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800"
//                 >
//                   {hobby}
//                 </span>
//               ))}
//               {ensureArray(data.activities).map((activity, index) => (
//                 <span
//                   key={index}
//                   className="rounded-full bg-pink-100 px-3 py-1 text-sm text-pink-800"
//                 >
//                   {activity}
//                 </span>
//               ))}
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// };

// Export both versions
// export { TemplateCV3PDF };
export default TemplateCV3;