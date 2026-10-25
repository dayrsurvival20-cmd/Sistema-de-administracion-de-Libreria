import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {data, useNavigate} from 'react-router-dom'

const AddCategory = () => {
    const [name, setName] = useState("");
    const [status, setStatus] = useState("1");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
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
        try {
            const res = await axios.get("https://sistema-de-administracion-de-libreria.onrender.com/api/categories/");
            setCategories(res.data);
        }catch (err) {
            console.error(err); 
            toast.error("Error al obtener las categorias");
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("https://sistema-de-administracion-de-libreria.onrender.com/api/categories/add/", {name, status});
            if(res.data.success)
            {
                toast.success(res.data.message || "Categoría agregada exitosamente")
                setName("");
                setStatus("1");
                fetchCategories();
            }
            else
            {
                toast.error(res.data.message || "Credenciales invalidas")
            }
        }
        catch (err) {
            console.error(err);
            toast.error("Algo salio mal");
        }
        finally
        {
            setLoading(false)
        }
    }

    return (
        <div className='py-5' style={{background:"linear-gradient(135deg, #f3f4ff, #fdfbff, red)", minHeight:"100vh"}}>
            <div className='container'>
                <div className='row mb-4'>
                    <div className='col-md-8 mx-auto'>
                        <div className='mb-4 text-center'>
                            <h4 className='fw-bold mb-1'>
                                <i className='fa-solid fa-layer-group text-primary'></i>
                                Agregar Categoría</h4>
                            <p className='text-muted small'>
                                Crear nueva categoría de libros y administrar su estado activo
                            </p>
                        </div>
                    </div>
                </div>
                        
                        <div className='row g-4'>
                            <div className='col-md-5'>
                                <div className='card border-0 shadow-sm rounded-4'>
                            <div className='card-body p-4'>
                                <form onSubmit={handleSubmit}>
                                    <div className='mb-3'>
                                        <label className='form-label small fw-medium'>Nombre de categoría</label>
                                        <div className='d-flex gap-3'>
                                            <div className='form-check'>
                                                <input type='radio' className='form-check-input' placeholder='Ej: Ciencia, Programacion, Historia, etc' value="1" checked={status === "1"} onChange={(e)=>setStatus(e.target.value)} id='status-active' name='status'/>
                                                <label className='form-check-label small' htmlFor="status-active">Activo</label>    
                                            </div>
                                            <div className='form-check'>
                                                <input type='radio' className='form-check-input' placeholder='Ej: Ciencia, Programacion, Historia, etc' value="0" checked={status === "0"} onChange={(e)=>setStatus(e.target.value)} id='status-inactive' name='status'/>
                                                <label className='form-check-label small' htmlFor="status-inactive">Inactivo</label>    
                                            </div>
                                        </div>
                                    </div>

                                    <div className='mb-3'>
                                        <label className='form-label small fw-medium'>Estado</label>
                                            <input type='text' className='form-control'placeholder='Ej: Ciencia, Programacion, Historia, etc' required value={name} onChange={(e)=>setName(e.target.value)}/>
                                    </div>

                                    <button type='submit' className='btn btn-primary w-100' disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className='spinner-border spinner-border-sm me-2'></span>CREANDO...
                                            </>
                                        ): (
                                            <>
                                                <i className='fa-solid fa-plus'></i>CREAR CATEGORIA
                                            </>
                                        )}
                                        
                                    </button>
                                </form>
                            </div>
                        </div>
                            </div>

                            <div className='col-md-7'>
                                <div className='card border-0 shadow-sm rounded-4'>
                                    <div className='card-body p-4'>
                                        <h6 className='f2-semibold mb-3'>Categorias existentes</h6>
                                        {categories.length === 0 ? (
                                            <p className='text-muted small'>No hay categorias disponibles.
                                            Agrega tu primera categoria del formulario</p>
                                        ):(
                                            <div className='table-responsive'>
                                                <table className='table table-striped table-bordered table-hover'>
                                                    <thead className='table-dark'>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Nombre</th>
                                                            <th>Estado</th>
                                                            <th>Creado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {categories.map((category, index) => (
                                                            <tr key={category.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{category.name}</td>
                                                                <td>{category.is_active ? (
                                                                    <span className='badge bg-success-subtle text-success border border-success-subtle'>
                                                                        Activo</span>
                                                                ): (
                                                                    <span className='badge bg-secondary-subtle text-secondary border border-secondary-subtle'>
                                                                        Inactivo</span>
                                                                )}</td>
                                                                <td>{new Date(category.created_at).toLocaleDateString()}</td>
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

export default AddCategory
