import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {Link} from 'react-router-dom'

const UserSignUp = () => {
    const [formData, setFormData] = useState({
        full_name:"",
        mobile:"",
        email:"",
        password:"",
        confirm_password:""
    });

    const [loading, setLoading] = useState(false);

    const handleChange =(e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value //actualiza un campo en especifico
        });
    }

    const handleSubmit = async(e) => {
        e.preventDefault(); // evita el envío por defecto
        
        if(formData.password !== formData.confirm_password)
        {
            toast.error("La contraseña y la contraseña confirmadano coinciden.");
            return;
        }
        
        if(formData.password.length < 6)
        {
            toast.error("La contraseña debe ser de almenos 6 caracteres.");
            return;
        }

        setLoading(true); 
        try {
            const res = await axios.post("http://127.0.0.1:8000/api/user_signup/", formData
            //{
                //full_name: formData.full_name,
                //mobile: formData.mobile,
                //email: formData.email,
                //password: formData.password,
                //confirm_password: formData.confirm_password
            //}
            );
            if(res.data.success)
            {
                toast.success(`Registro exitoso! Tu ID de estudiante es: ${res.data.student_id}`);
                setFormData({
                    full_name:"",
                    mobile:"",
                    email:"",
                    password:"",
                    confirm_password:""
                });
            }
            else
            {
                toast.error(res.data.message || "Fallo en el registro.");
            }
        }
        catch (err) {
            console.error(err);
            toast.error(err.response?.data.message || 'Un error ocurrio durante el resgistro.');
        }
        finally
        {
            setLoading(false)
        }
    }

    return(
        <div className='py-5' style={{background:"linear-gradient(135deg, #f3f4ff, #fdfbff, red)", minHeight:"100vh"}}>
            <div className='container'>
                <div className='row mb-3'>
                    <div className='col-md-6 mx-auto'>
                        <div className='mb-2 text-center'>
                            <h4 className='fw-bold mb-1'>
                                <i className='fa-solid fa-user-plus text-primary'></i>
                                Registro de Usuario</h4>
                            <p className='text-muted small'>
                                Crea tu cuenta de usuario al llenar el formulario de abajo.
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
                                    <label className='form-label small fw-bold'>Nombre completo</label>
                                    <input type='text' name='full_name' className='form-control' placeholder='Ingrese nombre completo' required value={formData.full_name} onChange={handleChange}/>
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label small fw-bold'>Numero de telefono</label>
                                    <input type='text' name='mobile' className='form-control' placeholder='Ingrese su numero de telefono' required value={formData.mobile} onChange={handleChange}/>
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label small fw-bold'>Correo electronico</label>
                                    <input type='email' name='email' className='form-control' placeholder='Ingrese el correo electronico' required value={formData.email} onChange={handleChange}/>
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label small fw-bold'>Contraseña</label>
                                    <input type='password' name='password' className='form-control' placeholder='Ingrese su contraseña' required value={formData.password} onChange={handleChange}/>
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label small fw-bold'>Confirmar contraseña</label>
                                    <input type='password' name='confirm_password' className='form-control' placeholder='Ingrese su contraseña nuevamente' required value={formData.confirm_password} onChange={handleChange}/>
                                </div>

                                <button type='submit' className='btn btn-primary w-100' disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className='spinner-border spinner-border-sm me-2'></span>CAMBIANDO...
                                        </>
                                    ): (
                                        <>
                                            <i className='fa-solid fa-user-plus'></i>REGISTRAR USUARIO AHORA
                                        </>
                                    )}
                                </button>
                                <p className='text-center text-muted small mt-2'>¿Ya te registraste? <Link to='/user/login'>Ingrese aqui</Link></p>
                            </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserSignUp
