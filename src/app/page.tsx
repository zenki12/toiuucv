import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Hero, HowItWorks, Features, Testimonials, CTASection } from "@/components/landing/Sections";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <Testimonials />
      <CTASection />
      <Footer />
    </main>
  );
}
