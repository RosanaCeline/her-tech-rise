import { useInView } from 'react-intersection-observer'

export function FadeInSection({ children }) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '0px 0px -10% 0px',
    triggerOnce: true,
  })

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out
        motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0
        ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      {children}
    </div>
  )
}
