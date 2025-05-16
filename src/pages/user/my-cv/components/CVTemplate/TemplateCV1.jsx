// components/CVDocument.tsx
import React from 'react';
import {Document, Font, Image, Page, Path, Svg, Text, View} from '@react-pdf/renderer';
import {htmlToText} from "html-to-text";
import robotoFont from '@/assets/Roboto-VariableFont_wdth,wght.ttf';
import dayjs from 'dayjs';

// Đăng ký font
Font.register({
    family: 'Roboto',
    src: robotoFont,
});

const Icon = ({path}) => (
    <Svg viewBox="0 0 24 24" width={12} height={12} style={{marginRight: 4}}>
        <Path d={path} fill="#6A5ACD"/>
    </Svg>
);

// Heroicons path (v5 hoặc v6 solid)
const paths = {
    phone: 'M2 3.75A.75.75 0 0 1 2.75 3h2.36a.75.75 0 0 1 .737.598l.548 2.741a.75.75 0 0 1-.212.703l-1.21 1.21a16.5 16.5 0 0 0 6.364 6.364l1.21-1.21a.75.75 0 0 1 .703-.212l2.741.548A.75.75 0 0 1 21 18.89v2.36a.75.75 0 0 1-.75.75h-.5C9.455 22 2 14.545 2 5.25v-.5z',
    email: 'M2.25 4.5A2.25 2.25 0 0 1 4.5 2.25h15a2.25 2.25 0 0 1 2.25 2.25v15a2.25 2.25 0 0 1-2.25 2.25h-15A2.25 2.25 0 0 1 2.25 19.5v-15zm2.26.75a.75.75 0 0 0-.26.56v.084l7.75 5.033 7.75-5.033v-.084a.75.75 0 0 0-.26-.56H4.51z',
    location: 'M12 2.25c-4.386 0-7.95 3.564-7.95 7.95 0 5.251 7.65 11.55 7.95 11.8.3-.25 7.95-6.55 7.95-11.8 0-4.386-3.564-7.95-7.95-7.95zm0 10.2a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5z',
    linkedin: 'M16 8a6 6 0 0 1 6 6v6h-4v-6a2 2 0 0 0-4 0v6h-4v-6a6 6 0 0 1 6-6z M2 9h4v12H2z M4 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
    github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303...',
    briefcase: "M6 7V6a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v1h1.5A1.5 1.5 0 0 1 21 8.5v11A1.5 1.5 0 0 1 19.5 21h-15A1.5 1.5 0 0 1 3 19.5v-11A1.5 1.5 0 0 1 4.5 7H6zm2.25-1v1h7.5V6a.75.75 0 0 0-.75-.75h-6a.75.75 0 0 0-.75.75z",
    academicCap: "M11.7 1.5a1.5 1.5 0 0 1 .6 0l9 3a1.5 1.5 0 0 1 0 2.828l-9 3a1.5 1.5 0 0 1-.6 0l-9-3a1.5 1.5 0 0 1 0-2.828l9-3zm9.3 7.63v4.12a1.5 1.5 0 0 1-.832 1.341l-7.5 3.75a1.5 1.5 0 0 1-1.336 0l-7.5-3.75A1.5 1.5 0 0 1 3 13.25V9.13l8.4 2.8a3 3 0 0 0 1.2 0l8.4-2.8z",
};

const Title = ({children}) => (
    <>
        <Text x={0} y={0} style={{fontSize: 12, color: '#4F46E5', marginBottom: 4}}>
            {children}
        </Text>
        <Text x={0} y={0}
              style={{width: '100%', height: 2, backgroundColor: '#696585', borderRadius: 1, marginBottom: 4}}/>
    </>
);

const Dot = () => (
    <View
        style={{
            width: 6,
            height: 6,
            borderRadius: 3, // 50% bo tròn
            backgroundColor: '#4F46E5',
            marginRight: 6,
            marginTop: 4,
        }}
    />
);

export const TemplateCV1 = ({data = {}}) => {
    console.log("dataaaaaaaaaaaaaaa: ", data);
    console.log('edu', data.education);

    return (
        <Document>
            <Page size="A4" style={{
                fontFamily: 'Roboto',
                borderRadius: 10,
            }}>
                <View style={{
                    height: 40,
                    backgroundColor: '#5046e7',
                }}/>
                <View style={{position: 'relative', alignItems: 'center', top: -20}}>
                    <View style={{
                        position: 'relative'
                    }}>
                        <Image
                            src={data.avatar || "http://localhost:5173/src/assets/temp1.jpg"}
                            style={{
                                width: 50,
                                height: 50,
                                objectFit: 'cover',
                                marginBottom: 10,
                                borderRadius: '50rem',
                            }}
                            cache={false}
                        />

                        <Text x={0} y={0} style={{
                            position: 'absolute',
                            width: 54,
                            height: 54,
                            top: -2,
                            left: -2,
                            borderRadius: '50rem',
                            border: '1px solid #eee',
                        }}>
                        </Text>
                    </View>


                    <View style={{marginBottom: 16, textAlign: 'center', width: '100%'}}>
                        <Text x={0} y={0} style={{fontSize: 20, fontWeight: 'bold', color: '#2E3B55', marginBottom: 8}}>
                            {data.info?.fullName || "Fullname"}
                        </Text>
                        <Text x={0} y={0} style={{fontSize: 14, color: '#6A5ACD', marginBottom: 8}}>
                            {data.info?.position || "Position"}
                        </Text>

                        {/* Row 1 */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            marginVertical: 2
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginHorizontal: 6,
                                marginVertical: 2
                            }}>
                                <Icon path={paths.phone}/>
                                <Text x={0} y={0} style={{fontSize: 10}}>
                                    {data.info?.phone || "Phone"}
                                </Text>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginHorizontal: 6,
                                marginVertical: 2
                            }}>
                                <Icon path={paths.email}/>
                                <Text x={0} y={0} style={{fontSize: 10}}>
                                    {data.info?.email || "Email"}
                                </Text>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginHorizontal: 6,
                                marginVertical: 2
                            }}>
                                <Icon path={paths.location}/>
                                <Text x={0} y={0} style={{fontSize: 10}}>
                                    {data.info?.address || "Address"}
                                </Text>
                            </View>
                        </View>

                        {/* Row 2 */}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            flexWrap: 'wrap',
                            marginVertical: 2
                        }}>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginHorizontal: 6,
                                marginVertical: 2
                            }}>
                                <Icon path={paths.linkedin}/>
                                <Text x={0} y={0} style={{fontSize: 10}}>
                                    {data.info?.linkedin || "linkedin.com/in/alexjohnson"}
                                </Text>
                            </View>

                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginHorizontal: 6,
                                marginVertical: 2
                            }}>
                                <Icon path={paths.github}/>
                                <Text x={0} y={0} style={{fontSize: 10}}>
                                    {data.info?.github || "github.com/alexjohnson"}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{textAlign: 'center', marginVertical: 10}}>
                    {/* Title */}
                    <Text x={0} y={0}
                          style={{
                              fontSize: 12,
                              color: '#4F46E5', // Indigo 600
                              textDecoration: 'underline',
                              marginBottom: 6,
                          }}
                    >
                        Profile
                    </Text>

                    {/* Description */}

                    <Text x={0} y={0} style={{maxWidth: '80%', margin: 'auto'}}>
                        <Text x={0} y={0}
                              style={{
                                  fontSize: 10,
                                  lineHeight: 1.5,
                                  width: '100%',
                                  color: '#333',
                                  textAlign: 'center',
                              }}
                        >
                            {htmlToText(data.profile, {
                                wordwrap: false,
                                preserveNewlines: true,
                            }).split('\n').filter(line => line.trim() !== '') || "Experienced software engineer with over 8 years of expertise in developing scalable web applications. Passionate about clean code, performance optimization, and creating intuitive user experiences."}
                        </Text>
                    </Text>
                </View>

                <View style={{flexDirection: 'row', gap: 20, paddingRight: 20, paddingLeft: 20}}>
                    {/* Left Column */}
                    <View style={{flex: 1}}>
                        {/* Experience */}
                        <View style={{marginBottom: 10}}>
                            <Title>Experience</Title>

                            {data.experiences && data.experiences.map((experience, index) => (
                                <View key={index}
                                      style={{flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6}}>
                                    <Dot/>
                                    <View>
                                        <Text x={0} y={0} style={{fontSize: 10, fontWeight: 'bold'}}>
                                            {experience.position || "Software Engineer"}
                                        </Text>
                                        <Text x={0} y={0} style={{fontSize: 9}}>
                                            {experience.company || "Company"}
                                        </Text>
                                        <Text x={0} y={0} style={{fontSize: 9, marginTop: 2}}>
                                            {htmlToText(experience.description, {
                                                wordwrap: false,
                                                preserveNewlines: true,
                                            }).split('\n').filter(line => line.trim() !== '') || "Lead development of cloud-based enterprise solutions. Implemented CI/CD pipelines and reduced deployment time by 40%."}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Education */}
                        <View style={{marginBottom: 10}}>
                            <Title>Education</Title>

                            {data.education && data.education.map((education, index) => {
                                console.log("education: ", education);
                                return (
                                <View key={index}
                                      style={{flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6}}>
                                    <Dot/>
                                    <View>
                                        <Text x={0} y={0} style={{fontSize: 10, fontWeight: 'bold'}}>
                                            {education.field || "Computer Science"}
                                        </Text>
                                        <Text x={0} y={0} style={{fontSize: 9}}>
                                            {education.school || "State University"}
                                        </Text>
                                        <Text x={0} y={0} style={{fontSize: 9, marginTop: 2}}>
                                            {htmlToText(education.description, {
                                                wordwrap: false,
                                                preserveNewlines: true,
                                            }).split('\n').filter(line => line.trim() !== '') || "Graduated with honors. Participated in ACM programming competitions."}
                                        </Text>
                                    </View>
                                </View>
                            )})}
                        </View>

                        {data.projects?.some(project => !!project.project) && (
                            <View style={{marginBottom: 10}}>
                                <Title>Projects</Title>
                                <View style={{paddingLeft: 10}}>
                                    {data.projects.map((project, index) => (
                                        <View key={index} style={{marginBottom: 4}}>
                                            <Text x={0} y={0} style={{fontSize: 9, fontWeight: 'bold'}}>• {project.project}</Text>
                                            {(project.startDate || project.endDate) && (
                                                <Text x={0} y={0} style={{fontSize: 8}}>
                                                    {project.startDate && dayjs(project.startDate).format("MM/YYYY")} 
                                                    {project.startDate && project.endDate ? " - " : ""} 
                                                    {project.endDate && dayjs(project.endDate).format("MM/YYYY")}
                                                </Text>
                                            )}
                                            {project.description && (
                                                <Text x={0} y={0} style={{fontSize: 8, marginTop: 1, paddingLeft: 5}}>
                                                    {htmlToText(project.description, {
                                                        wordwrap: false,
                                                        preserveNewlines: true,
                                                    }).split('\n').filter(line => line.trim() !== '')}
                                                </Text>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        {data.interests?.some(interest => !!interest.interest) && (
                            <View style={{marginBottom: 10}}>
                                <Title>Hobbies</Title>
                                <View style={{paddingLeft: 10}}>
                                    {data.interests.map((interest, index) => (
                                        <Text key={index} x={0} y={0} style={{fontSize: 9}}>• {interest.interest}</Text>
                                    ))}
                                </View>
                            </View>
                        )}

                        {data.consultants?.some(consultant => !!consultant.name) && (
                            <View style={{marginBottom: 10}}>
                                <Title>References</Title>
                                <View style={{paddingLeft: 10}}>
                                    {data.consultants.map((consultant, index) => (
                                        <View key={index} style={{marginBottom: 4}}>
                                            <Text x={0} y={0} style={{fontSize: 9, fontWeight: 'bold'}}>• {consultant.name}</Text>
                                            {consultant.position && (
                                                <Text x={0} y={0} style={{fontSize: 8, paddingLeft: 5}}>{consultant.position}</Text>
                                            )}
                                            {consultant.email && (
                                                <Text x={0} y={0} style={{fontSize: 8, paddingLeft: 5}}>{consultant.email}</Text>
                                            )}
                                            {consultant.phone && (
                                                <Text x={0} y={0} style={{fontSize: 8, paddingLeft: 5}}>{consultant.phone}</Text>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        {data.additionalInfo && (
                            <View style={{marginBottom: 10}}>
                                <Title>Additional Information</Title>
                                <View style={{paddingLeft: 10}}>
                                    <Text x={0} y={0} style={{fontSize: 9}}>
                                        {htmlToText(data.additionalInfo, {
                                            wordwrap: false,
                                            preserveNewlines: true,
                                        }).split('\n').filter(line => line.trim() !== '')}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {data.certificates?.some(cert => !!cert.certificate) && (
                            <View style={{marginBottom: 10}}>
                                <Title>Certificates</Title>
                                <View style={{paddingLeft: 10}}>
                                    {data.certificates.map((cert, index) => (
                                        <View key={index} style={{marginBottom: 4}}>
                                            <Text x={0} y={0} style={{fontSize: 9, fontWeight: 'bold'}}>• {cert.certificate}</Text>
                                            {cert.date && (
                                                <Text x={0} y={0} style={{fontSize: 8}}>{dayjs(cert.date).format("MM/YYYY")}</Text>
                                            )}
                                            {cert.description && (
                                                <Text x={0} y={0} style={{fontSize: 8, paddingLeft: 5}}>
                                                    {htmlToText(cert.description, {
                                                        wordwrap: false,
                                                        preserveNewlines: true,
                                                    }).split('\n').filter(line => line.trim() !== '')}
                                                </Text>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>

                    {/* Right Column */}
                    <View style={{flex: 1}}>
                        {/* Skills 3/5*100 */}
                        <View style={{marginBottom: 10}}>
                            <Title>Skills</Title>
                            {data.skills && data.skills.map((skill, index) => (
                                <View key={index} style={{marginBottom: 4}}>
                                    <Text x={0} y={0} style={{fontSize: 9}}>{skill.name || skill.skill}</Text>
                                    <View style={{height: 5, backgroundColor: '#E5E7EB', borderRadius: 2}}>
                                        <View
                                            style={{
                                                width: `${(((skill.rate !== undefined ? skill.rate : 0) / 5) * 100)}%`,
                                                height: 5,
                                                backgroundColor: '#4F46E5',
                                                borderRadius: 2,
                                            }}
                                        />
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Languages */}
                        {data.languages?.some(lang => !!lang.language) && (
                            <View style={{marginBottom: 10}}>
                                <Title>Languages</Title>
                                {data.languages.map((lang, index) => (
                                    <View key={index}
                                          style={{flexDirection: 'row', alignItems: 'center', marginBottom: 2}}>
                                        <Text x={0} y={0} style={{fontSize: 9, flex: 1}}>{lang.language}</Text>
                                        <Text x={0} y={0} style={{fontSize: 8, marginLeft: 5, color: '#4F46E5'}}>
                                            {lang.level}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Activities */}
                        {data.activities?.some(activity => !!activity.activity) && (
                            <View style={{marginBottom: 10}}>
                                <Title>Activities</Title>
                                <View style={{paddingLeft: 10}}>
                                    {data.activities.map((activity, index) => (
                                        <View key={index} style={{marginBottom: 4}}>
                                            <Text x={0} y={0} style={{fontSize: 9, fontWeight: 'bold'}}>• {activity.activity}</Text>
                                            {(activity.startDate || activity.endDate) && (
                                                <Text x={0} y={0} style={{fontSize: 8}}>
                                                    {activity.startDate && dayjs(activity.startDate).format("MM/YYYY")} 
                                                    {activity.startDate && activity.endDate ? " - " : ""} 
                                                    {activity.endDate && dayjs(activity.endDate).format("MM/YYYY")}
                                                </Text>
                                            )}
                                            {activity.description && (
                                                <Text x={0} y={0} style={{fontSize: 8, paddingLeft: 5}}>
                                                    {htmlToText(activity.description, {
                                                        wordwrap: false,
                                                        preserveNewlines: true,
                                                    }).split('\n').filter(line => line.trim() !== '')}
                                                </Text>
                                            )}
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </Page>
        </Document>
    );
};
