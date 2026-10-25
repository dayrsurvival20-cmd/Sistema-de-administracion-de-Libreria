import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {data, useNavigate} from 'react-router-dom'

const AdminChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const adminUser = localStorage.getItem("adminUser");

    useEffect(() => {
        if(!adminUser)
        {
            navigate("/admin/login");
        }

    }, []);

    const handleSubmit = async(e) => {
        e.preventDefault(); // evita el envío por defecto
        
        if(newPassword !== confirmPassword)
        {
            toast.error("La contraseña no coincide");
            return;
        }
        
        if(newPassword.length < 6)
        {
            toast.error("La nueva contraseña debe ser de almenos 6 caracteres");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post("https://sistema-de-administracion-de-libreria.onrender.com/api/change_admin_password/", { username: adminUser, current_password: currentPassword, new_password: newPassword, confirm_password: confirmPassword });
            if(res.data.success)
            {
                toast.success(res.data.message || "Contraseña cambiada exitosamente")
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            }
            else
            {
                toast.error(res.data.message || "Fallo en cambiar su contraseña ")
            }
        }
        catch (err) {
            console.error(err);
            if(err.response && err.response.data && err.response.data.message)
            {
                toast.error(err.response.data.message);
            }else{
                toast.error("Un error ocurrio mientras se cambiaba la contraseña.");
            }
        }
        finally
        {
            setLoading(false)
        }
    }

    return(
        <div className='py-5' style={{background:"linear-gradient(135deg, #f3f4ff, #fdfbff, red)", minHeight:"100vh"}}>
            <div className='container'>
                <div className='row mb-4'>
                    <div className='col-md-8 mx-auto'>
                        <div className='mb-4 text-center'>
                            <h4 className='fw-bold mb-1'>
                                <i className='fa-solid fa-key text-primary'></i>
                                Cambiar contraseña de Administrador</h4>
                            <p className='text-muted small'>
                                Actualiza tu contraseña aqui.
                            </p>
                        </div>
                    </div>
                </div>

                <div className='row g-4'>
                    <div className='col-md-8 mx-auto'>
                        <div className='card border-0 shadow-sm rounded-4'>
                            <div className='card-body p-4'>
                            <form onSubmit={handleSubmit}>
                                <div className='mb-3'>
                                    <label className='form-label small fw-bold'>Contraseña actual</label>
                                    <div className='input-group'>
                                        <span className='input-group-text bg-white'>
                                            <i className='fa-solid fa-lock'></i>
                                        </span>
                                        <input type={ showCurrent ? 'text' :'password'} className='form-control' placeholder='Ingrese contraseña actual' value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)}/>
                                        <button type='button' className='btn btn-outline-secondary' onClick={() => setShowCurrent(!showCurrent)}>
                                            {showCurrent ? <i className='fa-solid fa-eye-slash'></i> : <i className='fa-solid fa-eye'></i>}
                                        </button>
                                    </div>
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label small fw-bold'>Nueva Contraseña</label>
                                    <div className='input-group'>
                                        <span className='input-group-text bg-white'>
                                            <i className='fa-solid fa-key'></i>
                                        </span>
                                        <input type={ showNew ? 'text' :'password'} className='form-control' placeholder='Ingrese nueva contraseña' value={newPassword} onChange={(e)=>setNewPassword(e.target.value)}/>
                                        <button type='button' className='btn btn-outline-secondary' onClick={() => setShowNew(!showNew)}>
                                            {showNew ? <i className='fa-solid fa-eye-slash'></i> : <i className='fa-solid fa-eye'></i>}
                                        </button>
                                    </div>
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label small fw-bold'>Confirmar nueva contraseña</label>
                                    <div className='input-group'>
                                        <span className='input-group-text bg-white'>
                                            <i className='fa-solid fa-key'></i>
                                        </span>
                                        <input type={ showConfirm ? 'text' :'password'} className='form-control' placeholder='Ingrese nueva contraseña a confirmar' value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)}/>
                                        <button type='button' className='btn btn-outline-secondary' onClick={() => setShowConfirm(!showConfirm)}>
                                            {showConfirm ? <i className='fa-solid fa-eye-slash'></i> : <i className='fa-solid fa-eye'></i>}
                                        </button>
                                    </div>
                                </div>

                                <button type='submit' className='btn btn-primary w-100' disabled={loading}>
                                    {loading ? (
                                        <>
                                            <span className='spinner-border spinner-border-sm me-2'></span>CAMBIANDO...
                                        </>
                                    ): (
                                        <>
                                            <i className='fa-solid fa-key'></i>CAMBIAR CONTRASEÑA
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

export default AdminChangePassword
