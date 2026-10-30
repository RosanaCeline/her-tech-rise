import { createPortal } from "react-dom"

import useModalA11y from "../services/hooks/useModalA11y"

export default function PopUp({ children, onClose, ariaLabel = "Janela de publicação" }) {
    const dialogRef = useModalA11y(true, onClose)

    return createPortal(
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
            <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={ariaLabel} tabIndex={-1}
                className="bg-white rounded-2xl shadow-lg w-full text-center max-w-xl max-h-[90vh] p-6 overflow-y-auto focus:outline-none">
                {children}
            </div>
        </div>,
        document.body
    )
}
