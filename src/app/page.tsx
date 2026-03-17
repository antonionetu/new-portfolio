"use client";

import { I18nProvider } from "@/lib/i18n";
import LoadingScreen from "@/components/LoadingScreen";
import ClickRipple from "@/components/ClickRipple";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <I18nProvider>
      <LoadingScreen />
      <ClickRipple />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </I18nProvider>
  );
}
