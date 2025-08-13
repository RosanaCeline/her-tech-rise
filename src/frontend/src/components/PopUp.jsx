export default function PopUp({children}){
    return(
         <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full text-center max-w-lg overflow-auto max-h-[90vh] p-6">
                {children}
            </div>
        </div>
    )
}