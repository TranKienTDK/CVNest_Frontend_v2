import {Controller, useFieldArray} from "react-hook-form";
import {cn} from "@/lib/utils.js";
import {ArrowUp, Trash} from "lucide-react";
import styles from "@/pages/user/my-cv/style.module.css";
import {DatePicker, Divider, Input} from "antd";
import {Editor} from "@tinymce/tinymce-react";
import {PlusIcon} from "@heroicons/react/20/solid/index.js";
import React from "react";
import {useCreateCV} from "@/pages/user/my-cv/contexts/CreateCVContext";
import {itemDefaultProject} from "@/pages/user/my-cv/contexts/defs";

export default function Project() {
    const {formCreate} = useCreateCV();

    const {
        control,
        formState: {errors},
    } = formCreate;

    const {fields, append, remove, move} = useFieldArray({
        control,
        name: "projects",
    });

    return (
        <>
            <div className={cn("flex justify-between items-center my-8")}>
                <p className="text-lg font-semibold">Dự án</p>
            </div>

            <div className={cn("bg-white p-4 rounded-md")}>
                {fields.map((item, index) => (
                    <div key={`component-project-${index}-${item.id}`} id={item.id} className="space-y-4">
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
                                Tên dự án {index + 1}
                            </label>
                            <div className="grow">
                                <Controller
                                    name={`projects.${index}.project`}
                                    control={control}
                                    render={({field}) => (
                                        <Input
                                            {...field}
                                            placeholder="Vui lòng nhập tên dự án"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {errors.projects?.[index]?.project && (
                            <p className="text-red-500 text-sm">{errors.projects[index].project.message}</p>
                        )}

                        <div className={cn("grid grid-cols-2 gap-4")}>
                            <div className={cn(styles.formGroup)}>
                                <label className={cn(styles.formLabel)}>
                                    Thời gian bắt đầu {index + 1}
                                </label>
                                <div className={cn("grow")}>
                                    <Controller
                                        name={`projects.${index}.startDate`}
                                        control={control}
                                        render={({field}) => (
                                            <DatePicker 
                                                {...field} 
                                                format="YYYY-MM-DD"
                                                placeholder="Chọn ngày bắt đầu"
                                                className={cn("w-full")}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            
                            <div className={cn(styles.formGroup)}>
                                <label className={cn(styles.formLabel)}>
                                    Thời gian kết thúc {index + 1}
                                </label>
                                <div className={cn("grow")}>
                                    <Controller
                                        name={`projects.${index}.endDate`}
                                        control={control}
                                        render={({field}) => (
                                            <DatePicker 
                                                {...field} 
                                                format="YYYY-MM-DD"
                                                placeholder="Chọn ngày kết thúc"
                                                className={cn("w-full")}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {errors.projects?.[index]?.startDate && (
                            <p className="text-red-500 text-sm">{errors.projects[index].startDate.message}</p>
                        )}
                        {errors.projects?.[index]?.endDate && (
                            <p className="text-red-500 text-sm">{errors.projects[index].endDate.message}</p>
                        )}

                        <div className={cn(styles.formGroup)}>
                            <label className={cn(styles.formLabel)}>
                                Giới thiệu dự án {index + 1}
                            </label>
                            <div className={cn("grow")}>
                                <Controller
                                    name={`projects.${index}.description`}
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
                        {errors.projects?.[index]?.description && (
                            <p className="text-red-500 text-sm">{errors.projects[index].description.message}</p>
                        )}

                        <Divider/>
                    </div>
                ))}

                <div className={cn("flex justify-end mt-3")}>
                    <button
                        className={cn("bg-[#a1a1a1] text-white flex justify-center items-center gap-1 py-1 px-2 hover:opacity-80 text-sm")}
                        onClick={() => append({...itemDefaultProject})} // Removed id: v4() to let backend handle new items
                        type="button"
                    >
                        Thêm dự án khác
                        <PlusIcon className={cn("size-5")}/>
                    </button>
                </div>
            </div>
        </>
    );
}
