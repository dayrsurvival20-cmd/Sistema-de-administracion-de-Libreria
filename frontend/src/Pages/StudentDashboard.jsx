import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {Link, Navigate, useNavigate} from 'react-router-dom'

const StudentDashboard = () => {
    const [stats, setStats] = useState({
        total_books: 0,
        total_issue: 0,
        not_returned: 0,
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const studentUser = JSON.parse(localStorage.getItem("studentUser"));

    useEffect(() => {
        if(!studentUser){
            navigate("/user/login");
            return;
        }

        const fetchStats = async () => {
            try{
                setLoading(true); //api call
                const res = await axios.get("https://sistema-de-administracion-de-libreria.onrender.com/api/user_stats/", {
                    params: {student_id : studentUser.student_id}
                });
                setStats(res.data.stats);
            }catch (err){
                console.error(err);
                toast.error("Fallo en buscar las estadisticas.")
            }
            finally{
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return(
        <div className='py-5' style={{background:"linear-gradient(135deg, #f3f4ff, #fdfbff, red)", minHeight:"100vh"}}>
            <div className='container'>
                <div className='d-flex flex-wrap justify-content-between align-items-center'>
                    <div>
                        <h3 className='mb-1 d-flex align-items-center gap-2'>
                            <span className='d-inline-flex align-items-center justify-content-center rounded-3'
                            style={{width:'40px', height:'40px', background:'#0f766e1a', color:''}}>
                                <i className='fa-solid fa-user-graduate text-primary'></i>
                            </span>
                            <span>Mi panel de control de Libreria</span>
                        </h3>
                    </div>
                    <p className='mt-3'>Bienvenidos {studentUser.full_name || "Invitado"}</p>
                </div>
                {loading && (
                    <div className='text-center my-5'>
                        <div className='spinner-border text-primary' role='status'></div>
                        <span className='mt-3 text-muted'>CARGANDO...</span>
                    </div>
                )}

                {!loading && (
                    <div className='row g-4 mb-4'>
                        <div className='col-md-4'>
                            <div className='card border-0 shadow-sm h-100'>
                                <div className='card-body d-flex flex-column'>
                                    <div className='d-flex justify-content-betwenn align-items-center mb-3'>
                                        <div>
                                            <h6 className='text-uppercase text-muted mb-1 small'>Total de Libros</h6>
                                            <h3 className='mb-0'>{stats.total_books}</h3>
                                        </div>
                                        <div className='rounded-circle d-inline-flex align-items-center justify-content-center'
                                        style={{width:"48px", height:"42px", background:"#e0e7ff"}}>
                                            <i className='fa-solid fa-layer-group fa-2x text-primary'></i>
                                        </div>
                                    </div>
                                    <p className='text-muted mb-0 small'>
                                        Todos los libros actualmente disponibles en el catalogo de la libreria.
                                    </p>
                                    <div className='mt-3'>
                                        <Link to="/user/books" className='small text-primary text-decoration-none'>Ver Libros
                                        <i className='fa-solid fa-arrow-right'></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-4'>
                            <div className='card border-0 shadow-sm h-100' style={{background:'linear-gradient(135deg, #f97316, #f59e0b)', color:"white"}}>
                                <div className='card-body d-flex flex-column'>
                                    <div className='d-flex justify-content-betwenn align-items-center mb-3'>
                                        <div>
                                            <h6 className='text-uppercase text-muted mb-1 small'>Devoluciones pendientes</h6>
                                            <h3 className='mb-0'>{stats.not_returned}</h3>
                                        </div>
                                        <div className='rounded-circle d-inline-flex align-items-center justify-content-center'
                                        style={{width:"48px", height:"42px", background:"#e0e7ff"}}>
                                            <i className='fa-solid fa-layer-group fa-2x text-primary'></i>
                                        </div>
                                    </div>
                                    <p className='text-muted mb-0 small'>
                                        Libros que deberían haber sido devueltos pero que aún no lo han sido. Por favor, devuelvalos a tiempo para evitar multas.
                                    </p>
                                    <div className='mt-3'>
                                        <Link to="/user/books" className='small text-primary text-decoration-none'>Ver Libros
                                            <i className='fa-solid fa-arrow-right'></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-4'>
                            <div className='card border-0 shadow-sm h-100'>
                                <div className='card-body d-flex flex-column'>
                                    <div className='d-flex justify-content-betwenn align-items-center mb-3'>
                                        <div>
                                            <h6 className='text-uppercase text-muted mb-1 small'>Total de Libros prestados</h6>
                                            <h3 className='mb-0'>{stats.total_issue}</h3>
                                        </div>
                                        <div className='rounded-circle d-inline-flex align-items-center justify-content-center'
                                        style={{width:"48px", height:"42px", background:"#e0e7ff"}}>
                                            <i className='fa-solid fa-layer-group fa-2x text-primary'></i>
                                        </div>
                                    </div>
                                    <p className='text-muted mb-0 small'>
                                        Conteo de todos los libros prestados a ti.
                                    </p>
                                    <div className='mt-3'>
                                        <Link to="/user/books" className='small text-primary text-decoration-none'>Ver historial de prestamos
                                        <i className='fa-solid fa-arrow-right'></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StudentDashboard
