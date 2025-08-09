import { useState, useEffect } from 'react'
import BtnCallToAction from '../btn/BtnCallToAction/BtnCallToAction'
import LabelInput from "../form/Label/LabelInput"
import { Earth, Lock, X, Video, Image, Files, Trash2} from 'lucide-react'
import { newPost, updatePost } from '../../services/timelineService'

export default function ManagePost({user, setActivePopUp, formData, setFormData, isEdit, onSuccess, isShare = false }){
    const [changeVisibilityPopup, setChangeVisibilityPopup] = useState(false)
    const [postErrorMessage, setPostErrorMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [cancelModalOpen, setCancelModalOpen] = useState(false)
    const changeVisibility = (visibility) => {
        setFormData(prev => ({ ...prev, visibility: visibility }));
        setChangeVisibilityPopup(false)
    }

    const getMediaType = (mimeType) => {
        if (!mimeType) return undefined;
        if (mimeType.startsWith("image/")) return "IMAGE";
        if (mimeType.startsWith("video/")) return "VIDEO";
        return "OTHER";
    };

    const handleSubmit = async () => {
        if (formData.content !== '' || formData.media.length > 0) {
            setErrorMessage('');
            try {
                if (isEdit && formData.postId) {
                    const mediasFormatted = formData.media
                        .filter(media => media.id)
                        .map(media => ({
                            id: media.id,
                            mediaType: media.mediaType,
                            url: media.url,
                    }));

                    const newFiles = formData.media.filter(file => file instanceof File);

                    const formDataUpdated = {
                        content: formData.content,
                        visibility: (formData.visibility || 'PUBLICO').toUpperCase(),
                        medias: mediasFormatted,
                        ...(newFiles.length > 0 && { newFiles }), 
                    };

                    await updatePost(formData.postId, formDataUpdated);
                } else {
                    await newPost(formData) 
                }

                if (onSuccess) onSuccess();  
                else window.location.reload(); 
                setActivePopUp('')
            } catch (err) {
                setPostErrorMessage(err.response || 'Erro ao salvar')
                setTimeout(() => setPostErrorMessage(null), 4000)
            }
        } else {
            setErrorMessage("Insira pelo menos um texto ou anexo para publicar.")
        }
    }

    const [mediaUrls, setMediaUrls] = useState([]);

    useEffect(() => {
        const urls = formData.media
            .map(item => {
                if (item.url) {
                    return { file: item, url: item.url };
                }
                if (item instanceof File) {
                    if (item.type.startsWith('image/') || item.type === 'video/mp4') {
                    return { file: item, url: URL.createObjectURL(item) };
                    }
                }
                return null;
            })
            .filter(Boolean);
        setMediaUrls(urls);
        return () => {
            urls.forEach(({ url, file }) => {
                if (file instanceof File) {
                    URL.revokeObjectURL(url);
                }
            });
        };
    }, [formData.media]);

    useEffect(() => {
    if (!formData?.visibility) {
        setFormData(prev => ({ ...prev, visibility: 'PUBLICO' }));
    } else {
        const v = String(formData.visibility).toUpperCase();
        if (v === 'PUBLIC' || v === 'PUBLICO') {
        setFormData(prev => ({ ...prev, visibility: 'PUBLICO' }));
        } else if (v === 'PRIVATE' || v === 'PRIVADO') {
        setFormData(prev => ({ ...prev, visibility: 'PRIVADO' }));
        }
    }
    }, []); 



    const handleRemove = (fileToRemove) => {
        setFormData(prev => ({
            ...prev,
            media: prev.media.filter(file => {
                if (file.id) return file.id !== fileToRemove.id;
                return file !== fileToRemove;
            })
        }));
    };

    return(
        <>
        <div className="flex justify-between">
            <div className="flex items-center">
                <div className="relative w-full max-w-[70px] h-[70px] flex-shrink-0 mr-4">
                    <img src={user.profileURL} className="h-full w-full object-cover rounded-full"/>
                </div>
                <div className="flex flex-col items-start gap-y-1 justify-start">
                    <p className='text-nowrap'>{user.userName}</p>
                    <div className="flex text-(--purple-primary) items-center gap-x-1.5 cursor-pointer" 
                    onClick={() => setChangeVisibilityPopup(!changeVisibilityPopup)}>
                        {formData.visibility === 'PUBLICO' 
                        ? (<><Earth className="w-5 h-5"/>Pública</>)
                        : (<><Lock className="w-5 h-5"/>Privada</>)}
                    </div>
                </div>
                {changeVisibilityPopup && (
                    <div className="ml-3 flex flex-col p-1 gap-y-1">
                        <p className="p-2 text-xs bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer" 
                        onClick={() => changeVisibility('PUBLICO')}>
                            Visível para todos</p>
                        <p className="p-2 text-xs bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
                        onClick={() => changeVisibility('PRIVADO')}>
                            Apenas você pode ver isso</p>
                    </div>
                )}
            </div>
            <X className="cursor-pointer" onClick={() => (formData.content !== '' || formData.media.length !== 0) ? setCancelModalOpen(true) : setActivePopUp('')}/>
        </div>

        <div className='flex flex-col'>
        <LabelInput placeholder="Digite sua nova publicação" type="mensagem" value={formData.content} required={!formData.media.length}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}/></div>

        {formData.media.some(file => (file.type?.startsWith?.('image/') || file.mediaType === 'IMAGE') || (file.type?.startsWith?.('video/mp4') || file.mediaType === 'VIDEO')
        ) && (
            <div className="mt-4 flex gap-4 overflow-x-auto overflow-y-hidden max-w-full h-37">
                {mediaUrls.map(({file, url}, index) => {
                    return(
                        <div key={index} className='relative inline-block mr-4 min-w-[8rem]'>
                            {(file.type?.startsWith?.('image/') || file.mediaType === 'IMAGE') && <img src={url} alt="Preview" className="w-full h-32 object-cover rounded shadow"/>}
                            {(file.type?.startsWith?.('video/mp4') || file.mediaType === 'VIDEO') && <video key={index} src={url} controls className="w-full h-32 rounded shadow object-cover"/>}
                            <button onClick={() => handleRemove(file)} 
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
                <div key={index} className='flex items-center p-4 border border-blue-600 rounded shadow bg-gray-100 mb-2'>
                    <a href={URL.createObjectURL(file)} target="_blank" rel="noopener noreferrer"
                    className="flex-grow text-center text-sm text-blue-600 hover:underline truncate">
                    {file.name}
                    </a>
                    <button type='button' onClick={() => handleRemove(file)} className="ml-4">
                        <X/>
                    </button>
                </div>
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
            <BtnCallToAction variant="purple" onClick={() => handleSubmit()}>{isEdit ? "Salvar Alterações" : "Publicar"}</BtnCallToAction>
        </div>
        {errorMessage && <p className='text-center mt-2'>{errorMessage}</p>}
        {postErrorMessage && (
        <div className="fixed top-1/12 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                        z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg 
                        transition-opacity duration-300">
            {postErrorMessage}
        </div>
        )}
        {cancelModalOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-[var(--purple-primary)]">
                Confirmar Cancelamento
                </h2>
                <p className="mb-6 text-gray-700">Tem certeza que deseja cancelar publicação?</p>
                <div className="flex justify-center gap-6">
                <button
                    onClick={() => setCancelModalOpen(false)}
                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded-xl hover:bg-gray-400 transition"
                >
                    Não
                </button>
                <button
                    onClick={() => {
                        setActivePopUp('');
                        setFormData({
                            content: '',
                            media: [],
                            visibility: 'PUBLICO'
                        })
                        window.location.reload(); 
                    }}
                    className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition"
                >
                    Sim
                </button>
                </div>
            </div>
            </div>
            )}
        </>
    )
}