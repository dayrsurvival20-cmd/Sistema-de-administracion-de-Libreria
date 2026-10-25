import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'

const ManageBooks = () => {
    const [books, setBooks] = useState([]);
    const [categories, setCategories] = useState([]);

    const [editId, setEditId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editAuthor, setEditAuthor] = useState("");
    const [editPrice, setEditPrice] = useState("");
    const [editQuantity, setEditQuantity] = useState("");
    const [editImageFile, setEditImageFile] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);


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
            fetchAll();
        }

    }, [adminUser, navigate]);

    const fetchAll = async () => 
    {
        setLoadingList(true);
        try {
            const [bookRes, categoryRes, authorRes] = await Promise.all([
                axios.get("http://127.0.0.1:8000/api/books/"),
                axios.get("http://127.0.0.1:8000/api/categories/"),
                axios.get("http://127.0.0.1:8000/api/authors/")
            ]);
            setBooks(bookRes.data);
            setCategories(categoryRes.data);
            setAuthors(authorRes.data);
        }catch (err) {
            console.error(err); 
            toast.error("Error al obtener los datos");
        }
        finally{
            setLoadingList(false);
            try{
                const res = await axios.get("http://127.0.0.1:8000/api/books/");
                setBooks(res.data);
            }
            catch (err) {
                console.error(err);
                toast.error("Error al obtener los libros");
            }
            finally{
                setLoadingList(false);
            }
        }
    }

    const startEdit = (book) => {
        setEditId(book.id);
        setEditTitle(book.title);
        setEditCategory(book.category);
        setEditAuthor(book.author);
        setEditPrice(book.price);
        setEditQuantity(book.quantity);
        setEditImagePreview(`http://127.0.0.1:8000/${book.cover_image}`);
        setEditImageFile(null);
    }

    const cancelEdit = () => {
        setEditId(null);
        setEditTitle("");
        setEditCategory("");
        setEditAuthor("");
        setEditPrice("");
        setEditQuantity("");
        setEditImagePreview(null);
        setEditImageFile(null);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if(file)
        {
            setEditImageFile(file);
            setEditImagePreview(URL.createObjectURL(file));
        }
    }

    const handleUpdate = async(e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("title", editTitle);
            formData.append("category", editCategory);
            formData.append("author", editAuthor);
            formData.append("price", editPrice);
            formData.append("quantity", editQuantity);
            if(editImageFile)
            {
                formData.append("cover_image", editImageFile);
            }

            const res = await axios.put(`http://127.0.0.1:8000/api/update_book/${editId}/`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );  
            if(res.data.success)
            {
                toast.success(res.data.message || "Libro actualizado")
                cancelEdit();
                fetchAll();
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
            setSaving(false); // asegurate que eel guardado este en falso despues de la operacion
        }
    }

    const handleDelete = async(id) => {
        const ok = window.confirm("¿Estas seguro de eliminar este libro?");
        if(!ok) return;
        try {
            const res = await axios.delete(`http://127.0.0.1:8000/api/delete_book/${id}/`);
            if(res.data.success)
            {
                toast.success(res.data.message || "Libro eliminado")
                setBooks((prev) => prev.filter((a) => a.id !== id));
                if(editId === id) 
                {
                    cancelEdit();
                }
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
                                Administrar Libros
                            </h4>
                            <p className='text-muted small mb-0'>
                                Ver, editar y eliminar libros de la libreria.
                            </p>
                        </div>
                        <button className='btn btn-primary btn-sm rounded-pill px-3'
                            onClick={() => navigate("/admin/book_add")}>
                            <i className='fa-solid fa-plus me-1'></i>
                            Agregar nuevo libro
                        </button>
                    </div>
                </div>

                        <div className='row g-4'>
                            <div className='col-md-5'>
                                <div className='card border-0 shadow-sm rounded-4'>
                            <div className='card-body p-4'>
                                <h6 className='fw-bold mb-3'>{editId ? "Editar Libro" : "Selecciona libro a editar"}</h6>
                                {editId ? (
                                    <form onSubmit={handleUpdate}>
                                    <div className='row g-3'>
                                        <div className='col-md-12'>
                                            <label className='form-label small fw-medium'>Titulo del libro</label>
                                            <input type='text' className='form-control' placeholder='Ej: Red Rising, Python for Bio-medicine, Historia de Colombia, etc' value={editTitle} onChange={(e)=>setEditTitle(e.target.value)}/>
                                        </div>

                                        <div className='col-md-12'>
                                            <label className='form-label small fw-medium'>Categoria</label>
                                            <select className='form-select' required value={editCategory} onChange={(e)=>setEditCategory(e.target.value)}>
                                                <option value="">
                                                    --Seleciona categoria--
                                                </option>
                                                {categories.map((cat) =>(
                                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className='col-md-12'>
                                            <label className='form-label small fw-medium'>Autor</label>
                                            <select className='form-select' value={editAuthor} onChange={(e)=>setEditAuthor(e.target.value)}>
                                                <option value="">
                                                    --Seleciona autor--
                                                </option>
                                                {authors.map((auth) =>(
                                                    <option key={auth.id} value={auth.id}>{auth.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className='col-md-6'>
                                            <label className='form-label small fw-medium'>Precio</label>
                                            <input type='number' className='form-control' min="0" step="0.01" placeholder='ej: 35.000' required value={editPrice} onChange={(e) => setEditPrice(e.target.value)}/>
                                            <p className='small text-muted mb-0'>El precio debe ser accesible</p>
                                        </div>

                                        <div className='col-md-6'>
                                            <label className='form-label small fw-medium'>Cantidad</label>
                                            <input type='number' className='form-control' min="0" step="1" placeholder='ej: 5' required value={editQuantity} onChange={(e) => setEditQuantity(e.target.value)}/>
                                            <p className='small text-muted mb-0'>La cantidad debe estar registrada</p>
                                        </div>

                                        <div className='col-md-12'>
                                            <label className='form-label small fw-medium'>Portada del libro</label>
                                            {editImagePreview && (
                                                <div className='mb-2'>
                                                    <img src={editImagePreview} alt="Portada del libro" className='img-fluid rounded' style={{maxWidth:"100px", height:"100px", width:"100px"}}/>
                                                </div>
                                            )}
                                            <input type='file' className='form-control' accept='image/*' onChange={handleImageChange}/>
                                        </div>
                                    </div>

                                    <div className ="d-flex gap-2 align-items-center mt-4">
                                        <button type='submit' className='btn btn-primary mt-3' disabled={saving}>
                                            {saving ? (
                                                <>
                                                    <span className='spinner-border spinner-border-sm me-2'></span>ACTUALIZANDO...
                                                </>
                                            ): (
                                                <>
                                                    <i className='fa-solid fa-plus'></i>ACTUALIZAR
                                                </>
                                            )}
                                        </button>

                                        <button type="button" className='btn btn-secondary mt-3' onClick={cancelEdit}>
                                            CANCELAR
                                        </button>
                                    </div>

                                </form>
                                    ): (
                                        <p className='text-muted small'>Presiona <strong>Editar</strong> para modificar un autor.</p>
                                    )
                                } 
                            </div>
                        </div>
                            </div>

                            <div className='col-md-7'>
                                <div className='card shadow-sm rounded-4'>
                                    <div className='card-body'>
                                        <h6 className='f2-semibold mb-3'>Mostrando Libros</h6>
                                        {loadingList ? (
                                            <div className='text-center py-4 '>
                                                <span className='spinner-border text-primary me-2'></span> 
                                                Cargando...
                                            </div>
                                            ):  books.length === 0 ? (
                                            <p className='text-muted small'>No hay libros disponibles.
                                            Intenta agregar uno nuevo.</p>
                                            ):(
                                            <div className='table-responsive'>
                                                <table className='table table-striped table-hover align-middle'>
                                                    <thead className='table-dark'>
                                                        <tr>
                                                            <th>#</th>
                                                            <th>Libro</th>
                                                            <th>Categoria</th>
                                                            <th>Autor</th>
                                                            <th>ISBN</th>
                                                            <th>Precio</th>
                                                            <th>Cantidad</th>
                                                            <th className='text-center'>Accion</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {books.map((book, index) => (
                                                            <tr key={book.id}>
                                                                <td>{index + 1}</td>
                                                                <td style={{maxWidth:"200px"}}>
                                                                    <img src={`http://127.0.0.1:8000/${book.cover_image}`}
                                                                    alt={book.title} className="img-fluid rounded"
                                                                    style={{maxWidth:"100px", height:"70px", marginBottom: "4px"}}/>
                                                                    <div className="fw-bold small">
                                                                        {book.title}
                                                                    </div>
                                                                </td>
                                                                <td className='small text-muted'>{book.category_name}</td>
                                                                <td className='small text-muted'>{book.author_name}</td>
                                                                <td className='small text-muted'>{book.isbn}</td>
                                                                <td className='small text-muted'>${book.price}</td>
                                                                <td className='small text-muted'>{book.quantity}</td>
                                                                <td className='text-center'>
                                                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={()=>startEdit(book)}>
                                                                        <i className="fa-solid fa-pen-to-square"></i>Editar
                                                                    </button>
                                                                    <button className="btn btn-sm btn-outline-danger" onClick={()=>handleDelete(book.id)}>
                                                                        <i className="fa-solid fa-pen-to-square"></i>Eliminar
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
            </div>
        </div>
    )
}

export default ManageBooks;
