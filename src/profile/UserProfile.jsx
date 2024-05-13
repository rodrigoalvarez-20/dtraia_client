import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { setSession, deleteSession } from '../state/slicers/session';
import { toast, ToastContainer } from 'react-toastify';
import MoonLoader from "react-spinners/MoonLoader";
import SyncLoader from "react-spinners/SyncLoader";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
    const sessionState = useSelector((state) => state.session.value);
    const stateChatId = useSelector((state) => state.active_chat.value);
    const [isLoading, setIsLoading] = useState(false);
    const [customProfileImage, setCustomProfileImage] = useState(null);
    const [hasUploadedFile, setHasUploadedFile] = useState(false);
    const [userName, setUserName] = useState("");
    const fileUploadRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const dateOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }

    useEffect(() => {
        if (Object.keys(sessionState).length === 0) {
            navigate("/login", { replace: true });
        } else {
            const tk = localStorage.getItem("token");
            axios.get(`/api/users/profile`, { headers: { "Authorization": tk } }).then(r => {
                if (r.status !== 200) {
                    toast.error("Ha ocurrido un error al validar la sesion")
                    setTimeout(() => {
                        navigate("/login", { replace: true });
                    }, 3000);
                }
            }).catch(err => {
                console.log(err);
                if (err.response && err.response.status === 401) {
                    dispatch(deleteSession());
                    return navigate("/login", { replace: true })
                }
            })
        }
    }, [])

    useEffect(() => {
        //console.log(sessionState)
        setUserName(sessionState.nombre);
        setCustomProfileImage(`/static/${sessionState.profilePic}?${new Date().getTime()}`)
    }, [sessionState]);


    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const uploadedFile = e.target.files[0];
            setCustomProfileImage(URL.createObjectURL(uploadedFile));
            setHasUploadedFile(true);
        }
    }

    const updateUserProfile = () => {
        setIsLoading(true);
        if (userName.trim() === ""){
            toast.error("El nombre de usuario es invalido")
            setIsLoading(false);
            return
        }
        const tk = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("nombre", userName);
        if (hasUploadedFile){
            formData.append("pfp", fileUploadRef.current.files[0]);
        }
        
        const config = {
            headers: {
                "content-type": "multipart/form-data",
                "Authorization": tk
            },
        };
        
        axios.patch(`/api/users/profile`, formData, config).then(r => {
            if (r.status !== 200) {
                toast.error("Ha ocurrido un error al actualizar el perfil. Intente de nuevo.")
            }else{
                toast.success(r.data.message);
                dispatch(setSession(r.data.info))
            }
        }).catch(err => {
            console.log(err);
            if (err.response && err.response.status === 401) {
                dispatch(deleteSession());
                return navigate("/login", { replace: true })
            }else if (err.response){
                toast.warning(err.response.data.error)
            }else{
                toast.error("Ha ocurrido un error al realizar la peticion.")
            }
        }).finally(() => {
            setIsLoading(false);
            // TODO Actualizar los datos de la sesion
            setHasUploadedFile(false);
        })

    }

    return (
        <div className="flex justify-center items-center h-screen" style={{ margin: "auto 24px" }}>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                theme="light"
            />
            <div className="flex justify-center items-center" style={{ flexDirection: "column", minWidth: "30%", maxWidth: "50%" }}>
                <p className="text-4xl text-center font-bold mb-4">
                    Perfil de Usuario
                </p>
                <img
                    className='m-6'
                    src={customProfileImage}
                    style={{ borderRadius: 16, width: 180, height: 180, cursor: "pointer", objectFit: "cover" }}
                    onClick={() => { fileUploadRef.current.click() }}
                    alt='Profile Icon' />
                <input
                    type='file'
                    accept='image/*'
                    ref={fileUploadRef}
                    style={{ display: "none" }}
                    onChange={handleFileUpload} />
                <input
                type='text'
                    className="text-center text-black w-full px-3 py-2 m-4 border focus:outline-none focus:ring focus:border-blue-300"
                    style={{ borderRadius: 18, maxWidth: 300 }}
                    placeholder="Nombre de usuario"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <p className="muted mb-4 text-center text-sm font-bold text-grey-600">
                    Miembro desde {new Date(sessionState.createdDate).toLocaleDateString("es-MX", dateOptions)}
                </p>
                <p className="mb-4 text-center text-md font-bold text-white">
                    Correo Electronico: {sessionState.email}
                </p>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {
                        isLoading ? <MoonLoader size={32} color='#ffffff' /> : <button
                            onClick={updateUserProfile}
                            className="m-2 bg-yellow-400 hover:bg-yellow-600 text-white rounded-md h-10"
                            style={{ width: "50%", maxWidth: 220, minWidth: 180 }}
                        >
                            Guardar Cambios
                        </button>
                }
                    <button
                        className="m-2 bg-red-500 hover:bg-red-600 text-white rounded-md h-10"
                        style={{ width: "50%", maxWidth: 220, minWidth: 180 }}
                    >
                        Eliminar cuenta
                    </button>
                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="m-2 bg-blue-400 hover:bg-blue-500 text-white rounded-md h-10"
                    style={{ width: "50%", maxWidth: 220, minWidth: 180 }}
                >
                    Regresar
                </button>
            </div>

        </div>
    )
}


export default UserProfile