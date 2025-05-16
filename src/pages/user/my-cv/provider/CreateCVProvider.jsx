// src/contexts/CreateCVContext.tsx
import React, {createContext, useContext} from 'react';
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

// Tạo context
const CreateCVContext = createContext(undefined);

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
    expectedSalary: z.number().min(0),
    about: z.string().min(1, "Giới thiệu bản thân là bắt buộc"),
    hasExperience: z.boolean(),
    experiences: z.array(
        z.object({
            companyName: z.string().min(1, "Tên công ty không được để trống"),
            position: z.string().min(1, "Vị trí không được để trống"),
            from: z.any(),
            to: z.any().nullable(),
            isCurrent: z.boolean(),
            description: z.string().min(1, "Chi tiết công việc là bắt buộc"),
            techs: z.string().optional(),
            projects: z.array(
                z.object({
                    name: z.string().min(1, "Tên dự án không được để trống"),
                    time: z.string().optional(),
                    description: z.string().optional(),
                })
            ).optional(), // Thêm dòng này
        })
    ).optional(),
    skills: z
        .array(
            z.object({
                groupName: z.string().min(1, "Nhóm kỹ năng chính là bắt buộc"),
                skills: z.array(
                    z.object({
                        name: z.string().min(1, "Tên kỹ năng không được để trống"),
                        level: z.number().min(0).max(5),
                    })
                ),
            })
        )
        .optional(),
    otherSkills: z.string().optional(),
});

const defaultSkills = [
    {
        groupName: "",
        skills: [
            {name: "", level: 0, id: ""},
        ],
    },
];

// Tạo Provider
export const CreateCVProvider = ({children}) => {
    const formCreate = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            hasExperience: false,
            experiences: [{
                companyName: "",
                position: "",
                from: null,
                to: null,
                isCurrent: false,
                description: "",
                techs: "",
            }],
            skills: defaultSkills,
            otherSkills: "MongoDB, Redis",
        }
    });

    const value = {
        formCreate
    }

    return (
        <CreateCVContext.Provider value={value}>
            {children}
        </CreateCVContext.Provider>
    );
};

// Custom hook để sử dụng context
export const useCreateCV = () => {
    const context = useContext(CreateCVContext);
    if (!context) throw new Error('useCreateCV must be used within a CreateCVProvider');
    return context;
};
