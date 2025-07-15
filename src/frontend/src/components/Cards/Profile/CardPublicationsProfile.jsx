import React from 'react';

export default function CardPublicationsProfile ({ title, posts }) {

    return (
        <article
        className="
            bg-[var(--gray)]
            text-[var(--purple-secundary)]
            drop-shadow-md
            rounded-xl
            p-8
            flex flex-col
            w-full
            max-w-8xl
            z-0
        "
        >
        <h2 className="text-4xl font-semibold text-[var(--purple-secundary)] mb-4">
            {title}
        </h2>
        {posts && posts.length > 0 ? (
        posts.map(post => (
          <article key={post.id}>
            <p>{post.content}</p>
          </article>
        ))
      ) : (
        <p>Sem publicações para mostrar.</p>
      )}
        </article>
    )
}
