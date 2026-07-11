import "./styles/global.css";
import Background from "./components/Background";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import About from "./components/About";
import Stack from "./components/Stack";
import Projects from "./components/Projects";
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
      <Stack />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
