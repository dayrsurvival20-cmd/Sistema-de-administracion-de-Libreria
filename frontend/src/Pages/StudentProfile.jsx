import React, {useState, useEffect} from 'react';
import axios from 'axios'
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'

const StudentProfile = () => {

    const [profile, setProfile] = useState({
        student_id : "",
        full_name : "",
        email: "",
        mobile: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const navigate = useNavigate();

    const studentUser = JSON.parse(localStorage.getItem("studentUser"));

    useEffect(() => {
        if(!studentUser){
            navigate("/user/login");
            return;
        }

        const fetchProfile = async () => {
            try{
                setLoading(true); //api call
                const res = await axios.get("http://127.0.0.1:8000/api/user/profile/", {
                    params: {student_id: studentUser.student_id}
                });
                setProfile({
                    student_id : res.data.student_id,
                    full_name : res.data.full_name,
                    email : res.data.email,
                    mobile : res.data.mobile,
                })
            }catch (err){
                console.error(err);
                toast.error("Fallo en extraer su perfil.")
            }
            finally{
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile, //campos de perfil anterior extendidos
            [name]: value  //actualiza el campo cambiado
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            setSaving(true);
            await axios.put("http://127.0.0.1:8000/api/user/profile/", {
                student_id : profile.student_id,
                full_name : profile.full_name,
                mobile : profile.mobile,
            });
            toast.success("Perfil actualizado exitosamente");

            //actualizar Local Storage
            const updatedUser = {...studentUser, full_name: profile.full_name};
            localStorage.setItem("studentUser", JSON.stringify(updatedUser));
        }catch(err){
            console.error(err);
            toast.error("Fallo en actualizar perfil.")
        }finally{
            setSaving(false);
        }
    }

    if(loading){
        return(
            <div className='d-flex justify-content-center align-items-center' style={{height:"80vh"}}>
                <div className='spinner-border text-primary' role='status'>
                    <span className='visually-hidden'>CARGANDO...</span>
                </div>
            </div>
        )
    }

    return (
        <div className='py-5' style={{background:"linear-gradient(135deg, #f3f4ff, #fdfbff, red)", minHeight:"100vh"}}>
            <div className='container'>
                <div className='d-flex flex-wrap justify-content-between align-items-center'>
                    <div>
                        <h3 className='mb-1 d-flex align-items-center gap-2'>
                            <span className='d-inline-flex align-items-center justify-content-center rounded-3'
                            style={{width:'40px', height:'40px', background:'#0f766e1a'}}>
                                <i className='fa-solid fa-user-graduate text-primary'></i>
                            </span>
                            <span>Mi perfil</span>
                        </h3>
                        <p className='text-muted '>Ver y actualiza tu informacion de perfil aqui.</p>
                    </div>
                    <p className='mt-3'>Bienvenido {studentUser.full_name || "Invitado"}</p>
                </div>
                <div className='row justify-content-center'>
                    <div className='col-md-8'>
                        <div className='card shadow-sm border-0 rounded-4'>
                            <div className='card-body p-4'>
                                <form onSubmit={handleSubmit}>
                                    <div className='mb-3'>
                                        <label htmlFor='student_id' className='form-label'>ID del Estudiante</label>
                                        <input type='text' name='full_name' value={profile.student_id} readOnly className='form-control bg-light'></input>
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='full_name' className='form-label'>Nombre completo</label>
                                        <input type='text' name='full_name' value={profile.full_name} onChange={handleChange} className='form-control bg-light'></input>
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='email' className='form-label'>Correo Electronico</label>
                                        <input type='email' name='email' value={profile.email} readOnly className='form-control bg-light'></input>
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor='mobile' className='form-label'>Numero de Telefono</label>
                                        <input type='text' name='mobile' value={profile.mobile } onChange={handleChange} className='form-control' maxLength={10}></input>
                                    </div>
                                    <button type='submit' disabled={saving} className={`btn ${saving ? "btn-seconday" : "btn-primary"} w-100`}>
                                        {saving ? (
                                            <>
                                                <span className='spinner-border spinner-border-sm me-2' role='status' aria-hidden="true"></span>
                                                Guardando...
                                            </>
                                        ):(
                                            <>
                                                <i className='bi bi-save me-2'></i>
                                                Guardar Cambios
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

export default StudentProfile
