"use client";

import Image from "next/image";
import { Input, Button, Typography } from "@material-tailwind/react";
import { FormEvent, useState } from "react";
import Swal from "sweetalert2";
import { getImagePrefix } from "../../utils/utils";

function Hero() {
  const [loading, setLoading] = useState(false);

  const handleNewsletter = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get("email") as string || "").trim();

    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Email manquant",
        text: "Veuillez saisir votre adresse email.",
      });
      return;
    }

    setLoading(true);

    Swal.fire({
      title: "Envoi en cours...",
      text: "Merci de patienter quelques secondes.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await fetch("https://api-contact-news.onrender.com/api/newsletter", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email }),
});


      if (!res.ok) {
        throw new Error(`Erreur serveur (code ${res.status})`);
      }

      form.reset();

      Swal.fire({
        icon: "success",
        title: "Inscription enregistrée",
        text: "Merci ! Vous serez informé(e) de mes prochaines disponibilités et interventions.",
        confirmButtonText: "OK",
      });
    } catch (err: any) {
      console.error("NEWSLETTER ERROR:", err);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text:
          err?.message ||
          "Une erreur est survenue lors de l’inscription. Veuillez réessayer plus tard.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 px-8 py-10">
      <div className="container mx-auto grid min-h-[60vh] w-full grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div className="row-start-2 lg:row-auto text-white">
          <Typography
            variant="h1"
            color="white"
            className="mb-4 text-3xl lg:text-5xl !leading-tight"
          >
            Bienvenue sur mon <br /> portfolio technique&nbsp;!
          </Typography>

          <Typography
            variant="lead"
            className="mb-6 !text-gray-300 md:pr-16 xl:pr-28"
          >
            Je suis{" "}
            <span className="font-semibold text-white">
              Gracia KUTALAKUDIMA
            </span>
            , technicien réseaux, technique et maintenance basé à Kinshasa. 
            J&apos;assure l&apos;installation, la configuration et la maintenance 
            de systèmes informatiques et d&apos;infrastructures réseaux pour garantir 
            performance et continuité de service.
          </Typography>

          <form onSubmit={handleNewsletter} className="grid">
            <Typography
              variant="small"
              className="mb-2 font-medium text-gray-200"
            >
              Laissez votre email pour discuter de vos besoins
            </Typography>

            <div className="mb-2 flex w-full flex-col gap-4 md:w-10/12 md:flex-row">
              {/* @ts-ignore */}
              <Input
                color="gray"
                label="Entrez votre email"
                size="lg"
                name="email"
                type="email"
                required
                className="text-white"
              />
              <Button
                type="submit"
                color="gray"
                className="w-full bg-gray-100 px-4 text-gray-900 hover:bg-white md:w-[14rem]"
                disabled={loading}
              >
                {loading ? "Envoi..." : "Demander une intervention"}
              </Button>
            </div>
          </form>

          <Typography variant="small" className="font-normal !text-gray-400">
            En envoyant votre email, vous acceptez mes{" "}
            <a
              href="#"
              className="font-medium underline transition-colors hover:text-white"
            >
              conditions générales.
            </a>
          </Typography>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-tr from-gray-700/40 via-gray-500/20 to-white/5 blur-3xl" />
          <Image
            width={1024}
            height={1024}
            alt="Travail sur infrastructure réseau"
            src={`${getImagePrefix()}image/image-7.jpg`}
            className="h-[36rem] w-full rounded-3xl object-cover shadow-2xl"
            priority
          />
        </div>
      </div>
    </header>
  );
}

export default Hero;
