"use client";

import {
  Typography,
  Card,
  CardBody,
  Radio,
  Input,
  Textarea,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { EnvelopeIcon, PhoneIcon, TicketIcon } from "@heroicons/react/24/solid";
import { FormEvent } from "react";
import Swal from "sweetalert2";

export function ContactForm() {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData) as Record<string, string>;

    console.log("SUBMIT CONTACT payload:", payload);

    // Popup "en cours"
    Swal.fire({
      title: "Envoi en cours...",
      text: "Merci de patienter quelques secondes.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await fetch("https://api-contact-news.onrender.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("RESPONSE STATUS:", res.status);

      if (!res.ok) {
        // on force l’affichage de l’erreur avec le status
        throw new Error(`Erreur serveur (code ${res.status})`);
      }

      form.reset();

      // Succès
      Swal.fire({
        icon: "success",
        title: "Message envoyé",
        text: "Merci, votre message a bien été envoyé. Je vous recontacterai rapidement.",
        confirmButtonText: "OK",
      });
    } catch (err: any) {
      console.error("CONTACT ERROR:", err);

      // Erreur
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text:
          err?.message ||
          "Une erreur est survenue lors de l’envoi. Veuillez réessayer plus tard.",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <section className="px-8 py-16" id="contact">
      <div className="container mx-auto mb-20 text-center">
        <Typography variant="h1" color="blue-gray" className="mb-4">
          Contact
        </Typography>
        <Typography
          variant="lead"
          className="mx-auto w-full lg:w-5/12 !text-gray-500"
        >
          Besoin d&apos;un accompagnement pour l&apos;achat, l&apos;installation
          ou la maintenance de matériels informatiques&nbsp;? Laissez-moi un
          message et je vous recontacte rapidement.
        </Typography>
      </div>

      <div>
        <Card shadow={true} className="container mx-auto border border-gray/50">
          <CardBody className="grid grid-cols-1 md:gap-10 lg:grid-cols-7">
            {/* Bloc infos contact */}
            <div className="col-span-3 w-full rounded-lg bg-gray-900 p-5 py-8 md:p-16 h-full">
              <Typography variant="h4" color="white" className="mb-2">
                Coordonnées
              </Typography>
              <Typography
                variant="lead"
                className="mx-auto mb-8 text-base !text-gray-500"
              >
                Vous pouvez me contacter directement par téléphone, par email
                ou via le formulaire. Je suis disponible pour les personnes
                physiques et morales.
              </Typography>

              <div className="flex gap-5">
                <PhoneIcon className="h-6 w-6 text-white" />
                <Typography variant="h6" color="white" className="mb-2">
                  0812462888
                </Typography>
              </div>

              <div className="my-2 flex gap-5">
                <EnvelopeIcon className="h-6 w-6 text-white" />
                <div>
                  <Typography variant="h6" color="white" className="mb-1">
                    graciakutala00@gmail.com
                  </Typography>
                  <Typography
                    variant="small"
                    className="font-normal !text-gray-400"
                  >
                    graciakutala@gabkut.com
                  </Typography>
                </div>
              </div>

              <div className="mb-10 flex gap-5">
                <TicketIcon className="h-6 w-6 text-white" />
                <Typography variant="h6" color="white" className="mb-2">
                  Demande d&apos;intervention ou de devis
                </Typography>
              </div>

              <div className="flex items-center gap-5">
                <IconButton variant="text" color="white">
                  <i className="fa-brands fa-facebook text-lg" />
                </IconButton>
                <IconButton variant="text" color="white">
                  <i className="fa-brands fa-instagram text-lg" />
                </IconButton>
                <IconButton variant="text" color="white">
                  <i className="fa-brands fa-github text-lg" />
                </IconButton>
              </div>
            </div>

            {/* Formulaire branché sur la fonction Netlify */}
            <div className="col-span-4 w-full p-5 md:mt-0 md:px-10 mt-8 h-full">
              <form onSubmit={handleSubmit}>
                <div className="mb-8 grid gap-4 lg:grid-cols-2">
                  {/* @ts-ignore */}
                  <Input
                    color="gray"
                    size="lg"
                    variant="static"
                    label="Nom"
                    name="nom"
                    placeholder="ex. KUTALAKUDIMA"
                    containerProps={{
                      className: "!min-w-full mb-3 md:mb-0",
                    }}
                    required
                  />
                  {/* @ts-ignore */}
                  <Input
                    color="gray"
                    size="lg"
                    variant="static"
                    label="Prénom"
                    name="prenom"
                    placeholder="ex. Gracia"
                    containerProps={{
                      className: "!min-w-full",
                    }}
                    required
                  />
                </div>

                {/* @ts-ignore */}
                <Input
                  color="gray"
                  size="lg"
                  variant="static"
                  label="Email"
                  name="email"
                  placeholder="ex. vous@mail.com"
                  containerProps={{
                    className: "!min-w-full mb-8",
                  }}
                  required
                />

                <Typography
                  variant="lead"
                  className="mb-2 text-sm !text-blue-gray-500"
                >
                  Quel est votre besoin principal&nbsp;?
                </Typography>
                <div className="-ml-3 mb-14">
                  {/* @ts-ignore */}
                  <Radio
                    color="gray"
                    name="type"
                    label="Accompagnement pour achat de matériel"
                    value="achat"
                    defaultChecked
                  />
                  {/* @ts-ignore */}
                  <Radio
                    color="gray"
                    name="type"
                    label="Installation / mise en service"
                    value="installation"
                  />
                  {/* @ts-ignore */}
                  <Radio
                    color="gray"
                    name="type"
                    label="Maintenance / dépannage"
                    value="maintenance"
                  />
                  {/* @ts-ignore */}
                  <Radio color="gray" name="type" label="Autre" value="autre" />
                </div>

                {/* @ts-ignore */}
                <Textarea
                  color="gray"
                  size="lg"
                  variant="static"
                  label="Votre message"
                  name="message"
                  placeholder="Décrivez brièvement votre besoin..."
                  containerProps={{
                    className: "!min-w-full mb-8",
                  }}
                  required
                />

                <div className="flex w-full justify-end">
                  <Button
                    type="submit"
                    className="w-full md:w-fit"
                    color="gray"
                    size="md"
                  >
                    Envoyer le message
                  </Button>
                </div>
              </form>
            </div>
          </CardBody>
        </Card>
      </div>
    </section>
  );
}

export default ContactForm;
