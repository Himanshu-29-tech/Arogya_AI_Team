'use client';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Architecture from './components/Architecture';
import TechStack from './components/TechStack';
import Impact from './components/Impact';
import FutureScope from './components/FutureScope';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Architecture />
      <TechStack />
      <Impact />
      <FutureScope />
      <FAQ />
      <Footer />
    </main>
  );
}
