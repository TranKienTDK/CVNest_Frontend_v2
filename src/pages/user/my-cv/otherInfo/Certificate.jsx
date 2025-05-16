import {useCreateCV} from "@/pages/user/my-cv/contexts/CreateCVContext";
import {Controller, useFieldArray} from "react-hook-form";
import {cn} from "@/lib/utils";
import {ArrowUp, Trash} from "lucide-react";
import styles from "@/pages/user/my-cv/style.module.css";
import {DatePicker, Divider, Input} from "antd";
import {itemDefaultCertificate} from "@/pages/user/my-cv/contexts/defs";
import {PlusIcon} from "@heroicons/react/20/solid";
import React from "react";
import dayjs from "dayjs";

const {TextArea} = Input;

export default function Certificate() {
    const {formCreate} = useCreateCV();

    const {
        control,
        formState: {errors},
    } = formCreate;

    const {fields, append, remove, move} = useFieldArray({
        control,
        name: "certificates",
    });

    return (
        <>
            <div className={cn("flex justify-between items-center my-8")}>
                <p className="text-lg font-semibold">Chứng chỉ</p>
            </div>

            <div className={cn("bg-white p-4 rounded-md")}>
                {fields.map((item, index) => (
                    <div key={`component-certificates-${index}-${item.id}`} id={item.id} className="space-y-4">
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
                                Tên chứng chỉ {index + 1}
                            </label>
                            <div className="grow">
                                <Controller
                                    name={`certificates.${index}.certificate`}
                                    control={control}
                                    render={({field}) => (
                                        <Input
                                            {...field}
                                            rootClassName={cn(styles.formInput)}
                                            placeholder="Vui lòng nhập tên chứng chỉ"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {errors.certificates?.[index]?.certificate && (
                            <p className="text-red-500 text-sm">{errors.certificates[index].certificate.message}</p>
                        )}

                        <div className={cn(styles.formGroup)}>
                            <label className={cn(styles.formLabel)}>
                                Ngày cấp {index + 1}
                            </label>
                            <div className="grow">
                                <Controller
                                    name={`certificates.${index}.date`}
                                    control={control}
                                    render={({field}) => (
                                        <DatePicker
                                            style={{width: "100%"}}
                                            format="YYYY-MM-DD"
                                            placeholder="Chọn ngày"
                                            // Chuyển đổi giá trị date nếu là chuỗi hoặc không phải dayjs object
                                            value={field.value ? (dayjs.isDayjs(field.value) ? field.value : dayjs(field.value)) : null}
                                            onChange={(date) => field.onChange(date)}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {errors.certificates?.[index]?.date && (
                            <p className="text-red-500 text-sm">{errors.certificates[index].date.message}</p>
                        )}

                        <div className={cn(styles.formGroup)}>
                            <label className={cn(styles.formLabel)}>
                                Mô tả {index + 1}
                            </label>
                            <div className="grow">
                                <Controller
                                    name={`certificates.${index}.description`}
                                    control={control}
                                    render={({field}) => (
                                        <TextArea
                                            {...field}
                                            rows={4}
                                            autoSize={{minRows: 2, maxRows: 10}}
                                            className={cn(styles.formInput)}
                                            placeholder="Vui lòng nhập mô tả"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {errors.certificates?.[index]?.description && (
                            <p className="text-red-500 text-sm">{errors.certificates[index].description.message}</p>
                        )}

                        <Divider/>
                    </div>
                ))}

                <div className={cn("flex justify-end mt-3")}>
                    <button
                        className={cn("bg-[#a1a1a1] text-white flex justify-center items-center gap-1 py-1 px-2 hover:opacity-80 text-sm")}
                        onClick={() => append({...itemDefaultCertificate})}
                        type="button"
                    >
                        Thêm chứng chỉ khác
                        <PlusIcon className={cn("size-5")}/>
                    </button>
                </div>
            </div>
        </>
    );
}
