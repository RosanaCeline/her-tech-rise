import React from "react";
import { FaEye, FaUserFriends, FaUserPlus, FaFileAlt, FaHeart } from "react-icons/fa";

import Card from '../../../components/Cards/LandingPage/Card'
import LoadingSpinner from './../../../components/LoadingSpinner/LoadingSpinner'

export default function SeeStatistics({ profilevisits, followers, following, posts, likes }) {
  const loading = 
    profilevisits === undefined &&
    followers === undefined &&
    following === undefined &&
    posts === undefined &&
    likes === undefined;

  return (
    <section className="p-6">
        <h1 className="text-4xl font-bold text-[var(--purple-secundary)] mb-4">MINHAS ESTATÍSTICAS</h1>
        <p className="mt-2 text-lg max-w-3xl text-[var(--font-gray)]">Acompanhe sua atividade e o engajamento do seu perfil.</p>

        {loading ? (
            <LoadingSpinner />
        ) : (
            <article  className="grid grid-cols-3 gap-6 max-w-6xl mx-auto p-8">
                <Card
                    icon={<FaEye className="w-6 h-6 text-[var(--purple-primary)]" />}
                    title="Visualizações"
                    description={<span className="text-3xl font-bold leading-tight">{profilevisits ?? 0}</span>}
                />
                <Card
                    icon={<FaUserFriends className="w-6 h-6 text-[var(--purple-primary)]" />}
                    title="Seguidores"
                    description={<span className="text-3xl font-bold leading-tight">{followers ?? 0}</span>}
                />
                <Card
                    icon={<FaUserPlus className="w-6 h-6 text-[var(--purple-primary)]" />}
                    title="Seguindo"
                    description={<span className="text-3xl font-bold leading-tight">{following ?? 0}</span>}
                />
                <Card
                    icon={<FaFileAlt className="w-6 h-6 text-[var(--purple-primary)]" />}
                    title="Publicações"
                    description={<span className="text-3xl font-bold leading-tight">{posts ?? 0}</span>}
                />

                <div className="row-span-2 col-span-2 p-6 flex items-center justify-center">
                    {/* <Bar data={chartData} options={chartOptions} /> */}
                    <h2>local do grafico</h2>
                </div>

               <Card
                    icon={<FaHeart className="w-6 h-6 text-[var(--purple-primary)]" />}
                    title="Curtidas"
                    description={<span className="text-3xl font-bold leading-tight">{likes ?? 0}</span>}
                />

            </article>
        )}
    </section>
  )
}