import {useCreateCV} from "@/pages/user/my-cv/contexts/CreateCVContext";
import {Controller, useFieldArray} from "react-hook-form";
import {cn} from "@/lib/utils";
import {ArrowUp, Trash} from "lucide-react";
import styles from "@/pages/user/my-cv/style.module.css";
import {Checkbox, DatePicker, Divider, Input} from "antd";
import {itemDefaultActivity} from "@/pages/user/my-cv/contexts/defs";
import {PlusIcon} from "@heroicons/react/20/solid";
import {Editor} from "@tinymce/tinymce-react";
import React from "react";
import dayjs from "dayjs";

export default function Activity() {
    const {formCreate} = useCreateCV();

    const {
        control,
        watch,
        formState: {errors},
    } = formCreate;

    const {fields, append, remove, move} = useFieldArray({
        control,
        name: "activities",
    });

    return (
        <>
            <div className={cn("flex justify-between items-center my-8")}>
                <p className="text-lg font-semibold">Hoạt động xã hội</p>
            </div>

            <div className={cn("bg-white p-4 rounded-md")}>
                {fields.map((item, index) => (
                    <div key={`component-activities-${index}-${item.id}`} id={item.id} className="space-y-4">
                        <div className="flex justify-end mt-2">
                            <button
                                type="button"
                                onClick={() => move(index, index - 1)}
                                className="border border-gray-500 bg-gray-500 text-gray-700 px-0.5 py-1 text-sm hover:opacity-80"
                                disabled={index === 0}
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
                                Tên hoạt động {index + 1}
                            </label>
                            <div className="grow">
                                <Controller
                                    name={`activities.${index}.activity`}
                                    control={control}
                                    render={({field}) => (
                                        <Input
                                            {...field}
                                            rootClassName={cn(styles.formInput)}
                                            placeholder="Vui lòng nhập tên hoạt động"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {errors.activities?.[index]?.activity && (
                            <p className="text-red-500 text-sm">{errors.activities[index].activity.message}</p>
                        )}

                        <div className={cn(styles.formGroup)}>
                            <label className={cn(styles.formLabel)}>
                                Thời gian {index + 1}
                            </label>
                            <div className={cn("flex items-center gap-4")}>
                                <Controller
                                    name={`activities.${index}.startDate`}
                                    control={control}
                                    render={({field}) => (
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            placeholder="Từ"
                                            value={field.value ? (dayjs.isDayjs(field.value) ? field.value : dayjs(field.value)) : null}
                                            onChange={(date) => field.onChange(date)}
                                        />
                                    )}
                                />
                                <Controller
                                    name={`activities.${index}.endDate`}
                                    control={control}
                                    render={({field}) => (
                                        <DatePicker
                                            format="YYYY-MM-DD"
                                            placeholder="Đến"
                                            value={field.value ? (dayjs.isDayjs(field.value) ? field.value : dayjs(field.value)) : null}
                                            onChange={(date) => field.onChange(date)}
                                            disabled={watch(`activities.${index}.isCurrent`)}
                                        />
                                    )}
                                />
                                <Controller
                                    name={`activities.${index}.isCurrent`}
                                    control={control}
                                    render={({field}) => (
                                        <Checkbox
                                            checked={field.value}
                                            onChange={(e) => {
                                                field.onChange(e.target.checked);
                                                // Clear endDate when "Currently working" is checked
                                                if (e.target.checked) {
                                                    formCreate.setValue(`activities.${index}.endDate`, null);
                                                }
                                            }}
                                        >
                                            Hiện tại
                                        </Checkbox>
                                    )}
                                />
                            </div>
                        </div>

                        <div className={cn(styles.formGroup)}>
                            <label className={cn(styles.formLabel)}>
                                Mô tả {index + 1}
                            </label>
                            <div className="grow">
                                <Controller
                                    name={`activities.${index}.description`}
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
                        {errors.activities?.[index]?.description && (
                            <p className="text-red-500 text-sm">{errors.activities[index].description.message}</p>
                        )}

                        <Divider/>
                    </div>
                ))}

                <div className={cn("flex justify-end mt-3")}>
                    <button
                        className={cn("bg-[#a1a1a1] text-white flex justify-center items-center gap-1 py-1 px-2 hover:opacity-80 text-sm")}
                        onClick={() => append({...itemDefaultActivity})}
                        type="button"
                    >
                        Thêm hoạt động khác
                        <PlusIcon className={cn("size-5")}/>
                    </button>
                </div>
            </div>
        </>
    );
}
