import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'

const StudentBooks = () => {

    const [books, setBooks] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const studentUser = JSON.parse(localStorage.getItem("studentUser"));

    useEffect(() => {
        if(!studentUser){
            navigate("/user/login");
            return;
        }

        const fetchBooks = async () => {
            try{
                setLoading(true); //api call
                const res = await axios.get("http://127.0.0.1:8000/api/user/books/");
                setBooks(res.data);
                setFiltered(res.data);
            }catch (err){
                console.error(err);
                toast.error("Fallo en buscar los libros.")
            }
            finally{
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    useEffect(() =>{
        const term = search.trim().toLowerCase();
        if(!term){
            setFiltered(books);
            return;
        }
        const filteredBooks = books.filter(book =>
            book.title.toLowerCase().includes(term)||
            book.author_name.toLowerCase().includes(term) ||
            book.isbn.toLowerCase().includes(term)
        );
        setFiltered(filteredBooks);
    }, [search, books]);

    const getCoverURL = (book) => {
        if(!book.cover_image){
            return null
        }
        if(book.cover_image.startsWith("http://")){
            return book.cover_image
        }
        return `http://127.0.0.1:8000/${book.cover_image}`;
    };

    return (
        <div className='py-5' style={{background:"linear-gradient(135deg, #f3f4ff, #fdfbff, red)", minHeight:"100vh"}}>
            <div className='container'>
                <div className='d-flex flex-wrap justify-content-between align-items-center'>
                    <div>
                        <h3 className='mb-1 d-flex align-items-center gap-2'>
                            <span className='d-inline-flex align-items-center justify-content-center rounded-3'
                            style={{width:'40px', height:'40px', background:'#0f766e1a', color:''}}>
                                <i className='fa-solid fa-book text-primary'></i>
                            </span>
                            <span>Libros disponibles.</span>
                        </h3>
                        <p className='text-muted '>Explora todos los libros en el catalogo de la libreria con cantidad y disponibilidad.</p>
                    </div>
                    <div className='mt-3'>
                        <div className='input-group'>
                            <span className='input-group-text bg-white border-0'>
                                <i className='fa-solid fa-magnifying-glass text-muted'></i>
                            </span>
                            <input type='text' className='form-control border-0' placeholder='Buscar por titulo, autor o ISBN' value={search} onChange={(e) => setSearch(e.target.value)} style={{width:"250px"}}></input>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className='text-center my-5'>
                        <div className='spinner-border text-primary' role='status'></div>
                        <span className='mt-3 text-muted'>CARGANDO...</span>
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className='text-center my-5'>
                        <i className='fa-solid fa-book-open-reader fa-3x text-muted'></i>
                        <p className='mt-3 text-muted'>No hay libros.</p>
                    </div>
                )}

                {!loading && filtered.length>0 && (
                    <div className='row f-4'>
                        {filtered.map((book) => (
                            <div className='col-md-4' key={book.id}>
                                <div className='card border-0 shadow-sm h-100 rounded-4'>
                                    <div className='bg-light d-flex align-items-center justify-content-center rounded-top' style={{height:"200px"}}>
                                        {/*<img src={`http://127.0.0.1:8000/${book.cover_image}`} alt={book.title} style={{maxHeight:"180px", objectFit:"contain"}}/>*/}
                                        {getCoverURL(book) ? (
                                            <img src={getCoverURL(book)} alt={book.title} style={{maxHeight:"180px", objectFit:"contain"}}></img>
                                        ):(
                                            <div className='text-muted text-center'>
                                                <i className='fa-solid fa-book text-muted'></i>
                                                <div className='small'>Sin Portada</div>
                                            </div>
                                        )}
                                    </div>
                                    <div className='card-body d-flex flex-column'>
                                        <h6 className='mb-1 text-truncate'>{book.title}</h6>
                                        <p className='mb-2 text-muted small'>
                                            <i className='fa-solid fa-user-pen'></i>{book.author_name}</p>
                                        <p className='small' mb-1>
                                            <span className='badge text-primary border border-primary-subtle'>
                                                <i className='fa-solid fa-tag'></i> {book.category_name}
                                            </span>
                                        </p>

                                        <p className='mb-1 small text-muted'>
                                            <i className='fa-solid fa-bardcore'></i> ISBN: {book.isbn}
                                        </p>

                                        <div className='d-flex justify-content-between align-items-center mt-2'>
                                            <span className='fw-bold text-success'>
                                                ${book.price}
                                            </span>

                                            <span className={`badge px-3 py-2 rounded-pill ${book.available_quantity > 0 ?
                                            'bg-success-subtle text-success border-success-subtle': 'bg-danger-subtle text-danger border border-danger-subtle'}`}>
                                                {book.available_quantity > 0 ? `Disponible ${book.available_quantity}` : 'No-disponible'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default StudentBooks
