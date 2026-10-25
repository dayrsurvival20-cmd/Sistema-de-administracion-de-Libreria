import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {data, useNavigate} from 'react-router-dom'

const AddAuthors = () => {
    const [name, setName] = useState("");
    const [authors, setAuthors] = useState([]);
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
            fetchAuthors();
        }

    }, [adminUser, navigate]);

    const fetchAuthors = async () => 
    {
        try {
            const res = await axios.get("https://sistema-de-administracion-de-libreria.onrender.com/api/authors/");
            setAuthors(res.data);
        }catch (err) {
            console.error(err); 
            toast.error("Error al obtener los autores");
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("https://sistema-de-administracion-de-libreria.onrender.com/api/authors/add/", {name});
            if(res.data.success)
            {
                toast.success(res.data.message || "Autor agregado exitosamente")
                setName("");
                fetchAuthors();
            }
            else
            {
                toast.error(res.data.message || "Fallo en agregar nombre ")
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
                                <i className='fa-solid fa-user-pen text-primary'></i>
                                Agregar Autor</h4>
                            <p className='text-muted small'>
                                Crear nuevo autor y administrar su estado activo
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
                                        <label className='form-label small fw-medium'>Nombre del autor</label>
                                        <input type='text' className='form-control' placeholder='Ej: J.R.R Tolkien, Frank Helbert, Isaac Asimov, etc' value={name} onChange={(e)=>setName(e.target.value)}/>
                                    </div>
                                    <button type='submit' className='btn btn-primary w-100' disabled={loading}>
                                        {loading ? (
                                            <>
                                                <span className='spinner-border spinner-border-sm me-2'></span>AÑADIENDO...
                                            </>
                                        ): (
                                            <>
                                                <i className='fa-solid fa-plus'></i>AÑADIR AUTOR
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
                                        <h6 className='f2-semibold mb-3'>Autores existentes</h6>
                                        {authors.length === 0 ? (
                                            <p className='text-muted small'>No hay autores disponibles.
                                            Agrega tu primer autor del formulario</p>
                                        ):(
                                            <div className='table-responsive'>
                                                <table className='table table-striped table-bordered table-hover'>
                                                    <thead className='table-dark'>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Nombre</th>
                                                            <th>Creado</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {authors.map((author, index) => (
                                                            <tr key={author.id}>
                                                                <td>{index + 1}</td>
                                                                <td>{author.name}</td>
                                                                <td>{new Date(author.created_at).toLocaleDateString()}</td>
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

export default AddAuthors
