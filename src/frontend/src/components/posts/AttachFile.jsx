import { useRef } from 'react'
import { X, Image, Files } from 'lucide-react'

export default function AttachFile({type, setFormData, setActivePopUp}){

    const fileInputRef = useRef(null);
    const handleFiles = (files) => {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
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
        <button type="button" aria-label="Voltar para a publicação" className="flex ml-auto cursor-pointer" onClick={() => setActivePopUp('post')}>
            <X aria-hidden="true"/>
        </button>
        <div className="mt-3 p-4 border-2 border-dashed rounded-xl border-gray-400 hover:bg-gray-100 transition"
            onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                <div className="text-center text-gray-600 p-3">
                    {
                        type === 'image' 
                    ? 
                        <> 
                            <Image aria-hidden="true" className='mx-auto w-16 h-16 sm:w-50 sm:h-50'/>
                            <p className='mt-4 text-sm sm:text-base max-w-xs sm:max-w-md mx-auto'>Arraste as imagens desejadas no formato JPG ou PNG ou</p>
                        </>
                    : 
                        <>
                            <Files aria-hidden="true" className='mx-auto w-16 h-16 sm:w-50 sm:h-50'/>
                            <p className='mt-4 text-sm sm:text-base max-w-xs sm:max-w-md mx-auto'>Arraste os documentos desejados no formato DOCX ou PDF ou</p>
                        </>}
                    <button
                        type="button"
                        onClick={openFileDialog}
                        className="mt-2 px-4 py-2 bg-(--purple-primary) rounded hover:bg-(--purple-action)
                                text-white  text-sm sm:text-base"
                    >
                        Selecione do seu dispositivo
                    </button>
                </div>

                <input
                    type="file"
                    accept={
                        type === 'image' ? 'image/jpeg,image/png' :
                        type === 'docs' ? '.pdf,.docx' :
                        ''
                    }
                    multiple
                    aria-label={type === 'image' ? 'Selecionar imagens' : 'Selecionar documentos'}
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
        </div>
    </div>
    )
}
