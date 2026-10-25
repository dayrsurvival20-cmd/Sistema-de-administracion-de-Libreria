import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'

const ManageStudents = () => {
    const [students, setStudents] = useState([]);
    const [loadingList, setLoadingList] = useState(false);
    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
        if(!adminUser)
        {
            navigate("/admin/login");
        }
        fetchStudents();

    },[]);

    const fetchStudents = async () => 
    {
        setLoadingList(true);
        try {
            const res = await axios.get("https://sistema-de-administracion-de-libreria.onrender.com/api/admin/students");
            setStudents(res.data);
        }catch (err) {
            console.error(err); 
            toast.error("Error al cargar los estudiantes.");
        }
        finally{
            setLoadingList(false);
        }
    }
    
    const handleToogleStatus = async (students) =>{
        const isCurrentlyActive = students.is_active;
        const url = isCurrentlyActive ?  
            `https://sistema-de-administracion-de-libreria.onrender.com/api/admin/block_students/${students.id}/`:
            `https://sistema-de-administracion-de-libreria.onrender.com/api/admin/activate_students/${students.id}/`;

        const confirmMessage = isCurrentlyActive ?
            `Seguro que quieres bloquear a ${students.full_name} ?`:
            `Seguro que quieres activar a ${students.full_name} ?`;

        if(!window.confirm(confirmMessage)){
            return;
        }
        try{
            await axios.post(url);
            fetchStudents();
        }catch (err){
            console.error(err);
            toast.error("Fallo en actualizar el estado del estudiante.")
        }
    }

    return (
        <div className='py-5' style={{background:"linear-gradient(135deg, #f3f4ff, #fdfbff)", minHeight:"100vh"}}>
            <div className='container py-4'>
                <div className='row mb-4'>
                    <div className='col-md-8 mx-auto d-flex justify-content-between align-items-center'>
                        <div>
                            <h4 className='fw-bold mb-1'>
                                <i className='fa-solid fa-layer-group text-primary me-2'></i>
                                Administrar Estudiantes
                            </h4>
                            <p className='text-muted small mb-0'>
                                Ver, todos los estudiantes registrados, bloquear o activar estudiantes.
                            </p>
                        </div>
                        <button className='btn btn-primary btn-sm rounded-pill px-3'
                            onClick={() => navigate("/admin/issued_books")}>
                            Libros emitidos
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
                                            ):  students.length === 0 ? (
                                            <p className='text-muted small'>No se encuentran estudiantes registrados.</p>
                                            ):(
                                            <div className='table-responsive'>
                                                <table className='table table-striped table-hover'>
                                                    <thead className='small text-muted'>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>ID estudiante</th>
                                                            <th>Nombre del estudiante</th>
                                                            <th>Email</th>
                                                            <th>Numero de telefono</th>
                                                            <th>Fecha de registro</th>
                                                            <th>Estado</th>
                                                            <th className='text-center'>Accion</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {students.map((students, index) => (
                                                            <tr key={students.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{students.student_id}</td>
                                                                <td>{students.full_name}</td>
                                                                <td>{students.email}</td>
                                                                <td>{students.mobile}</td>
                                                                <td>{new Date(students.created_at).toLocaleDateString()}</td>
                                                                <td>{students.is_active ?
                                                                (
                                                                    <span className='badge bg-success-subtle text-success border border-success-subtle'>
                                                                        Activo
                                                                    </span>
                                                                ):
                                                                (
                                                                    <span className='badge bg-secondary-subtle text-success border border-secondary-subtle'>
                                                                        Inactivo
                                                                    </span>
                                                                )}
                                                                </td>
                                                                <td className='text-center d-flex'>
                                                                    <button className={students.is_active ? "btn btn-sm btn-outline-danger me-2" :
                                                                    "btn btn-sm btn-outline-success me-2"}
                                                                    onClick={() => handleToogleStatus(students)}>
                                                                        {students.is_active ? "Bloquear" : "Activar"}
                                                                    </button>
                                                                    <button className='btn btn-sm btn-success'
                                                                    onClick={() => navigate(`/admin/students/${students.student_id}/history`)}>
                                                                        Detalles
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

export default ManageStudents
