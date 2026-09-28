const profileLinks = [
  { label: 'GitHub', href: 'https://github.com/jaskhetani' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jas-khetani' },
  { label: 'Medium', href: 'https://medium.com/@jaskhetani' },
];

const proofStats = [
  { value: 'AI', label: 'RAG, evals, debugging, guardrails' },
  { value: 'QC', label: 'Qiskit, Q#, OpenQASM exploration' },
  { value: 'FDE', label: 'Product thinking + field constraints' },
  { value: 'Data', label: 'Big-data analytics learning track' },
];

const caseStudies = [
  {
    eyebrow: 'AI Engineering Lab',
    title: 'Coursework turned into proof of engineering discipline.',
    description:
      'AI301 and CodePath work reframed around issue selection, reproducibility, eval harnesses, RAG failure modes, and the habit of verifying AI instead of worshipping it.',
    status: 'Cleanup in progress',
    accent: 'develop',
    links: [
      { label: 'ai301-coursework', href: 'https://github.com/jaskhetani/ai301-coursework' },
      { label: 'DocuBot RAG lab', href: 'https://github.com/jaskhetani/ai110-module4tinker-docubot-starter' },
    ],
  },
  {
    eyebrow: 'Quantum Computing Projects',
    title: 'A public learning trail through quantum algorithms and simulation.',
    description:
      'A differentiating body of Qiskit, Q#, Python, Jupyter, and OpenQASM experiments. The next pass adds a project status table, cleaner outputs, and a sharper portfolio narrative.',
    status: 'Public showcase candidate',
    accent: 'preview',
    links: [
      { label: 'Quantum repo', href: 'https://github.com/jaskhetani/Quantum-Computing-Projects' },
    ],
  },
  {
    eyebrow: 'Product Systems',
    title: 'Operational prototypes with privacy-aware storytelling.',
    description:
      'Selected private/product work can become sanitized case studies: problem, constraints, system decisions, validation, and lessons — without exposing sensitive implementation details.',
    status: 'Sanitized case study only',
    accent: 'ship',
    links: [{ label: 'Private by design', href: '#contact' }],
  },
  {
    eyebrow: 'Research Communication',
    title: 'Security and ML work translated for humans.',
    description:
      'The malware-classification poster and future technical writing belong here: concise explanations, defensible claims, and artifacts that make the work legible to recruiters.',
    status: 'Artifact pending',
    accent: 'neutral',
    links: [{ label: 'Writing queue', href: '#writing' }],
  },
];

const nowBuilding = [
  'Public RAG/evals/guardrails proof that shows failure analysis, not just a demo.',
  'Vercel portfolio rebuild with recruiter-grade case-study routing.',
  'Medium restart for AI-assisted productivity, systems thinking, and learning-in-public notes.',
];

const cleanupItems = [
  'Clean generated files from Quantum-Computing-Projects and add a status table.',
  'Rewrite ai301-coursework top README as an AI engineering lab, not course logistics.',
  'Clean DocuBot RAG repo before promoting it as a case study.',
  'Archive or hide legacy/training repos that distract from the current signal.',
];

function App() {
  return (
    <main>
      <header className="site-nav" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Jas Khetani home">
          <span className="brand-mark">JK</span>
          <span>Jas Khetani</span>
        </a>
        <nav>
          <a href="#case-studies">Work</a>
          <a href="#now">Now</a>
          <a href="#writing">Writing</a>
          <a href="#contact" className="nav-cta">Contact</a>
        </nav>
      </header>

      <section id="top" className="hero section-shell">
        <div className="hero-orbit" aria-hidden="true" />
        <p className="kicker">AI systems · automation · quantum/data projects</p>
        <h1>Building practical AI systems with the discipline to verify them.</h1>
        <p className="hero-copy">
          I’m Jas Khetani, a CS student at Fairleigh Dickinson University focused on big-data analytics,
          electrical engineering technology, and the kind of AI/FDE work where taste, evidence, and execution
          all have to survive contact with reality.
        </p>
        <div className="hero-actions">
          <a href="#case-studies" className="button primary">View case studies</a>
          <a href="https://github.com/jaskhetani" className="button secondary">GitHub profile</a>
        </div>
      </section>

      <section className="proof-strip section-shell" aria-label="Portfolio focus areas">
        {proofStats.map((item) => (
          <article className="metric-card" key={item.value}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section id="case-studies" className="section-shell split-heading">
        <div>
          <p className="kicker">Selected work</p>
          <h2>Curated signal, not a landfill of repositories.</h2>
        </div>
        <p>
          The portfolio should route attention like a clean deployment pipeline: strongest proof first,
          supporting artifacts second, legacy clutter nowhere near the recruiter’s first click.
        </p>
      </section>

      <section className="case-grid section-shell">
        {caseStudies.map((study) => (
          <article className={`case-card ${study.accent}`} key={study.title}>
            <div className="card-topline">
              <span>{study.eyebrow}</span>
              <span className="pill">{study.status}</span>
            </div>
            <h3>{study.title}</h3>
            <p>{study.description}</p>
            <div className="link-row">
              {study.links.map((link) => (
                <a href={link.href} key={link.label}>{link.label}</a>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section id="now" className="section-shell workflow-section">
        <div className="workflow-copy">
          <p className="kicker">Now building</p>
          <h2>Develop → Preview → Ship, without pretending half-polished work is finished.</h2>
          <p>
            The next phase is a cleanup sprint followed by deployment. A portfolio site is only useful if the
            links behind it do not wobble like a badly-mounted shelf.
          </p>
        </div>
        <div className="pipeline" aria-label="Current build pipeline">
          <article>
            <span className="mono develop-text">Develop</span>
            <h3>Repo hygiene</h3>
            <p>Remove generated junk, stale starters, exposed config risk, and weak descriptions.</p>
          </article>
          <article>
            <span className="mono preview-text">Preview</span>
            <h3>Case studies</h3>
            <p>Frame work by problem, constraints, decisions, evidence, and limitation.</p>
          </article>
          <article>
            <span className="mono ship-text">Ship</span>
            <h3>Vercel portfolio</h3>
            <p>Deploy a fast static site once the content surface is respectable.</p>
          </article>
        </div>
      </section>

      <section className="section-shell two-column">
        <article className="panel">
          <p className="kicker">Priority cleanup</p>
          <h2>Before the spotlight, the room gets cleaned.</h2>
          <ul className="check-list">
            {cleanupItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
        <article id="writing" className="panel dark-panel">
          <p className="kicker">Writing / thinking</p>
          <h2>Notes that make the work legible.</h2>
          <ul className="check-list">
            {nowBuilding.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
      </section>

      <section id="contact" className="section-shell contact-card">
        <div>
          <p className="kicker">Contact</p>
          <h2>For AI engineering, FDE-style internships, and serious build conversations.</h2>
          <p>
            Start with GitHub for artifacts, LinkedIn for professional context, and Medium for longer notes as
            the writing surface comes online.
          </p>
        </div>
        <div className="contact-links">
          {profileLinks.map((link) => (
            <a href={link.href} key={link.label}>{link.label}</a>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
