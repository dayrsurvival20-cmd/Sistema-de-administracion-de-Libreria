import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'

const AddBook = () => {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [author, setAuthor] = useState("");
    const [isbn, setIsbn] = useState("");
    const [price, setPrice] = useState("");
    const [quantity, setQuantity] = useState("");
    const [coverFile, setCoverfile] = useState(null);

    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(false);
    const [loadingDropdowns, setLoadingDropdowns] = useState(false);

    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
        if(!adminUser)
        {
            navigate("/admin/login");
        }
        else
        {
            fetchDropdownData();
        }

    }, [adminUser, navigate]);

    const fetchDropdownData = async () => 
    {
        setLoadingDropdowns(true);
        try {
            const [authRes, catRes] = await Promise.all([
                axios.get("https://sistema-de-administracion-de-libreria.onrender.com/api/authors/"),
                axios.get("https://sistema-de-administracion-de-libreria.onrender.com/api/categories/")
            ])
            const activeCats = (catRes.data).filter((c) => c.is_active); 
            setCategories(activeCats);
            setAuthors(authRes.data);

        }catch (err) {
            console.error(err); 
            toast.error("Error al obtener los autores y las categorias");
        }
        finally{
            setLoadingDropdowns(false);
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("author", author);
        formData.append("isbn", isbn);
        formData.append("price", price);
        formData.append("quantituy", quantity);
        if(coverFile){
            formData.append('cover_image', coverFile);
        }
        setLoading(true);
        try {
            const res = await axios.post("https://sistema-de-administracion-de-libreria.onrender.com/api/books/add/", formData, {
                headers :{
                    'Content-Type': 'multipart/form-data',
                }
            });
            if(res.data.success)
            {
                toast.success(res.data.message || "Libro agregado exitosamente")
                setTitle("");
                setCategory("");
                setAuthor("");
                setIsbn("");
                setPrice("");
                setQuantity("");
                setCoverfile(null);
                fetchDropdownData();
            }
            else
            {
                toast.error(res.data.message || "Fallo en agregar libro")
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
                                <i className='fa-solid fa-book text-primary'></i>
                                Agregar Libro</h4>
                            <p className='text-muted small'>
                                Crear nuevo libro rellenando el formulario
                            </p>
                        </div>
                    </div>
                </div>
                        
                        <div className='row justify-content-center'>
                            <div className='col-md-10 '>
                                <div className='card border-0 shadow-sm rounded-4'>
                            <div className='card-body p-4'>
                                {loadingDropdowns ? (
                                    <div className='text-center my-5'>
                                        <span className='spinner-border text-primary'></span>
                                    </div>
                                    ) : (
                                        <form onSubmit={handleSubmit}>
                                        <div className='row g-3'>
                                            <div className='col-md-6'>
                                                <label className='form-label small fw-medium'>Titulo del libro</label>
                                                <input type='text' className='form-control' placeholder='Ej: Red Rising, Python for Bio-medicine, Historia de Colombia, etc' value={title} onChange={(e)=>setTitle(e.target.value)}/>
                                            </div>

                                            <div className='col-md-6'>
                                                <label className='form-label small fw-medium'>Categoria</label>
                                                <select className='form-select' required value={category} onChange={(e)=>setCategory(e.target.value)}>
                                                    <option value="">
                                                        --Seleciona categoria--
                                                    </option>
                                                    {categories.map((cat) =>(
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className='col-md-6'>
                                                <label className='form-label small fw-medium'>Autor</label>
                                                <select className='form-select' value={author} onChange={(e)=>setAuthor(e.target.value)}>
                                                    <option value="">
                                                        --Seleciona autor--
                                                    </option>
                                                    {authors.map((auth) =>(
                                                        <option key={auth.id} value={auth.id}>{auth.name}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className='col-md-6'>
                                                <label className='form-label small fw-medium'>Numero ISBN</label>
                                                <input type='text' className='form-control' placeholder='Unico numero ISBN' required value={isbn} onChange={(e) => setIsbn(e.target.value)}/>
                                                <p className='small text-muted mb-0'>El ISBN debe ser unco en cada libro</p>
                                            </div>

                                            <div className='col-md-4'>
                                                <label className='form-label small fw-medium'>Precio</label>
                                                <input type='number' className='form-control' min="0" step="0.01" placeholder='ej: 35.000' required value={price} onChange={(e) => setPrice(e.target.value)}/>
                                                <p className='small text-muted mb-0'>El precio debe ser accesible</p>
                                            </div>

                                            <div className='col-md-4'>
                                                <label className='form-label small fw-medium'>Cantidad</label>
                                                <input type='number' className='form-control' min="0" step="1" placeholder='ej: 5' required value={quantity} onChange={(e) => setQuantity(e.target.value)}/>
                                                <p className='small text-muted mb-0'>La cantidad debe estar registrada</p>
                                            </div>

                                            <div className='col-md-4'>
                                                <label className='form-label small fw-medium'>Portada del libro</label>
                                                <input type='file' className='form-control' accept='image/*' required  onChange={(e) => setCoverfile(e.target.files[0])}/>
                                            </div>
                                        </div>
                                    
                                        <div className='mt-4'>
                                            <button type='submit' className='btn btn-primary w-100' disabled={loading}>
                                            {loading ? (
                                                <>
                                                    <span className='spinner-border spinner-border-sm me-2'></span>
                                                    AGREGANDO...
                                                </>
                                            ): (
                                                <>
                                                    <i className='fa-solid fa-plus'></i>
                                                    AÑADIR LIBRO   
                                                </>
                                                )
                                            }
                                            </button>
                                        </div>
                                    </form>
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

export default AddBook
