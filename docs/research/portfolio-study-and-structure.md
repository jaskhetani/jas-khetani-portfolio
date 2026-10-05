# FDE-oriented portfolio study and Jas Khetani site structure

## Evidence and limits

I fetched and inspected **55 distinct public individual sites or substantive personal project/writing pages**. The sample includes **18 pages that explicitly mention FDE/forward deployment near the top**, and **37 adjacent AI/ML engineering, product-building, or technical-writing examples**. All 55 were checked for nonempty page content and a relevant work narrative. Some render as static text, others as client-rendered HTML with server metadata. This is a **qualitative design sample**, not a random hiring cohort. A personal site cannot establish that it caused a job offer; several people describe their roles themselves, without independent employment verification. Nor are all 55 current startup FDEs. I refused to pad the FDE subset with generic templates or broken pages.

The stronger hiring signal comes from employer criteria, not visual trends: OpenAI's FDE posting calls for customer discovery, technical scoping, system design, build and production rollout.[62] Palantir distinguishes the forward-deployed mandate as “one customer, many capabilities.”[63] Baseten's FDE team describes a double bar for engineering fundamentals and product/customer intuition, with a bias for turning field discoveries back into reusable product capability.[57] A Baseten engineer describes a blog post noticed by a co-founder, a subsequent meeting and project work before the offer; that is a *reported individual route*, not evidence that blogs generally cause hiring.[58]

## The useful pattern, not the fashionable template

1. **Name the actual user and constraint before the tech stack.** Clear problem → decision → shipped behavior → measured outcome appears in strong case-study pages, notably the discovery-to-deployment narrative at Prayas Jain.[4] A technically rich project-only site can still leave the reader wondering what was improved.
2. **Show the last 20% of the work.** Evaluations, latency, tenant boundaries, onboarding, handoff, and failures distinguish a production engineer from a tutorial builder. Akshay Kumar foregrounds oversight and scoped access; Senanur Cetin foregrounds evaluation slices; Aasher Kamal lays out architecture and lessons.[9][38][37]
3. **Make one small artifact experiential.** A bounded, deterministic demo beats a dead screenshot or a fragile live LLM widget. Examples range from Live Lab to individual product pages; the demo must be labeled when it is a simulation.[20][37]
4. **Put writing on its own shelf.** Zoltan Fabry separates What I Build, How I Build and Writing; François Chollet separates software, papers and essays.[5][43] Your published quantum writing is genuine evidence that you can interpret complex claims for other people.[61]
5. **Surface customer empathy without claiming a title prematurely.** Your résumé reports an AI/ML internship at Precisio, a ticketing workflow used at an 800+ attendee event, and interdisciplinary teaching. Those are stronger than declaring yourself already employed as an FDE; lead with the evidence and describe forward-deployed engineering as the direction.

## Your proposed information architecture

- **Home / mission:** “Close to the problem. Careful with the solution.” Two routes: selected work or an interactive studio. No inflated “senior FDE” claim.
- **Work / case files:** four edited stories, each with user/context, constraint, architecture decision, reliability boundary, reported result, candid next step, and a source/demo if public. Precisio is explicitly private and its percentage outcomes attributed to the résumé; JAS explains offline/idempotency lessons; the quantum classifier labels its robustness test correctly; local-first agent work is explained without exposing accounts.
- **Practice:** a concise discover → shape → harden → learn loop. It expresses the FDE craft without pretending every engagement was a startup deployment.
- **Studio:** a no-network, front-end-only access-boundary demonstrator with three explicit scenarios (approved aggregate, raw-row denial, prompt override denial). It is a teaching sketch, **not** an employer product or a real security guarantee.
- **About / trajectory:** Precisio internship, JAS founder work, FDU, performance/teaching as evidence of communication. Tools appear in context, not as a hundred-icon wall. The résumé lists GPA 3.7, while your GitHub profile README currently says 3.6; GPA is omitted until reconciled.[60]
- **Journal (distinct `blog.html`):** editorial introduction, featured published essay, searchable/category-filtered archive of 10 real Medium posts, and separately marked prospective field notes. Article links open their Medium originals rather than falsely implying content has been republished. Later, genuine first-party case notes can have their own article routes.
- **Contact:** direct email, GitHub, LinkedIn. No form backend, booking promise, or fabricated testimonials.

**Access note:** I inspected Jas's supplied résumé, public GitHub profile, and Medium profile/articles. LinkedIn redirected to a sign-up wall, so the LinkedIn profile was used only as a contact link; no biographical claims came from it. Handshake was not used as evidence. Employer project details remain résumé-reported unless separately public. This design should be reviewed for client confidentiality and metric accuracy before publication.

## Sample ledger — individual pages actually inspected

Each item cites the exact site inspected. The classification is about **what the page claims or contains**, not a verified employment record. Numbers are source IDs so the evidence block is mechanically checkable.

1. **Aman Patel — Forward-Deployed AI Engineer** — FDE-labelled / role-adjacent. Customer-embedded production claims; scoping-to-rollout narrative and trade-offs. [1]
2. **Ahmed — Deployed Engineer** — AI/ML builder / communication-adjacent. Live demo + GitHub links beside production-project descriptions. [2]
3. **Muhammed Salim | AI Engineer · Forward Deployed Engineer** — FDE-labelled / role-adjacent. Experience, projects and reliability/cost concerns appear together. [3]
4. **Prayas Jain — AI Engineer · Applied AI · Forward Deployed · Full-Stack AI** — FDE-labelled / role-adjacent. Discovery-to-deployment positioning with concrete production case studies. [4]
5. **Zoltan Fabry - AI Engineer | Agent Orchestration & LLM Integration** — AI/ML builder / communication-adjacent. What I Build / How I Build / Writing gives both outcomes and method. [5]
6. **Musila Peter | Forward Deployed Engineer** — FDE-labelled / role-adjacent. Customer deployment experience plus a specific built-project gallery. [6]
7. **Md. Zahid Hasan — AI & Cybersecurity Engineer** — AI/ML builder / communication-adjacent. AI systems and security sit together; project categories are easy to scan. [7]
8. **Kethan Dosapati | AI Engineer Portfolio** — FDE-labelled / role-adjacent. Founding AI engineer experience and a “where I shipped” narrative. [8]
9. **Akshay Kumar BM — Production AI Agents for Operations** — AI/ML builder / communication-adjacent. Production agents foreground restraint, human oversight and scoped access. [9]
10. **Abdul Rafay Ahmed | Senior Full-Stack Engineer** — AI/ML builder / communication-adjacent. Project-specific engineering notes rather than a generic skills wall. [10]
11. **Sujit Sadalage | AI Engineer & Full Stack Developer** — AI/ML builder / communication-adjacent. A RAG console appears as a tangible product, not merely a keyword. [11]
12. **Vivek Marakumbi | AI Engineer Portfolio** — AI/ML builder / communication-adjacent. Experience and specific AI projects are separated for fast evaluation. [12]
13. **AI Systems & Infrastructure Engineer** — AI/ML builder / communication-adjacent. AI workflow automation and infrastructure given distinct capability lanes. [13]
14. **Fateh Ali Aamir — Backend Developer & AI Engineer** — AI/ML builder / communication-adjacent. Compact AI/LLM systems and backend focus, emphasizing shipping. [14]
15. **Yadidiah Kanaparthi — AI/ML & Backend Systems Engineer** — AI/ML builder / communication-adjacent. Selected work and experience shown beside simulations and their status. [15]
16. **Sameer Shah is a Pakistan-based AI and Full-Stack Engineer specializing in LLM applications, RA** — AI/ML builder / communication-adjacent. AI/RAG implementation paired with a visible service-focused narrative. [16]
17. **AI Automation Engineer building intelligent agents, workflow automation, RAG systems, voice AI ** — AI/ML builder / communication-adjacent. Agent, voice and workflow automation examples in a practical gallery. [17]
18. **Fourteen weeks of agent infrastructure, sandboxed runtimes, an iOS app, and durable chat** — AI/ML builder / communication-adjacent. Deep project case study of agent infrastructure and production trade-offs. [18]
19. **Home** — AI/ML builder / communication-adjacent. Published writing linked near work; an assistant interface is explicitly offered. [19]
20. **AI/ML Engineer Portfolio Hero** — AI/ML builder / communication-adjacent. Live Lab and projects demonstrate artifacts before technologies. [20]
21. **Chris Parry - Founding Engineer. Real-time AI, shipped end-to-end.** — AI/ML builder / communication-adjacent. Founder/engineer project narratives cover shipped AI products and constraints. [21]
22. **Hassan Pasha — Principal AI Engineer & Head of AI** — AI/ML builder / communication-adjacent. Problems, what was built, and testimonials are attached to claims. [22]
23. **Edward Yi | AI Engineer, Founder, Builder** — AI/ML builder / communication-adjacent. An AI-assisted product is explained in relation to real user checks. [23]
24. **Jeremy Gracey — AI Architect · AI Engineer · Founder · Designer** — AI/ML builder / communication-adjacent. Flagship systems and responsible-AI lanes balance breadth and depth. [24]
25. **Haris Ahmed — AI Engineer & Full-Stack Software Engineer** — AI/ML builder / communication-adjacent. A clear production-systems positioning line and supporting project evidence. [25]
26. **Tommy Zhang — AI Forward Deployed Engineer** — FDE-labelled / role-adjacent. Brief “things I built and ran” list, avoiding a sprawling résumé wall. [26]
27. **Forward deployed engineer at Together AI. Notes on production AI and adjacent thoughts.
Sohail ** — FDE-labelled / role-adjacent. Production-AI writing and a stated role at Together AI. [27]
28. **Muhammad Sami builds serious AI systems, intelligent products, developer tools, automation work** — FDE-labelled / role-adjacent. AI agent and product work with an end-to-end systems framing. [28]
29. **Tutorials and walkthroughs on building AI systems: agents with LangChain and LangGraph, RAG, LL** — AI/ML builder / communication-adjacent. Technical tutorials act as proof of ability to explain a system. [29]
30. **Explore Redreamality's personal blog and project showcase, featuring in-depth articles on softw** — AI/ML builder / communication-adjacent. Personal blog paired with projects and open-source contributions. [30]
31. **Umesh Malik is an AI engineer and software developer building GenAI applications, LLM-powered p** — AI/ML builder / communication-adjacent. About-page career context for a GenAI/software builder. [31]
32. **Practical backend engineering, AI tooling, and developer career advice by Kubai Kevin** — AI/ML builder / communication-adjacent. Practical backend articles and AI-tooling writing as authority building. [32]
33. **Insights, tutorials, and reflections on artificial intelligence, machine learning, software eng** — AI/ML builder / communication-adjacent. Technical notes connect ML, software and mathematical reasoning. [33]
34. **Prince Singh | Founding Engineer & AI Architect | DSA Expert | AI System Design** — AI/ML builder / communication-adjacent. Production numbers and built systems are prominent; claims remain self-reported. [34]
35. **Priyanshu Paul — AI Engineer & Full-Stack Builder** — AI/ML builder / communication-adjacent. Shipped-project list precedes a tiered toolset. [35]
36. **Portfolio | Chirag Borse** — AI/ML builder / communication-adjacent. Agent-observability and MCP tools shown as distinct products. [36]
37. **Aztrogent** — AI/ML builder / communication-adjacent. Project case study has Challenge / Build / Architecture / Lessons sections. [37]
38. **Senanur Cetin | Data Scientist & AI Engineer** — AI/ML builder / communication-adjacent. Case studies foreground evaluation slices and deployed evidence. [38]
39. **Vishesh Goyal | VisheshVerse** — AI/ML builder / communication-adjacent. Real-world build cards followed by engineering context. [39]
40. **Raj Kumar Nelluri — AI/ML Engineer** — AI/ML builder / communication-adjacent. Named AI agents and domain-specific systems provide navigable work. [40]
41. **Kshitij Bhatnagar, Software Engineer and AI Native Product Builder** — AI/ML builder / communication-adjacent. Individual project pages make a diverse portfolio inspectable. [41]
42. **Sumeet Zankar | AI Engineer — Autonomous Agents** — AI/ML builder / communication-adjacent. Operating fleet and product themes grouped as concrete deployments. [42]
43. **François Chollet - Personal Page** — AI/ML builder / communication-adjacent. Software, books, papers and essays have separate browseable shelves. [43]
44. **Matt Brooks** — AI/ML builder / communication-adjacent. Thoughts and Projects are separated, with a human “What I value” section. [44]
45. **Code intelligence for coding agents** — FDE-labelled / role-adjacent. Selected work and talks show public communication alongside research. [45]
46. **Agastya Kommanamanchi | Forward-Deployed AI Engineering Leader** — FDE-labelled / role-adjacent. Discovery → executable design → hard middle → measurement is explicit. [46]
47. **Yeskendir Assankul — ML / MLOps Engineer** — FDE-labelled / role-adjacent. Full ML lifecycle, FDE experience, and selected RAG work connected. [47]
48. **Forward Deployed & Applied AI Engineer** — FDE-labelled / role-adjacent. Professional experience, focus, and technical skills in context. [48]
49. **Akshita Sharma | Forward Deployed Engineer** — FDE-labelled / role-adjacent. FDE-oriented impact narrative with problem and bottleneck descriptions. [49]
50. **Abhiram Vinjamuri | Forward Deployed Software Engineer** — FDE-labelled / role-adjacent. Experience and technical project sections give hiring context. [50]
51. **Ishank Sharma | Forward Deployed Engineer** — FDE-labelled / role-adjacent. Messy problem → built thing framing without buzzword overload. [51]
52. **David Beatty · Fractional AI Lead** — FDE-labelled / role-adjacent. Forward-deployed team leadership explained through services and working sessions. [52]
53. **Tanzeel Naveed Khan | Forward Deployed Engineer (FDE)** — FDE-labelled / role-adjacent. FDE title, full-stack/AI projects and “what I am hired to do” sections. [53]
54. **Marius Ngaboyamahina — Senior Software & Forward Deployed Engineer** — FDE-labelled / role-adjacent. FDE consultant work, progression and featured projects in one place. [54]
55. **Asadullah Shafique — Agentic AI Systems Engineer** — AI/ML builder / communication-adjacent. A “verified engineering evidence” path and flagship case studies. [55]

## Sources

[1] https://amanpatel.vercel.app
[2] https://deployedengineer.dev
[3] https://mosalim.dev
[4] https://prayas17.github.io/portfolio
[5] https://zoltanfabry.com
[6] https://musiladev.vercel.app
[7] https://z4hid.github.io
[8] https://dkethan.github.io/portfolio
[9] https://akshay-kumar-bm.github.io
[10] https://rafay-ah.github.io
[11] https://sujit1661.github.io/sujit
[12] https://vpm-portfolio.vercel.app
[13] https://vmdeshpande.github.io/vedant-deshpande-portfolio
[14] https://fatehaliaamir2100.github.io/fateh-portfolio
[15] https://yadidiah.vercel.app
[16] https://sameershah-portfolio.vercel.app
[17] https://vishalsahilai.vercel.app
[18] https://tanayshah.dev/projects/structured-ai
[19] https://saadsharifahmed.com
[20] https://www.mwasif.dev
[21] https://cjparry.dev
[22] https://www.hassanpasha.com
[23] https://edwardyi.dev
[24] https://jeremygracey.ai
[25] https://harisahmed.dev
[26] https://www.tommyz.blog
[27] https://sohailmo.ai
[28] https://muhammad-sami.vercel.app
[29] https://folarin.dev
[30] https://redreamality.com
[31] https://umesh-malik.com/about
[32] https://kubaik.github.io
[33] https://vzhukov.dev
[34] https://www.princesingh.work
[35] https://priyanshupaul.vercel.app
[36] https://portfolio-kappa-red-97.vercel.app
[37] https://aasherkamal.com/projects/aztrogent
[38] https://senanur-cetin.vercel.app
[39] https://visheshverse.com
[40] https://rajkumarai.dev
[41] https://kshitijbhatnagar.com
[42] https://sumeetzankar.com
[43] https://fchollet.com
[44] https://mattbrooks.xyz
[45] https://rachpradhan.com
[46] https://agstya.github.io
[47] https://yeskendir2502.github.io
[48] https://jpalmer95.github.io
[49] https://akshita2k.github.io
[50] https://ramstar3000.github.io/Portfolio
[51] https://ishank-dev.github.io
[52] https://davidabeatty.vercel.app
[53] https://tanzeel-portfolio-one.vercel.app
[54] https://ntezi.github.io
[55] https://asadullahshafique-devunity.vercel.app
[57] https://www.baseten.co/blog/forward-deployed-engineering
[58] https://www.baseten.co/blog/what-i-learned-as-a-forward-deployed-engineer-working-at-an-ai-startup
[60] https://github.com/jaskhetani/jaskhetani
[61] https://medium.com/@jaskhetani
[62] https://openai.com/careers/forward-deployed-engineer-seoul-seoul-south-korea
[63] https://www.palantir.com/careers/students-and-early-talent
