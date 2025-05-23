import styles from "@/pages/user/my-cv/style.module.css"
import React, {useEffect} from "react";
import {Controller, useFieldArray} from "react-hook-form";
import {Checkbox, DatePicker, Divider, Input, Space} from "antd";
import {useCreateCV} from "@/pages/user/my-cv/contexts/CreateCVContext";
import {cn} from "@/lib/utils.js";
import {PlusIcon} from "@heroicons/react/20/solid/index.js";
import {Editor} from "@tinymce/tinymce-react";
import {ArrowUp, Trash} from "lucide-react";
import dayjs from "dayjs";

import {itemDefaultEducation} from "@/pages/user/my-cv/contexts/defs";

export default function EducationForm() {
    const {formCreate} = useCreateCV();

    const {
        control,
        watch,
        setValue,
        formState: {errors},
    } = formCreate;

    const {fields, append, remove, move} = useFieldArray({
        control,
        name: "educations",
    });

    useEffect(() => {
        if (fields.length > 0) {
            setValue("educations.0.isCurrent", false, {shouldValidate: false});
        }
    }, []);

    const addNewEducation = () => {
        append({
            ...itemDefaultEducation,
            isCurrent: false
        });
    };

    return (
        <>
            <div className={cn("flex justify-between items-center my-8")}>
                <p className="text-lg font-semibold">Học vấn</p>
            </div>

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
                                Tên trường cơ sở đào tạo chính quy
                                <span className="text-red-500">(*)</span>
                            </label>
                            <div className="grow">
                                <Controller
                                    name={`educations.${index}.school`}
                                    control={control}
                                    render={({field}) => (
                                        <Input
                                            {...field}
                                            placeholder="Tên trường học"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {errors.educations?.[index]?.school && (
                            <p className="text-red-500 text-sm">{errors.educations[index].school.message}</p>
                        )}

                        <div className={cn(styles.formGroup)}>
                            <label className={cn(styles.formLabel)}>
                                Thời gian học tập
                                <span className="text-red-500">(*)</span>
                            </label>
                            <div className={cn("grow")}>
                                <Space>
                                    <Controller
                                        name={`educations.${index}.startDate`}
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
                                        name={`educations.${index}.endDate`}
                                        control={control}
                                        render={({field}) => (
                                            <DatePicker
                                                picker="month"
                                                value={field.value ? dayjs(field.value) : null}
                                                onChange={(date) => field.onChange(date)}
                                                disabled={watch(`educations.${index}.isCurrent`)}
                                                placeholder="Đến"
                                            />
                                        )}
                                    />
                                    <Controller
                                        name={`educations.${index}.isCurrent`}
                                        control={control}
                                        render={({field}) => (
                                            <Checkbox
                                                checked={field.value}
                                                onChange={(e) => field.onChange(e.target.checked)}
                                            >
                                                Đang học tại đây
                                            </Checkbox>
                                        )}
                                    />
                                </Space>
                            </div>
                        </div>

                        <div className={cn(styles.formGroup)}>
                            <label className={cn(styles.formLabel)}>
                                Ngành học
                                <span className="text-red-500">(*)</span>
                            </label>
                            <div className={cn("grow")}>
                                <Controller
                                    name={`educations.${index}.field`}
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
                        {errors.educations?.[index]?.field && (
                            <p className="text-red-500 text-sm">{errors.educations[index].field.message}</p>
                        )}

                        <div className={cn(styles.formGroup)}>
                            <label className={cn(styles.formLabel)}>
                                Thông tin khác
                            </label>
                            <div className={cn("grow")}>
                                <Controller
                                    name={`educations.${index}.description`}
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
                        {errors.educations?.[index]?.description && (
                            <p className="text-red-500 text-sm">{errors.educations[index].description.message}</p>
                        )}

                        <Divider/>
                    </div>
                ))}

                <div className={cn("flex justify-end mt-3")}>
                    <button
                        className={cn("bg-[#a1a1a1] text-white flex justify-center items-center gap-1 py-1 px-2 hover:opacity-80 text-sm")}
                        onClick={addNewEducation}
                        type="button"
                    >
                        Thêm học vấn khác
                        <PlusIcon className={cn("size-5")}/>
                    </button>
                </div>
            </div>
        </>
    );
}
