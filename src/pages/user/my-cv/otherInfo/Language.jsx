import {useCreateCV} from "@/pages/user/my-cv/contexts/CreateCVContext";
import {Controller, useFieldArray} from "react-hook-form";
import {cn} from "@/lib/utils";
import {ArrowUp, Trash} from "lucide-react";
import styles from "@/pages/user/my-cv/style.module.css";
import {Divider, Select} from "antd";
import {itemDefaultLanguage, itemDefaultOther} from "@/pages/user/my-cv/contexts/defs";
import {PlusIcon} from "@heroicons/react/20/solid";
import React from "react";

const langList = ["English", "Japanese", "Chinese", "Korean", "French", "German"];
const levelList = ["BASIC", "INTERMEDIATE", "ADVANCED", "FLUENT", "NATIVE"];

export default function Language() {
    const {formCreate} = useCreateCV();

    const {
        control,
        formState: {errors},
    } = formCreate;

    const {fields, append, remove, move} = useFieldArray({
        control,
        name: "languages",
    });

    return (
        <>
            <div className={cn("flex justify-between items-center my-8")}>
                <p className="text-lg font-semibold">Ngoại ngữ</p>
            </div>

            <div className={cn("bg-white p-4 rounded-md")}>
                {fields.map((item, index) => (
                    <div key={`component-languages-${index}-${item.id}`} id={item.id} className="space-y-4">
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
                                Ngoại ngữ {index + 1}
                            </label>
                            <div className="grow">
                                <Controller
                                    name={`languages.${index}.language`}
                                    control={control}
                                    render={({field}) => (
                                        <Select
                                            {...field}
                                            placeholder="Chọn ngoại ngữ"
                                            className="w-full"
                                            options={langList.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {errors.languages?.[index]?.language && (
                            <p className="text-red-500 text-sm">{errors.languages[index].language.message}</p>
                        )}

                        <div className={cn(styles.formGroup)}>
                            <label className={cn(styles.formLabel)}>
                                Mức độ thông thạo {index + 1}
                            </label>
                            <div className="grow">
                                <Controller
                                    name={`languages.${index}.level`}
                                    control={control}
                                    render={({field}) => (
                                        <Select
                                            {...field}
                                            placeholder="Chọn mức độ thông thạo"
                                            className="w-full"
                                            options={levelList.map((item) => ({
                                                label: item,
                                                value: item,
                                            }))}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {errors.languages?.[index]?.level && (
                            <p className="text-red-500 text-sm">{errors.languages[index].level.message}</p>
                        )}

                        <Divider/>
                    </div>
                ))}

                <div className={cn("flex justify-end mt-3")}>
                    <button
                        className={cn("bg-[#a1a1a1] text-white flex justify-center items-center gap-1 py-1 px-2 hover:opacity-80 text-sm")}
                        onClick={() => append({...itemDefaultLanguage})} // Removed id: v4() to let backend handle new items
                        type="button"
                    >
                        Thêm thông tin khác
                        <PlusIcon className={cn("size-5")}/>
                    </button>
                </div>
            </div>
        </>
    );
}
