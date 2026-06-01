import { useEffect } from "react"

export default function PopUp({ children }) {
    useEffect(() => {
        document.body.classList.add('overflow-hidden')
        return () => document.body.classList.remove('overflow-hidden')
    }, [])

    return (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-lg w-full text-center max-w-xl max-h-[90vh] p-6 overflow-hidden">
                {children}
            </div>
        </div>
    )
}