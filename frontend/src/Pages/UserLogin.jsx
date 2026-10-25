import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {Link, Navigate, useNavigate} from 'react-router-dom'

const UserLogin = () => {
    const [formData, setFormData] = useState({
        login_id:"",
        password:""
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange =(e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value //actualiza un campo en especifico
        });
    }

    const handleSubmit = async(e) => {
        e.preventDefault(); // evita el envío por defecto

        setLoading(true); 
        try {
            const res = await axios.post("https://sistema-de-administracion-de-libreria.onrender.com/api/user_login/", formData);
            if(res.data.success)
            {
                localStorage.setItem("studentUser", JSON.stringify(res.data));
                toast.success(`Ingreso exitoso!`);
                navigate("/user/dashboard");
                setFormData({
                    login_id:"",
                    password:""
                });
            }
            else
            {
                toast.error(res.data.message || "Fallo en el ingreso.");
            }
        }
        catch (err) {
            console.error(err);
            toast.error(err.response?.data.message || 'Credenciales de acceso invalidas. Por favor, intente de nuevo');
        }
        finally
        {
            setLoading(false)
        }
    }

    return(
        <div className='py-5' style={{background:"linear-gradient(135deg, #f3f4ff, #fdfbff, red)", minHeight:"100vh"}}>
            <div className='container'>
                <div className='row mb-2'>
                    <div className='col-md-8 mx-auto'>
                        <div className='mb-2 text-center'>
                            <h4 className='fw-bold mb-1'>
                                <i className='fa-solid fa-user text-primary'></i>
                                Inicio de sesion de Usuario</h4>
                            <p className='text-muted small'>
                                Por favor, ingresa tus credenciales de usuario para acceder a tu cuenta.
                            </p>
                        </div>
                    </div>
                </div>

                <div className='row'>
                    <div className='col-md-8 mx-auto'>
                        <div className='card border-0 shadow-sm rounded-4'>
                            <div className='card-body p-4'>
                            <form onSubmit={handleSubmit}>
                                <div className='mb-3'>
                                    <label className='form-label small fw-bold'>Correo o ID de estudiante</label>
                                    <input type='text' name='login_id' className='form-control' placeholder='Ingrese correo o ID' required value={formData.login_id} onChange={handleChange}/>
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label small fw-bold'>Contraseña</label>
                                    <input type='password' name='password' className='form-control' placeholder='Ingrese contraseña' required value={formData.password} onChange={handleChange}/>
                                </div>

                                <button type='submit' className='btn btn-primary w-100' disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className='spinner-border spinner-border-sm me-2'></span>INGRESANDO...
                                        </>
                                    ): (
                                        <>
                                            <i className='fa-solid fa-user-plus'></i>INGRESAR
                                        </>
                                    )}
                                </button>
                                <p className='text-center text-muted small mt-2'>¿Nuevo aqui? <Link to='/user/signup'>Registrese aqui</Link></p>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserLogin
