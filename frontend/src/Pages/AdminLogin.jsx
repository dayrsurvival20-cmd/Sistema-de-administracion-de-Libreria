import React, {useState} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {data, useNavigate} from 'react-router-dom'

const AdminLogin = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("https://sistema-de-administracion-de-libreria.onrender.com/api/admin/login/", {username, password});
            if(res.status === 200)
            {
                toast.success(res.data.message || "Sesion exitosa")
                localStorage.setItem("adminUser", res.data.username);
                navigate("/admin/dashboard");
            }
            else
            {
                toast.error(res.data.message || "Credenciales invalidas")
            }
        }
        catch (err) {
            console.error(err);
            if (err.response?.data?.message)
            {
                toast.error(err.response.data.message);
            }
            else
            {
                toast.error("Algo salio mal");
            }
        }
        finally
        {
            setLoading(false)
        }
    }

    return (
        <div className='py-5' style={{background:"linear-gradient(135deg, #f3f4ff, #fdfbff, red)", minHeight:"100vh"}}>
            <div className='container'>
                <div className='row justify-content-center'>
                    <div className='col-md-5'>
                        <div className='mb-4 text-center'>
                            <h4 className='fw-bold mb-1'>
                                <i className='fa-solid fa-shield-halved text-primary'></i>
                                Ingreso de administrador</h4>
                            <p className='text-muted small'>
                                Usa la cuenta de Administrador creada desde <code>createsuperuser</code>
                            </p>
                        </div>
                        <div className='card border-0 shadow-sm rounded-4'>
                            <div className='card-body p-4'>
                                <form onSubmit={handleSubmit}>
                                    <div className='mb-3'>
                                        <label className='form-label small fw-medium'>USUARIO</label>
                                        <div className='input-group'>
                                            <span className='input-group-text bg-transparent'>
                                                <i className='fa-regular fa-user '></i>
                                            </span>
                                            <input type='text' className='form-control'placeholder='Ingrese usuario de administrador' required value={username} onChange={(e)=>setUsername(e.target.value)}/>
                                        </div>
                                    </div>

                                    <div className='mb-3'>
                                        <label className='form-label small fw-medium'>CONTRASEÑA</label>
                                        <div className='input-group'>
                                            <span className='input-group-text bg-transparent'>
                                                <i className='fa-solid fa-key '></i>
                                            </span>
                                            <input type='password' className='form-control'placeholder='**********' required value={password} onChange={(e)=>setPassword(e.target.value)}/>
                                        </div>
                                    </div>

                                    <button type='submit' className='btn btn-primary w-100' disabled={loading}>
                                        {loading? (
                                            <>
                                                <span className='spinner-border spinner-border-sm me-2'></span>INGRESANDO...
                                            </>
                                        ): (
                                            <>
                                                <i className='fa-solid fa-right-to-bracket'></i>INGRESAR
                                            </>
                                        )}
                                        
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminLogin
