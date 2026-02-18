"use client";

import { ProjectCard } from "@/components";
import { Typography } from "@material-tailwind/react";
import { getImagePrefix } from "../../utils/utils";

const PROJECTS = [
  {
    img: `${getImagePrefix()}image/blog1.png`,
    title: "Accompagnement à l'achat de matériels",
    desc: "Conseil et accompagnement de particuliers et d'entreprises pour l’acquisition de matériels informatiques en RDC et à l’étranger.",
  },
  {
    img: `${getImagePrefix()}image/blog2.png`,
    title: "Installation et mise en service",
    desc: "Mise en place, câblage et configuration de postes, équipements réseaux et périphériques dans des bureaux et petites structures.",
  },
  {
    img: `${getImagePrefix()}image/blog3.png`,
    title: "Maintenance et dépannage",
    desc: "Diagnostic et réparation de pannes matérielles et logicielles afin d’assurer la continuité de service au quotidien.",
  },
  {
    img: `${getImagePrefix()}image/blog4.png`,
    title: "Suivi et conseils techniques",
    desc: "Suivi des installations, recommandations d’amélioration et bonnes pratiques pour prolonger la durée de vie des équipements.",
  },
];

export function Projects() {
  return (
    <section className="py-28 px-8">
      <div className="container mx-auto mb-20 text-center">
        <Typography variant="h2" color="blue-gray" className="mb-4">
          Mes projets
        </Typography>
        <Typography
          variant="lead"
          className="mx-auto w-full px-4 font-normal !text-gray-500 lg:w-6/12"
        >
          J’accompagne les personnes physiques et morales dans l’acquisition,
          l’installation et la maintenance de leurs équipements informatiques,
          en RDC comme à l’étranger.
        </Typography>
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-x-10 gap-y-20 md:grid-cols-2 xl:grid-cols-4">
        {PROJECTS.map((props, idx) => (
          <ProjectCard key={idx} {...props} />
        ))}
      </div>
    </section>
  );
}

export default Projects;
