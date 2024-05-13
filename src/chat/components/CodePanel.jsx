import { useSelector, useDispatch } from 'react-redux';
import { setCodeToExecute, togglePanel } from '../../state/slicers/code_panel';
import { deleteSession } from '../../state/slicers/session';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { sha256 } from "js-sha256";
import { IoMdClose } from "react-icons/io";
import { FaFileCode } from "react-icons/fa";
import { IoTerminal } from "react-icons/io5";
import { GiMeshNetwork } from "react-icons/gi";
import { Button, Accordion, Tabs } from "flowbite-react"
import Lottie from "lottie-react";
import axios from 'axios';


import codeanimation from "../../assets/code_animation.json";
import SlidingPanel from 'react-sliding-side-panel';
import 'react-sliding-side-panel/lib/index.css';

const CodePanel = () => {
    const codePanel = useSelector((state) => state.code_panel.value);
    const [isLoading, setIsLoading] = useState(true);
    const [codesToExecute, setCodesToExecute] = useState([]);
    const [codeResults, setCodeResults] = useState([]);
    const [canDisplayNetwork, setCanDisplayNetwork] = useState(false);
    const [networkImageUrl, setNetworkUrlImage] = useState(null)
    const [isGeneratingImage, setIsGeneratingImage] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (codePanel.isOpened) {
            let codeFragments = codePanel.code_execute.split("```").filter(f => f.startsWith("python"));
            codeFragments = codeFragments.map(f => f.replace(/^(python)(\n)*/g, ""));
            setCodesToExecute(codeFragments);
        }
    }, [codePanel])

    useEffect(() => {
        if (codesToExecute.length < 1) {
            console.log("Code To Exec Empty")
            return
        }

        const code_body = {
            "code_fragments": codesToExecute
        }
        const tk = localStorage.getItem("token");
        axios.post(`/api/code`, code_body, { "headers": { "Authorization": tk } }).then(r => {
            //console.log(r.data);
            if (r.status !== 200) {
                toast.warning("Ha ocurrido un error al ejecutar el codigo. Por favor intente de nuevo.");
                setTimeout(handleClosePanel, 3000);
                setIsLoading(false)
            } else {
                toast.success(r.data.message)
                //console.log(r.data);
                let codeOutputs = r.data.output.split("\n");
                codeOutputs = codeOutputs.slice(0, codeOutputs.length - 1);
                setCodeResults(codeOutputs);
                setCanDisplayNetwork(r.data.can_take_photo)
                setIsLoading(false)
            }
        }).catch(e => {
            console.log(e.response)
            if (e.response && e.response.status === 401) {
                dispatch(deleteSession());
                return navigate("/login", { replace: true })
            } else if (e.response.data.error) {
                toast.error(e.response.data.error)
            } else {
                toast.error("Ha ocurrido un error al ejecutar el fragmento de codigo.")
                setTimeout(handleClosePanel, 3000);
            }
        });

    }, [codesToExecute]);

    useEffect(() => {
        if (!canDisplayNetwork){
            console.log("Cant display network")
            return 
        }

        let project_id = codeResults[1].split("Respuesta: ")[1]
        project_id = JSON.parse(project_id)["project_id"]

        console.log("Requesting Topology")

        if (!project_id){
            toast.error("Ha ocurrido un error al generar la imagen de la topologia. Por favor, vuelva a intentarlo.")
            return
        }
        setIsGeneratingImage(true);
        const tk = localStorage.getItem("token");
        axios.get(`/api/code/network?project_id=${project_id}`, { "headers": { "Authorization": tk } }).then(r => {
            console.log(r.data);
            if (r.status !== 200) {
                toast.warning("Ha ocurrido un error al generar la vista previa de la topologia. Por favor intente de nuevo.");
            } else {
                toast.success(r.data.message)
                setNetworkUrlImage(r.data.image)
                setIsGeneratingImage(false);
            }
        }).catch(e => {
            console.log(e.response)
            if (e.response && e.response.status === 401) {
                dispatch(deleteSession());
                return navigate("/login", { replace: true })
            } else if (e.response.data.error) {
                toast.error(e.response.data.error)
            } else {
                toast.error("Ha ocurrido un error al ejecutar el generar la vista previa de la topologia.")
            }
        });
    }, [canDisplayNetwork]);


    const handleClosePanel = () => {
        setIsLoading(true);
        setCodeResults([])
        setCanDisplayNetwork(false)
        setIsGeneratingImage(true);
        setNetworkUrlImage(null);
        dispatch(setCodeToExecute(""))
        dispatch(togglePanel())
    }

    function renderCodeResponses(codeResponse, idx) {
        if (idx === 0 || codeResponse.search("{") === -1) {
            return (
                <p className="mb-2 text-gray-500 dark:text-gray-400">
                    {codeResponse.replace("\"", "")}
                </p>
            )
        } else {
            let jsonRespose = codeResponse.split("Respuesta: ")[1]
            return (
                <SyntaxHighlighter
                    PreTag="div"
                    customStyle={{ width: "100%", fontSize: "12px", maxHeight: "450px" }}
                    language="json"
                    style={darcula}>
                    {JSON.stringify(JSON.parse(jsonRespose), null, 2)}
                </SyntaxHighlighter>
            )
        }
    }


    return (
        <SlidingPanel
            type={'right'}
            isOpen={codePanel.isOpened}
            size={60}
            backdropClicked={handleClosePanel}>
            <div style={{ backgroundColor: "white", borderRadius: "8px", padding: "12px", overflow: "auto", alignItems: "center", height: "100%", display: "flex", flexDirection: "column" }}>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    theme="light"
                />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>
                    <p className='text-lg font-semibold ml-6 mr-4' style={{ flex: 1, textAlign: "center" }}>Panel de ejecución</p>
                    <Button size="xs" className='mr-2' outline gradientDuoTone="pinkToOrange" onClick={handleClosePanel}>
                        <IoMdClose className="h-6 w-6" />
                    </Button>
                </div>
                <div style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
                    <Tabs aria-label="Execution Tabs" style="underline" defaultValue={-1}>
                        <Tabs.Item title="Código" icon={FaFileCode} id='Code Tab' tabIndex={0}>
                            {
                                codesToExecute.map((code, idx) => {
                                    return (
                                        <SyntaxHighlighter
                                            key={sha256(code)}
                                            PreTag="div"
                                            customStyle={{ fontSize: "12px", borderRadius: "8px", maxHeight: "80vh" }}
                                            language="python"
                                            style={darcula}>
                                            {code}
                                        </SyntaxHighlighter>
                                    )
                                })
                            }
                        </Tabs.Item>
                        <Tabs.Item active title="Salida de ejecución" icon={IoTerminal} tabIndex={-1}
                            style={{ overflow: "auto", width: "95%", minHeight: "450px", maxHeight: "80vh" }} >
                            {
                                isLoading ?
                                    <Lottie animationData={codeanimation} loop={true} style={{ height: "180px" }} /> :
                                    <div style={{  }}>
                                        {
                                            codeResults.map((code, idx) => {
                                                return (
                                                    <Accordion key={sha256(code)} className='mb-2' style={{ margin: "6px 8px" }} collapseAll>
                                                        <Accordion.Panel>
                                                            <Accordion.Title>Respuesta #{idx + 1}</Accordion.Title>
                                                            <Accordion.Content>
                                                                {renderCodeResponses(code, idx)}
                                                            </Accordion.Content>
                                                        </Accordion.Panel>
                                                    </Accordion>
                                                )
                                            })
                                        }
                                    </div>
                            }
                        </Tabs.Item>
                        <Tabs.Item 
                            title="Topología"
                            icon={GiMeshNetwork}
                            disabled={isGeneratingImage}>
                            <div style={{ justifyContent: "center", display: "flex", margin: "auto", width: "95%" }}>
                                <img
                                    onClick={() => { window.open(networkImageUrl, "_blank") }}
                                    alt="Network Topology"
                                    src={networkImageUrl}
                                    style={{ width: "90%", height: "50%", objectFit: "contain", marginTop: "12px", marginBottom: "12px", cursor: "pointer" }} />
                            </div>
                            
                        </Tabs.Item>
                    </Tabs>
                </div>
            </div>
        </SlidingPanel>
    )
}

export default CodePanel