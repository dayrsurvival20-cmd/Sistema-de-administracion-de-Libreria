import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'

const ManageCategories = () => {
    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editStatus, setEditStatus] = useState("1");
    const [categories, setCategories] = useState([]);
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
            fetchCategories();
        }

    }, [adminUser, navigate]);

    const fetchCategories = async () => 
    {
        setLoadingList(true);
        try {
            const res = await axios.get(" https://sistema-de-administracion-de-libreria.onrender.com/api/categories/");
            setCategories(res.data);
        }catch (err) {
            console.error(err); 
            toast.error("Error al obtener las categorias");
        }
        finally{
            setLoadingList(false);
        }
    }

    const startEdit = (cat) => {
        setEditId(cat.id);
        setEditName(cat.name);
        setEditStatus(cat.is_active ? "1": "0");
    }

    const cancelEdit = () => {
        setEditId(null);
        setEditName("");
        setEditStatus("1");
    }

    const handleUpdate = async(e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await axios.put(` https://sistema-de-administracion-de-libreria.onrender.com/api/update_category/${editId}/`,
                {name:editName, status:editStatus});
            if(res.data.success)
            {
                toast.success(res.data.message || "Categoría actualizada")
                cancelEdit();
                fetchCategories();
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
        const ok = window.confirm("¿Estas seguro de eliminar esta categoria?");
        if(!ok) return;
        setSaving(true); 
        try {
            const res = await axios.delete(` https://sistema-de-administracion-de-libreria.onrender.com/api/delete_category/${id}/`);
            if(res.data.success)
            {
                toast.success(res.data.message || "Categoría eliminada")
                setCategories((prev) => prev.filter((cat) => cat.id !== id));
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
                                Administrar Categoría
                            </h4>
                            <p className='text-muted small mb-0'>
                                Ver, editar y eliminar categorías existentes.
                            </p>
                        </div>
                        <button className='btn btn-primary btn-sm rounded-pill px-3'
                            onClick={() => navigate("/admin/category_add")}>
                            Agregar nueva categoría
                            <i className='fa-solid fa-plus me-1'></i>
                        </button>
                    </div>
                </div>

                        <div className='row g-4'>
                            <div className='col-md-5'>
                                <div className='card border-0 shadow-sm rounded-4'>
                            <div className='card-body p-4'>
                                <h6 className='fw-bold mb-3'>{editId ? "Editar Categoría" : "Selecciona Categoría a editar"}</h6>
                                {editId ? (
                                    <form onSubmit={handleUpdate}>
                                    <div className='mb-3'>
                                        <label className='form-label small fw-medium'>Nombre de categoría</label>
                                        <input type='text' className='form-control' placeholder='Ej: Ciencia, Programacion, Historia, etc' required value={editName} onChange={(e)=>setEditName(e.target.value)}/>
                                    </div>

                                    <div className='mb-3'>
                                        <label className='form-label small fw-medium'>Estado</label>
                                        <div className='d-flex gap-3'>
                                            <div className='form-check'>
                                                <input type='radio' className='form-check-input' value="1" checked={editStatus === "1"} onChange={(e)=>setEditStatus(e.target.value)} id="status-active" name="status"/>
                                                <label className='form-check-label small' htmlFor='status'>ACTIVO</label>
                                            </div>
                                            <div className='form-check'>
                                                <input type='radio' className='form-check-input' value="0" checked={editStatus === "0"} onChange={(e)=>setEditStatus(e.target.value)} id="status-inactive" name="status"/>
                                                <label className='form-check-label small' htmlFor='status'>INACTIVO</label>
                                            </div>
                                        </div>
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
                                        <p className='text-muted small'>Presiona <strong>Editar</strong> para modificar una categoría.</p>
                                    )
                                } 
                            </div>
                        </div>
                            </div>

                            <div className='col-md-8'>
                                <div className='card shadow-sm rounded-4'>
                                    <div className='card-body'>
                                        <h6 className='f2-semibold mb-3'>Mostrando Categorias</h6>
                                        {loadingList ? (
                                            <div className='text-center py-4 '>
                                                <span className='spinner-border text-primary me-2'></span> 
                                                Cargando...
                                            </div>
                                            ):  categories.length === 0 ? (
                                            <p className='text-muted small'>No hay categorias disponibles.
                                            Intenta agregar uno nuevo.</p>
                                            ):(
                                            <div className='table-responsive'>
                                                <table className='table table-striped table-hover'>
                                                    <thead className='table-dark'>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Nombre</th>
                                                            <th>Estado</th>
                                                            <th>Creado</th>
                                                            <th>Actualizado</th>
                                                            <th>Accion</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {categories.map((category, index) => (
                                                            <tr key={category.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{category.name}</td>
                                                                <td>
                                                                    <span className={`badge ${category.is_active === "1" ? "bg-success" : "bg-secondary"}`}>
                                                                        {category.is_active === "1" ? "Activo" : "Inactivo"}
                                                                    </span>
                                                                </td>
                                                                <td className='small text-mute'>{new Date(category.created_at).toLocaleDateString()}</td>
                                                                <td className='small text-mute'>{new Date(category.updated_at).toLocaleDateString()}</td>
                                                                <td className='text-center d-flex'>
                                                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>startEdit(category)}>Editar</button>
                                                                    <button className="btn btn-sm btn-outline-danger" onClick={()=>handleDelete(category.id)}>Eliminar</button>
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

export default ManageCategories
