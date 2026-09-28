const externalLinks = [
  { label: 'GitHub', href: 'https://github.com/jaskhetani' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jas-khetani' },
  { label: 'Medium', href: 'https://medium.com/@jaskhetani' },
  { label: 'ResearchGate', href: 'https://www.researchgate.net/publication/409343971_Dynamic_Feature-Based_Malware_Classification' },
  { label: 'Chess.com', href: 'https://www.chess.com/member/jaskhetani' },
  { label: 'Email', href: 'mailto:j.khetani@student.fdu.edu' },
];

const researchSignals = [
  { value: '60', label: 'portfolio references benchmarked' },
  { value: '53', label: 'used projects as the main proof layer' },
  { value: '34', label: 'used teaching/writing to prove judgment' },
  { value: '12', label: 'had explicit service or consulting funnels' },
];

const proofRooms = [
  {
    eyebrow: 'Employer room',
    title: 'Proof that I can think like an AI engineer before I have the title.',
    copy:
      'Recruiters do not need another list of frameworks. They need to see how I choose issues, reproduce failures, measure outputs, and decide when an AI answer is not good enough.',
    bullets: ['AI301 contribution workflow', 'RAG and evaluation notes', 'Debugging logs over demo polish'],
  },
  {
    eyebrow: 'Client room',
    title: 'A small studio for useful automations, not vague “AI consulting.”',
    copy:
      'The freelance side is intentionally concrete: intake, automation maps, RAG prototypes, dashboards, and workflow cleanup for students, creators, and small teams.',
    bullets: ['Workflow automation', 'RAG knowledge assistants', 'Portfolio/profile rebuilds'],
  },
  {
    eyebrow: 'Inner room',
    title: 'The person behind the system: discipline, combat, quantum curiosity.',
    copy:
      'The peach blossom and yin-yang theme is not decoration. It frames the tension I actually live in: precision and softness, engineering and philosophy, ambition and restraint.',
    bullets: ['Kalaripayattu discipline', 'Quantum learning path', 'Hermes-assisted execution'],
  },
];

const caseStudies = [
  {
    number: '01',
    title: 'AI Engineering Lab',
    subtitle: 'Coursework converted into operating evidence.',
    copy:
      'AI301 and CodePath work become a lab notebook: issue triage, eval harnesses, contribution stories, prompt failures, and small systems that make AI output testable.',
    proof: ['ai301-coursework', 'DocuBot RAG', 'Game Glitch debugging'],
    href: 'https://github.com/jaskhetani/ai301-coursework',
  },
  {
    number: '02',
    title: 'Quantum / Data Garden',
    subtitle: 'A differentiator that should feel curious, not gimmicky.',
    copy:
      'Quantum projects are reframed as a learning garden: algorithms, Qiskit/Q#, simulations, and public notes. The site should make the repo easier to enter, not merely link to it.',
    proof: ['Qiskit + Q#', 'OpenQASM', 'Medium quantum writing'],
    href: 'https://github.com/jaskhetani/Quantum-Computing-Projects',
  },
  {
    number: '03',
    title: 'Field Systems / Product Sense',
    subtitle: 'Sanitized operational stories for serious readers.',
    copy:
      'The event-ticketing story is the proof of field judgment: QR entry, pass categories, low-network constraints, concurrent scanning, and the humility to redesign after a spreadsheet-backed MVP hits its limits.',
    proof: ['QR ticketing', 'Low-network operations', 'Expectation → constraint translation'],
    href: '#contact',
  },
  {
    number: '04',
    title: 'Research Communication',
    subtitle: 'Making technical work legible without inflating it.',
    copy:
      'The malware-classification poster and future Medium notes belong here: explain the work, name the limits, and prove that I can translate complexity for professors, employers, and collaborators.',
    proof: ['ML/security poster', 'Medium restart', 'Technical storytelling'],
    href: 'https://www.researchgate.net/publication/409343971_Dynamic_Feature-Based_Malware_Classification',
  },
];

const services = [
  {
    title: 'AI workflow audit',
    copy: 'Map your current process, identify repetitive decisions, and propose a pragmatic automation or AI-agent layer.',
    deliverable: '1-page workflow map + build plan',
  },
  {
    title: 'RAG prototype sprint',
    copy: 'Turn messy documents, notes, or course material into a small retrieval assistant with honest limitations.',
    deliverable: 'Prototype + eval checklist',
  },
  {
    title: 'Portfolio / GitHub surface rebuild',
    copy: 'Clean a technical profile so employers understand the signal instead of drowning in old project noise.',
    deliverable: 'Narrative, README, and site structure',
  },
];

const benchmarkLessons = [
  'Karpathy/Weng/Willison pattern: writing is not decoration; it is proof of judgment.',
  'Eugene Yan/Hamel pattern: case studies beat project grids when systems thinking matters.',
  'Quantum Country/PennyLane pattern: interactive/visual learning makes hard domains memorable.',
  'Top dev portfolios pattern: one unmistakable visual motif wins more than five generic sections.',
];

const credibilitySignals = [
  { label: 'Academic base', value: 'CS + Data Science @ FDU' },
  { label: 'Current standing', value: 'GPA 3.6 + merit/scholarship awards' },
  { label: 'Research signal', value: 'Dynamic feature-based malware classification' },
  { label: 'Operating layer', value: 'Hermes-assisted semester execution' },
];

const petals = Array.from({ length: 22 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  delay: `${(index * 0.73) % 8}s`,
  duration: `${9 + (index % 7)}s`,
  scale: `${0.72 + (index % 5) * 0.12}`,
}));

function PetalField() {
  return (
    <div className="petal-field" aria-hidden="true">
      {petals.map((petal) => (
        <span
          key={petal.id}
          className="petal"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            transform: `scale(${petal.scale})`,
          }}
        />
      ))}
    </div>
  );
}

function App() {
  return (
    <main>
      <PetalField />
      <header className="site-nav" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Jas Khetani home">
          <span className="brand-mark">花</span>
          <span>Jas Khetani</span>
        </a>
        <nav>
          <a href="#proof">Proof</a>
          <a href="#services">Services</a>
          <a href="#philosophy">Philosophy</a>
          <a href="#contact" className="nav-cta">Enquire</a>
        </nav>
      </header>

      <section id="top" className="hero section-shell">
        <div className="yin-stage" aria-hidden="true">
          <div className="moon-disc" />
          <div className="tree-trunk" />
          <div className="branch branch-one" />
          <div className="branch branch-two" />
          <div className="branch branch-three" />
          <div className="root root-one" />
          <div className="root root-two" />
          <div className="blossom b1" />
          <div className="blossom b2" />
          <div className="blossom b3" />
          <div className="blossom b4" />
        </div>
        <p className="kicker">AI systems · quantum curiosity · disciplined execution</p>
        <h1>Where precision learns softness.</h1>
        <p className="hero-copy">
          I’m Jas Khetani — a CS student building toward AI engineering and Forward-Deployed work, with a
          quantum/data spine and a practical freelance studio for useful automation. This site is not a second
          résumé. It is the garden behind the résumé.
        </p>
        <div className="hero-actions">
          <a href="#proof" className="button primary">Enter the proof map</a>
          <a href="#services" className="button secondary">Client services</a>
        </div>
        <div className="made-by">Made by Vera Hermes · Jas’s Hermes agent</div>
      </section>

      <section className="research-strip section-shell" aria-label="Research benchmark summary">
        {researchSignals.map((item) => (
          <article key={item.label}>
            <strong>{item.value}</strong>
            <span>{item.label}</span>
          </article>
        ))}
      </section>

      <section className="section-shell credibility-grid" aria-label="Credibility signals">
        {credibilitySignals.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </article>
        ))}
      </section>

      <section id="proof" className="section-shell thesis-grid">
        <div className="thesis-copy">
          <p className="kicker">The new structure</p>
          <h2>Three rooms, one person.</h2>
          <p>
            The README already says “AI systems, automation, quantum + data.” The website goes deeper: how I
            think, where the proof lives, and how an employer or client should engage with me.
          </p>
        </div>
        <div className="room-stack">
          {proofRooms.map((room) => (
            <article className="room-card" key={room.title}>
              <span>{room.eyebrow}</span>
              <h3>{room.title}</h3>
              <p>{room.copy}</p>
              <ul>
                {room.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="section-shell case-section">
        <div className="section-head">
          <p className="kicker">Case studies, not cards</p>
          <h2>Proof should read like decisions under pressure.</h2>
        </div>
        <div className="case-list">
          {caseStudies.map((study) => (
            <article className="case-row" key={study.title}>
              <span className="case-number">{study.number}</span>
              <div>
                <p className="case-subtitle">{study.subtitle}</p>
                <h3>{study.title}</h3>
                <p>{study.copy}</p>
                <div className="proof-tags">
                  {study.proof.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
              </div>
              <a href={study.href} aria-label={`Open ${study.title}`}>Open</a>
            </article>
          ))}
        </div>
      </section>

      <section id="services" className="service-band">
        <div className="section-shell service-grid">
          <div className="service-intro">
            <p className="kicker">Freelance hub</p>
            <h2>Small, useful systems for people who need the work to move.</h2>
            <p>
              I am not selling magic. I am offering disciplined build help: map the problem, produce the first
              working artifact, and leave behind a process you can actually use.
            </p>
          </div>
          <div className="service-cards">
            {services.map((service) => (
              <article key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.copy}</p>
                <span>{service.deliverable}</span>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="philosophy" className="section-shell philosophy-section">
        <article className="philosophy-card">
          <p className="kicker">Design language</p>
          <h2>Asymmetrical, but balanced.</h2>
          <p>
            The site uses a yin-yang composition and drifting peach blossoms because the brand is not “generic
            AI student.” It is disciplined softness: Caro-Kann patience, Kalaripayattu body-awareness, quantum
            curiosity, and Hermes-assisted execution. The petals move randomly; the page still feels composed.
          </p>
        </article>
        <article className="benchmark-card">
          <p className="kicker">What the benchmark changed</p>
          <ul>
            {benchmarkLessons.map((lesson) => <li key={lesson}>{lesson}</li>)}
          </ul>
        </article>
      </section>

      <section id="contact" className="section-shell contact-card">
        <div>
          <p className="kicker">Next move</p>
          <h2>Employer, collaborator, or client — choose the right doorway.</h2>
          <p>
            For internships, start with the proof map. For client work, send the workflow you want cleaned up.
            For technical conversation, Medium and GitHub show the current trail.
          </p>
        </div>
        <div className="contact-links">
          {externalLinks.map((link) => <a href={link.href} key={link.label}>{link.label}</a>)}
        </div>
      </section>
    </main>
  );
}

export default App;