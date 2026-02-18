"use client";

import { Typography, Card, CardBody } from "@material-tailwind/react";

export function Testimonial() {
  return (
    <section className="py-16 px-8">
      <div className="container mx-auto max-w-screen-md">
        <Typography
          variant="h2"
          color="blue-gray"
          className="mb-4 text-center"
        >
          Pourquoi travailler avec moi ?
        </Typography>
        <Typography
          variant="lead"
          className="mx-auto mb-8 w-full text-center !text-gray-500"
        >
          J’accompagne les particuliers et entreprises dans le choix, 
          l’acquisition et la maintenance de leurs équipements informatiques, 
          avec sérieux et disponibilité.
        </Typography>

        <Card className="border border-gray-200 shadow-sm">
          <CardBody>
            <Typography className="!text-gray-700">
              Que ce soit pour acheter du matériel en RDC ou à l&apos;étranger,
              mettre en place un petit parc informatique ou assurer la
              maintenance au quotidien, je reste votre interlocuteur unique
              pour des solutions claires et adaptées.
            </Typography>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}

export default Testimonial;
