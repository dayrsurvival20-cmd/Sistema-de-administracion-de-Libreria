import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'

const ManageIssuedBooks = () => {
    const [issues, setIssues] = useState([]);
    const [loadingList, setLoadingList] = useState(false);
    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
        if(!adminUser)
        {
            navigate("/admin/login");
        }
        fetchIssues();

    },[]);

    const fetchIssues = async () => 
    {
        setLoadingList(true);
        try {
            const res = await axios.get("https://sistema-de-administracion-de-libreria.onrender.com/api/admin/issued-books/");
            setIssues(res.data);
        }catch (err) {
            console.error(err); 
            toast.error("No se pudieron cargar los libros emitidos.");
        }
        finally{
            setLoadingList(false);
        }
    }

    return (
        <div className='py-5' style={{background:"linear-gradient(135deg, #f3f4ff, #fdfbff)", minHeight:"100vh"}}>
            <div className='container'>
                <div className='row mb-4'>
                    <div className='col-md-8 mx-auto d-flex justify-content-between align-items-center'>
                        <div>
                            <h4 className='fw-bold mb-1'>
                                <i className='fa-solid fa-layer-group text-primary me-2'></i>
                                Administrar Libros Emitidos
                            </h4>
                            <p className='text-muted small mb-0'>
                                Ver todos los libros emitidos, su estado y retornar sus detalles.
                            </p>
                        </div>
                        <button className='btn btn-outline-primary btn-sm'
                            onClick={() => navigate("/admin/issue-books")}>
                            Emitir nuevo libro
                        </button>
                    </div>
                </div>


                                <div className='card border-0 shadow-sm rounded-4'>
                                    <div className='card-body p-4'>
                                        {loadingList ? (
                                            <div className='text-center py-4 '>
                                                <div className='spinner-border text-primary'>
                                                </div>
                                            </div>
                                            ):  issues.length === 0 ? (
                                            <p className='text-muted small'>No hay libros emitidos.</p>
                                            ):(
                                            <div className='table-responsive'>
                                                <table className='table table-striped table-hover'>
                                                    <thead className='small text-muted'>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>ID estudiante</th>
                                                            <th>Nombre del estudiante</th>
                                                            <th>Nombre del libro</th>
                                                            <th>ISBN</th>
                                                            <th>Fecha de emision</th>
                                                            <th>Fecha de retorno</th>
                                                            <th>Accion</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {issues.map((issue, index) => (
                                                            <tr key={issue.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{issue.student_id}</td>
                                                                <td>{issue.student_name}</td>
                                                                <td>{issue.book_title}</td>
                                                                <td>{issue.book_isbn}</td>
                                                                <td>{new Date(issue.issued_at).toLocaleDateString()}</td>
                                                                <td>{issue.is_returned ?
                                                                (
                                                                    new Date(issue.returned_at).toLocaleDateString()
                                                                ):
                                                                (
                                                                    <span className='badge bg-danger'>
                                                                        No devuelto
                                                                    </span>
                                                                )}
                                                                </td>
                                                                <td>
                                                                    <button className='btn btn-sm btn-outline-primary'
                                                                    onClick={() => navigate(`/admin/issued-books/${issue.id}`)}>
                                                                        <i className='fa-solid fa-pen-to-square me-1'></i>
                                                                        Detalles/Retorno
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                            )
                                        }
                                    </div>
                                </div>
            </div>
        </div>
    )
}

export default ManageIssuedBooks
