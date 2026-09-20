import RevealObserver from "./componentes/RevealObserver";
import TopBar from "./componentes/TopBar";
import TouroHeroImagem from "./componentes/TouroHeroImagem";
import ProleCaraLimpa from "./componentes/ProleCaraLimpa";
import TouroHeroTexto from "./componentes/TouroHeroTexto";
import Genealogia from "./componentes/Genealogia";
import Fatos from "./componentes/Fatos";
import Calculadora from "./componentes/Calculadora";
import EvolucaoDeps from "./componentes/EvolucaoDeps";
import InfertilidadeBand from "./componentes/InfertilidadeBand";
import PrecoReserva from "./componentes/PrecoReserva";
import Faq from "./componentes/Faq";
import ConfiraFonte from "./componentes/ConfiraFonte";
import Footer from "./componentes/Footer";
import WhatsappFab from "./componentes/WhatsappFab";

export default function Home() {
  return (
    <>
      <RevealObserver />
      <TopBar />
      <main id="conteudo">
        {/* a prova visual vem logo depois da foto do touro, antes dos números */}
        <TouroHeroImagem />
        <ProleCaraLimpa />
        <Genealogia />
        <TouroHeroTexto />
        <Fatos />
        <Calculadora />
        <EvolucaoDeps />
        <InfertilidadeBand />
        <PrecoReserva />
        <Faq />
        {/* transparência das fontes fecha a página, depois da decisão de compra */}
        <ConfiraFonte />
      </main>
      <Footer />
      <WhatsappFab />
    </>
  );
}
