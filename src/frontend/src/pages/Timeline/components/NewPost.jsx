import { useEffect, useState } from "react";
import LabelInput from "../../../components/form/Label/LabelInput";
import { Video, Image, Files} from 'lucide-react'
import { getProfileById } from "../../../services/userService";
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
    const [user, setUser] = useState({
        userName: getCurrentUser().name,
        profileURL: ''
    })
    // solução temporária para conseguir a foto
    useEffect(() => {
        async function getProfileURL() {
            const data = await getProfileById()
            setUser({...user, profileURL: data.profilePic})
        }
        getProfileURL()
    }, [])

    return (
        <>
            <div className="flex gap-x-4">
                <img src={user.profileURL} className="h-17 min-w-17 aspect-square"/>
                <div className="w-full pt-2">
                    <LabelInput placeholder="Comece uma nova publicação" onClick={() => setActivePopUp('post')}/>
                </div>
            </div>
            <div className="border-t my-5 border-(--purple-primary)"></div>
            <div className="flex justify-between text-(--purple-primary) font-semibold text-lg">
                <button className="flex items-center gap-3 justify-center cursor-pointer transition duration-300 hover:scale-105"
                onClick={() => setActivePopUp('video')}>
                    <Video />
                    Vídeo
                </button>
                <button className="flex items-center gap-3 content-center justify-center cursor-pointer transition duration-300 hover:scale-105"
                onClick={() => setActivePopUp('image')}>
                    <Image />
                    Foto
                </button>
                <button className="flex items-center gap-3 content-center justify-center cursor-pointer transition duration-300 hover:scale-105"
                onClick={() => setActivePopUp('docs')}>
                    <Files />
                    Documento
                </button>
            </div>
            {activePopUp && (
                <PopUp>
                    {activePopUp === 'post' && <ManagePost user={user} setActivePopUp={setActivePopUp} 
                    formData={formData} setFormData={setFormData}/>}
                    {activePopUp === 'image' && <AttachFile type='image' setFormData={setFormData} setActivePopUp={setActivePopUp}/>}
                    {activePopUp === 'video' && <AttachFile type='video' setFormData={setFormData} setActivePopUp={setActivePopUp}/>}
                    {activePopUp === 'docs' && <AttachFile type='docs' setFormData={setFormData} setActivePopUp={setActivePopUp}/>}
                </PopUp>
            )}
        </>
    )
}