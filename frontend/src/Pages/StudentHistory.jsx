import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {useNavigate, useParams} from 'react-router-dom'

const StudentHistory = () => {
    const {studentId} = useParams(); //Obtener el Student Id DE LOS parametros de la URL
    const [student, setStudent] = useState(null);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
        if(!adminUser)
        {
            navigate("/admin/login");
        }
        fetchHistory();
    },[]);

    const fetchHistory = async () => 
    {
        setLoading(true);
        try {
            const res = await axios.get(`http://127.0.0.1:8000/api/admin/student-history/${studentId}/`);
            setStudent(res.data.student);
            setIssues(res.data.issues);
        }catch (err) {
            console.error(err); 
            toast.error("Fallo al cargar el histolos estudiantes.");
        }
        finally{
            setLoading(false);
        }
    }
    


    return (
        <div className='py-5' style={{background:"linear-gradient(135deg, #f3f4ff, #fdfbff)", minHeight:"100vh"}}>
            <div className='container py-4'>
                <div className='row mb-4'>
                    <div className='col-md-8 mx-auto d-flex justify-content-between align-items-center'>
                        <div className='mb-4 text-center'>
                            <h4 className='fw-bold mb-1'>
                                <i className='fa-solid fa-book text-primary'></i>
                                Historial de libros emitidos.
                            </h4>
                            <p className='text-muted small'>
                                {student ? `Historial de ${student.full_name} (ID): $${student.student_id} - ${student.email}` : "Cargando detalles del estudiante..."}
                            </p>
                        </div>
                        <button className='btn btn-primary btn-sm rounded-pill px-3'
                            onClick={() => navigate("/admin/manage_students")}>
                            De vuelta a estudiante.
                        </button>
                    </div>
                </div>

                <div className='card border-0 shadow-sm rounded-4'>
                    <div className='card-body p-4'>
                        {loading ? (
                            <div className='text-center py-4 '>
                                <div className='spinner-border text-primary'>
                                </div>
                            </div>
                            ):  issues.length === 0 ? (
                            <p className='text-muted small'>No hay libros emitidos por este estudiante.</p>
                            ):(
                            <div className='table-responsive'>
                                <table className='table table-striped table-hover'>
                                    <thead className='small text-muted'>
                                        <tr>
                                            <th>#</th>
                                            <th>ID estudiante</th>
                                            <th>Nombre del estudiante</th>
                                            <th>Libro emitido</th>
                                            <th>fecha de emision</th>
                                            <th>Fecha de retorno</th>
                                            <th>Multa(COL$)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {issues.map((issues, index) => (
                                            <tr key={issues.id}>
                                                <td>{index + 1}</td>
                                                <td>{issues.student_id}</td>
                                                <td>{issues.student_name}</td>
                                                <td>{issues.book_title}</td>
                                                <td>{issues.issued_at}</td>
                                                <td>{issues.is_returned ?
                                                (
                                                    new Date(issues.returned_at).toLocaleDateString()
                                                ):
                                                (
                                                    "No regresado aun."
                                                )}
                                                </td>

                                                <td>{issues.is_returned ?
                                                (
                                                    issues.fine
                                                ):
                                                (
                                                    "No regresado aun."
                                                )}
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

export default StudentHistory
