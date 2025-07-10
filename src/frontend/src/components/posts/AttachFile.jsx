import { useRef } from 'react'
import { X, Image, Video, Files } from 'lucide-react'

export default function AttachFile({type, setFormData, setActivePopUp}){
    const fileInputRef = useRef(null);

    const handleFiles = (files) => {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'video/mp4',
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        const validFiles = Array.from(files).filter(file => allowedTypes.includes(file.type));

        setFormData(prev => ({
            ...prev,
            media: [...(prev.media || []), ...validFiles]
        }));

        setActivePopUp('post');
    };

    const handleDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const handleFileChange = (e) => {
        handleFiles(e.target.files);
    };

    const openFileDialog = () => {
        fileInputRef.current.click();
    };

    return(
    <div>
        <X className="cursor-pointer ml-auto" onClick={() => setActivePopUp('post')}/>
        <div className="mt-3 p-4 border-2 border-dashed rounded-xl border-gray-400 hover:bg-gray-100 transition"
            onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                <div className="text-center text-gray-600 p-3">
                    {
                    type === 'image' 
                    ? <> 
                        <Image className='mx-auto w-50 h-50'/>
                        <p className='mt-4'>Arraste as imagens desejadas no formato JPG ou PNG ou</p>
                    </>
                    : type === 'video' 
                    ? <> 
                        <Video className='mx-auto w-50 h-50'/>
                        <p className='mt-4'>Arraste os vídeos desejados no formato MP4 ou</p>
                    </>
                    : <>
                        <Files className='mx-auto w-50 h-50'/>
                        <p className='mt-4'>Arraste os documentos desejados no formato DOCX ou PDF ou</p>
                    </>}
                    <button
                    type="button"
                    onClick={openFileDialog}
                    className="mt-2 px-4 py-2 bg-(--purple-primary) text-white rounded hover:bg-(--purple-action)"
                    >
                    Selecione do computador
                    </button>
                </div>

                <input
                    type="file"
                    accept={
                        type === 'image' ? 'image/jpeg,image/png' :
                        type === 'video' ? 'video/mp4' :
                        type === 'docs' ? '.pdf,.docx' :
                        ''
                    }
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
        </div>
    </div>
    )
}