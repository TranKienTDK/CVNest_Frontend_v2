// src/contexts/CreateCVContext.tsx
import React, {useState, useEffect} from 'react';
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {v4} from "uuid";
import dayjs from "dayjs";
import {CreateCVContext} from "@/pages/user/my-cv/contexts/CreateCVContext.js";
import {
    itemDefaultActivity,
    itemDefaultCertificate,
    itemDefaultEducation,
    itemDefaultHobby,
    itemDefaultLanguage,
    itemDefaultOther,
    itemDefaultProject,
    itemDefaultReference,
    itemDefaultSkill,
    listDetailInfoDefs
} from "@/pages/user/my-cv/contexts/defs";

// Zod schema
const schema = z.object({
    fullname: z.string().min(1, "Họ và tên không được để trống"),
    position: z.string().min(1, "Vị trí ứng tuyển không được để trống"),
    email: z.string().email("Email không hợp lệ"),
    phone: z.string().min(9, "Số điện thoại không hợp lệ"),
    gender: z.string().optional(),
    dob: z.any().optional(),
    city: z.string().min(1, "Vui lòng chọn thành phố"),
    address: z.string().optional(),
    linkedin: z.string().url("URL Linkedin không hợp lệ").optional(),
    github: z.string().url("URL Github không hợp lệ").optional(),
    jobStatus: z.string().optional(),
    expectedSalary: z.any(),
    about: z.string().min(1, "Giới thiệu bản thân là bắt buộc"),
    hasExperience: z.boolean(),
    experiences: z.array(
        z.object({
            company: z.string().min(1, "Tên công ty không được để trống"),
            position: z.string().min(1, "Vị trí không được để trống"),
            startDate: z.any(),
            endDate: z.any().nullable(),
            isCurrent: z.boolean(),
            description: z.string().min(1, "Chi tiết công việc là bắt buộc"),
            usageTechnologies: z.string().optional(),
        })
    ).optional(),
    skills: z.array(
        z.object({
            skill: z.string().min(1, "Tên kỹ năng không được để trống"),
            rate: z.number().min(0).max(5),
        })
    ).optional(),
    otherSkills: z.string().optional(),
    educations: z.array((
        z.object({
            school: z.string().min(1, "Tên trường không được để trống"),
            startDate: z.any(),
            endDate: z.any().nullable(),
            isCurrent: z.boolean(),
            field: z.string().optional(),
            description: z.string().optional(),
        })
    )).optional(),
    projects: z.array(
        z.object({
            project: z.string().optional(),
            startDate: z.any().optional(),
            endDate: z.any().optional(),
            description: z.string().optional(),
        })
    ).optional(),
    interests: z.array(
        z.object({
            interest: z.string().optional(),
        })
    ).optional(),
    consultants: z.array(
        z.object({
            name: z.string().optional(),
            position: z.string().optional(),
            email: z.string().optional(),
            phone: z.string().optional(),
        })
    ).optional(),
    additionalInfo: z.string().optional(),
    others: z.array(
        z.object({
            name: z.string().optional(),
            description: z.string().optional(),
        })
    ).optional(),
    languages: z.array(
        z.object({
            language: z.string().optional(),
            level: z.string().optional(),
        })
    ).optional(),
    activities: z.array(
        z.object({
            activity: z.string().optional(),
            startDate: z.any(),
            endDate: z.any().nullable(),
            isCurrent: z.boolean().optional(),
            description: z.string().optional(),
        })
    ).optional(),
    certificates: z.array(
        z.object({
            certificate: z.string().optional(),
            date: z.any(),
            description: z.string().optional(),
        })
    ).optional()
});

// Tạo Provider
export const CreateCVProvider = ({children, initialData}) => {
    const isFirstRender = React.useRef(true);
    const [validationIssues, setValidationIssues] = useState([]);

    const formCreate = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            fullname: initialData?.personalInfo?.fullname || "",
            position: initialData?.personalInfo?.position || "",
            email: initialData?.personalInfo?.email || "",
            phone: initialData?.personalInfo?.phone || "",
            gender: initialData?.personalInfo?.gender || "",
            dob: initialData?.personalInfo?.dob ? dayjs(initialData.personalInfo.dob) : null,
            city: initialData?.personalInfo?.city || "",
            address: initialData?.personalInfo?.address || "",
            linkedin: initialData?.personalInfo?.linkedin || "",
            github: initialData?.personalInfo?.github || "",
            jobStatus: initialData?.personalInfo?.jobStatus || "",
            expectedSalary: initialData?.personalInfo?.expectedSalary || "",
            about: initialData?.introduction || "",
            hasExperience: initialData?.experiences?.length > 0 || false,
            experiences: initialData?.experiences?.length > 0 
                ? initialData.experiences.map(exp => ({
                    id: exp.id || v4(),
                    company: exp.company || "",
                    position: exp.position || "",
                    startDate: exp.startDate ? dayjs(exp.startDate) : null,
                    endDate: exp.endDate ? dayjs(exp.endDate) : null,
                    isCurrent: !exp.endDate,
                    description: exp.description || "",
                    usageTechnologies: exp.usageTechnologies || "",
                }))
                : [{
                    company: "",
                    position: "",
                    startDate: null,
                    endDate: null,
                    isCurrent: false,
                    description: "",
                    usageTechnologies: "",
                }],
            skills: initialData?.skills?.length > 0
                ? initialData.skills.map(skill => ({
                    id: skill.id || v4(),
                    skill: skill.skill || "",
                    rate: skill.rate || 0
                }))
                : [{
                    id: v4(),
                    skill: "",
                    rate: 0
                }],
            otherSkills: "MongoDB, Redis",
            educations: initialData?.education?.length > 0
                ? initialData.education.map(edu => ({
                    id: edu.id || v4(),
                    school: edu.school || "",
                    field: edu.field || edu.degree || "",
                    startDate: edu.startDate ? dayjs(edu.startDate) : null,
                    endDate: edu.endDate ? dayjs(edu.endDate) : null,
                    isCurrent: edu.endDate ? false : true,
                    description: edu.description || ""
                }))
                : [{...itemDefaultEducation, id: v4()}],
            projects: initialData?.projects?.length > 0
                ? initialData.projects.map(p => ({
                    id: p.id || v4(),
                    project: p.project || "",
                    startDate: p.startDate ? dayjs(p.startDate) : null,
                    endDate: p.endDate ? dayjs(p.endDate) : null,
                    description: p.description || ""
                }))
                : [],
              
            interests: initialData?.hobbies?.length > 0
                ? initialData.hobbies.map(h => ({
                    id: h.id || v4(),
                    interest: h.interest || h.name || ""
                }))
                : [],
              
            consultants: (initialData?.consultants?.length > 0) 
                ? initialData.consultants.map(c => ({
                    id: c.id || v4(),
                    name: c.name || "",
                    position: c.position || "",
                    email: c.email || "",
                    phone: c.phone || ""
                }))
                : (initialData?.references?.length > 0)
                    ? initialData.references.map(r => ({
                        id: r.id || v4(),
                        name: r.name || "",
                        position: r.position || "",
                        email: r.email || "",
                        phone: r.phone || ""
                    }))
                    : [{ ...itemDefaultReference, id: v4() }],
            
            // Thêm trường additionalInfo mới
            additionalInfo: initialData?.additionalInfo || "",
              
            others: initialData?.others?.length > 0
                ? initialData.others.map(o => ({
                    id: o.id || v4(),
                    name: o.name || "",
                    description: o.description || ""
                }))
                : [{ ...itemDefaultOther, id: v4() }],
              
            languages: initialData?.languages?.length > 0
                ? initialData.languages.map(l => ({
                    id: l.id || v4(),
                    language: l.language || "",
                    level: l.level || ""
                }))
                : [{ ...itemDefaultLanguage, id: v4() }],
              
            activities: initialData?.activities?.length > 0
                ? initialData.activities.map(a => ({
                    id: a.id || v4(),
                    activity: a.activity || a.name || "", // Hỗ trợ cả activity và name
                    startDate: a.startDate || a.from ? dayjs(a.startDate || a.from) : null, // Hỗ trợ cả startDate và from
                    endDate: a.endDate || a.to ? dayjs(a.endDate || a.to) : null, // Hỗ trợ cả endDate và to
                    isCurrent: !a.endDate && !a.to,
                    description: a.description || ""
                }))
                : [{ ...itemDefaultActivity, id: v4() }],
              
            certificates: initialData?.certificates?.length > 0
                ? initialData.certificates.map(c => ({
                    id: c.id || v4(),
                    certificate: c.certificate || c.name || "", // Hỗ trợ cả certificate và name
                    date: c.date || c.time ? dayjs(c.date || c.time) : null, // Hỗ trợ cả date và time
                    description: c.description || ""
                }))
                : [{ ...itemDefaultCertificate, id: v4() }],
              
        }
    });

    // Convert and get key of listDetailInfo for default value state result is ["language", "project", "hobby", "reference", "activity", "certificate", "other"]
    const [listDetailInfo, setListDetailInfo] = useState(Object.keys(listDetailInfoDefs));
    
    // Khởi tạo listDetailInfoShowing dựa trên dữ liệu có sẵn trong initialData
    const initialShowingItems = React.useMemo(() => {
        if (!initialData) return [];
        
        const showingItems = [];
        
        // Kiểm tra từng loại thông tin, nếu có dữ liệu thì hiển thị section tương ứng
        if (initialData.projects && initialData.projects.length > 0 && initialData.projects.some(p => p.project || p.description)) {
            showingItems.push('project');
        }
        
        if (initialData.activities && initialData.activities.length > 0 && initialData.activities.some(a => a.activity || a.description)) {
            showingItems.push('activity');
        }
        
        if (initialData.certificates && initialData.certificates.length > 0 && initialData.certificates.some(c => c.certificate || c.description)) {
            showingItems.push('certificate');
        }
        
        if (initialData.languages && initialData.languages.length > 0 && initialData.languages.some(l => l.language)) {
            showingItems.push('language');
        }
        
        if (initialData.others && initialData.others.length > 0 && initialData.others.some(o => o.name)) {
            showingItems.push('other');
        }
        
        // Thay đổi từ references sang consultants
        if ((initialData.consultants && initialData.consultants.length > 0 && initialData.consultants.some(r => r.name)) ||
            (initialData.references && initialData.references.length > 0 && initialData.references.some(r => r.name))) {
            showingItems.push('consultant');
        }
        
        if ((initialData.interests && initialData.interests.length > 0 && initialData.interests.some(h => h.interest)) ||
            (initialData.hobbies && initialData.hobbies.length > 0 && initialData.hobbies.some(h => h.name))) {
            showingItems.push('interest');
        }
        
        return showingItems;
    }, [initialData]);
    
    const [listDetailInfoShowing, setListDetailInfoShowing] = useState(initialShowingItems);

    // Monitor form errors and update validationIssues state
    useEffect(() => {
        const subscription = formCreate.watch(() => {
            // Get current errors
            const currentErrors = formCreate.formState.errors;
            
            // If there are errors, log them to console and update state
            if (Object.keys(currentErrors).length > 0) {
                const errorList = [];
                
                // Convert the nested error object to a flat array for easier display
                const processErrors = (errors, path = '') => {
                    Object.entries(errors).forEach(([key, value]) => {
                        const currentPath = path ? `${path}.${key}` : key;
                        
                        if (value.message) {
                            errorList.push({
                                path: currentPath,
                                message: value.message
                            });
                        }
                        
                        // Handle array errors
                        if (value.type === "array" && value.message) {
                            errorList.push({
                                path: currentPath,
                                message: value.message
                            });
                        }
                        
                        // Handle nested objects and arrays with errors
                        if (typeof value === 'object' && !value.message) {
                            if (Array.isArray(value)) {
                                value.forEach((item, index) => {
                                    if (item && typeof item === 'object') {
                                        processErrors(item, `${currentPath}[${index}]`);
                                    }
                                });
                            } else {
                                processErrors(value, currentPath);
                            }
                        }
                    });
                };
                
                processErrors(currentErrors);
                
                // Log validation issues to console
                console.log("Schema Validation Issues:", errorList);
                setValidationIssues(errorList);
            } else {
                setValidationIssues([]);
            }
        });
        
        // Cleanup subscription
        return () => subscription.unsubscribe();
    }, [formCreate]);

    // Update form values when initialData changes (for update CV scenario)
    useEffect(() => {
        // Skip the first render as the form is already initialized with defaultValues
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Only update if initialData is provided
        if (initialData) {
            // Reset form with new values
            formCreate.reset({
                fullname: initialData?.personalInfo?.fullname || "",
                position: initialData?.personalInfo?.position || "",
                email: initialData?.personalInfo?.email || "",
                phone: initialData?.personalInfo?.phone || "",
                gender: initialData?.personalInfo?.gender || "",
                dob: initialData?.personalInfo?.dob ? dayjs(initialData.personalInfo.dob) : null,
                city: initialData?.personalInfo?.city || "",
                address: initialData?.personalInfo?.address || "",
                linkedin: initialData?.personalInfo?.linkedin || "",
                github: initialData?.personalInfo?.github || "",
                jobStatus: initialData?.personalInfo?.jobStatus || "",
                expectedSalary: initialData?.personalInfo?.expectedSalary || "",
                about: initialData?.introduction || "",
                hasExperience: initialData?.experiences?.length > 0 || false,
                experiences: initialData?.experiences?.length > 0 
                    ? initialData.experiences.map(exp => ({
                        id: exp.id || v4(),
                        company: exp.company || "", // Đã đổi từ companyName sang company để khớp với backend
                        position: exp.position || "",
                        startDate: exp.startDate ? dayjs(exp.startDate) : null,
                        endDate: exp.endDate ? dayjs(exp.endDate) : null,
                        isCurrent: !exp.endDate,
                        description: exp.description || "",
                        usageTechnologies: exp.usageTechnologies || "",
                    }))
                    : [{
                        company: "", // Đã đổi từ companyName sang company
                        position: "",
                        startDate: null,
                        endDate: null,
                        isCurrent: false,
                        description: "",
                        usageTechnologies: "",
                    }],
                skills: initialData?.skills?.length > 0
                    ? initialData.skills.map(skill => ({
                        id: skill.id || v4(),
                        skill: skill.skill || "",
                        rate: skill.rate || 0
                    }))
                    : [{
                        id: v4(),
                        skill: "",
                        rate: 0
                    }],
                educations: initialData?.education?.length > 0
                    ? initialData.education.map(edu => ({
                        id: edu.id || v4(),
                        school: edu.school || "",
                        field: edu.field || edu.degree || "",
                        startDate: edu.startDate ? dayjs(edu.startDate) : null,
                        endDate: edu.endDate ? dayjs(edu.endDate) : null,
                        isCurrent: edu.endDate ? false : true,
                        description: edu.description || ""
                    }))
                    : [{...itemDefaultEducation, id: v4()}],
                projects: initialData?.projects?.length > 0
                    ? initialData.projects.map(p => ({
                        id: p.id || v4(),
                        project: p.project || "",
                        startDate: p.startDate ? dayjs(p.startDate) : null,
                        endDate: p.endDate ? dayjs(p.endDate) : null,
                        description: p.description || ""
                    }))
                    : [{ ...itemDefaultProject, id: v4() }],
                  
                interests: initialData?.hobbies?.length > 0
                    ? initialData.hobbies.map(h => ({
                        id: h.id || v4(),
                        interest: h.interest || h.name || ""
                    }))
                    : [{ ...itemDefaultHobby, id: v4() }],
                  
                consultants: (initialData?.consultants?.length > 0) 
                    ? initialData.consultants.map(c => ({
                        id: c.id || v4(),
                        name: c.name || "",
                        position: c.position || "",
                        email: c.email || "",
                        phone: c.phone || ""
                    }))
                    : (initialData?.references?.length > 0)
                        ? initialData.references.map(r => ({
                            id: r.id || v4(),
                            name: r.name || "",
                            position: r.position || "",
                            email: r.email || "",
                            phone: r.phone || ""
                        }))
                        : [{ ...itemDefaultReference, id: v4() }],
                
                // Thêm trường additionalInfo mới
                additionalInfo: initialData?.additionalInfo || "",
                  
                others: initialData?.others?.length > 0
                    ? initialData.others.map(o => ({
                        id: o.id || v4(),
                        name: o.name || "",
                        description: o.description || ""
                    }))
                    : [{ ...itemDefaultOther, id: v4() }],
                  
                languages: initialData?.languages?.length > 0
                    ? initialData.languages.map(l => ({
                        id: l.id || v4(),
                        language: l.language || "",
                        level: l.level || ""
                    }))
                    : [{ ...itemDefaultLanguage, id: v4() }],
                  
                activities: initialData?.activities?.length > 0
                    ? initialData.activities.map(a => ({
                        id: a.id || v4(),
                        activity: a.activity || a.name || "", // Hỗ trợ cả activity và name
                        startDate: a.startDate || a.from ? dayjs(a.startDate || a.from) : null, // Hỗ trợ cả startDate và from
                        endDate: a.endDate || a.to ? dayjs(a.endDate || a.to) : null, // Hỗ trợ cả endDate và to
                        isCurrent: !a.endDate && !a.to,
                        description: a.description || ""
                    }))
                    : [{ ...itemDefaultActivity, id: v4() }],
                  
                certificates: initialData?.certificates?.length > 0
                    ? initialData.certificates.map(c => ({
                        id: c.id || v4(),
                        certificate: c.certificate || c.name || "", // Hỗ trợ cả certificate và name
                        date: c.date || c.time ? dayjs(c.date || c.time) : null, // Hỗ trợ cả date và time
                        description: c.description || ""
                    }))
                    : [{ ...itemDefaultCertificate, id: v4() }],
                  
            });
        }
    }, [initialData, formCreate]);

    const value = {
        formCreate,
        validationIssues,
        listDetailInfo, setListDetailInfo,
        listDetailInfoShowing, setListDetailInfoShowing
    }

    return (
        <CreateCVContext.Provider value={value}>
            {children}
        </CreateCVContext.Provider>
    );
};
