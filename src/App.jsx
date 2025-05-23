import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Register from "./pages/auth/register/Register";
import Login from "./pages/auth/login/Login";
import ForgotPassword from "./pages/auth/forgot_password/ForgotPassword";
import VerifyForgotPassword from "./pages/auth/forgot_password/VerifyForgotPassword";
import ResetPassword from "./pages/auth/forgot_password/ResetPassword";
import CompanyPage from "./pages/company/Companypage";
import {ToastContainer} from "react-toastify";
import Homepage from "./pages/homepage/Homepage";
import JobPage from "./pages/job/JobPage";
import CompanyDetail from "./pages/company/CompanyDetail";
import CreateCVPage from "@/pages/user/my-cv/CreateCVPage.jsx";
import UpdateCVPage from "@/pages/user/my-cv/UpdateCVPage.jsx";

// import các plugin bạn dùng (chỉ dùng miễn phí)
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/table';
import 'tinymce/plugins/code';
import CVManagement from "@/pages/user/my-cv/CVManagement.jsx";
import MainLayout from "@/components/layouts/MainLayout";
import CreateNameCV from "./pages/user/my-cv/CreateNameCV";
import ViewCVDocument from "./pages/user/my-cv/ViewCVDocument";
import JobDetail from "./pages/job/JobDetail";
import ApplicationsManagement from "./pages/user/applications/ApplicationsManagement";
import HRApplicationsManagement from "./pages/hr/ApplicationsManagement";
import JobManagement from "./pages/hr/JobManagement";
import CVMatchingPage from "./pages/hr/match/CVMatchingPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/verify-code" element={<VerifyForgotPassword/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
                <Route path="/" element={<Homepage/>}/>
                <Route path="/companies" element={<CompanyPage/>}/>
                <Route path="/companies/:id" element={<CompanyDetail/>}/>
                <Route path="/jobs" element={<JobPage/>}/>
                <Route path="/jobs/:id" element={<JobDetail/>}/>

                <Route path="/user" Component={MainLayout}>
                    <Route path="my-cv">
                        <Route path="" element={<CVManagement/>}/>
                        <Route path="template" element={<CreateNameCV/>}/>
                        <Route path="create" element={<CreateCVPage/>}/>
                        <Route path="update/:id" element={<UpdateCVPage/>}/>
                        <Route path="view-document" element={<ViewCVDocument/>}/>
                    </Route>
                    <Route path="applications" element={<ApplicationsManagement />} />
                </Route>
                
                {/* HR Routes */}
                <Route path="/hr" Component={MainLayout}>
                    <Route path="applications" element={<HRApplicationsManagement />} />
                    <Route path="applications/:id" element={<HRApplicationsManagement />} />
                    <Route path="jobs" element={<JobManagement />} />
                    <Route path="jobs/:id" element={<JobManagement />} />
                    <Route path="cv-evaluate/:jobId" element={<CVMatchingPage />} />
                </Route>
                
                <Route path="/test" element={<></>}/>
            </Routes>
            <ToastContainer/>
        </Router>
    );
}

export default App
