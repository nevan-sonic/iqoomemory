// Initial Curated Dataset for Hackathon Prototype
// Contains real pre-processed records matching SQLite/Room schema in Section 5.5 of blueprint

export const INITIAL_PEOPLE = [
  {
    id: 'person-nevan',
    name: 'Nevan',
    fullName: 'Nevan R G',
    role: 'You (Owner)',
    avatar: '/assets/beach.jpeg',
    cropStyle: { backgroundPosition: '56% 25%', backgroundSize: '240%' },
    created_at: Date.now() - 86400000 * 30,
    tags: ['me', 'myself', 'owner', 'ai/ml engineer'],
    faceEmbeddingsCount: 2
  },
  {
    id: 'person-prithiv',
    name: 'Prithiv',
    fullName: 'Prithiv R',
    role: 'Friend & Tech Collaborator',
    avatar: '/assets/friend.jpeg',
    cropStyle: { backgroundPosition: '38% 38%', backgroundSize: '350%' },
    distinguishingFeatures: 'Orange shirt, curly hair, spectacles, iQOO Quester badge',
    created_at: Date.now() - 86400000 * 20,
    tags: ['friend', 'prithiv', 'orange shirt', 'colleague', 'cit classmate'],
    faceEmbeddingsCount: 1
  }
];

export const INITIAL_LOCATIONS = [
  {
    id: 'loc-marina',
    file_id: 'file-beach-photo',
    coarse_name: 'Marina Beach, Chennai',
    short_name: 'Marina Beach',
    city: 'Chennai',
    state: 'Tamil Nadu',
    latitude: 13.0499,
    longitude: 80.2824,
    tags: ['beach', 'sea', 'coast', 'chennai', 'bay of bengal', 'shore', 'outdoor']
  },
  {
    id: 'loc-iqoo-event',
    file_id: 'file-friend-photo',
    coarse_name: 'iQOO Connect Community Meet, Chennai',
    short_name: 'iQOO Event Hall',
    city: 'Chennai',
    state: 'Tamil Nadu',
    latitude: 13.0827,
    longitude: 80.2707,
    tags: ['iqoo', 'iqoo connect', 'event', 'community', 'chennai', 'meetup', 'z11']
  },
  {
    id: 'loc-cit-campus',
    file_id: 'file-nevan-resume',
    coarse_name: 'Chennai Institute of Technology, Chennai',
    short_name: 'CIT Campus',
    city: 'Chennai',
    state: 'Tamil Nadu',
    latitude: 12.9719,
    longitude: 80.0431,
    tags: ['college', 'cit', 'university', 'chennai', 'education']
  }
];

export const INITIAL_FILES = [
  {
    id: 'file-nevan-resume',
    uri: '/assets/Nevan_July_Resume.pdf',
    filename: 'Nevan_July_Resume.pdf',
    mime_type: 'application/pdf',
    size_bytes: 57336,
    sha256: '98a72c114e9f55e09887b4097e3a9856f4d3c2a1e808bfa04123568897acbd12',
    status: 'INDEXED',
    created_at: Date.now() - 86400000 * 14,
    modified_at: Date.now() - 86400000 * 7,
    indexed_at: Date.now() - 86400000 * 2,
    media_category: 'document',
    title: "Nevan R G - AI/ML Engineer Resume",
    summary: "Professional resume of Nevan R G specializing in Agentic AI, LangGraph, LlamaIndex, citation-aware RAG pipelines, FastAPI, and MechaForge.",
    person_ids: ['person-nevan'],
    location_id: 'loc-cit-campus',
    ocr_text: `Nevan R G
nevanrg456@gmail.com | linkedin.com/in/nevanrg14 | github.com/nevan-sonic
AI/ML engineer specializing in Agentic AI, workflow automation, multi-agent orchestration, and tool calling (MCP), with hands-on experience building Generative AI systems, LLM applications, and citation-aware RAG pipelines.
EDUCATION:
Chennai Institute of Technology Aug. 2024 – May 2028
Bachelor of Technology in Information Technology — Chennai, India
EXPERIENCE:
AI/ML Intern (Aug 2026 – Present) at Aparsoft Private Limited: Agentic AI workflows, RAG pipelines, LMS evaluation systems.
AI/ML Intern (June 2026 – Present) at National Informatics Centre (NIC), MeitY, Govt. of India — eProcurement Division: Built citation-aware RAG platform (FastAPI, React), LlamaIndex, pgvector, BAAI/bge-small-en-v1.5 embeddings, PaddleOCR fallback, LangGraph validation, Corrective RAG (CRAG).
PROJECTS:
MechaForge Lab — Visual Meta-Agent Builder (Unified Groq, Gemini, DeepSeek).
T.A.C.T. — Autonomous SRE Incident Responder (Llama 3.3 via Groq in Rust/WASM TEE).
NevoraX — Autonomous Agent-to-Agent Marketplace.
AI Research — Predictive-Prescriptive AI for Additive Manufacturing (Three-head LSTM).
SKILLS:
LangGraph, LlamaIndex, SentenceTransformers, NumPy, Pandas, Scikit-learn, FastAPI, Express.js, Node.js, PostgreSQL, pgvector, Python, TypeScript, React.js, Next.js, Docker, Kubernetes, Google Cloud.`,
    chunks: [
      {
        id: 'chunk-nevan-1',
        text: 'Nevan R G - AI/ML engineer specializing in Agentic AI, workflow automation, multi-agent orchestration, tool calling (MCP), Generative AI systems, citation-aware RAG pipelines.',
        keywords: ['nevan', 'ai/ml', 'agentic ai', 'rag', 'mcp']
      },
      {
        id: 'chunk-nevan-2',
        text: 'Experience: AI/ML Intern at Aparsoft Private Limited and National Informatics Centre (NIC) eProcurement Software Development Division Chennai. Built citation-aware RAG with FastAPI, React, pgvector, LangGraph validation, Corrective RAG (CRAG).',
        keywords: ['aparsoft', 'nic', 'eprocurement', 'fastapi', 'react', 'langgraph', 'crag']
      },
      {
        id: 'chunk-nevan-3',
        text: 'Projects: MechaForge Lab (Meta-Agent builder unifying Groq, Gemini, DeepSeek), T.A.C.T. (Autonomous SRE incident responder via Groq Llama 3.3), NevoraX (Agent-to-Agent marketplace on Ethereum Sepolia).',
        keywords: ['mechaforge', 'tact', 'nevorax', 'groq', 'llama', 'blockchain']
      },
      {
        id: 'chunk-nevan-4',
        text: 'Education & Skills: Chennai Institute of Technology (CIT), B.Tech IT. Skills: Python, TypeScript, LangGraph, LlamaIndex, FastAPI, PostgreSQL, React.js, Docker, GCP.',
        keywords: ['chennai institute of technology', 'cit', 'btech', 'python', 'react']
      }
    ],
    semantic_keywords: ['resume', 'cv', 'nevan', 'software engineering resume', 'ai intern', 'fastapi', 'rag', 'langgraph', 'chennai institute of technology']
  },
  {
    id: 'file-prithiv-resume',
    uri: '/assets/PrithivR_Resume.pdf',
    filename: 'PrithivR Resume.pdf',
    mime_type: 'application/pdf',
    size_bytes: 108842,
    sha256: '4b11fe2811a0c926a7981b23908ac99d45e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
    status: 'INDEXED',
    created_at: Date.now() - 86400000 * 18,
    modified_at: Date.now() - 86400000 * 10,
    indexed_at: Date.now() - 86400000 * 2,
    media_category: 'document',
    title: "Prithiv R - Software Engineer Resume",
    summary: "Resume of Prithiv R, Software Engineer Intern experienced in ReactJS, Java, Spring Boot, Python, Quantum Computing (Qiskit), and AI Education platforms.",
    person_ids: ['person-prithiv'],
    location_id: 'loc-cit-campus',
    ocr_text: `Prithiv R
shakilaprithiv9677273879@gmail.com | +91 8778519090 | linkedin.com/in/prithivr-tech | github.com/prithiv04
EDUCATION:
Chennai Institute Of Technology : B.Tech Information Technology (Sep 2024 – May 2028), 3rd Year.
EXPERIENCE:
Software Engineer Intern - Zidio Development [March 2025 - May 2025]
Designed and developed scalable web applications using Java, Spring Boot, React.js, and SQL. Built and integrated RESTful APIs to connect backend services.
PROJECTS:
Kshitij - AI for education (TensorFlow, PyTorch, Flask, MongoDB, React.js, Tailwind CSS): AI-Powered Personalization & Smart Analytics.
IBM Quantum Platform Backend Analyzer & Job Orchestrator (Python, Qiskit, IBM Quantum, Aer Simulator, Scikit-learn, NLP, Supabase): Aer-based quantum job simulation, natural language Qiskit generation.
AI powered smart resume analyser (React.js, Streamlit, Python spaCy, Gemini API, Firebase): ATS scoring, keyword gap detection.
Perforated AI Powered Optimization Platform (React, TailwindCSS, Python, FastAPI, MCP Server, PostgreSQL).
TECHNICAL SKILLS:
Python, Solidity, MongoDB, FastAPI, ReactJS, Numpy, PyTorch, C++, MySQL, Pandas, Javascript, GitHub, MCP, Blender, C#, C Language, RestAPI, Git, Docker, Vercel, Firebase.
ACHIEVEMENTS:
Web3conf 2025 Winner 2nd place, Leetcode 720 problems solved, Cardano 2025 Top 5 global finalist.`,
    chunks: [
      {
        id: 'chunk-prithiv-1',
        text: 'Prithiv R - Software Engineer, 3rd year B.Tech IT at Chennai Institute of Technology (CIT). Skills: ReactJS, Java, Python, FastAPI, Spring Boot, PyTorch, MongoDB.',
        keywords: ['prithiv', 'software engineer', 'cit', 'chennai institute of technology', 'react']
      },
      {
        id: 'chunk-prithiv-2',
        text: 'Software Engineer Intern at Zidio Development (March 2025 - May 2025): Developed scalable web apps in Java, Spring Boot, React.js, REST APIs, and SQL.',
        keywords: ['zidio', 'intern', 'java', 'spring boot', 'react']
      },
      {
        id: 'chunk-prithiv-3',
        text: 'Projects: Kshitij (AI for education with PyTorch/React), IBM Quantum Platform Backend Analyzer & Job Orchestrator (Qiskit quantum circuits), Smart Resume Analyser (spaCy, Gemini API), Perforated AI.',
        keywords: ['kshitij', 'ibm quantum', 'qiskit', 'resume analyser', 'gemini']
      }
    ],
    semantic_keywords: ['resume', 'cv', 'prithiv', 'prithiv resume', 'friend resume', 'software engineer intern', 'react developer', 'quantum', 'zidio']
  },
  {
    id: 'file-beach-photo',
    uri: '/assets/beach.jpeg',
    filename: 'beach.jpeg',
    mime_type: 'image/jpeg',
    size_bytes: 52751,
    sha256: '77c92a912f8e66c081249b991ef234a5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
    status: 'INDEXED',
    created_at: Date.now() - 86400000 * 25,
    modified_at: Date.now() - 86400000 * 25,
    indexed_at: Date.now() - 86400000 * 2,
    media_category: 'photo',
    title: "Nevan at Marina Beach, Chennai",
    summary: "Selfie of Nevan with a black Cardano cap and earphones standing on the sandy shore of Marina Beach in Chennai with ocean waves.",
    person_ids: ['person-nevan'],
    location_id: 'loc-marina',
    visual_features: {
      scene: "Coastal beach, open sea shoreline, sunny bright sky, waves crashing on sand",
      objects: ["person", "cap", "sunglasses / eyeglasses", "earphones", "beach sand", "ocean", "waves"],
      dominant_colors: ["#7998B4", "#D8C7B0", "#632731", "#1B1D21"],
      quality_score: 0.94,
      faces: [
        {
          person_id: 'person-nevan',
          name: 'Nevan',
          box: { x: 50, y: 15, w: 26, h: 42 },
          confidence: 0.98,
          attributes: ['black cap', 'spectacles', 'earphones', 'burgundy polo shirt']
        }
      ]
    },
    ocr_text: "Cardano HACKATHON Asia 2025",
    semantic_keywords: ['beach', 'marina beach', 'chennai', 'sea', 'ocean', 'waves', 'shore', 'vacation', 'cardano cap', 'nevan at beach', 'outdoor selfie']
  },
  {
    id: 'file-friend-photo',
    uri: '/assets/friend.jpeg',
    filename: 'friend.jpeg',
    mime_type: 'image/jpeg',
    size_bytes: 148234,
    sha256: '33d18c991a78e45b1209f87234c90ab8d12345e6f7a8b9c0d1e2f3a4b5c6d7e8',
    status: 'INDEXED',
    created_at: Date.now() - 86400000 * 12,
    modified_at: Date.now() - 86400000 * 12,
    indexed_at: Date.now() - 86400000 * 2,
    media_category: 'photo',
    title: "Nevan and Prithiv at iQOO Connect Z11 Meet",
    summary: "Nevan and friend Prithiv (in orange shirt) standing together inside an official iQOO Z11 Community photobooth frame with badges.",
    person_ids: ['person-prithiv', 'person-nevan'],
    location_id: 'loc-iqoo-event',
    visual_features: {
      scene: "Indoor event convention hall with wooden arched doorway and carpeted floor",
      objects: ["two people", "iQOO Z11 photo cutout booth frame", "orange shirt", "black shirt", "lanyards / event badges", "iQOO smartphone mockups"],
      dominant_colors: ["#E66624", "#1E2026", "#FCE100", "#7C654D"],
      quality_score: 0.96,
      faces: [
        {
          person_id: 'person-prithiv',
          name: 'Prithiv',
          box: { x: 38, y: 34, w: 12, h: 14 },
          confidence: 0.99,
          attributes: ['orange long-sleeve shirt', 'curly hair', 'spectacles', 'iQOO badge', 'peace sign']
        },
        {
          person_id: 'person-nevan',
          name: 'Nevan',
          box: { x: 54, y: 30, w: 13, h: 15 },
          confidence: 0.97,
          attributes: ['black t-shirt', 'spectacles', 'smiling', 'iQOO quester badge', 'peace sign']
        }
      ]
    },
    ocr_text: "iQOO Connect THE OFFICIAL COMMUNITY | iQOO Z11 | QUESTER EXCLUSIVE ACCESS",
    semantic_keywords: ['prithiv', 'nevan', 'friend', 'friend in orange shirt', 'orange shirt', 'prithiv in orange shirt', 'iqoo', 'iqoo connect', 'iqoo z11', 'quester', 'chennai meetup', 'event photo']
  }
];

export const INITIAL_MEMORIES = [
  {
    id: 'memory-iqoo-meet',
    label: 'iQOO Connect Community Meet in Chennai with Prithiv',
    created_at: Date.now() - 86400000 * 12,
    evidence: [
      { file_id: 'file-friend-photo', evidence_type: 'PERSON', value: 'Prithiv & Nevan' },
      { file_id: 'file-friend-photo', evidence_type: 'LOCATION', value: 'Chennai (iQOO Connect Event)' },
      { file_id: 'file-friend-photo', evidence_type: 'OCR_ENTITY', value: 'iQOO Z11 Community' }
    ]
  },
  {
    id: 'memory-marina-trip',
    label: 'Morning Walk at Marina Beach',
    created_at: Date.now() - 86400000 * 25,
    evidence: [
      { file_id: 'file-beach-photo', evidence_type: 'PERSON', value: 'Nevan' },
      { file_id: 'file-beach-photo', evidence_type: 'LOCATION', value: 'Marina Beach, Chennai' },
      { file_id: 'file-beach-photo', evidence_type: 'SEMANTIC', value: 'Beach / Sea Shore' }
    ]
  },
  {
    id: 'memory-tech-resumes',
    label: 'College Tech Profiles & Resumes (CIT 2026)',
    created_at: Date.now() - 86400000 * 7,
    evidence: [
      { file_id: 'file-nevan-resume', evidence_type: 'PERSON', value: 'Nevan R G' },
      { file_id: 'file-prithiv-resume', evidence_type: 'PERSON', value: 'Prithiv R' },
      { file_id: 'file-nevan-resume', evidence_type: 'OCR_ENTITY', value: 'Agentic AI / LangGraph / RAG' },
      { file_id: 'file-prithiv-resume', evidence_type: 'OCR_ENTITY', value: 'React / Java / Quantum Computing' }
    ]
  }
];
