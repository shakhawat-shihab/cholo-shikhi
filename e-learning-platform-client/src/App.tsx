import React, { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import LogIn from "./components/pages/authentication/logIn/logIn";
import Register from "./components/pages/authentication/register/register";
import ForgetPassword from "./components/pages/authentication/forgetPassword/forgetPassword";
import VerifyEmail from "./components/pages/authentication/verifyEmail/verifyEmail";
import ChangePassword from "./components/pages/authentication/changePassword/changePassword";
import NotFound from "./components/pages/notFound";
import { useDispatch, useSelector } from "react-redux";
import TeacherRoute from "./components/Routes/TeacherRoute";
import CreateCourse from "./components/pages/dashboard/teacher/createCourse/createCourse";
import Footer from "./components/organisms/footer/footer";
import "./App.css";
import Navigationbar from "./components/organisms/navigationbar/navigatiobar";
import Home from "./components/pages/home";
import StudentRoute from "./components/Routes/StudentRoute";
import AdminRoute from "./components/Routes/AdminRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from "./components/pages/dashboard/dashboard";
import DrawerSidebar from "./components/pages/dashboard/sidebar/drawerSidebar/drawerSidebar";
import Courses from "./components/pages/course/courses";
import MyProfile from "./components/pages/myProfile/myProfile";
import TeacherCourse from "./components/pages/dashboard/teacher/teacherCourse/TeacherCourse";
import CourseDetails from "./components/pages/course/courseDetails/courseDetails";
import Cart from "./components/pages/cart/cart";
import Wishlist from "./components/pages/wishlist/wishlist";
import CourseRequest from "./components/pages/dashboard/admin/courseRequest/courseRequest";
import SubscriptionRequest from "./components/pages/dashboard/admin/subscriptionRequest/subscriptionRequest";
import TeacherRegistration from "./components/pages/authentication/teacherRegistration/teacherRegistration";
import TeacherRequest from "./components/pages/dashboard/admin/teacherRequest/teacherRequest";
import AddCourseMaterial from "./components/pages/dashboard/teacher/addCourseMaterial/addCourseMaterial";
import CreateModule from "./components/pages/dashboard/teacher/addCourseMaterial/module/createModule";
import CreateContent from "./components/pages/dashboard/teacher/addCourseMaterial/content/createContent";
import CreateQuiz from "./components/pages/dashboard/teacher/addCourseMaterial/quiz/createQuiz";
import MyCourse from "./components/pages/myCourse/myCourse";
import PlayCourse from "./components/pages/playCourse/playCourse";
import CreateQuestion from "./components/pages/dashboard/teacher/addCourseMaterial/question/createQuestion";
import CreateAssignment from "./components/pages/dashboard/teacher/addCourseMaterial/assignment/createAssignment";
import AssignMarks from "./components/pages/dashboard/teacher/addCourseMaterial/assignment/assignMarks";

function App() {
  const user = useSelector((state: any) => state?.auth?.userData);
  // console.log(user);

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={1500}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        theme="light"
      />
      <BrowserRouter>
        {/* <PreNavbar /> */}
        {/* <Navbar items={items} className="custom-navbar" /> */}
        {/* <MyNavbar /> */}
        <Navigationbar />
        <DrawerSidebar
        // showDrawer={showDashboardDrawer}
        // setShowDrawer={setShowDashboardDrawer}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          <Route path="/login" element={<LogIn />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route
            path="/verify-email/:token/:authId"
            element={<VerifyEmail />}
          />
          <Route
            path="/reset-password/:token/:authId"
            element={<ChangePassword />}
          />
          <Route path="/pending/dashboard" element={<TeacherRegistration />} />

          {/* Common routes */}
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/course-detail/:courseId" element={<CourseDetails />} />

          {/* student route */}
          <Route path="/student" element={<StudentRoute />}>
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="cart" element={<Cart />} />
          </Route>
          <Route path="/" element={<StudentRoute />}>
            <Route path="/my-course" element={<MyCourse />} />
            <Route path="/my-course/:courseId" element={<PlayCourse />} />
          </Route>

          {/* teacher route */}
          <Route path="/teacher" element={<TeacherRoute />}>
            <Route path="dashboard" element={<Dashboard />}>
              <Route path="" element={<MyProfile />} />
              <Route path="my-profile" element={<MyProfile />} />
              <Route path="my-course" element={<TeacherCourse />} />
              <Route path="create-course" element={<CreateCourse />} />
              <Route
                path="manage-course/:courseId"
                element={<AddCourseMaterial />}
              />
              <Route
                path="manage-module/:courseId"
                element={<CreateModule />}
              />
              <Route
                path="manage-content/:courseId"
                element={<CreateContent />}
              />
              <Route path="manage-quiz/:courseId" element={<CreateQuiz />} />
              <Route
                path="manage-question/:quizId"
                element={<CreateQuestion />}
              />

              <Route
                path="manage-assignment-marks/:courseId"
                element={<AssignMarks />}
              />

              <Route
                path="manage-assignment/:courseId"
                element={<CreateAssignment />}
              />
            </Route>
          </Route>

          {/* admin route */}
          <Route path="/admin" element={<AdminRoute />}>
            <Route path="dashboard" element={<Dashboard />}>
              <Route path="" element={<MyProfile />} />
              <Route path="my-profile" element={<MyProfile />} />
              <Route path="teacher-request" element={<TeacherRequest />} />
              <Route path="course-request" element={<CourseRequest />} />
              <Route
                path="subscription-request"
                element={<SubscriptionRequest />}
              />
              <Route
                path="course-request/:courseId"
                element={<CourseDetails />}
              />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
