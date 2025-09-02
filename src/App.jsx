import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import Register from "./pages/auth/register/Register";
import Login from "./pages/auth/login/Login";
import ForgotPassword from "./pages/auth/forgot_password/ForgotPassword";
import VerifyForgotPassword from "./pages/auth/forgot_password/VerifyForgotPassword";
import ResetPassword from "./pages/auth/forgot_password/ResetPassword";
import CompanyPage from "./pages/company/Companypage";
import {ToastContainer} from "react-toastify";
import { Toaster } from "sonner";
import UserHomepage from "./pages/homepage/UserHomepage";
import HomeRouter from "./pages/homepage/HomeRouter";
import HRHomepage from "./pages/homepage/HRHomepage";
import JobPage from "./pages/job/JobPage";
import CompanyDetail from "./pages/company/CompanyDetail";
import CreateCVPage from "@/pages/user/my-cv/CreateCVPage.jsx";
import UpdateCVPage from "@/pages/user/my-cv/UpdateCVPage.jsx";
import UserProfile from "@/pages/user/profile/UserProfile.jsx";

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
import JobApplicationsDetail from "./pages/hr/JobApplicationsDetail";
import SavedCV from "./pages/hr/saved_cv";
import RecommendedJobs from "./pages/user/recommend_jobs/RecommendedJobs";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/forgot-password" element={<ForgotPassword/>}/>
                <Route path="/verify-code" element={<VerifyForgotPassword/>}/>
                <Route path="/reset-password" element={<ResetPassword/>}/>
                <Route path="/" element={<HomeRouter/>}/>
                <Route path="/user-home" element={<UserHomepage/>}/>
                <Route path="/hr-home" element={<HRHomepage/>}/>
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
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="applications" element={<ApplicationsManagement />} />
                    <Route path="recommended-jobs" element={<RecommendedJobs />} />
                </Route>
                
                {/* HR Routes */}
                <Route path="/hr" Component={MainLayout}>
                    <Route path="applications" element={<HRApplicationsManagement />} />
                    <Route path="applications/:id" element={<HRApplicationsManagement />} />
                    <Route path="jobs" element={<JobManagement />} />
                    <Route path="jobs/:id" element={<JobManagement />} />
                    <Route path="cv-evaluate/:jobId" element={<CVMatchingPage />} />
                    <Route path="job-applications/:jobId" element={<JobApplicationsDetail />} />
                    <Route path="saved-cv" element={<SavedCV />} />
                </Route>
                
                <Route path="/test" element={<></>}/>
            </Routes>
            <ToastContainer/>
            <Toaster position="top-right" richColors />
        </Router>
    );
}

export default App
