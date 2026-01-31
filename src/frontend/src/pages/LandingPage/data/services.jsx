import React from 'react'
import {
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  BriefcaseIcon,
  ShieldCheckIcon,
  UserIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'

export const services = [
  {
    icon: <ChatBubbleLeftRightIcon className="w-6 h-6 text-[#55618C]" />,
    title: 'Timeline',
    description: 'Compartilhe ideias, conquistas e projetos. Interaja, aprenda e cresça com a comunidade.',
  },
  {
    icon: <GlobeAltIcon className="w-6 h-6 text-[#55618C]" />,
    title: 'Networking',
    description: 'Conexões reais com mulheres que impulsionam o ecossistema tech.',
  },
  {
    icon: <BriefcaseIcon className="w-6 h-6 text-[#55618C]" />,
    title: 'Vagas',
    description: 'Oportunidades reais em empresas comprometidas com inclusão.',
  },
  {
    icon: <ShieldCheckIcon className="w-6 h-6 text-[#55618C]" />,
    title: 'Visibilidade',
    description: 'Mostre suas competências e conquistas para empresas e recrutadores.',
  },
  {
    icon: <UserIcon className="w-6 h-6 text-[#55618C]" />,
    title: 'Perfil',
    description: 'Centralize suas habilidades, experiências e projetos em um perfil profissional visível.',
  },
  {
    icon: <UserGroupIcon className="w-6 h-6 text-[#55618C]" />,
    title: 'Parcerias',
    description: 'Amplie seu impacto promovendo diversidade e recrutando talentos qualificados.',
  },
]