const externalLinks = [
  { label: 'GitHub', href: 'https://github.com/jaskhetani' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/jas-khetani' },
  { label: 'Medium', href: 'https://medium.com/@jaskhetani' },
  { label: 'ResearchGate', href: 'https://www.researchgate.net/publication/409343971_Dynamic_Feature-Based_Malware_Classification' },
  { label: 'Chess.com', href: 'https://www.chess.com/member/jaskhetani' },
  { label: 'Email', href: 'mailto:j.khetani@student.fdu.edu' },
];

const credibilitySignals = [
  { label: 'Academic base', value: 'CS + Data Science @ FDU' },
  { label: 'Current standing', value: 'GPA 3.6 + merit/scholarship awards' },
  { label: 'AI proof', value: 'AI301, RAG, debugging, eval workflows' },
  { label: 'Research signal', value: 'Dynamic feature-based malware classification' },
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
      'The freelance side stays concrete: workflow maps, RAG prototypes, dashboards, portfolio surfaces, and operational cleanup for students, creators, and small teams.',
    bullets: ['Workflow automation', 'RAG knowledge assistants', 'Profile and process rebuilds'],
  },
  {
    eyebrow: 'Inner room',
    title: 'The person behind the system: discipline, combat, quantum curiosity.',
    copy:
      'The blossom tree is not decoration. It frames the tension I live in: precision and softness, engineering and philosophy, ambition and restraint.',
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
      'The event-ticketing story is proof of field judgment: QR entry, pass categories, low-network constraints, concurrent scanning, and the humility to redesign after a spreadsheet-backed MVP hits its limits.',
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

const operatingCards = [
  {
    title: 'Coursework accountability',
    copy: 'Hermes helps me keep the semester visible: portal updates, calendar/task hygiene, daily standups, and evening reviews.',
  },
  {
    title: 'Inspectable AI use',
    copy: 'I use agents to sharpen questions, check assumptions, repair workflows, and make my thinking harder to fake.',
  },
  {
    title: 'Execution ritual',
    copy: 'The goal is not “AI did it.” The goal is fewer dropped threads between school, research, work, and public proof.',
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
  'Writing is not decoration; it is proof of judgment.',
  'Case studies beat project grids when systems thinking matters.',
  'Quantum and visual-learning references work best when they make hard domains approachable.',
  'One unmistakable visual motif wins more than five generic portfolio sections.',
];

const fallingPetals = Array.from({ length: 38 }, (_, index) => ({
  id: index,
  left: `${4 + ((index * 9) % 34)}vw`,
  delay: `-${(index * 0.47) % 10}s`,
  duration: `${13 + (index % 9)}s`,
  drift: `${34 + (index % 6) * 9}vw`,
  scale: `${0.62 + (index % 5) * 0.13}`,
}));

const staticPetals = [
  ['18vw', '15vh', '-18deg'],
  ['27vw', '23vh', '24deg'],
  ['36vw', '32vh', '-42deg'],
  ['45vw', '42vh', '18deg'],
  ['52vw', '51vh', '-8deg'],
  ['61vw', '61vh', '34deg'],
  ['69vw', '72vh', '-28deg'],
  ['78vw', '84vh', '16deg'],
  ['86vw', '91vh', '-12deg'],
];

function BlossomWorld() {
  return (
    <div className="blossom-world" aria-hidden="true">
      <div className="story-tree">
        <div className="tree-trunk-large" />
        <div className="tree-shadow" />
        <div className="canopy cluster-one" />
        <div className="canopy cluster-two" />
        <div className="canopy cluster-three" />
        <div className="tree-branch branch-a" />
        <div className="tree-branch branch-b" />
        <div className="tree-branch branch-c" />
        <div className="tree-branch branch-d" />
      </div>
      <div className="wind-ribbon ribbon-one" />
      <div className="wind-ribbon ribbon-two" />
      <div className="wind-ribbon ribbon-three" />
      {fallingPetals.map((petal) => (
        <span
          key={petal.id}
          className="falling-petal"
          style={{
            left: petal.left,
            animationDelay: petal.delay,
            animationDuration: petal.duration,
            '--drift': petal.drift,
            '--petal-scale': petal.scale,
          }}
        />
      ))}
      {staticPetals.map(([left, top, rotate], index) => (
        <span
          key={`static-${index}`}
          className="static-petal"
          style={{ left, top, rotate }}
        />
      ))}
    </div>
  );
}

function App() {
  return (
    <main>
      <BlossomWorld />
      <header className="site-nav" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Jas Khetani home">
          <span className="brand-mark">花</span>
          <span>Jas Khetani</span>
        </a>
        <nav>
          <a href="#proof">Proof</a>
          <a href="#operating-style">AI use</a>
          <a href="#services">Services</a>
          <a href="#contact" className="nav-cta">Enquire</a>
        </nav>
      </header>

      <section id="top" className="hero section-shell">
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
          <p className="kicker">The proof map</p>
          <h2>Three rooms, one person.</h2>
          <p>
            The README gives the first impression. The website goes deeper: how I think, where the proof lives,
            and how an employer or client should engage with me without getting lost in old coursework noise.
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

      <section id="operating-style" className="section-shell operating-section">
        <div className="section-head narrow">
          <p className="kicker">AI-native operating style</p>
          <h2>I use AI as leverage, not camouflage.</h2>
          <p>
            The point of Hermes is not to outsource taste. It is to make my work more inspectable: sharper
            questions, better checklists, tighter accountability, and fewer abandoned threads.
          </p>
        </div>
        <div className="operating-grid">
          {operatingCards.map((card) => (
            <article key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="services" className="section-shell service-panel">
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
      </section>

      <section id="philosophy" className="section-shell philosophy-section">
        <article className="philosophy-card">
          <p className="kicker">Design language</p>
          <h2>Asymmetrical, but balanced.</h2>
          <p>
            The cherry blossom tree starts on the left because the site should feel rooted, not templated. Branches
            carry blossoms at the top; petals drift toward the lower right; the contact section becomes the ground
            where the roots show just enough to give the page weight.
          </p>
        </article>
        <article className="benchmark-card">
          <p className="kicker">What the benchmark changed</p>
          <ul>
            {benchmarkLessons.map((lesson) => <li key={lesson}>{lesson}</li>)}
          </ul>
        </article>
      </section>

      <section id="contact" className="contact-ground">
        <div className="root-system" aria-hidden="true">
          <span className="root-line r1" />
          <span className="root-line r2" />
          <span className="root-line r3" />
          <span className="root-line r4" />
          <span className="petal-pile" />
        </div>
        <div className="section-shell contact-card">
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
        </div>
      </section>
    </main>
  );
}

export default App;
