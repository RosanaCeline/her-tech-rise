import { useState } from "react";
import LabelInput from "../../../components/form/Label/LabelInput";
import { Video, Image, Files} from 'lucide-react'
import { getCurrentUser } from "../../../services/authService";
import PopUp from "../../../components/PopUp";
import ManagePost from "../../../components/posts/ManagePost";
import AttachFile from "../../../components/posts/AttachFile";

export default function NewPost(){

    const [formData, setFormData] = useState({
        content: '',
        media: [],
        visibility: 'PUBLICO'
    })
    const [activePopUp, setActivePopUp] = useState(null)
    const user = {
        userName: getCurrentUser().name,
        profileURL: getCurrentUser().profilePicture
    }
    const isMobile = window.innerWidth < 440;
    return (
        <>
            <div className="flex items-center gap-4">
                <div className="relative w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex-shrink-0"> 
                    <img src={user.profileURL} className="h-full w-full object-cover rounded-full"/>
                </div>
                <div className="w-full">
                    <LabelInput onClick={() => setActivePopUp('post')} placeholder={ isMobile ? 'Nova publicação...' : 'Comece uma nova publicação' } />
                </div>
            </div>
            <div className="border-t my-5 border-(--purple-primary)"></div>
            <div className="flex justify-between text-(--purple-primary) font-semibold text-lg">
                <button className="flex items-center gap-3 justify-center cursor-pointer transition duration-300 hover:scale-105"
                onClick={() => setActivePopUp('video')}>
                    <Video />
                    <p className="hidden sm:block">Vídeo</p>
                </button>
                <button className="flex items-center gap-3 content-center justify-center cursor-pointer transition duration-300 hover:scale-105"
                onClick={() => setActivePopUp('image')}>
                    <Image />
                    <p className="hidden sm:block">Foto</p>
                </button>
                <button className="flex items-center gap-3 content-center justify-center cursor-pointer transition duration-300 hover:scale-105"
                onClick={() => setActivePopUp('docs')}>
                    <Files />
                    <p className="hidden sm:block">Documento</p>
                </button>
            </div>
            {activePopUp && (
                <PopUp>
                    {activePopUp === 'post' && <ManagePost user={user} setActivePopUp={setActivePopUp} formData={formData} setFormData={setFormData}/>}
                    {activePopUp === 'image' && <AttachFile type='image' setFormData={setFormData} setActivePopUp={setActivePopUp}/>}
                    {activePopUp === 'video' && <AttachFile type='video' setFormData={setFormData} setActivePopUp={setActivePopUp}/>}
                    {activePopUp === 'docs' && <AttachFile type='docs' setFormData={setFormData} setActivePopUp={setActivePopUp}/>}
                </PopUp>
            )}
        </>
    )
}