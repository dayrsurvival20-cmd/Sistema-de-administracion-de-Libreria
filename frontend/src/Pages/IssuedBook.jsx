import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'


const IssuedBook = () => {
    const [studentId, setStudentId] = useState("");
    const [student, setStudent] = useState(null);
    const [bookQuery, setBookQuery] = useState("");
    const [book, setBook] = useState(null);
    const [studentLoading, setStudentLoading] = useState(false);
    const [bookLoading, setBookLoading] = useState(false);
    const [remark, setRemark] = useState("");
    const [issuing, setIssuing] = useState(false);
    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
        if(!adminUser)
        {
            navigate("/admin/login");
        }
    },[]);

    const handleFetchStudent = async () => {
        if(!studentId){
            toast.error("Por favor, ingrese su ID de estudiante.");
            return;
        }
        setStudent(null);
        setStudentLoading(true);
        try{
            const res = await axios.get(`https://sistema-de-administracion-de-libreria.onrender.com/api/students/by-id/?student_id=${studentId}`);
            setStudent(res.data);
        }catch(error){
            toast.error("Estudiante no encontrado.")
        }finally{
            setStudentLoading(false);
        }
    }

    const handleFetchBook = async () =>{
        if(!bookQuery){
            toast.error("Por favor, ingrese nombre del libro o ISBN.");
            return;
        }
        setBook(null);
        setBookLoading(true);
        try{
            const res = await axios.get(`https://sistema-de-administracion-de-libreria.onrender.com/api/books/lookup/?q=${bookQuery}`);
            setBook(res.data.book);
        }catch(error){
            toast.error("Libro no encontrado.")
        }finally{
            setBookLoading(false);
        }
    }

    const handleIssueBook = async () =>{
        if(!studentId || !book || !remark){
            toast.error("Por favor, llene todos los campos.");
            return;
        }
        if(book.quantity<=0){
            toast.error("Libro no disponible (No hay mas copias)");
            return;
        }
        setIssuing(true);
        try{
            const res = await axios.post(`https://sistema-de-administracion-de-libreria.onrender.com/api/admin/issue_book/`, {
                student_id :  student.student_id,
                book_id : book.id,
                remark : remark
            });
            toast.success("Libro emitido exitosamente.");
            //navigate("/admin/issued-book")
            setRemark("");
            //setBook(null);
            //setStudent(null);
            setStudentId("");
            setBookQuery("");
        }catch(error){
            toast.error("Fallo en emitir el libro.")
        }finally{
            setStudentLoading(false);
        }
    }

    const bookCoverUrl = book && book.cover_image 
        ? (book.cover_image.startsWith("http")
            ? book.cover_image : `https://sistema-de-administracion-de-libreria.onrender.com${book.cover_image}`)
        :null;

    return (
        <div className='py-5' style={{background:"linear-gradient(135deg, #f3f4ff, #fdfbff)", minHeight:"100vh"}}>
            <div className='container py-4'>
                <div className='row mb-4'>
                    <div className='col-md-8 mx-auto d-flex justify-content-between align-items-center'>
                        <div>
                            <h4 className='fw-bold mb-1'>
                                <i className='fa-solid fa-layer-group text-primary me-2'></i>
                                Emitir un nuevo Libro
                            </h4>
                            <p className='text-muted small mb-0'>
                                Buscar estudiante y libro, entonces emitir el libro con un comentario.
                            </p>
                        </div>
                        <button className='btn btn-outline-primary btn-sm'
                            onClick={() => navigate("/admin/manage-issued-books")}>
                            Gestionar los libros emitidos
                        </button>
                    </div>
                </div>

                <div className='row g-4'>
                    <div className='col-md-7'>
                        <div className='card border-0 shadow-sm rounded-4'>
                            <div className='card-body p-4'>
                                <form onSubmit={handleIssueBook}>
                                    <div className='mb-4'>
                                        <label className='form-label small fw-medium'>
                                            ID del Estudiante <span className='text-danger'>*</span>
                                        </label>
                                        <div className='input-group'>
                                            <input type='text' className='form-control' placeholder='Ej: 1001' value={studentId} onChange={(e) =>setStudentId(e.target.value)} onBlur={handleFetchStudent} required/>
                                            <button type='button' className='btn btn-outline-secondary' onClick={handleFetchStudent}>
                                                {studentLoading? (
                                                    <span className='spinner-border spinner-border-sm'></span>
                                                ):(
                                                    <>
                                                        <i className='fa-solid fa-magnifying-glass me-1'></i>
                                                        BUSCAR
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <div className='mt-2 small'>
                                            {student ? (
                                                <span className='text-success fw-bold'>{student.full_name} ({student.email}) - {student.mobile}</span>
                                            ) : (
                                                <span className='text-muted'>Ingrese ID del estudiante y presione BUSCAR</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className='mb-4'>
                                        <label className='form-label small fw-medium'>
                                            Numero ISBN o titulo del libro<span className='text-danger'>*</span>
                                        </label>
                                        <div className='input-group'>
                                            <input type='text' className='form-control' placeholder='Ingresa ISBN o parte del titulo' value={bookQuery} onChange={(e) =>setBookQuery(e.target.value)} onBlur={handleFetchBook}/>
                                            <button type='button' className='btn btn-outline-secondary' onClick={handleFetchBook}>
                                                {bookLoading? (
                                                    <span className='spinner-border spinner-border-sm'></span>
                                                ):(
                                                    <>
                                                        <i className='fa-solid fa-magnifying-glass me-1'></i>
                                                        BUSCAR
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                        <div className='mt-2 small'>
                                            {book ? (
                                                <span className='text-success fw-bold'>{book.title} (ISBN: {book.isbn}) - Ctd: {book.quantity}</span>
                                            ) : (
                                                <span className='text-muted'>Ingrese ISBN / titulo y presione BUSCAR</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className='mt-4'>
                                        <label className="form-label small fw-medium">
                                            Comentar <span className='text-danger'>*</span>
                                        </label>
                                        <textarea className='form-control' placeholder='Ej: emitido por 7 dias, tener cuidado, etc.' rows="3" value={remark} onChange={(e) => setRemark(e.target.value)} required></textarea>
                                    </div>
                                    <button type='submit' className='btn btn-primary mt-4' disabled={issuing}>
                                        {issuing ? (
                                            <>
                                                <span className='spinner-border spinner-border-sm'></span>
                                                Emitiendo...
                                            </>
                                        ):(
                                            <>
                                                <i className='fa-solid fa-book-open me-1'></i>
                                                Emitir libro
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className='col-md-5'>
                        <div className='card border-0 shadow-sm rounded-4 mb-3'>
                            <div className='card-body p-3'>
                                <div className='d-flex align-items-center'>
                                    <div className='rounded-circle d-inline-flex align-items-center justify-content-center me-3'
                                    style={{width:"50px", height:"50px", background:"#eef2ff", color:"#4f46e5"}}>
                                        <i className='fa-solid fa-user-graduate'></i>
                                    </div>

                                    <div className=''>
                                        <div className='small text-muted'>Estudiante</div>
                                        <div className='fw-bold'>
                                            {student ? student.full_name : "Estudiante no seleccionado"}
                                        </div>
                                        {student && (
                                            <div className='small text-muted'>
                                                {student.student_id} - {student.email}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='card border-0 shadow-sm rounded-4 mb-3'>
                            <div className='card-body p-3'>
                                <div className='d-flex'>
                                    {bookCoverUrl ? (
                                        <img src={bookCoverUrl} alt={book.title} className='rounded me-3'
                                        style={{width:"50px", height:"70px", objectFit:"cover"}}></img>
                                    ):(
                                        <div className='rounded me-3 d-flex align-items-center justify-content-center'
                                        style={{width:"50px", height:"70px", background:"#eef2ff"}}>
                                            <i className='fa-solid fa-book text-muted'></i>
                                        </div>
                                    )}

                                    <div className=''>
                                        <div className='small text-muted'>Libro</div>
                                        <div className='fw-bold'>
                                            {book ? book.title : "Libro no seleccionado"}
                                        </div>
                                        {book && (
                                            <div className='small text-muted'>
                                                ISBN: {book.isbn} - Ctd: {book.quantity}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IssuedBook
