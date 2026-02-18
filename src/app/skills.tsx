"use client";

import { Typography } from "@material-tailwind/react";
import {
  RectangleGroupIcon,
  FingerPrintIcon,
  SwatchIcon,
  HashtagIcon,
  EyeIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import { SkillCard } from "@/components";

const SKILLS = [
  {
    icon: RectangleGroupIcon,
    title: "Administration et maintenance systèmes",
    children:
      "Gestion, surveillance et maintenance des postes de travail, serveurs et équipements informatiques afin d’assurer stabilité, sécurité et disponibilité des services.",
  },
  {
    icon: FingerPrintIcon,
    title: "Réseaux informatiques",
    children:
      "Installation, configuration et dépannage de réseaux locaux (LAN), Wi‑Fi, routeurs et switches, avec un souci permanent de performance et de continuité de service.",
  },
  {
    icon: SwatchIcon,
    title: "Support technique & assistance",
    children:
      "Prise en charge des incidents utilisateurs, diagnostic rapide des pannes matérielles ou logicielles et mise en place de solutions durables et documentées.",
  },
  {
    icon: HashtagIcon,
    title: "Sécurité et sauvegarde",
    children:
      "Mise en place de bonnes pratiques de sécurité, d’outils de protection et de stratégies de sauvegarde pour réduire les risques de perte de données et d’intrusion.",
  },
  {
    icon: EyeIcon,
    title: "Supervision et amélioration continue",
    children:
      "Suivi des performances des infrastructures et proposition d’améliorations pour optimiser les ressources, réduire les temps d’arrêt et anticiper les incidents.",
  },
  {
    icon: DocumentTextIcon,
    title: "Documentation et procédure",
    children:
      "Rédaction de procédures techniques, fiches d’intervention et rapports clairs pour faciliter la maintenance, le transfert de compétences et la traçabilité.",
  },
];

// KPIs simples (tu peux ajuster les chiffres)
const KPIS = [
  { label: "Années d’expérience", value: "5+" },
  { label: "Parcs accompagnés", value: "20+" },
  { label: "Interventions réalisées", value: "200+" },
];

export function Skills() {
  return (
    <section className="px-8 py-16">
      <div className="container mx-auto mb-12 text-center">
        <Typography color="blue-gray" className="mb-2 font-bold uppercase">
          Mes compétences
        </Typography>
        <Typography variant="h1" color="blue-gray" className="mb-4">
          Ce que je fais
        </Typography>
        <Typography
          variant="lead"
          className="mx-auto w-full !text-gray-500 lg:w-10/12"
        >
          Je mets mon expertise en réseaux, technique et maintenance au service
          des entreprises afin de garantir des infrastructures informatiques
          fiables, sécurisées et toujours opérationnelles.
        </Typography>
      </div>

      {/* KPIs */}
      <div className="container mx-auto mb-12 grid gap-4 md:grid-cols-3">
        {KPIS.map((kpi, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-200 bg-white p-4 text-center shadow-sm transition-transform transition-shadow duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <Typography
              variant="h4"
              color="blue-gray"
              className="font-bold mb-1"
            >
              {kpi.value}
            </Typography>
            <Typography className="text-sm !text-gray-500">
              {kpi.label}
            </Typography>
          </div>
        ))}
      </div>

      {/* Cartes compétences animées */}
      <div className="container mx-auto grid grid-cols-1 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
        {SKILLS.map((props, idx) => (
          <div
            key={idx}
            className="h-full transition-transform transition-shadow duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <SkillCard {...props} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;
