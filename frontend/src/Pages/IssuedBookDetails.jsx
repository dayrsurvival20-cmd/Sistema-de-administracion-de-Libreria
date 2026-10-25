import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {useNavigate, useParams} from 'react-router-dom'

const IssuedBookDetails = () => {

    const {id} = useParams();
    const [issue, setIssue] = useState(null);
    const [fine, setFine] = useState("");
    const [loading, setLoading] = useState(false);
    const [returning, setReturning] = useState(false);
    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
        if(!adminUser)
        {
            navigate("/admin/login");
        }
        fetchDetails();
    },[]);

    const fetchDetails = async () => 
    {
        setLoading(true);
        try {
            const res = await axios.get(`https://sistema-de-administracion-de-libreria.onrender.com/api/issued-books/${id}/`);
            setIssue(res.data);
            if(res.data.fine){
                setFine(res.data.fine);
            }
        }
        catch (err) {
            console.error(err); 
            toast.error("No se pudieron cargar los libros emitidos.");
        }
        finally{
            setLoading(false);
        }
    }

    const handleReturn = async () =>{
        if(!window.confirm("¿Estas seguro que quieres regresar este libro?")){
            return;
        }
        if(!fine){
            toast.error("Por favor, ingrese el monto de la multa(Ingrese 0 si no hay)");
            return;
        }


    setReturning(true);
        try{
            const res = await axios.post(`https://sistema-de-administracion-de-libreria.onrender.com/api/return-book/${id}/`,
                {fine: fine}
            );
            toast.success("Libro regresado exitosamente");
            //navigate("/admin/manage-issued-books");
            fetchDetails();
        }
        catch(err){
            console.error(err);
            toast.error("Fallo en retornar el libro.")
        }
        finally{
            setReturning(false)
        }
    }

    const bookCoverUrl = issue && issue.book_cover
        ? (issue.book_cover.startsWith("http")
            ? issue.book_cover : `https://sistema-de-administracion-de-libreria.onrender.com/${issue.book_cover}`)
        :null;

    if(loading || !issue){
    //if(loading){
        return(
            <div className='py-5 d-flex justify-content-center align-items-center'
            style={{
                background:"linear-gradient(135deg, #f3f4ff, #fdfbff)",
                minHeight:"100vh"}}>
                <div className='spinner-border text-primary'>

                </div>
            </div>
        )
    }
    return (
        <div className='py-5' style={{background:"linear-gradient(135deg, #f3f4ff, #fdfbff)", minHeight:"100vh"}}>
            <div className='container'>
                <div className='row mb-4'>
                    <div className='col-md-8 mx-auto d-flex justify-content-between align-items-center'>
                        <div>
                            <h4 className='fw-bold mb-1'>
                                <i className='fa-solid fa-layer-group text-primary'></i>
                                Detalles de los libros emitidos
                            </h4>
                            <p className='text-muted small'>
                                Ver estudiantes y detalles del libro, retornar estado y informacion de la multa
                            </p>
                        </div>
                        <button className='btn btn-outline-primary btn-sm'
                            onClick={() => navigate("/admin/manage-issued-books")}>
                            Volver a listado
                        </button>
                    </div>
                </div>

                <div className='row g-4'>
                    <div className='col-md-6'>
                        <div className='card border-0 shadow-sm rounded-4'>
                            <div className='card-body p-4'>
                                <h5 className='fw-bold mb-3'>Detalles de Estudiante</h5>
                                <hr/>
                                <p className='mb-1'>
                                    <strong>ID Estudiante: </strong>{issue.student_id}
                                </p>
                                <p className='mb-1'>
                                    <strong>Nombre del Estudiante: </strong>{issue.student_name}
                                </p>
                                <p className='mb-1'>
                                    <strong>Multa: </strong>{issue.fine ? `COL$${issue.fine}` : "No hay multa regsistrada aun."}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='col-md-6'>
                        <div className='card border-0 shadow-sm rounded-4'>
                            <div className='card-body p-4'>
                                <h5 className='fw-bold mb-3'>Detalles del libro</h5>
                                <hr/>
                                {bookCoverUrl && (
                                    <img src={bookCoverUrl} alt={issue.book_title}
                                    style={{width:"100px", height:"150px", objectFit:"cover", marginBottom:"15px", borderRadius:"4px"}}/>
                                )}

                                <p className='mb-1'>
                                    <strong>Nombre del libro: </strong> {issue.book_title}
                                </p>
                                <p className='mb-1'>
                                    <strong>ISBN del libro: </strong> {issue.book_isbn}
                                </p>
                                <p className='mb-1'>
                                    <strong>Fecha de emision: </strong> {new Date(issue.issued_at).toLocaleDateString()}
                                </p>
                                <p className='mb-1'>
                                    <strong>Fecha de retorno: </strong> {issue.returned_at ? new Date(issue.returned_at).toLocaleDateString()
                                        : "No regresado aun"}
                                </p>
                            </div>
                        </div>
                        <div className='card border-0 shadow-sm rounded-4'>
                            <div className='card-body p-4'>
                                <h5 className='f2-bold mb-3'>Regresar libro</h5>
                                <hr/>
                                {issue.is_returded ? (
                                    <p className='text-success small mb-0'>
                                        Este libro ya ha sido regresado.
                                        Multa: <strong>COL$ {issue.fine || 0}</strong>
                                    </p>
                                ):(
                                    <>
                                        <div className='mb-3'>
                                            <label className='form-label small fw-medium'>Cantidad de la multa (COL$) (si hay)</label>
                                            <input type='number' className='form-control' value={fine}
                                            onChange={(e) =>setFine(e.target.value)}
                                            placeholder='Ingrese la cantidad de la multa, ejemplo: 0 o 10.000'/>
                                        </div>
                                        <button className='btn btn-primary' onClick={handleReturn} disabled={returning}>
                                            {returning ? (
                                            <>
                                                <span className='spinner-border spinner-border-sm me-2'></span>
                                                Procesando...
                                            </>
                                            ):(
                                                <>
                                                    <i className='bi bi-check-circle-fill me-2'></i>
                                                    Regresar Libro
                                                </>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default IssuedBookDetails
