import { useEffect, useState } from "react";
import LabelInput from "../../../components/form/Label/LabelInput";
import { getProfessionalProfile } from "../../../services/profileService";
import { Video, Image, Files, X, Earth, Lock} from 'lucide-react'
import { getCurrentUser } from "../../../services/authService";
import BtnCallToAction from "../../../components/btn/BtnCallToAction/BtnCallToAction";
import PopUp from "./PopUp";

export default function NewPost(){
    const [activePopUp, setActivePopUp] = useState(null)
    const [changeVisibilityPopup, setChangeVisibilityPopup] = useState(false)
    const [formData, setFormData] = useState({
        content: '',
        media: [],
        visibility: 'public'
    })

    const changeVisibility = (visibility) => {
        setFormData(prev => ({ ...prev, visibility: visibility }));
        setChangeVisibilityPopup(false)
    }

    const userName = getCurrentUser().name
    // solução temporária para conseguir a foto
    const [profileURL, setProfileURL] = useState('')

    useEffect(() => {
        async function getProfileURL() {
            const data = await getProfessionalProfile(1)
            setProfileURL(data.profilePic)
        }
        getProfileURL()
    }, [])

    return (
        <>
            <div className="flex gap-x-4">
                <img src={profileURL} className="h-17 min-w-17 aspect-square"/>
                <div className="w-full pt-2">
                    <LabelInput placeholder="Comece uma nova publicação" onClick={() => setActivePopUp('post')}/>
                </div>
            </div>
            <div className="border-t my-5 border-(--purple-primary)"></div>
            <div className="flex justify-between text-(--purple-primary) font-semibold text-lg">
                <button className="flex items-center gap-3 justify-center cursor-pointer transition duration-300 hover:scale-105">
                    <Video />
                    Vídeo
                </button>
                <button className="flex items-center gap-3 content-center justify-center cursor-pointer transition duration-300 hover:scale-105">
                    <Image />
                    Foto
                </button>
                <button className="flex items-center gap-3 content-center justify-center cursor-pointer transition duration-300 hover:scale-105">
                    <Files />
                    Documento
                </button>
            </div>
            {activePopUp === 'post' ? (
               <PopUp>
                <div className="flex justify-between">
                    <div className="flex items-center ">
                        <img src={profileURL} className="h-17 min-w-17 aspect-square mr-4"/>
                        <div className="flex flex-col items-start gap-y-1 justify-start">
                            {userName}
                            <div className="flex text-(--purple-primary) items-center gap-x-1.5 cursor-pointer" onClick={() => setChangeVisibilityPopup(!changeVisibilityPopup)}>
                                {formData.visibility === 'public' 
                                ? (<><Earth className="w-5 h-5"/>Pública</>)
                                : (<><Lock className="w-5 h-5"/>Privada</>)}
                            </div>
                        </div>
                        {changeVisibilityPopup && (
                            <div className="ml-3 flex flex-col p-1 gap-y-1">
                                <p className="p-2 text-xs bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer" 
                                onClick={() => changeVisibility('public')}>
                                    Visível para todos</p>
                                <p className="p-2 text-xs bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                                onClick={() => changeVisibility('private')}>
                                    Apenas você pode ver isso</p>
                            </div>
                        )}
                    </div>
                    <button className="cursor-pointer" onClick={() => setActivePopUp(null)}><X/></button>
                </div>
                <LabelInput placeholder="Digite sua nova publicação" type="mensagem"/>
                <div className="flex justify-between">
                    <div className="border border-(--font-gray) p-3 rounded-2xl flex gap-x-4 items-center">
                        Adicionar à publicação
                        <Video className="transition duration-300 hover:scale-110 cursor-pointer text-(--purple-primary) h-8 w-8"/>
                        <Image className="transition duration-300 hover:scale-110 cursor-pointer text-(--purple-primary) h-8 w-8"/>
                        <Files className="transition duration-300 hover:scale-110 cursor-pointer text-(--purple-primary) h-8 w-8"/>
                    </div>
                    <BtnCallToAction variant="purple">Publicar</BtnCallToAction>
                </div>
               </PopUp>
            ) : ''}
        </>
    )
}