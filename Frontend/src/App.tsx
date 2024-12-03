import RootLayout from "./layout"
import LandingPage from "./Section/LandingPage"
import SignupForm from "./components/SignupPage"
import { Navigate, Route, Routes } from "react-router-dom"
import LoginForm from "./components/SigninPage"

import AddSchool from "./Section/School/add-school"
import AddTeacher from "./Section/School/add-teacher"
import AddStudent from "./Section/School/add-student"
import ViewStudents from "./Section/School/view-student"
import ViewTeachers from "./Section/School/view-teachers"
import Students from "./Section/Students/Students"
import Teachers from "./Section/Teacher/Teacher"
import FormBuilder from "./Section/School/form-builder"
import ViewForms from "./Section/School/view-forms"
import ViewTeacherForms from "./Section/Teacher/view-teacher-forms"
import ViewTeacherStudents from "./Section/Teacher/view-students"
import FormPage from "./Section/Teacher/submit-form"
const isAuthorized = () => {
  const token = localStorage.getItem("token")
  console.log(token)
  if (token) {
    return true
  }
  return false
}
export default function App() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <RootLayout >
        <Routes>
        <Route path="/" element = {<LandingPage />} />
          <Route path="/signup" element={<SignupForm/>} />
          <Route path="/signin" element={<LoginForm />} />
          
          <Route path="/addschool" element={isAuthorized() ?  <AddSchool/>:<Navigate to='/'/>  } />
          <Route path="/addteacher" element={isAuthorized() ? <AddTeacher/>:<Navigate to='/'/> } />
          <Route path="/addstudent" element={isAuthorized() ? <AddStudent/>:<Navigate to='/'/> } />
         <Route path="/students" element={isAuthorized() ? <Students/> : <Navigate to='/'/>} />
         <Route path="/teachers" element={isAuthorized() ? <Teachers/> : <Navigate to='/'/>} />
          <Route path="/viewteacher" element={isAuthorized() ? <ViewTeachers/>:<Navigate to='/'/> } />
          <Route path="/viewstudent" element={isAuthorized() ? <ViewStudents/>:<Navigate to='/'/> } />
          <Route path="/createform" element={isAuthorized() ? <FormBuilder/>:<Navigate to='/'/> } />
          <Route path="/viewforms" element={isAuthorized() ? <ViewForms/>:<Navigate to='/'/> } />
          <Route path="/teachers/viewforms" element={isAuthorized() ? <ViewTeacherForms/>:<Navigate to='/'/> } />
          <Route path="/teachers/viewstudent" element={isAuthorized() ? <ViewTeacherStudents/>:<Navigate to='/'/> } />
          <Route path="/teachers/submitform/:id" element={isAuthorized() ? <FormPage/>:<Navigate to='/'/> } />
      </Routes>
      </RootLayout>
    </div>
  )
}