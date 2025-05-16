import {Fragment} from "react";
import {useCreateCV} from "@/pages/user/my-cv/contexts/CreateCVContext";
import {listDetailInfoDefs} from "@/pages/user/my-cv/contexts/defs";

export default function DetailInfoSection() {
    const {listDetailInfo, listDetailInfoShowing} = useCreateCV();

    return listDetailInfo.map((item, index) => {
        if (!listDetailInfoShowing.includes(item)) return null;

        const Component = listDetailInfoDefs[item].component;
        return (
            <Fragment key={index}>
                <Component/>
            </Fragment>
        );
    });
}