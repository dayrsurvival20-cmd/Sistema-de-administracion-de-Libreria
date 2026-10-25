import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'

import Header from './Components/Header'
import AdminLogin from './Pages/AdminLogin'
import { ToastContainer } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css"
import AdminDashboard from './Pages/AdminDashboard'
import AddCategory from './Pages/AddCategory'
import ManageCategories from './Pages/ManageCategories'
import AddAuthors from './Pages/AddAuthors'
import ManageAuthors from './Pages/ManageAuthors'
import AddBook from './Pages/AddBook'
import ManageBooks from './Pages/ManageBooks'
import AdminChangePassword from './Pages/AdminChangePassword'
import UserSignUp from './Pages/UserSignUp'
import UserLogin from './Pages/UserLogin'
import StudentDashboard from './Pages/StudentDashboard'
import StudentBooks from './Pages/StudentBooks'
import StudentProfile from './Pages/StudentProfile'
import StudentChangePassword from './Pages/StudentChangePassword'
import ManageStudents from './Pages/ManageStudents'
import IssuedBook from './Pages/IssuedBook'
import ManageIssuedBooks from './Pages/ManageIssuedBooks'
import IssuedBookDetails from './Pages/IssuedBookDetails'
import StudentHistory from './Pages/StudentHistory'
import StudentIssuedBooks from './Pages/StudentIssuedBooks'

function App() {
  return (
    <>
      <Header/>
      <ToastContainer position='top-right' autoClose={2000}/>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin/>}></Route>
        <Route path="/admin/dashboard" element={<AdminDashboard/>}></Route>
        <Route path="/admin/category_add" element={<AddCategory/>}></Route>
        <Route path="/admin/category_manager" element={<ManageCategories/>}></Route>
        <Route path="/admin/author_manager" element={<ManageAuthors/>}></Route>
        <Route path="/admin/author_add" element={<AddAuthors/>}></Route>
        <Route path="/admin/book_add" element={<AddBook/>}></Route>
        <Route path="/admin/book_manager" element={<ManageBooks/>}></Route>
        <Route path="/admin/change_password" element={<AdminChangePassword/>}></Route>
        <Route path="/user/signup" element={<UserSignUp/>}></Route>
        <Route path="/user/login" element={<UserLogin/>}></Route>
        <Route path="/user/dashboard" element={<StudentDashboard/>}></Route>
        <Route path="/user/books" element={<StudentBooks/>}></Route>
        <Route path='/user/profile' element={<StudentProfile/>}></Route>
        <Route path='/user/change_password' element={<StudentChangePassword/>}></Route>
        <Route path='/admin/manage_students' element={<ManageStudents/>}></Route>
        <Route path='/admin/issue-books' element={<IssuedBook/>}></Route>
        <Route path='/admin/manage-issued-books' element={<ManageIssuedBooks/>}></Route>
        <Route path='/admin/issued-books/:id' element={<IssuedBookDetails/>}></Route>
        <Route path='/admin/students/:studentId/history' element={<StudentHistory/>}></Route>
        <Route path='/user/issued-books' element={<StudentIssuedBooks/>}></Route>
      </Routes>
    </>
  )
}

export default App
