import styles from "@/pages/user/my-cv/style.module.css"
import React, {useState} from "react";
import {Controller, useFieldArray} from "react-hook-form";
import {DatePicker, Divider, Input, Radio, Space} from "antd";
import {useCreateCV} from "@/pages/user/my-cv/contexts/CreateCVContext";
import {v4} from "uuid";
import {cn} from "@/lib/utils.js";
import {PlusIcon} from "@heroicons/react/20/solid/index.js";
import {Editor} from "@tinymce/tinymce-react";
import {ArrowUp, Trash} from "lucide-react";
import dayjs from "dayjs";
import Checkbox from "antd/es/checkbox/Checkbox.js";

const blankItem = {
    company: "",
    position: "",
    startDate: null,
    endDate: null,
    isCurrent: false,
    description: "",
    usageTechnologies: "",
    projects: [],
};

export default function WorkExperienceForm() {
    const {formCreate} = useCreateCV();
    const [hasExperience, setHasExperience] = useState(true);

    const {
        control,
        register,
        watch,
        setValue,
        formState: {errors},
    } = formCreate;

    const {fields, append, remove, move} = useFieldArray({
        control,
        name: "experiences",
    });

    const handleExperienceChange = (value) => {
        setHasExperience(value);
        setValue("hasExperience", value);
        if (value) {
            append({...blankItem, id: v4()});
        } else {
            setValue("experiences", []);
        }
    };

    return (
        <>
            <div className={cn("flex justify-between items-center my-8")}>
                <p className="text-lg font-semibold">Kinh nghiệm làm việc</p>
                <div className={cn("flex")}>
                    <button
                        onClick={() => handleExperienceChange(false)}
                        className={cn(
                            "py-3 px-5 rounded-none border border-gray-500 text-black",
                            "hover:opacity-80",
                            {"bg-[#d34127] border-[#d34127] text-white": !hasExperience}
                        )}
                    >
                        Chưa có kinh nghiệm
                    </button>
                    <button
                        onClick={() => handleExperienceChange(true)}
                        className={cn(
                            "py-3 px-5 rounded-none border border-gray-500 text-black",
                            "hover:opacity-80",
                            {"bg-[#d34127] border-[#d34127] text-white": hasExperience}
                        )}
                    >
                        Đã có kinh nghiệm
                    </button>
                </div>
            </div>

            {hasExperience === false && (
                <div className="border p-4 italic text-center text-gray-600">
                    Với các bạn chưa có kinh nghiệm có thể bổ sung các dự án tại trường hoặc dự án cá nhân tại mục{" "}
                    <span className="font-semibold underline">Dự án</span>
                </div>
            )}

            {hasExperience === true && (
                <div className={cn("bg-white p-4 rounded-md")}>
                    {fields.map((item, index) => (
                        <div key={`work-exp-${index}-${item.id}`} id={item.id} className="space-y-4">
                            <div className="flex justify-end mt-2">
                                <button
                                    type="button"
                                    onClick={() => move(index, index - 1)}
                                    className="border border-gray-500 bg-gray-500 text-gray-700 px-0.5 py-1 text-sm hover:opacity-80"
                                >
                                    <ArrowUp className={cn("size-5 text-white")}/>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="border border-red-600 text-red-600 px-2 py-1 text-sm hover:bg-red-100 hover:text-red-700"
                                >
                                    <Trash className={cn("size-5")}/>
                                </button>
                            </div>

                            <div className={cn(styles.formGroup)}>
                                <label className={cn(styles.formLabel)}>
                                    Tên công ty
                                    <span
                                        className="text-red-500">(*)</span>
                                </label>
                                <div className="grow">
                                    <Controller
                                        name={`experiences.${index}.company`}
                                        control={control}
                                        render={({field}) => (
                                            <Input
                                                {...field}
                                                placeholder="Tên công ty"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            {errors.experiences?.[index]?.company && (
                                <p className="text-red-500 text-sm">{errors.experiences[index].company.message}</p>
                            )}

                            <div className={cn(styles.formGroup)}>
                                <label className={cn(styles.formLabel)}>
                                    Thời gian làm việc
                                    <span
                                        className="text-red-500">(*)</span>
                                </label>
                                <div className={cn("grow")}>
                                    <Space>
                                        <Controller
                                            name={`experiences.${index}.startDate`}
                                            control={control}
                                            render={({field}) => (
                                                <DatePicker
                                                    picker="month"
                                                    value={field.value ? dayjs(field.value) : null}
                                                    onChange={(date) => field.onChange(date)}
                                                    placeholder="Từ"
                                                />
                                            )}
                                        />
                                        <Controller
                                            name={`experiences.${index}.endDate`}
                                            control={control}
                                            render={({field}) => (
                                                <DatePicker
                                                    picker="month"
                                                    value={field.value ? dayjs(field.value) : null}
                                                    onChange={(date) => field.onChange(date)}
                                                    disabled={watch(`experiences.${index}.isCurrent`)}
                                                    placeholder="Đến"
                                                />
                                            )}
                                        />
                                        <Controller
                                            name={`experiences.${index}.isCurrent`}
                                            control={control}
                                            render={({field}) => (
                                                <Checkbox
                                                    checked={field.value}
                                                    onChange={(e) => field.onChange(e.target.checked)}
                                                >
                                                    Đang làm tại đây
                                                </Checkbox>
                                            )}
                                        />
                                    </Space>
                                </div>
                            </div>

                            <div className={cn(styles.formGroup)}>
                                <label className={cn(styles.formLabel)}>
                                    Vị trí công việc
                                    <span
                                        className="text-red-500">(*)</span>
                                </label>
                                <div className={cn("grow")}>
                                    <Controller
                                        name={`experiences.${index}.position`}
                                        control={control}
                                        render={({field}) => (
                                            <Input
                                                {...field}
                                                placeholder="Vị trí công việc"
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            {errors.experiences?.[index]?.position && (
                                <p className="text-red-500 text-sm">{errors.experiences[index].position.message}</p>
                            )}

                            <div className={cn(styles.formGroup)}>
                                <label className={cn(styles.formLabel)}>
                                    Chi tiết công việc và vai trò tại vị trí này
                                    <span
                                        className="text-red-500">(*)</span>
                                </label>
                                <div className={cn("grow")}>
                                    <Controller
                                        name={`experiences.${index}.description`}
                                        control={control}
                                        render={({field}) => (
                                            <Editor
                                                key={item.id}
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
                                        )}
                                    />
                                </div>
                            </div>
                            {errors.experiences?.[index]?.description && (
                                <p className="text-red-500 text-sm">{errors.experiences[index].description.message}</p>
                            )}

                            <div className={cn(styles.formGroup)}>
                                <label className={cn(styles.formLabel)}>
                                    Công nghệ sử dụng cho vị trí này
                                </label>
                                <div className={cn("grow")}>
                                    <Controller
                                        name={`experiences.${index}.usageTechnologies`}
                                        control={control}
                                        render={({field}) => (
                                            <Input
                                                {...field}
                                                placeholder="Công nghệ sử dụng cho vị trí"
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            {watch(`experiences.${index}.projects`)?.map((project, pIndex) => (
                                <div key={pIndex}
                                     className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-3 rounded mb-4 bg-gray-50">
                                    <div>
                                        <label className={cn(styles.formLabel)}>Tên dự án {pIndex + 1}</label>
                                        <Input
                                            placeholder="Vui lòng nhập thông tin dự án"
                                            {...register(`experiences.${index}.projects.${pIndex}.name`)}
                                        />
                                    </div>
                                    <div>
                                        <label className={cn(styles.formLabel)}>Thời gian dự án {pIndex + 1}</label>
                                        <Input
                                            placeholder="Bao nhiêu tháng, từ thời gian nào"
                                            {...register(`experiences.${index}.projects.${pIndex}.time`)}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className={cn(styles.formLabel)}>Giới thiệu dự án</label>
                                        <Input.TextArea
                                            rows={3}
                                            placeholder="Giải quyết vấn đề, bài toán gì"
                                            {...register(`experiences.${index}.projects.${pIndex}.description`)}
                                        />
                                    </div>
                                    <div className="flex justify-end md:col-span-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const current = watch(`experiences.${index}.projects`) || [];
                                                setValue(`experiences.${index}.projects`, current.filter((_, i) => i !== pIndex));
                                            }}
                                            className="border border-gray-500 px-3 py-1 text-sm hover:bg-red-100 hover:text-red-600"
                                        >
                                            Xóa dự án này 🗑️
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <div className={cn("flex justify-end")}>
                                <button
                                    type="button"
                                    className={cn("border border-gray-700 text-gray-700 flex justify-center items-center gap-1 py-2 px-3 hover:opacity-80 hover:bg-[#d34127] hover:text-white transition text-sm")}
                                    onClick={() => {
                                        const current = watch(`experiences.${index}.projects`) || [];
                                        setValue(`experiences.${index}.projects`, [
                                            ...current,
                                            {name: "", time: "", description: ""},
                                        ]);
                                    }}
                                >
                                    Thêm dự án cho vị trí này
                                    <PlusIcon className={cn("size-5")}/>
                                </button>
                            </div>

                            <Divider/>
                        </div>
                    ))}

                    <div className={cn("flex justify-end mt-3")}>
                        <button
                            className={cn("bg-[#a1a1a1] text-white flex justify-center items-center gap-1 py-1 px-2 hover:opacity-80 text-sm")}
                            onClick={() => append({...blankItem})} // Removed id: v4() to let backend handle new items
                            type="button"
                        >
                            Thêm công việc khác
                            <PlusIcon className={cn("size-5")}/>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
