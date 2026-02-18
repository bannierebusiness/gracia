import { Typography, Button } from "@material-tailwind/react";

const CURRENT_YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="mt-16 bg-gray-100 text-gray-900">
      <div className="container mx-auto px-6 md:px-8 pt-16 pb-10">
        {/* Top grid */}
        <div className="grid gap-12 md:grid-cols-3">
          {/* Bloc identité */}
          <div>
            <Typography className="mb-2 text-xl font-semibold text-gray-900">
              Gracia KUTALAKUDIMA
            </Typography>
            <Typography className="text-sm text-gray-700">
              Réseaux, technique et maintenance. Solutions informatiques fiables,
              adaptées aux besoins des particuliers et des entreprises.
            </Typography>
          </div>

          {/* Bloc navigation (vide pour l’instant) */}
          <div>
            <Typography className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
              Navigation
            </Typography>
            <ul className="space-y-2">{/* liens à ajouter si besoin */}</ul>
          </div>

          {/* Bloc contact */}
          <div>
            <Typography className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-900">
              Contact
            </Typography>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-700">Tél : 0812462888</li>
              <li>
                <a
                  href="mailto:graciakutala00@gmail.com"
                  className="text-gray-900 underline decoration-gray-400 hover:text-black"
                >
                  graciakutala00@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:graciakutala@gabkut.com"
                  className="text-gray-900 underline decoration-gray-400 hover:text-black"
                >
                  graciakutala@gabkut.com
                </a>
              </li>
              <li className="pt-3">
                <Button
                  color="gray"
                  size="sm"
                  className="bg-gray-900 text-white text-sm normal-case hover:bg-black"
                >
                  Me contacter
                </Button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-gray-300 pt-6 text-center md:flex-row md:text-left">
          <Typography className="text-xs text-gray-700">
            &copy; {CURRENT_YEAR} Gracia KUTALAKUDIMA. Tous droits réservés.
          </Typography>
          <Typography className="text-xs text-gray-700">
            Pour vos solutions réseaux, techniques et maintenance informatique.
          </Typography>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
