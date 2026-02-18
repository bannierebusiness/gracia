"use client";

import { Typography, Button } from "@material-tailwind/react";
import {
  ChartBarIcon,
  PuzzlePieceIcon,
  CursorArrowRaysIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";
import { ResumeItem } from "@/components";

const RESUME_ITEMS = [
  {
    icon: ChartBarIcon,
    children: "Bac+5 en Informatique, réseaux, technique et maintenance",
  },
  {
    icon: PuzzlePieceIcon,
    children: "Expérience en installation, configuration et maintenance de matériels et infrastructures réseaux",
  },
  {
    icon: CursorArrowRaysIcon,
    children: "Accompagnement des entreprises et particuliers dans l’acquisition de matériels informatiques en RDC et à l’étranger",
  },
];

export function Resume() {
  return (
    <section className="px-8 py-24">
      <div className="container mx-auto grid w-full grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div className="col-span-1">
          <Typography variant="h2" color="blue-gray">
            Mon profil
          </Typography>
          <Typography className="mb-4 mt-3 w-9/12 font-normal !text-gray-500">
            Technicien en réseaux, technique et maintenance avec une formation
            bac+5 en informatique. J’assure l’installation, la maintenance et
            le suivi des équipements et infrastructures informatiques pour
            garantir leur fiabilité au quotidien.
          </Typography>
          <Button
            variant="text"
            color="gray"
            className="flex items-center gap-2"
          >
            voir plus
            <ArrowRightIcon
              strokeWidth={3}
              className="h-3.5 w-3.5 text-gray-900"
            />
          </Button>
        </div>
        <div className="col-span-1 grid gap-y-6 lg:ml-auto pr-0 lg:pr-12 xl:pr-32">
          {RESUME_ITEMS.map((props, idx) => (
            <ResumeItem key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Resume;
