"use client";

import { Typography } from "@material-tailwind/react";

const EXPERTISE = [
  {
    title: "Conseil & achat de matériel",
    desc: "Accompagnement pour choisir et acheter des ordinateurs, imprimantes et équipements réseaux adaptés à vos besoins.",
  },
  {
    title: "Installation & mise en service",
    desc: "Mise en place et configuration sur site des postes, périphériques et infrastructures réseaux.",
  },
  {
    title: "Maintenance & dépannage",
    desc: "Interventions préventives et correctives pour assurer la continuité de votre activité.",
  },
  {
    title: "Suivi & accompagnement",
    desc: "Support régulier, recommandation d’améliorations et bonnes pratiques d’utilisation.",
  },
];

export function PopularClients() {
  return (
    <section className="py-16 px-8 lg:py-24 bg-gray-50">
      <div className="container mx-auto text-center">
        <Typography
          variant="h6"
          className="mb-4 uppercase tracking-wide !text-gray-500"
        >
          Domaines d’intervention
        </Typography>
        <Typography variant="h2" color="blue-gray" className="mb-8">
          Comment je vous accompagne
        </Typography>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-4">
          {EXPERTISE.map((item, index) => (
            <div
              key={index}
              className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-transform transition-shadow duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-2 font-semibold"
              >
                {item.title}
              </Typography>
              <Typography className="text-sm !text-gray-600">
                {item.desc}
              </Typography>

              <div className="mt-4 h-1 w-0 bg-gray-900 transition-all duration-300 group-hover:w-16" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularClients;
