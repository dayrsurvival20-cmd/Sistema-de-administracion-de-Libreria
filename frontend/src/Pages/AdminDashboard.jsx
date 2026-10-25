import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'

const AdminDashboard = () =>
{
    const adminUser = localStorage.getItem("adminUser");
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(!adminUser)
        {
            navigate("/admin/login");
            return;
        }
        fetchStats();
    },[]);

    const fetchStats = async () => {
        setLoading(true);
        try{
            const res = await axios.get("https://sistema-de-administracion-de-libreria.onrender.com/api/admin/stats/");
            setStats(res.data);
        }catch (error){
            toast.error("Fallo en obtener los estados del administrador.");
        }finally{
            setLoading(false);
        }
    }

    return (
        <div className='py-5' style={{background:"linear-gradient(135deg, #f3f4ff, #fdfbff)", minHeight:"100vh"}}>
            <div className='container py-4'>
                <div className='row mb-4'>
                    <div className='col-md-10 mx-auto d-flex justify-content-between align-items-center'>
                        <div className='mb-4 text-center'>
                            <h4 className='fw-bold mb-1'>
                                <i className='fa-solid fa-book text-primary'></i>
                                Panel de control del Administrador
                            </h4>
                            <p className='text-muted small'>
                                Breve resumen de las estadísticas y actividades de la biblioteca.
                            </p>
                        </div>
                        <div className='badge bg-primary-subtle text-primary py-2 px-3 rounded-pill'>
                            <i className='fa-solid fa-shield-halved'></i>
                            Panel de administrador
                        </div>
                    </div>
                    {loading && (
                        <div className='text-ccenter py-5'>
                            <div className='spinner-border text-primary' role='status'>
                                <span className='visually-hidden'>CARGANDO...</span>
                            </div>
                        </div>
                    )}
                    {!loading && stats && (
                        <>
                            <div className='row g-3 mb-4'>
                                <div className='col-md-4'>
                                    <div className='card border-0 shadow-sm rounded-4'>
                                        <div className='card-body d-flex'>
                                            <div className='me-3 d-flex align-items-center'>
                                                <span className='rounded-circle d-inline-flex align-items-center justify-content-center'
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    background: "#eef2ff",
                                                    color: "#4f46",
                                                }}>
                                                    <i className='fa-solid fa-user-graduate'></i>
                                                </span>
                                            </div>
                                            <div>
                                                <p className='text-muted text-uppercase small mb-1'>Total de estudiantes: </p>
                                                <h3 className='fw-bold mb-1'>{stats.total_students}</h3>
                                                <p className='small mb-0'>
                                                    Activos: 
                                                    <span className='text-success fw-bold'>
                                                        {stats.active_students}
                                                    </span>
                                                    &nbsp;   &nbsp;
                                                    Bloqueados: 
                                                    <span className='text-danger fw-bold'>
                                                        {stats.active_students}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-md-4'>
                                    <div className='card border-0 shadow-sm rounded-4'>
                                        <div className='card-body d-flex'>
                                            <div className='me-3 d-flex align-items-center'>
                                                <span className='rounded-circle d-inline-flex align-items-center justify-content-center'
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    background: "#eef2ff",
                                                    color: "#4f46",
                                                }}>
                                                    <i className='fa-solid fa-book-open'></i>
                                                </span>
                                            </div>
                                            <div>
                                                <p className='text-muted text-uppercase small mb-1'>Total de libros </p>
                                                <h3 className='fw-bold mb-1'>{stats.total_books}</h3>
                                                <p className='small mb-0'>
                                                    Disponibles: 
                                                    <span className='text-success fw-bold'>
                                                        {stats.available_books}
                                                    </span>
                                                    &nbsp;   &nbsp;
                                                    Agotado: 
                                                    <span className='text-danger fw-bold'>
                                                        {stats.out_of_stock_books}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-md-4'>
                                    <div className='card border-0 shadow-sm rounded-4'>
                                        <div className='card-body d-flex'>
                                            <div className='me-3 d-flex align-items-center'>
                                                <span className='rounded-circle d-inline-flex align-items-center justify-content-center'
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    background: "#eef2ff",
                                                    color: "#4f46",
                                                }}>
                                                    <i className='fa-solid fa-arrow-right-arrow-left'></i>
                                                </span>
                                            </div>
                                            <div>
                                                <p className='text-muted text-uppercase small mb-1'>Registros emitidos: </p>
                                                <h3 className='fw-bold mb-1'>{stats.total_issued}</h3>
                                                <p className='small mb-0'>
                                                    Actualmente emitidos:
                                                    <span className='text-success fw-bold'>
                                                        {stats.currently_issued}
                                                    </span>
                                                    &nbsp;   &nbsp;
                                                    Regresados:
                                                    <span className='text-danger fw-bold'>
                                                        {stats.returned_count}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                            <div className='row g-3'>
                                <div className='col-md-6'>
                                    <div className='card border-0 shadow-sm rounded-4'>
                                        <div className='card-body d-flex'>
                                            <div className='me-3 d-flex align-items-center'>
                                                <span className='rounded-circle d-inline-flex align-items-center justify-content-center'
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    background: "#eef2ff",
                                                    color: "#4f46e5",
                                                }}>
                                                    <i className='fa-solid fa-layer-group'></i>
                                                </span>
                                            </div>
                                            <div>
                                                <p className='text-muted text-uppercase small mb-1'>Categorias: </p>
                                                <h3 className='fw-bold mb-1'>{stats.total_categories}</h3>
                                                <p className='small text-muted mb-0'>
                                                    Diferentes generos y clasificaciones de libros disponibles en la libreria
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-md-6'>
                                    <div className='card border-0 shadow-sm rounded-4'>
                                        <div className='card-body d-flex'>
                                            <div className='me-3 d-flex align-items-center'>
                                                <span className='rounded-circle d-inline-flex align-items-center justify-content-center'
                                                style={{
                                                    width: "50px",
                                                    height: "50px",
                                                    background: "#eef2ff",
                                                    color: "#4f46e5",
                                                }}>
                                                    <i className='fa-solid fa-user-pen'></i>
                                                </span>
                                            </div>
                                            <div>
                                                <p className='text-muted text-uppercase small mb-1'>Autores: </p>
                                                <h3 className='fw-bold mb-1'>{stats.total_authors}</h3>
                                                <p className='small text-muted mb-0'>
                                                    Escritores y conribuidores de los libros dispobiles en la biblioteca.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
