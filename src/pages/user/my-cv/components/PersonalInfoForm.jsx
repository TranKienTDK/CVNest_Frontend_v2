import styles from "@/pages/user/my-cv/style.module.css";
import React, {useState} from "react";
import {Button, DatePicker, Input, Modal, Radio, Select, Upload,} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import {Controller} from "react-hook-form";
import {useCreateCV} from "@/pages/user/my-cv/contexts/CreateCVContext";
import {cn} from "@/lib/utils.js";
import WorkExperienceForm from "@/pages/user/my-cv/components/WorkExperienceForm.jsx";
import {v4} from "uuid";
import {Editor} from "@tinymce/tinymce-react";
import ProgrammingSkillsForm from "@/pages/user/my-cv/components/ProgrammingSkillsForm.jsx";
import EducationForm from "@/pages/user/my-cv/components/EducationForm.jsx";
import DetailInfoSection from "@/pages/user/my-cv/components/DetailInfoSection.jsx";
import dayjs from "dayjs";
import cvAPI from "@/api/cv";
import {toast} from "react-toastify";
import { useNavigate, useParams} from "react-router-dom";
import { ROUTES } from "@/routes/routes";

const {Option} = Select;
const idEditor = v4();
const isFakeData = false;

function PersonalInfoForm() {
    const navigate = useNavigate();
    const {formCreate} = useCreateCV();
    const { id } = useParams();
    const isEditMode = id && id.length > 0;
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = formCreate;

    const [openSample, setOpenSample] = useState(false);

    const handleOpenSample = () => setOpenSample(true);
    const handleCloseSample = () => setOpenSample(false);

    const onSubmit = handleSubmit(async (formData) => {
        console.log(isEditMode ? "update: " : "create: ", formData);
        
        const programmingSkillsFlat = (formData.skills || []).map((skillObj) => ({
            ...(isEditMode ? { id: skillObj.id } : {}),
            skill: skillObj.skill || "",
            rate: skillObj.rate || 0
        }));
        
        const experiencesMapped = (formData.experiences || []).map((exp) => ({
            ...(isEditMode ? { id: exp.id } : {}),
            company: exp.company || "",
            position: exp.position || "",
            startDate: exp.startDate ? dayjs(exp.startDate).format("YYYY-MM-DD") : null,
            endDate: exp.isCurrent ? null : (exp.endDate ? dayjs(exp.endDate).format("YYYY-MM-DD") : null),
            description: exp.description || "",
            usageTechnologies: exp.usageTechnologies || "",
        }));
        
        const educationsMapped = (formData.educations || []).map((edu) => ({
            ...(isEditMode ? { id: edu.id } : {}),
            school: edu.school || "",
            field: edu.field || "",
            startDate: edu.startDate ? dayjs(edu.startDate).format("YYYY-MM-DD") : null,
            endDate: edu.isCurrent ? null : (edu.endDate ? dayjs(edu.endDate).format("YYYY-MM-DD") : null),
            description: edu.description || ""
        }));
        
        const languagesMapped = (formData.languages || []).map((language) => ({
            ...(isEditMode ? { id: language.id } : {}),
            language: language.language || "",
            level: language.level || null,
        }));
        
        const projectsMapped = (formData.projects || []).map((project) => ({
            ...(isEditMode ? { id: project.id } : {}),
            project: project.project || "",
            startDate: project.startDate ? dayjs(project.startDate).format("YYYY-MM-DD") : null,
            endDate: project.endDate ? dayjs(project.endDate).format("YYYY-MM-DD") : null,
            description: project.description || "",
        }));

        console.log("projectsMapped: ", projectsMapped);
        console.log(formData.projects);
        
        const interestsMapped = (formData.interests || []).map(interest => ({
            ...(isEditMode ? { id: interest.id } : {}),
            interest: interest.interest || ""
        }));
        
        const consultantsMapped = (formData.consultants || []).map(consultant => ({
            ...(isEditMode ? { id: consultant.id } : {}),
            name: consultant.name || "",
            position: consultant.position || "",
            email: consultant.email || "",
            phone: consultant.phone || ""
        }));
        
        const activitiesMapped = (formData.activities || []).map(activity => ({
            ...(isEditMode ? { id: activity.id } : {}),
            activity: activity.activity || "",
            startDate: activity.startDate ? dayjs(activity.startDate).format("YYYY-MM-DD") : null,
            endDate: activity.isCurrent ? null : (activity.endDate ? dayjs(activity.endDate).format("YYYY-MM-DD") : null),
            description: activity.description || ""
        }));
        
        const certificatesMapped = (formData.certificates || []).map(cert => ({
            ...(isEditMode ? { id: cert.id } : {}),
            certificate: cert.certificate || "",
            date: cert.date ? dayjs(cert.date).format("YYYY-MM-DD") : null,
            description: cert.description || ""
        }));
        
        const draft = localStorage.getItem('cv_draft');
        const templateId = draft ? JSON.parse(draft).templateId : null;
        const cvName = draft ? JSON.parse(draft).name : null;
        
        const payload = {
            templateId: templateId || 1,
            profile: formData.about || "",
            cvName: cvName?.toUpperCase() || "UNTITLED CV",
            additionalInfo: formData.additionalInfo || "",
            
            info: {
                ...(isEditMode ? { id: formData.infoId } : {}),
                fullName: formData.fullname || "",
                email: formData.email || "",
                phone: formData.phone || "",
                position: formData.position || "",
                dob: formData.dob?.format("YYYY-MM-DD") || null,
                gender: formData.gender || "OTHER",
                address: formData.address || "",
                city: formData.city || "",
                avatar: formData.avatar || "",
                linkedin: formData.linkedin || "",
                github: formData.github || "",
            },
            
            experiences: experiencesMapped,
            skills: programmingSkillsFlat,
            educations: educationsMapped,
            languages: languagesMapped,
            projects: projectsMapped.length > 0 ? projectsMapped : null,
            interests: interestsMapped,
            consultants: consultantsMapped,
            activities: activitiesMapped,
            certificates: certificatesMapped,
        }
        
        if (payload.experiences?.length === 0) delete payload.experiences;
        if (payload.skills?.length === 0) delete payload.skills;
        if (payload.educations?.length === 0) delete payload.educations;
        if (payload.languages?.length === 0) delete payload.languages;
        if (payload.projects?.length === 0) delete payload.projects;
        if (payload.interests?.length === 0) delete payload.interests;
        if (payload.consultants?.length === 0) delete payload.consultants;
        if (payload.activities?.length === 0) delete payload.activities;
        if (payload.certificates?.length === 0) delete payload.certificates;
        
        console.log("Final Payload:", JSON.stringify(payload, null, 2));
        
        if (!isEditMode) {
            try {
                if (!payload.info.fullName) {
                    toast.error("Họ và tên là trường bắt buộc");
                    return;
                }
                if (!payload.info.email) {
                    toast.error("Email là trường bắt buộc");
                    return;  
                }
                if (!payload.info.phone) {
                    toast.error("Số điện thoại là trường bắt buộc");
                    return;
                }
                if (!payload.info.position) {
                    toast.error("Vị trí ứng tuyển là trường bắt buộc");
                    return;
                }
                if (!payload.profile) {
                    toast.error("Phần giới thiệu bản thân là trường bắt buộc");
                    return;
                }
                
                let response = await cvAPI.createCV(payload);
                console.log("response: ", response);
                toast.success("Tạo CV thành công!", {
                    position: "top-right",
                    autoClose: 2000,
                });
                navigate(ROUTES.CVMANAGEMENT);
            } catch (error) {
                console.error("Error:", error);
                console.error("Response data:", error.response?.data);
                toast.error("Lỗi tạo CV: " + (error.response?.data?.message || error.message), {
                    position: "top-right",
                    autoClose: 2000,
                });
            }
        } else {
            try {
                if (isFakeData) {
                    // Simulate successful update with fake data
                    console.log("Simulating CV update for ID:", id);
                    console.log("Updated data:", payload);

                    // Simulate API delay
                    setTimeout(() => {
                        toast.success("CV updated successfully! (Simulated)");
                        navigate(ROUTES.CVMANAGEMENT);
                    }, 500);
                } else {
                    // Real API call
                    await cvAPI.updateCV(id, payload);
                    toast.success("CV updated successfully!");
                    navigate(ROUTES.CVMANAGEMENT);
                }
            } catch (err) {
                console.error("Error updating CV:", err);
                toast.error("Failed to update CV. Please try again: " + (err.response?.data?.message || err.message));
            }
        }
    })

    return (
        <>
        <form onSubmit={onSubmit}>
            <div className="bg-white p-6 mb-[40px]">
                <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6">
                    <div className="md:col-span-2 grid grid-cols-1 gap-4">
                        <div className={cn(styles.formGroup)}>
                            <label className={cn(styles.formLabel)}>Họ và tên
                                <span className="text-red-500">(*)</span>
                            </label>
                            <div className="grow">
                                <Controller
                                    name="fullname"
                                    control={control}
                                    render={({field}) => (
                                        <Input {...field} rootClassName={styles.formInput}
                                               placeholder="Vui lòng nhập họ và tên"/>
                                    )}
                                />
                                {errors.fullname?.message && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.fullname?.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className={cn(styles.formGroup)}>
                            <label className={cn(styles.formLabel)}>Vị trí
                                hiện
                                tại/<br/>Vị trí ứng tuyển <span
                                    className="text-red-500">(*)</span></label>
                            <div className="grow">
                                <Controller
                                    name="position"
                                    control={control}
                                    render={({field}) => (
                                        <Input {...field} rootClassName={styles.formInput}
                                               placeholder="Vui lòng chọn vị trí ứng tuyển"/>
                                    )}
                                />
                                {errors.position?.message && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.position?.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className={cn(styles.formGroup)}>
                            <label
                                className={cn(styles.formLabel)}>Email <span
                                className="text-red-500">(*)</span></label>
                            <div className="grow">
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({field}) => (
                                        <Input {...field} rootClassName={styles.formInput}
                                               placeholder="example@gmail.com"/>
                                    )}
                                />
                                {errors.email?.message && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.email?.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className={cn(styles.formGroup)}>
                            <label className={cn(styles.formLabel)}>Điện
                                thoại <span
                                    className="text-red-500">(*)</span></label>
                            <div className="grow">
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({field}) => (
                                        <Input {...field} rootClassName={styles.formInput}
                                               placeholder="Vui lòng nhập số điện thoại"/>
                                    )}
                                />
                                {errors.phone?.message && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.phone?.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className={cn(styles.formGroup)}>
                            <label className={cn(styles.formLabel)}>Giới
                                tính</label>
                            <div className="grow">
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({field}) => (
                                        <Radio.Group {...field} className="w-full flex">
                                            <Radio.Button className={cn("h-[47px] flex justify-center items-center")}
                                                          value="MALE">
                                                Nam
                                            </Radio.Button>
                                            <Radio.Button className={cn("h-[47px] flex justify-center items-center")}
                                                          value="FEMALE">
                                                Nữ
                                            </Radio.Button>
                                            <Radio.Button className={cn("h-[47px] flex justify-center items-center")}
                                                          value="OTHER">
                                                N/A
                                            </Radio.Button>
                                        </Radio.Group>
                                    )}
                                />
                            </div>
                        </div>

                        <div className={cn(styles.formGroup)}>
                            <label className={cn(styles.formLabel)}>Ngày
                                sinh <span
                                    className="text-red-500">(*)</span></label>
                            <div className="grow">
                                <Controller
                                    name="dob"
                                    control={control}
                                    render={({field}) => (
                                        <DatePicker {...field} format="DD-MM-YYYY"
                                                    className={cn("w-full", styles.formDatePicker)}/>
                                    )}
                                />
                            </div>
                        </div>

                        <div className={cn(styles.formGroup)}>
                            <label className={cn(styles.formLabel)}>Thành
                                phố <span
                                    className="text-red-500">(*)</span></label>
                            <div className="grow">
                                <Controller
                                    name="city"
                                    control={control}
                                    render={({field}) => (
                                        <Select {...field} placeholder="Chọn thành phố"
                                                className={cn("select-dropdown-custom", styles.formSelect)}>
                                            <Option value="50">TP. Hồ Chí Minh</Option>
                                            <Option value="29">Hà Nội</Option>
                                        </Select>
                                    )}
                                />
                                {errors.city?.message && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {errors.city?.message}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center items-start">
                        <div className="w-40 h-52 border bg-gray-100 flex items-center justify-center relative">
                            <Controller
                                name="avatar"
                                control={control}
                                render={({field: {value, onChange}}) => (
                                    <Upload
                                        showUploadList={false}
                                        beforeUpload={(file) => {
                                            const reader = new FileReader();
                                            reader.onload = (e) => {
                                                onChange(e.target.result);
                                            };
                                            reader.readAsDataURL(file);
                                            return false; // Prevent auto upload
                                        }}
                                    >
                                        {value ? (
                                            <div className="w-full h-full absolute inset-0">
                                                <img
                                                    src={value}
                                                    alt="Avatar"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div
                                                    className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <button 
                                                        type="button" 
                                                        className="text-white text-sm flex flex-col items-center">
                                                        Thay đổi ảnh
                                                        <UploadOutlined className="mt-1"/>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                className="text-gray-600 hover:text-black text-sm flex flex-col items-center">
                                                Thêm ảnh
                                                <UploadOutlined className="mt-1"/>
                                            </button>
                                        )}
                                    </Upload>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className={cn("mt-4 flex flex-col gap-4")}>
                    <div className={cn(styles.formGroup)}>
                        <label className={cn(styles.formLabel)}>Địa chỉ cụ
                            thể</label>
                        <div className="grow">
                            <Controller
                                name="address"
                                control={control}
                                render={({field}) => (
                                    <Input {...field} rootClassName={styles.formInput}
                                           placeholder="Đường, Phường, Quận"/>
                                )}
                            />
                        </div>
                    </div>

                    <div className={cn(styles.formGroup)}>
                        <label
                            className={cn(styles.formLabel)}>Linkedin</label>
                        <div className="grow">
                            <Controller
                                name="linkedin"
                                control={control}
                                render={({field}) => (
                                    <Input {...field} rootClassName={styles.formInput}
                                           placeholder="https://lk.id/username"/>
                                )}
                            />
                            {errors.linkedin?.message && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.linkedin?.message}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className={cn(styles.formGroup)}>
                        <label
                            className={cn(styles.formLabel)}>Github</label>
                        <div className="grow">
                            <Controller
                                name="github"
                                control={control}
                                render={({field}) => (
                                    <Input {...field} rootClassName={styles.formInput}
                                           placeholder="https://github.com/username"/>
                                )}
                            />
                            {errors.github?.message && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.github?.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:col-span-3 grid grid-cols-12 gap-4 bg-[#f9e3df] p-4 rounded-md mb-6 items-center">
                <label className="col-span-3 font-semibold">Nhu cầu tìm việc</label>
                <div className="col-span-3">
                    <Controller
                        name="jobStatus"
                        control={control}
                        render={({field}) => (
                            <Select {...field} showSearch placeholder="Chọn nhu cầu tìm việc"
                                    className={cn("select-dropdown-custom w-full", styles.formSelect)}>
                                <Option value="Đang tìm việc">Đang tìm việc</Option>
                                <Option value="Không có nhu cầu">Không có nhu cầu</Option>
                                <Option value="Không có nhu cầu nhưng vẫn cân nhắc">
                                    Không có nhu cầu nhưng vẫn cân nhắc
                                </Option>
                            </Select>
                        )}
                    />
                    {errors.jobStatus?.message && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.jobStatus?.message}
                        </p>
                    )}
                </div>

                <label className="col-span-3 font-semibold">
                    Mức lương mong muốn tối thiểu
                </label>
                <div className="col-span-3">
                    <Controller
                        name="expectedSalary"
                        control={control}
                        render={({field}) => (
                            <Select {...field} showSearch placeholder="Chọn mức lương mong muốn"
                                    className={cn("select-dropdown-custom w-full", styles.formSelect)}>
                                <Option value="Dưới $300">Dưới $300</Option>
                                <Option value="$300 - $500">$300 - $500</Option>
                                <Option value="$500 - $700">$500 - $700</Option>
                                <Option value="$700 - $1000">$700 - $1000</Option>
                                <Option value="$1000 - $1200">$1000 - $1200</Option>
                                <Option value="$1200 - $1500">$1200 - $1500</Option>
                                <Option value="$1500 - $2000">$1500 - $2000</Option>
                                <Option value="Trên $2000">Trên $2000</Option>
                            </Select>
                        )}
                    />
                    {errors.expectedSalary?.message && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.expectedSalary?.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="md:col-span-3">
                <div className="bg-gray-100 rounded-md">
                    <div className="flex items-start justify-between mb-8">
                        <h3 className="text-lg font-semibold text-gray-700">Giới thiệu bản thân</h3>
                        <Button
                            type="button"
                            onClick={handleOpenSample}
                            className="text-blue-600 text-sm italic"
                        >
                            Click để xem thông tin mẫu
                        </Button>
                    </div>

                    <div className="grid grid-cols-12 gap-4 bg-white py-9 px-5">
                        <label className="col-span-2 font-semibold text-sm">
                            Giới thiệu bản thân <span className="text-red-500">(*)</span>
                        </label>
                        <div className="col-span-10">
                            <Controller
                                name="about"
                                control={control}
                                render={({field}) => {
                                    return (
                                        <Editor
                                            key={idEditor}
                                            value={field.value}
                                            onEditorChange={(content) => field.onChange(content)}
                                            init={{
                                                height: 300,
                                                menubar: false,
                                                plugins: [
                                                    'advlist autolink lists link charmap preview anchor',
                                                    'searchreplace visualblocks code fullscreen',
                                                    'insertdatetime table paste help wordcount'
                                                ],
                                                toolbar:
                                                    'undo redo | formatselect | bold italic underline | \
                                                    alignleft aligncenter alignright alignjustify | \
                                                    bullist numlist outdent indent | removeformat | help',
                                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                            }}
                                        />
                                    )
                                }}
                            />
                            <p className="text-red-500 text-xs mt-1">{errors.about?.message}</p>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                title="Mẫu thông tin mục giới thiệu"
                open={openSample}
                onCancel={handleCloseSample}
                footer={null}
                width={700}
            >
                <div className="bg-white border rounded px-4 py-2 text-sm space-y-2">
                    <ul className="list-disc list-inside space-y-1">
                        <li>
                            Tôi có 7 năm kinh nghiệm làm việc trong lĩnh vực phát triển phần mềm.
                        </li>
                        <li>
                            Tôi có kinh nghiệm và vững vàng về Phân mềm và Ứng dụng web sử dụng Java.
                        </li>
                        <li>
                            Tôi có thể áp dụng các khung thử nghiệm tự động hoá Selenium và Appium bằng Java.
                        </li>
                        <li>
                            Tôi có kinh nghiệm tích hợp các thử nghiệm tự động hoá và triển khai ứng dụng vào Tích hợp
                            liên tục, Jenkins.
                        </li>
                        <li>
                            Xây dựng dự án và quản lý nhóm phát triển.
                        </li>
                    </ul>
                </div>
            </Modal>

            <WorkExperienceForm/>

            <ProgrammingSkillsForm/>

            <EducationForm/>

            <DetailInfoSection/>

            <div className={cn("w-full bg-white py-2 px-2 mt-4 flex justify-end")}>
                <button 
                    type="submit"
                    className={cn(
                        "bg-[#d34127] border border-[#d34127] font-bold text-white uppercase py-4 px-10",
                        "justify-center items-center"
                    )}
                >
                    {isEditMode ? "Lưu thay đổi" : "Lưu CV"}
                </button>
            </div>
        </form>
        </>
    );
}

export default PersonalInfoForm;
