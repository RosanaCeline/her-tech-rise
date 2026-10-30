import { useState } from "react";

import { Image, Files} from 'lucide-react'

import { getCurrentUser } from "../../../services/authService";
import PopUp from "../../../components/PopUp";
import ManagePost from "../../../components/posts/ManagePost";
import AttachFile from "../../../components/posts/AttachFile";

export default function NewPost({ onCreated }){

    const [activePopUp, setActivePopUp] = useState(null);
    const [formData, setFormData] = useState({
        content: '',
        media: [],
        visibility: 'PUBLICO'
    })
    const currentUser = getCurrentUser();
    const user = {
        userName: currentUser.name,
        profileURL: currentUser.profilePicture
    }

    return (
        <>
            <div className="flex items-center gap-4">
                <div className="relative w-[50px] h-[50px] md:w-[70px] md:h-[70px] flex-shrink-0">
                    <img src={user.profileURL} alt="" className="h-full w-full object-cover rounded-full"/>
                </div>
                <button
                    type="button"
                    onClick={() => setActivePopUp('post')}
                    className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg text-gray-500 hover:bg-slate-50 cursor-pointer transition"
                >
                    <span className="sm:hidden">Nova publicação...</span>
                    <span className="hidden sm:inline">Comece uma nova publicação</span>
                </button>
            </div>
            <div className="border-t my-5 border-(--purple-primary)"></div>
            <div className="flex justify-around text-(--purple-primary) font-semibold text-lg">
                <button type="button" aria-label="Publicar foto"
                    className="flex items-center gap-3 content-center justify-center cursor-pointer transition duration-300 hover:scale-105"
                    onClick={() => setActivePopUp('image')}>
                        <Image aria-hidden="true" />
                        <span className="hidden sm:block">Foto</span>
                </button>
                <button type="button" aria-label="Publicar documento"
                    className="flex items-center gap-3 content-center justify-center cursor-pointer transition duration-300 hover:scale-105"
                    onClick={() => setActivePopUp('docs')}>
                        <Files aria-hidden="true" />
                        <span className="hidden sm:block">Documento</span>
                </button>
            </div>
            {activePopUp && (
                <PopUp onClose={() => setActivePopUp(null)} ariaLabel="Nova publicação">
                    {activePopUp === 'post' && (
                        <ManagePost user={user} setActivePopUp={setActivePopUp} formData={formData} setFormData={setFormData}
                            onSuccess={(post) => onCreated?.(post)} />
                    )}
                    {activePopUp === 'image' && <AttachFile type='image' setFormData={setFormData} setActivePopUp={setActivePopUp}/>}
                    {activePopUp === 'docs' && <AttachFile type='docs' setFormData={setFormData} setActivePopUp={setActivePopUp}/>}
                </PopUp>
            )}
        </>
    )
}
