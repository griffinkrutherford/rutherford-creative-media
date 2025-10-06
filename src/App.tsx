import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import ATLExcerpt from "@/components/ATLExcerpt";
import Footer from "@/components/Footer";

export default function App() {
  return (
    <main className="antialiased">
      <Hero />
      <About />
      <Projects />
      <ATLExcerpt />
      <Footer />
    </main>
  );
}