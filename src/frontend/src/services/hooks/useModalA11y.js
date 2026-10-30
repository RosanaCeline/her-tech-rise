import { useEffect, useRef } from 'react';

// pilha de modais abertos: só o do topo responde ao Esc e prende o foco
const openModals = [];

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Comportamento acessível comum aos modais: fecha com Esc, leva o foco para dentro,
 * mantém o Tab dentro do modal, devolve o foco ao fechar e trava a rolagem da página.
 */
export default function useModalA11y(isOpen, onClose) {
    const containerRef = useRef(null);
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const token = {};
        openModals.push(token);
        const previouslyFocused = document.activeElement;
        document.body.classList.add('overflow-hidden');

        const container = containerRef.current;
        const first = container?.querySelector(FOCUSABLE);
        (first || container)?.focus({ preventScroll: true });

        const handleKeyDown = (e) => {
            if (openModals[openModals.length - 1] !== token) return;

            if (e.key === 'Escape') {
                e.stopPropagation();
                onCloseRef.current?.();
                return;
            }

            if (e.key === 'Tab' && container) {
                const items = Array.from(container.querySelectorAll(FOCUSABLE));
                if (items.length === 0) {
                    e.preventDefault();
                    return;
                }
                const firstItem = items[0];
                const lastItem = items[items.length - 1];
                if (e.shiftKey && document.activeElement === firstItem) {
                    e.preventDefault();
                    lastItem.focus();
                } else if (!e.shiftKey && document.activeElement === lastItem) {
                    e.preventDefault();
                    firstItem.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            openModals.splice(openModals.indexOf(token), 1);
            if (openModals.length === 0) document.body.classList.remove('overflow-hidden');
            if (previouslyFocused instanceof HTMLElement && document.contains(previouslyFocused)) {
                previouslyFocused.focus({ preventScroll: true });
            }
        };
    }, [isOpen]);

    return containerRef;
}
