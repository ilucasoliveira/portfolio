import "./styles/global.css";
import Background from "./components/Background";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Stack from "./components/Stack";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="app">
      <Background />
      <Nav />
      <Hero />
      <About />
      <Projects />
      <Experience />
      <Stack />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
