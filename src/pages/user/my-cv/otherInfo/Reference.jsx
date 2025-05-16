import {useCreateCV} from "@/pages/user/my-cv/contexts/CreateCVContext";
import {Controller, useFieldArray} from "react-hook-form";
import {cn} from "@/lib/utils";
import {ArrowUp, Trash} from "lucide-react";
import styles from "@/pages/user/my-cv/style.module.css";
import {Divider, Input} from "antd";
import {itemDefaultReference} from "@/pages/user/my-cv/contexts/defs";
import {PlusIcon} from "@heroicons/react/20/solid";
import React from "react";

export default function Reference() {
    const {formCreate} = useCreateCV();

    const {
        control,
        formState: {errors},
    } = formCreate;

    const {fields, append, remove, move} = useFieldArray({
        control,
        name: "consultants",
    });

    return (
        <>
            <div className={cn("flex justify-between items-center my-8")}>
                <p className="text-lg font-semibold">Người tham vấn</p>
            </div>

            <div className={cn("bg-white p-4 rounded-md")}>
                {fields.map((item, index) => (
                    <div key={`component-consultants-${index}-${item.id}`} id={item.id} className="space-y-4">
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
                                Tên người tham vấn {index + 1}
                            </label>
                            <div className="grow">
                                <Controller
                                    name={`consultants.${index}.name`}
                                    control={control}
                                    render={({field}) => (
                                        <Input
                                            {...field}
                                            rootClassName={cn(styles.formInput)}
                                            placeholder="Vui lòng nhập tên người tham vấn"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {errors.consultants?.[index]?.name && (
                            <p className="text-red-500 text-sm">{errors.consultants[index].name.message}</p>
                        )}

                        <div className={cn(styles.formGroup)}>
                            <label className={cn(styles.formLabel)}>
                                Vị trí {index + 1}
                            </label>
                            <div className="grow">
                                <Controller
                                    name={`consultants.${index}.position`}
                                    control={control}
                                    render={({field}) => (
                                        <Input
                                            {...field}
                                            rootClassName={cn(styles.formInput)}
                                            placeholder="Vui lòng nhập vị trí"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {errors.consultants?.[index]?.position && (
                            <p className="text-red-500 text-sm">{errors.consultants[index].position.message}</p>
                        )}

                        <div className={cn(styles.formGroup)}>
                            <label className={cn(styles.formLabel)}>
                                Email {index + 1}
                            </label>
                            <div className="grow">
                                <Controller
                                    name={`consultants.${index}.email`}
                                    control={control}
                                    render={({field}) => (
                                        <Input
                                            {...field}
                                            rootClassName={cn(styles.formInput)}
                                            placeholder="Vui lòng nhập email"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {errors.consultants?.[index]?.email && (
                            <p className="text-red-500 text-sm">{errors.consultants[index].email.message}</p>
                        )}

                        <div className={cn(styles.formGroup)}>
                            <label className={cn(styles.formLabel)}>
                                Số điện thoại {index + 1}
                            </label>
                            <div className="grow">
                                <Controller
                                    name={`consultants.${index}.phone`}
                                    control={control}
                                    render={({field}) => (
                                        <Input
                                            {...field}
                                            rootClassName={cn(styles.formInput)}
                                            placeholder="Vui lòng nhập số điện thoại"
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        {errors.consultants?.[index]?.phone && (
                            <p className="text-red-500 text-sm">{errors.consultants[index].phone.message}</p>
                        )}

                        <Divider/>
                    </div>
                ))}

                <div className={cn("flex justify-end mt-3")}>
                    <button
                        className={cn("bg-[#a1a1a1] text-white flex justify-center items-center gap-1 py-1 px-2 hover:opacity-80 text-sm")}
                        onClick={() => append({...itemDefaultReference})}
                        type="button"
                    >
                        Thêm người tham vấn khác
                        <PlusIcon className={cn("size-5")}/>
                    </button>
                </div>
            </div>
        </>
    );
}
