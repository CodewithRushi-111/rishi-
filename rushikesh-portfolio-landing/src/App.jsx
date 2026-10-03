import { motion } from 'framer-motion';
import DisplacementSphere from './components/DisplacementSphere';

const navItems = [
  ['01', 'Work', '#work'],
  ['02', 'About', '#about'],
  ['03', 'Contact', '#contact'],
];

export default function App() {
  return (
    <main className="site-shell">
      <header className="nav-wrap">
        <a href="#top" className="brand" aria-label="Rushikesh Naik home">
          <span className="brand-mark">RN</span>
          <span className="brand-text">Rushikesh Naik</span>
        </a>

        <nav className="nav-links" aria-label="Primary navigation">
          {navItems.map(([number, label, href]) => (
            <a href={href} className="nav-link" key={label}>
              <span>{number}</span>
              {label}
            </a>
          ))}
        </nav>
      </header>

      <section id="top" className="hero" aria-labelledby="hero-title">
        <DisplacementSphere />
        <div className="hero-grain" />

        <div className="hero-copy">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            FULL STACK DEVELOPER · AI &amp; DATA ENGINEER
          </motion.p>

          <motion.h1
            id="hero-title"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.25 }}
          >
            Rushikesh
            <br />
            <span>Naik.</span>
          </motion.h1>

          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            I build modern web products, AI-powered systems, and developer-focused experiences — from idea to deployment.
          </motion.p>

          <motion.a
            href="#work"
            className="hero-cta"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <span>Explore my work</span>
            <span className="cta-arrow">↘</span>
          </motion.a>
        </div>

        <div className="hero-meta hero-meta-left">
          <span>OPEN TO ROLES</span>
          <i />
          <span>MUMBAI, INDIA</span>
        </div>

        <div className="hero-meta hero-meta-right">
          <span>01</span>
          <i />
          <span>SCROLL TO EXPLORE</span>
        </div>

        <div className="scroll-cue" aria-hidden="true">
          <span className="scroll-line" />
          <span>SCROLL</span>
        </div>
      </section>

      <section id="work" className="placeholder-section">
        <div>
          <span className="section-number">01</span>
          <h2>Projects coming next.</h2>
          <p>Your live projects, GitHub links, case studies, and Web3 work will go here.</p>
        </div>
      </section>

      <section id="about" className="placeholder-section light-block">
        <div>
          <span className="section-number">02</span>
          <h2>About coming next.</h2>
          <p>We’ll replace this with your final About section once you provide the content.</p>
        </div>
      </section>

      <section id="contact" className="placeholder-section">
        <div>
          <span className="section-number">03</span>
          <h2>Let’s build something.</h2>
          <p>Contact details and your social links will be added after the landing page is approved.</p>
        </div>
      </section>
    </main>
  );
}
