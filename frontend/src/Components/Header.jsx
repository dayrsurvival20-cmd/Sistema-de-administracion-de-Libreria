import React from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom";

const Header = () => {
    const location = useLocation();
    const adminUser = localStorage.getItem("adminUser");
    const studentUser = localStorage.getItem("studentUser");
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("adminUser");
        navigate("/admin/login");
    }

    const handleStudentLogout = () => {
        localStorage.removeItem("studentUser");
        navigate("/user/login");
    }

    const isActive = (path) =>
        location.pathname === path ? "active text-primary fw-bold" : "";    

    return (
        <nav className="navbar navbar-expand-lg bg-white border-bottom shadow-sm sticky-top">
            <div className="container-fluid">
                <Link className="navbar-brand d-flex align-items-center gap-2 " to="#">
                    <span className='rounded-circle d-inline-flex align-items-center justify-content-center gap-2' style={{background:"#4f46e5", color:"white", width:"36px", height:"36px"}} >
                        <i className='fa-solid fa-book-open-reader'></i>
                    </span>
                    <span className=''>Libreria Inteligente</span>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                        {!adminUser && !studentUser && (
                        <>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive("/")}`} to="/">
                            <i className='fa-solid fa-user me-1'></i>
                            Inicio</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive("/user/login")}`} to="/user/login">
                            <i className='fa-solid fa-user me-1'></i>
                            Ingresar Usuario</Link>
                        </li>
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive("/user/signup")}`} to="/user/signup">
                            <i className='fa-solid fa-user-plus me-1'></i>
                            Registar Usuario</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="btn btn-primary" to="/admin/login">
                            <i className='fa-solid fa-shield-halved me-1'></i>
                            Ingresar Admin</Link>
                        </li>
                        </>
                        )}

                        {adminUser && (
                            <>
                                <li className="nav-item">
                                    <Link className={`nav-link ${isActive("/admin/dashboard")}`} to="/admin/dashboard">
                                        <i className='fa-solid fa-gauge-high me-1'></i>   
                                        Dashboard
                                    </Link>
                                </li>

                                <li className="nav-item dropdown">
                                    <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className='fa-solid fa-layer-group me-1'></i>   
                                        Categorias
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                            <Link className="dropdown-item" to="/admin/category_add">
                                                <i className='fa-solid fa-plus me-1'></i>   
                                                Agregar Categoria
                                            </Link>
                                        </li>

                                        <li>
                                            <Link className="dropdown-item" to="/admin/category_manager">
                                                <i className='fa-solid fa-list me-1'></i>   
                                                Administrar Categoria
                                            </Link>
                                        </li>
                                    </ul>
                                </li>

                                <li className="nav-item dropdown">
                                    <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className='fa-solid fa-layer-group me-1'></i>   
                                        Autor
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                            <Link className="dropdown-item" to="/admin/author_add">
                                                <i className='fa-solid fa-user-pen me-1'></i>   
                                                Agregar Autor
                                            </Link>
                                        </li>

                                        <li>
                                            <Link className="dropdown-item" to="/admin/author_manager">
                                                <i className='fa-solid fa-list me-1'></i>   
                                                Administrar Autor
                                            </Link>
                                        </li>
                                    </ul>
                                </li>

                                <li className="nav-item dropdown">
                                    <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i className='fa-solid fa-book me-1'></i>   
                                        Libros
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                            <Link className="dropdown-item" to="/admin/book_add">
                                                <i className='fa-solid fa-plus me-1'></i>   
                                                Agregar Libro
                                            </Link>
                                        </li>

                                        <li>
                                            <Link className="dropdown-item" to="/admin/book_manager">
                                                <i className='fa-solid fa-list me-1'></i>   
                                                Administrar Libros
                                            </Link>
                                        </li>

                                        <li>
                                            <Link className="dropdown-item" to="/admin/manage-issued-books">
                                                <i className='fa-solid fa-arrow-right-arrow-left me-1'></i>   
                                                Libros emitidos
                                            </Link>
                                        </li>
                                    </ul>
                                </li>

                                <li className="nav-item">
                                    <Link className={`nav-link ${isActive("/admin/issue-books")}`} to="/admin/issue-books">
                                        <i className='fa-solid fa-right-from-bracket me-1'></i>   
                                        Libros emitidos
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className={`nav-link ${isActive("/admin/manage_students")}`} to="/admin/manage_students">
                                        <i className='fa-solid fa-users me-1'></i>   
                                        Estudiantes
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link className={`nav-link ${isActive("/admin/dashboard")}`} to="/admin/change_password">
                                        <i className='fa-solid fa-key me-1'></i>   
                                        Cambiar Contraseña
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <button className="btn btn-outline-danger" to="/admin/dashboard" onClick={handleLogout}>
                                        <i className='fa-solid fa-right-from-bracket me-1'></i>   
                                        Cerrar Sesión
                                    </button>
                                </li>
                            </>
                        )}

                        {studentUser && (
                            <>
                                <li className='nav-item'>
                                    <Link className={`nav-link ${isActive("/user/dashboard")}`} to='/user/dashboard'>
                                        <i className='fa-solid fa-gauge me-1'></i>
                                        Dashboard
                                    </Link>
                                </li>

                                <li className='nav-item'>
                                    <Link className={`nav-link ${isActive("/user/books")}`} to='/user/books'>
                                        <i className='fa-solid fa-book-open me-1'></i>
                                        Mi libreria
                                    </Link>
                                </li>

                                <li className='nav-item'>
                                    <Link className={`nav-link ${isActive("/user/issued-books")}`} to='/user/issued-books'>
                                        <i className='fa-solid fa-receipt me-1'></i>
                                        Libros emitidos
                                    </Link>
                                </li>


                                <li className="nav-item dropdown">
                                    <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown">
                                        <i className='fa-solid fa-circle-user me-1'></i>   
                                        Mi cuenta
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li>
                                            <Link className="dropdown-item" to="/user/profile">
                                                <i className='fa-solid fa-id-badge me-1'></i>   
                                                Perfil
                                            </Link>
                                        </li>

                                        <li>
                                            <Link className="dropdown-item" to="/user/change_password">
                                                <i className='fa-solid fa-key me-1'></i>   
                                                Cambiar contraseña
                                            </Link>
                                        </li>

                                        <hr className='dropdown-divider'/>

                                        <li>
                                            <button type='button' className='dropdown-item text-danger' onClick={handleStudentLogout}>
                                                <i className='fa-solid fa-right-from-bracket me-2'></i>
                                                Cerrar sesion
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Header


