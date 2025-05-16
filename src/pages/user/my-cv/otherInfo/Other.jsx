import {useCreateCV} from "@/pages/user/my-cv/contexts/CreateCVContext";
import {Controller} from "react-hook-form";
import {cn} from "@/lib/utils";
import styles from "@/pages/user/my-cv/style.module.css";
import React from "react";
import {Editor} from "@tinymce/tinymce-react";

export default function Other() {
    const {formCreate} = useCreateCV();

    const {
        control,
        formState: {errors},
    } = formCreate;

    return (
        <>
            <div className={cn("flex justify-between items-center my-8")}>
                <p className="text-lg font-semibold">Thông tin khác</p>
            </div>

            <div className={cn("bg-white p-4 rounded-md")}>
                <div className={cn(styles.formGroup)}>
                    <label className={cn(styles.formLabel)}>
                        Thông tin bổ sung
                    </label>
                    <div className={cn("grow")}>
                        <Controller
                            name="additionalInfo"
                            control={control}
                            render={({field}) => (
                                <Editor
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
                {errors.additionalInfo && (
                    <p className="text-red-500 text-sm">{errors.additionalInfo.message}</p>
                )}
            </div>
        </>
    );
}
