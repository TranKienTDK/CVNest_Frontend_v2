import Language from "@/pages/user/my-cv/otherInfo/Language";
import Project from "@/pages/user/my-cv/components/Project";
import Hobby from "@/pages/user/my-cv/otherInfo/Hobby";
import Reference from "@/pages/user/my-cv/otherInfo/Reference";
import Activity from "@/pages/user/my-cv/otherInfo/Activity";
import Certificate from "@/pages/user/my-cv/otherInfo/Certificate";
import Other from "@/pages/user/my-cv/otherInfo/Other";

export const itemDefaultSkill = {
    name: ""
};

export const itemDefaultEducation = {
    school: "",
    startDate: null,
    endDate: null,
    field: "",
    description: ""
};

export const itemDefaultProject = {
    project: "",
    startDate: null,
    endDate: null,
    description: ""
};

export const itemDefaultHobby = {
    interest: ""
};

export const itemDefaultReference = {
    name: "",
    position: "",
    email: "",
    phone: ""
};

export const itemDefaultOther = {
    name: "",
    description: ""
};

export const itemDefaultLanguage = {
    language: "",
    level: ""
};

export const itemDefaultActivity = {
    activity: "", 
    startDate: null, 
    endDate: null,
    description: ""
};

export const itemDefaultCertificate = {
    certificate: "",
    date: null,
    description: ""
};

export const listDetailInfoDefs = {
    project: {
        label: "Dự án",
        component: Project
    },
    interest: {
        label: "Sở thích",
        component: Hobby
    },
    consultant: {
        label: "Người tham vấn",
        component: Reference
    },
    other: {
        label: "Thông tin khác",
        component: Other
    },
    language: {
        label: "Ngoại ngữ",
        component: Language
    },
    activity: {
        label: "Hoạt động",
        component: Activity
    },
    certificate: {
        label: "Chứng chỉ",
        component: Certificate
    },
}