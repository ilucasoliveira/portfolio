import Hero from "../components/Hero";
import About from "../components/About";
import Gate from "../components/Gate";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Stack from "../components/Stack";
import Contact from "../components/Contact";
import Epilogue from "../components/Epilogue";
// serpente de runas desligada para teste: para religar, importe RuneSerpent e coloque <RuneSerpent /> de volta

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Gate />
      <Projects />
      <Experience />
      <Stack />
      <Contact />
      <Epilogue />
    </>
  );
}

export default Home;
