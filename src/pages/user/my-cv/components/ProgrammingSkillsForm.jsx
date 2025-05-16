import React from "react";
import {Button, Rate, Select} from "antd";
import {Controller, useFieldArray} from "react-hook-form";
import {DeleteOutlined, PlusOutlined} from "@ant-design/icons";
import {useCreateCV} from "@/pages/user/my-cv/contexts/CreateCVContext";
import {cn} from "@/lib/utils.js";
import styles from "@/pages/user/my-cv/style.module.css";
import {ArrowUp, Trash} from "lucide-react";

const predefinedSkillList = ["React", "JavaScript", "Node.js", "Python", "TypeScript", "Java"];

export default function ProgrammingSkillsForm() {
    const {formCreate} = useCreateCV();

    const {
        control,
        formState: {errors},
    } = formCreate;
    
    const {
        fields: skills,
        append,
        remove,
        move,
    } = useFieldArray({
        control,
        name: "skills",
    });

    return (
        <div className="bg-white p-6 mb-10">
            <h3 className="text-lg font-semibold mb-4">Kỹ năng lập trình</h3>
            
            <div className="space-y-4">
                {skills.map((skill, index) => (
                    <div key={skill.id} id={skill.id} className="flex gap-4 items-center border p-4 rounded bg-gray-50">
                        <div className="flex-1">
                            <div className={cn(styles.formGroup)}>
                                <label className={cn(styles.formLabel)}>
                                    Kỹ năng <span className="text-red-500">(*)</span>
                                </label>
                                <div className="grow">
                                    <Controller
                                        key={skill.id}
                                        id={skill.id}
                                        name={`skills.${index}.skill`}
                                        control={control}
                                        render={({field}) => (
                                            <Select
                                                {...field}
                                                placeholder="Chọn kỹ năng"
                                                className="w-full"
                                                options={predefinedSkillList.map((item) => ({
                                                    label: item,
                                                    value: item,
                                                }))}
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                            {errors?.skills?.[index]?.skill && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.skills[index].skill.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-1">Đánh giá</label>
                            <Controller
                                key={`${skill.id}-rate`}
                                name={`skills.${index}.rate`}
                                control={control}
                                render={({field}) => (
                                    <Rate
                                        {...field}
                                        count={5}
                                        value={field.value}
                                        onChange={field.onChange}
                                        allowClear={false}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <button
                                type="button"
                                onClick={() => index > 0 && move(index, index - 1)}
                                className="border border-gray-500 bg-gray-500 text-gray-700 px-0.5 py-1 text-sm hover:opacity-80"
                            >
                                <ArrowUp className="size-5 text-white"/>
                            </button>
                            <button
                                type="button"
                                onClick={() => remove(index)}
                                className="border border-red-600 text-red-600 px-2 py-1 text-sm hover:bg-red-100 hover:text-red-700"
                            >
                                <Trash className="size-5"/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Button
                onClick={() => append({skill: "", rate: 0})}
                icon={<PlusOutlined/>}
                type="dashed"
                className="w-full mt-4"
            >
                Thêm kỹ năng
            </Button>
        </div>
    );
}
