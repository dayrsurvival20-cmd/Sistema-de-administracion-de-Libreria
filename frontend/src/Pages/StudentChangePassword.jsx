import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'

const StudentChangePassword = () => {

    const [form, setForm] = useState({
        old_password : "",
        new_password : "",
        confirm_password: "",
    });

    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const studentUser = JSON.parse(localStorage.getItem("studentUser"));

    useEffect(() => {
        if(!studentUser){
            navigate("/user/login");
            return;
        }
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setForm((prevForm) => ({
            ...prevForm, //campos de perfil anterior extendidos
            [name]: value  //actualiza el campo cambiado
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(form.new_password != form.confirm_password){
            toast.error("Nueva contraseña y confirmar contraseña no coinciden");
            return;
        }

        try{
            setSaving(true);
            const res = await axios.post("https://sistema-de-administracion-de-libreria.onrender.com/api/user/change_password/", {
                student_id : studentUser.student_id,
                current_password : form.current_password,
                new_password : form.new_password,
                confirm_password : form.confirm_password
            });
            toast.success(res.data.message || "Contraseña cambiada exitosamente.");

            //actualizar Local Storage
            setForm({
                current_password:"",
                new_password:"",
                confirm_password:""
            })
        }catch(err){
            console.error(err);
            toast.error("Fallo en cambiar contraseña.")
        }finally{
            setSaving(false);
        }
    }

    return (
        <div className='py-5' style={{background:"linear-gradient(135deg, #f3f4ff, #fdfbff)", minHeight:"100vh"}}>
            <div className='container'>
                <div className='d-flex flex-wrap justify-content-between align-items-center'>
                    <div>
                        <h3 className='mb-1 d-flex align-items-center gap-2'>
                            <span className='d-inline-flex align-items-center justify-content-center rounded-3'
                            style={{width:'40px', height:'40px', background:'#0f766e1a'}}>
                                <i className='fa-solid fa-key text-primary'></i>
                            </span>
                            <span>Mi contaseña</span>
                        </h3>
                        <p className='text-muted '>Cambiar tu contraseña aqui.</p>
                    </div>
                    <p className='mt-3'>Bienvenido {studentUser.full_name || "Invitado"}</p>
                </div>
                <div className='row justify-content-center'>
                    <div className='col-md-6'>
                        <div className='card shadow-sm border-0 rounded-3'>
                            <div className='card-body p-4'>
                                <form onSubmit={handleSubmit}>
                                    <div className='mb-3'>
                                        <label htmlFor="current_password" className='form-label'>Contraseña Actual</label>
                                            <input type="password" className='form-control' id='current_password' name='current_password' value={form.current_password} onChange={handleChange} required/>
                                    </div>

                                    <div className='mb-3'>
                                        <label htmlFor="new_password" className='form-label'>Nueva Contraseña</label>
                                            <input type="password" className='form-control' id='new_password' name='new_password' value={form.new_password} onChange={handleChange} required/>
                                    </div>

                                    <div className='mb-3'>
                                        <label htmlFor="current_password" className='form-label'>Confirmar nueva contraseña</label>
                                            <input type="password" className='form-control' id='confirm_password' name='confirm_password' value={form.confirm_password} onChange={handleChange} required/>
                                    </div>

                                    <button type='submit' disabled={saving} className={`btn ${saving ? "btn-seconday" : "btn-primary"} w-100`}>
                                        {saving ? (
                                            <>
                                                <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden="true"></span>
                                                Actualizando...
                                            </>
                                        ):(
                                            <>
                                                <i className='fa fa-key me-2'></i>
                                                Cambiar Contraseña
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

export default StudentChangePassword
