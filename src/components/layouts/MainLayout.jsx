import Header from "@/components/header/Header";
import {Outlet} from "react-router-dom";
import {cn} from "@/lib/utils";

export default function MainLayout() {
    return (
        <div>
            <Header/>

            <div className={cn("mt-[var(--header-height)]")}>
                <Outlet/>
            </div>
        </div>
    )
}