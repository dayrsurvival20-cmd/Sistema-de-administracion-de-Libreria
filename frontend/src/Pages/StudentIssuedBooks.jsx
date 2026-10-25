import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from "react-toastify"
import {Link, Navigate, useNavigate} from 'react-router-dom'

const StudentIssuedBooks = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [issuedBooks, setIssuedBooks] = useState([]);

    const studentUser = JSON.parse(localStorage.getItem("studentUser"));

    useEffect(() => {
        if(!studentUser){
            navigate("/user/login");
            return;
        }

        const fetchIssuedBooks = async () => {
            try{
                setLoading(true); //api call
                const res = await axios.get("https://sistema-de-administracion-de-libreria.onrender.com/api/user_issued_books/", {
                    params: {student_id : studentUser.student_id}
                });
                setIssuedBooks(res.data);
            }catch (err){
                console.error(err);
                toast.error("Fallo en buscar los libros emitidos.")
            }
            finally{
                setLoading(false);
            }
        };
        fetchIssuedBooks();
    }, []);

    const totalIssued = issuedBooks.length; 
    const notReturnedCount = issuedBooks.filter(issue => !issue.is_returned).length;

    const totalFine = issuedBooks.reduce((sum, issue) => sum + (issue.fine || 0), 0);

    return (
        <div className='py-5' style={{background:"linear-gradient(135deg, #f3f4ff, #fdfbff, red)", minHeight:"100vh"}}>
            <div className='container'>
                <div className='d-flex flex-wrap justify-content-between align-items-center'>
                    <div>
                        <h3 className='mb-1 d-flex align-items-center gap-2'>
                            <span className='d-inline-flex align-items-center justify-content-center rounded-3'
                            style={{width:'40px', height:'40px', background:'#0f766e1a', color:''}}>
                                <i className='fa-solid fa-receipt text-primary'></i>
                            </span>
                            <span>Mis libros emitidos</span>
                        </h3>
                    </div>
                    <p className='mt-3'>Bienvenidos {studentUser.full_name || "Invitado"}</p>
                </div>
                {loading && (
                    <div className='text-center py-5'>
                        <div className='spinner-border text-primary' role='status'>
                            <span className='visually-hidden'>CARGANDO...</span>
                        </div>
                    </div>
                )}
                {!loading &&(
                    <div className='row g-3 mb-4'>
                        <div className='col-md-4 mb-3'>
                            <div className='card border-0 shadow-sm rounded-4'>
                                <div className='card-body d-flex align-items-center justify-content-between'>
                                    <div>
                                        <p className='text-muted text-uppercase small mb-1'>
                                            Total de libros emitidos.
                                        </p>
                                        <h4 className='mb-0'>{totalIssued}</h4>
                                    </div>
                                    <span className='d-inline-flex align-items-center justify-content-center rounded-circle'
                                    style={{width:"40px", height:"40px", background:"#0f766e1a"}}>
                                        <i className='fa-solid fa-book-open text-primary'></i>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-4 mb-3'>
                            <div className='card border-0 shadow-sm rounded-4'>
                                <div className='card-body d-flex align-items-center justify-content-between'>
                                    <div>
                                        <p className='text-muted text-uppercase small mb-1'>No retornados</p>
                                        <h4 className='mb-0'>{notReturnedCount}</h4>
                                    </div>
                                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        background: "#fef3c7"
                                    }}>
                                        <i className="fa-solid fa-rotate-left text-warning"></i>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className='col-md-4 mb-3'>
                            <div className='card border-0 shadow-sm rounded-4'>
                                <div className='card-body d-flex align-items-center justify-content-between'>
                                    <div>
                                        <p className='text-muted text-uppercase small mb-1'>Multa total</p>
                                        <h4 className='card-text fs-4'>COL${totalFine}</h4>
                                    </div>
                                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle"
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        background: "#fef3c7"
                                    }}>
                                        <i className="fa-solid fa-money-bill-wave text-danger"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!loading && issuedBooks.length === 0 && (
                    <div className='text-center py-5'>
                        <div className='alert alert-info'>
                            <i className='fa-solid fa-info-circle me-2'></i>
                            No hay libros emitidos
                        </div>
                    </div>
                )}

                {!loading && issuedBooks.length > 0 && (
                    <div className='table-responsive border-rounded-3'>
                        <table className='table table-hover mb-0'>
                            <thead className='table-light'>
                                <tr>
                                    <th>#</th>
                                    <th>Titulo del libro</th>
                                    <th>ISBN</th>
                                    <th>Fecha de emision</th>
                                    <th>Fecha de retorno</th>
                                    <th>Multa (COL$)</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {issuedBooks.map((issue, index) =>(
                                    <tr key={issue.id}>
                                        <td>{index + 1}</td>
                                        <td>{issue.book_title}</td>
                                        <td>
                                            <span className='badge bg-soft-secondary text-dark border border-secondary-subtle'>
                                                {issue.book_isbn}
                                            </span>
                                        </td>
                                        <td>{new Date(issue.issued_at).toLocaleString()}</td>
                                        <td>{issue.returned_at ? 
                                            new Date(issue.returned_at).toLocaleString(): 
                                            <span className='text-danger fw-bold'>No regresado aun</span>}</td>
                                        <td>{issue.fine || 0}</td>
                                        <td className={issue.is_returned === 'returned' ? 'text-success' : 'text-danger'}>
                                            {issue.is_returned ? 'Regresado' : 'No regresado'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default StudentIssuedBooks
