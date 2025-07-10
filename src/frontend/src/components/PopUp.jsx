export default function PopUp({children}){
    return(
         <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center w-1/2 flex flex-col gap-4">
                {children}
            </div>
        </div>
    )
}