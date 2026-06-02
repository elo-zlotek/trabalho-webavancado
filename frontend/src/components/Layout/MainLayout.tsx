import { Outlet } from "react-router-dom";
import TopBar from "../Layout/TopBar/TopBar";

export default function MainLayout() {
    return (
        <>
            <TopBar />

            <main>
                <Outlet />
            </main>
        </>
    );
}