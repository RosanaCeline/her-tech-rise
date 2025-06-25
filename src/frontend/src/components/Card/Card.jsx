import React from 'react';

export default function Card({ icon, title, description }) {
  return (
    <article className='card'>
      <div className='icon'>{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}