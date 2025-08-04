import React, { useMemo } from "react";
import { FaEye, FaUserFriends, FaUserPlus, FaFileAlt, FaHeart } from "react-icons/fa";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale
} from "chart.js";
import "chartjs-adapter-date-fns";

import Card from "../../../components/Cards/LandingPage/Card";
import LoadingSpinner from "./../../../components/LoadingSpinner/LoadingSpinner";

ChartJS.register(LinearScale, PointElement, Tooltip, Legend, TimeScale);

export default function SeeStatistics({ profilevisits, followers, following, posts = [], likes }) {
  const loading =
    profilevisits === undefined &&
    followers === undefined &&
    following === undefined &&
    posts === undefined &&
    likes === undefined;

   const chartData = useMemo(
        () => ({
            datasets: [
                {
                    label: "Curtidas por Data",
                    data: posts.map((p) => ({
                        x: p.createdAt ? new Date(p.createdAt) : new Date(),
                        y: p.likesCount ?? 0,
                    })),
                    backgroundColor: "rgba(139, 92, 246, 0.8)",
                    borderColor: "rgba(139, 92, 246, 1)",
                    pointRadius: 6,
                    pointHoverRadius: 12,
                },
            ],
        }),
        [posts]
    );

    const maxLikes = useMemo(() => {
        if (!posts || posts.length === 0) return 10;
        const max = Math.max(...posts.map((p) => p.likesCount ?? 0));
        return max === 0 ? 10 : max;
    }, [posts]);

    const chartOptions = {
        responsive: true,
        plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (context) => `Curtidas: ${context.parsed.y}`,
            },
        },
        },
        scales: {
            x: {
                type: "time",
                time: {
                    unit: "day",
                    tooltipFormat: "dd/MM/yyyy",
                    displayFormats: {
                        day: posts.length > 10 ? "dd/MM" : "dd/MM/yyyy",
                    },
                },
                ticks: {
                    maxRotation: 45,
                    autoSkip: true,
                    maxTicksLimit: 10,
                    callback: (value, index, ticks) =>
                        formatXAxisTick(value, index, ticks, posts.length),
                },
                title: { display: true, text: "Data da Publicação" },
                grid: { display: false },
            },
            y: {
                title: { display: true, text: "Curtidas" },
                beginAtZero: true,
                max: maxLikes,
                ticks: {
                    stepSize: 1,
                    callback: (value) =>
                        Number.isInteger(value) ? value : null,
                },
                grid: { drawTicks: false, drawBorder: false, color: "transparent" },
            },
        },
    };

  return (
    <section className="p-6">
      <h1 className="text-4xl font-bold text-[var(--purple-secundary)] mb-4">
        MINHAS ESTATÍSTICAS
      </h1>
      <p className="mt-2 text-lg max-w-3xl text-[var(--font-gray)]">
        Acompanhe sua atividade e o engajamento do seu perfil.
      </p>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <article className="grid grid-cols-3 gap-6 max-w-6xl mx-auto p-8">
          <Card
            icon={<FaEye className="w-6 h-6 text-[var(--purple-primary)]" />}
            title="Visualizações"
            description={
              <span className="text-3xl font-bold leading-tight">
                {profilevisits ?? 0}
              </span>
            }
          />
          <Card
            icon={<FaUserFriends className="w-6 h-6 text-[var(--purple-primary)]" />}
            title="Seguidores"
            description={
              <span className="text-3xl font-bold leading-tight">
                {followers ?? 0}
              </span>
            }
          />
          <Card
            icon={<FaUserPlus className="w-6 h-6 text-[var(--purple-primary)]" />}
            title="Seguindo"
            description={
              <span className="text-3xl font-bold leading-tight">
                {following ?? 0}
              </span>
            }
          />
          <Card
            icon={<FaFileAlt className="w-6 h-6 text-[var(--purple-primary)]" />}
            title="Publicações"
            description={
              <span className="text-3xl font-bold leading-tight">
                {posts?.length ?? 0}
              </span>
            }
          />

          <div className="row-span-2 col-span-2 p-6 flex items-center justify-center">
            <Scatter data={chartData} options={chartOptions} />
          </div>

          <Card
            icon={<FaHeart className="w-6 h-6 text-[var(--purple-primary)]" />}
            title="Curtidas"
            description={
              <span className="text-3xl font-bold leading-tight">
                {likes ?? 0}
              </span>
            }
          />
        </article>
      )}
    </section>
  );
}

function formatXAxisTick(value, index, ticks, postsLength) {
  const date = new Date(value);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return postsLength > 10
    ? `${index + 1} - ${day}/${month}`
    : `${index + 1} - ${day}/${month}/${year}`;
}