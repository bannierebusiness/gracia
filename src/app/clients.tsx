"use client";

import { Typography } from "@material-tailwind/react";

const HARDWARE_BLOCKS = [
  {
    type: "Ordinateurs & laptops",
    brands: "Dell, HP, Lenovo, Asus, Acer",
  },
  {
    type: "Imprimantes & scanners",
    brands: "HP, Canon, Epson, Brother",
  },
  {
    type: "Réseaux & connectivité",
    brands: "Cisco, TP-Link, D-Link, Mikrotik",
  },
  {
    type: "Stockage & sauvegarde",
    brands: "Seagate, Western Digital, Kingston, Samsung",
  },
  {
    type: "Périphériques & accessoires",
    brands: "Claviers, souris, onduleurs, écrans, onduleurs, routeurs, câbles…",
  },
  {
    type: "Solutions sur mesure",
    brands:
      "Accompagnement pour tout autre besoin spécifique en RDC ou à l’étranger.",
  },
];

export function Clients() {
  return (
    <section className="px-8 py-24 bg-gray-50">
      <div className="container mx-auto text-center">
        <Typography
          variant="h6"
          color="blue-gray"
          className="mb-2 uppercase tracking-wide !text-gray-500"
        >
          Matériels informatiques que j’accompagne
        </Typography>
        <Typography
          variant="lead"
          className="mb-10 mx-auto w-full !text-gray-600 lg:w-7/12"
        >
          De l’achat à la maintenance, j’aide à choisir et gérer les équipements
          informatiques adaptés aux besoins des particuliers et des entreprises.
        </Typography>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {HARDWARE_BLOCKS.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm transition-transform transition-shadow duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <Typography
                variant="h6"
                color="blue-gray"
                className="mb-2 font-semibold"
              >
                {item.type}
              </Typography>
              <Typography className="text-sm !text-gray-600">
                {item.brands}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Clients;
