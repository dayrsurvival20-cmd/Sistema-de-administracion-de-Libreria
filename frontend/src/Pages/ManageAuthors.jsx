import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'

const ManageAuthors = () => {
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [authors, setAuthors] = useState([]);
    const [loadingList, setLoadingList] = useState(false);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
        if(!adminUser)
        {
            navigate("/admin/login");
        }
        else
        {
            fetchAuthors();
        }

    }, [adminUser, navigate]);

    const fetchAuthors = async () => 
    {
        setLoadingList(true);
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/authors/");
            setAuthors(res.data);
        }catch (err) {
            console.error(err); 
            toast.error("Error al obtener los autores");
        }
        finally{
            setLoadingList(false);
        }
    }

    const startEdit = (author) => {
        setEditId(author.id);
        setEditName(author.name);
    }

    const cancelEdit = () => {
        setEditId(null);
        setEditName("");
    }

    const handleUpdate = async(e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await axios.put(`http://127.0.0.1:8000/api/update_author/${editId}/`, {name:editName});
            if(res.data.success)
            {
                toast.success(res.data.message || "Autor actualizado")
                cancelEdit();
                fetchAuthors();
            }
            else
            {
                toast.error(res.data.message || "Actualizacion fallida")
            }
        }
        catch (err) {
            console.error(err);
            toast.error("Algo salio mal");
        }
        finally
        {
            setSaving(false)
        }
    }

    const handleDelete = async(id) => {
        const ok = window.confirm("¿Estas seguro de eliminar este autor?");
        if(!ok) return;
        try {
            const res = await axios.delete(`http://127.0.0.1:8000/api/delete_author/${id}/`);
            if(res.data.success)
            {
                toast.success(res.data.message || "Autor eliminado")
                setAuthors((prev) => prev.filter((a) => a.id !== id));
            }
            else
            {
                toast.error(res.data.message || "Eliminación fallida")
            }
        }
        catch (err) {
            console.error(err);
            toast.error("Algo salio mal");
        }
        finally
        {
            setSaving(false)
        }
    }

    return (
        <div className='py-5' style={{background:"linear-gradient(135deg, #f3f4ff, #fdfbff, red)", minHeight:"100vh"}}>
            <div className='container py-4'>
                <div className='row mb-4'>
                    <div className='col-md-8 mx-auto d-flex justify-content-between align-items-center'>
                        <div>
                            <h4 className='fw-bold mb-1'>
                                <i className='fa-solid fa-layer-group text-primary me-2'></i>
                                Administrar Autores
                            </h4>
                            <p className='text-muted small mb-0'>
                                Ver, editar y eliminar autores de la libreria.
                            </p>
                        </div>
                        <button className='btn btn-primary btn-sm rounded-pill px-3'
                            onClick={() => navigate("/admin/author_add")}>
                            <i className='fa-solid fa-plus me-1'></i>
                            Agregar nuevo autor
                            <i className='fa-solid fa-plus me-1'></i>
                        </button>
                    </div>
                </div>

                        <div className='row g-4'>
                            <div className='col-md-5'>
                                <div className='card border-0 shadow-sm rounded-4'>
                            <div className='card-body p-4'>
                                <h6 className='fw-bold mb-3'>{editId ? "Editar autor" : "Selecciona autor a editar"}</h6>
                                {editId ? (
                                    <form onSubmit={handleUpdate}>
                                    <div className='mb-3'>
                                        <label className='form-label small fw-medium'>Nombre del autor</label>
                                        <input type='text' className='form-control' placeholder='Ej: J.R.R Tolkien, Frank Helbert, Isaac Asimov, etc' value={editName} onChange={(e)=>setEditName(e.target.value)}/>
                                    </div>

                                    <button type='submit' className='btn btn-primary w-100' disabled={saving}>
                                        {saving ? (
                                            <>
                                                <span className='spinner-border spinner-border-sm me-2'></span>ACTUALIZANDO...
                                            </>
                                        ): (
                                            <>
                                                <i className='fa-solid fa-plus'></i>ACTUALIZADO
                                            </>
                                        )}
                                        
                                    </button>
                                </form>
                                    ): (
                                        <p className='text-muted small'>Presiona <strong>Editar</strong> para modificar un autor.</p>
                                    )
                                } 
                            </div>
                        </div>
                            </div>

                            <div className='col-md-8'>
                                <div className='card shadow-sm rounded-4'>
                                    <div className='card-body'>
                                        <h6 className='f2-semibold mb-3'>Mostrando autores</h6>
                                        {loadingList ? (
                                            <div className='text-center py-4 '>
                                                <span className='spinner-border text-primary me-2'></span> 
                                                Cargando...
                                            </div>
                                            ):  authors.length === 0 ? (
                                            <p className='text-muted small'>No hay autores disponibles.
                                            Intenta agregar uno nuevo.</p>
                                            ):(
                                            <div className='table-responsive'>
                                                <table className='table table-striped table-hover'>
                                                    <thead className='table-dark'>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Nombre</th>
                                                            <th>Creado</th>
                                                            <th>Actualizado</th>
                                                            <th className='text-center'>Accion</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {authors.map((author, index) => (
                                                            <tr key={author.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{author.name}</td>
                                                                <td className='small text-mute'>{new Date(author.created_at).toLocaleDateString()}</td>
                                                                <td className='small text-mute'>{new Date(author.updated_at).toLocaleDateString()}</td>
                                                                <td className='text-center d-flex'>
                                                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>startEdit(author)}>Editar</button>
                                                                    <button className="btn btn-sm btn-outline-danger" onClick={()=>handleDelete(author.id)}>Eliminar</button>
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
            </div>
        </div>
    )
}

export default ManageAuthors;
