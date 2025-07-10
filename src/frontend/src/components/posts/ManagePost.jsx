import { useState } from 'react'
import BtnCallToAction from '../btn/BtnCallToAction/BtnCallToAction'
import LabelInput from "../form/Label/LabelInput"
import { Earth, Lock, X, Video, Image, Files, Trash2} from 'lucide-react'

export default function ManagePost({user, setActivePopUp, formData, setFormData}){
    const [changeVisibilityPopup, setChangeVisibilityPopup] = useState(false)
    
    const changeVisibility = (visibility) => {
        setFormData(prev => ({ ...prev, visibility: visibility }));
        setChangeVisibilityPopup(false)
    }

    const handleSubmit = () => {
        if(formData.content !== '' || formData.media.length > 0){
            console.log(formData)
        }
    }
    
    return(
        <>
        <div className="flex justify-between">
            <div className="flex items-center ">
                <img src={user.profileURL} className="h-17 min-w-17 aspect-square mr-4"/>
                <div className="flex flex-col items-start gap-y-1 justify-start">
                    {user.userName}
                    <div className="flex text-(--purple-primary) items-center gap-x-1.5 cursor-pointer" 
                    onClick={() => setChangeVisibilityPopup(!changeVisibilityPopup)}>
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
            <X className="cursor-pointer" onClick={() => setActivePopUp(null)}/>
        </div>

        <div className='flex flex-col'>
        <LabelInput placeholder="Digite sua nova publicação" type="mensagem" value={formData.content} required={!formData.media.length}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}/></div>

        {formData.media.some(file => file.type.startsWith('image/') || file.type === 'video/mp4') && (
        <div className="mt-4 flex gap-4 overflow-x-auto overflow-y-hidden max-w-full h-37">
            {formData.media.map((file, index) => {
                const url = URL.createObjectURL(file);

                const handleRemove = () => {
                    setFormData(prev => ({...prev, media: prev.media.filter((_, i) => i !== index)}))
                }

                return(
                    <div key={index} className='relative inline-block mr-4 min-w-[8rem]'>
                        {file.type.startsWith('image/') && <img src={url} alt="Preview" className="w-full h-32 object-cover rounded shadow"/>}
                        {file.type === 'video/mp4' && <video key={index} src={url} controls className="w-full h-32 rounded shadow object-cover"/>}
                        <button onClick={handleRemove} 
                        className='absolute top-1 right-1 bg-(--purple-primary) text-white rounded-full w-9 h-9 flex items-center justify-center hover:bg-(--purple-action)'>
                            <Trash2 />
                        </button>
                    </div>
                )
            })}
        </div>
        )}

        <div>
           {formData.media
            .filter(file =>
                file.type === 'application/pdf' ||
                file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            )
            .map((file, index) => (
                <a key={index} href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer"
                className="block p-4 border rounded shadow bg-gray-100 text-sm text-blue-600 hover:underline">
                {file.name}
                </a>
            ))}
        </div>

        <div className="flex justify-between">
            <div className="border border-(--font-gray) p-3 rounded-2xl flex gap-x-4 items-center">
                <p className='hidden md:flex'>Adicionar à publicação</p>
                <Video className="transition duration-300 hover:scale-110 cursor-pointer text-(--purple-primary) h-8 w-8"
                onClick={() => setActivePopUp('video')}/>
                <Image className="transition duration-300 hover:scale-110 cursor-pointer text-(--purple-primary) h-8 w-8"
                onClick={() => setActivePopUp('image')}/>
                <Files className="transition duration-300 hover:scale-110 cursor-pointer text-(--purple-primary) h-8 w-8"
                onClick={() => setActivePopUp('docs')}/>
            </div>
            <BtnCallToAction variant="purple" onClick={handleSubmit}>Publicar</BtnCallToAction>
        </div>
        </>
    )
}