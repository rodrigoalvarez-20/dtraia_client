import { useEffect, useState } from "react"
import { toast, ToastContainer } from 'react-toastify';
import { PUB_KEY } from "../../assets/constants";
import { sha256 } from "js-sha256";
import { pki, md, mgf1, util} from "node-forge";
import MoonLoader from "react-spinners/MoonLoader";
import axios from "axios";
import PasswordInput from "../../ui/components/PasswordInput";

const RecoverPassword = () => {

    const [isLoading, setIsLoading ] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const [isResetCorrect, setIsResetCorrect] = useState(false);


    useEffect(() => {
        setUserToken(window.location.search.split("token=")[1])
    }, [])


    const sendResetRequest = (e) => {
        e.preventDefault()

        const usrPwd = e.target[0].value;
        const usrPwd_v = e.target[2].value
        
        const regexPwd = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");

        if (!regexPwd.test(usrPwd)) {
            toast.error("La contraseña es invalida.");
            return
        } else if (usrPwd !== usrPwd_v) {
            toast.warning("Las contraseñas no coinciden. Por favor revise los datos.");
            return
        }

        const pki_key = pki.publicKeyFromPem(PUB_KEY);
        const sha_pwd = sha256(usrPwd)

        const enc_pwd = pki_key.encrypt(sha_pwd, "RSA-OAEP", {
            md: md.sha256.create(),
            mgf1: mgf1.create()
        });

        setIsLoading(true);
        const headers = {
            "Authorization": userToken
        }

        const payload = { "email": "", "password": util.encode64(enc_pwd) }

        axios.post(`/api/users/reset_password`, payload , { "headers": headers }).then(r => {
            console.log(r.data)
            if (r.status !== 200){
                toast.error(r.data.error);
            }else {
                toast.success(r.data.message)
                setIsResetCorrect(true);
            }
        }).catch(e => {
            console.log(e);
            if (e.response.data.error){
                toast.error(e.response.data.error)
            }else{
                toast.error("Ha ocurrido un error al solicitar el restablecimiento")
            }
        }).finally(() => {
            console.log(isResetCorrect)
            setIsLoading(false);
            if (isResetCorrect){
                setTimeout(() => {
                    window.location.href = "/"
                }, 5000);
            }
        });

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
            <form
                id="resetPasswordForm"
                onSubmit={sendResetRequest}
                style={{ margin: "auto 24px" }}
                className="bg-white p-8 shadow-md rounded-md mt-[-200px]">
                <p className="text-4xl text-center font-bold mb-4">
                    Restablecimiento de contraseña
                </p>
                <PasswordInput placeholder="Contraseña" id="pwd" name="pwd" />
                <PasswordInput placeholder="Confirmar contraseña" id="cpwd" name="cpwd" />
                <p className="muted mb-2 mt-2 text-center text-sm font-bold text-grey-600">
                    * La contraseña debe de tener +8 caracteres, un caracter especial y un numero *
                </p>
                <div className="flex" style={{ justifyContent: "space-around", alignItems: "center" }}>
                    {
                        isLoading ? <MoonLoader
                            loading={true}
                            size={28}
                            color='#1200ff'
                            aria-label="Loading Spinner" /> :
                            <button
                                className="m-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md w-1/3 h-10"
                                type="submit"
                            >
                                Aceptar
                            </button>
                    }
                </div>
            </form>
        </div>
    )
}


export default RecoverPassword