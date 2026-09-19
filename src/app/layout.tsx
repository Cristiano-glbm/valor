import type { Metadata } from "next";
import "./globals.css";
import Consentimento from "./componentes/Consentimento";

export const metadata: Metadata = {
  title: "Pontual FIV St. Cruz — sêmen Nelore PO | Valor Assessoria Pecuária",
  description:
    "Sêmen do touro Nelore Pontual FIV St. Cruz (RGD GPO A5042). Top 0,1% da raça em ganho da desmama ao sobreano. 211 filhos avaliados. Comercialização exclusiva Valor Assessoria Pecuária.",
  icons: {
    icon: "/images/logo-navbar.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  // sem maximumScale/userScalable: bloquear o zoom quebra a WCAG 1.4.4
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0F0F0F" },
    { media: "(prefers-color-scheme: light)", color: "#FAF7F1" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&family=Anton&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try {
  var t = localStorage.getItem('valor-tema');
  if (t === 'light' || t === 'dark') {
    document.documentElement.setAttribute('data-theme', t);
  }
} catch (e) {}`,
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}
        <Consentimento />
      </body>
    </html>
  );
}
