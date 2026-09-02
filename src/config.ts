export const portfolioConfig = {
  name: "ANIRUDH RAO",
  role: "BUILDING THINGS THAT SHOULD EXIST.",
  title: "AI / ML DEVELOPER\nFULL-STACK DEVELOPER",
  terminalUsername: "guest@anirudh",
  email: "anirudhrao2007@gmail.com",
  github: {
    username: "AnirudhRao-24",
    url: "https://github.com/AnirudhRao-24"
  },
  linkedin: {
    url: "https://www.linkedin.com/in/anirudh-rao-1946b8432/"
  },
  twitter: {
    url: "https://x.com/_Anirudh_rao"
  },
  instagram: {
    url: "https://www.instagram.com/_anirudhh_rao?igsi=bGRrb3NibXV0ZGxx"
  },
  resume: "/resume.pdf",
  projects: [
    {
      id: '01',
      name: 'CricBid',
      category: 'WEB APP / FULL STACK',
      tech: 'REACT / FIREBASE / TAILWIND',
      desc: 'An interactive cricket auction platform designed to simulate a real auction environment with real-time bidding and budget tracking.',
      year: '2026',
      status: 'DEPLOYED',
      longDesc: 'CricBid is a high-performance web application built to handle the complex, real-time state changes of a live sports auction. It utilizes Firebase Firestore for millisecond-latency database updates, featuring role-based authentication and a synchronized countdown timer.',
      problem: 'Traditional simulated sports auctions rely on slow spreadsheets or unoptimized software that fails under concurrent real-time bidding without proper budget enforcement.',
      solution: 'Engineered a real-time bidding architecture utilizing Firebase Firestore for synchronized state, optimistic UI updates, and role-based access for Hosts and Participants.',
      color: '#3b82f6',
      github: 'https://github.com/AnirudhRao-24/CricBid',
      live: 'https://anirudhrao-24.github.io/CricBid/',
      images: [
        '/cricbid/1.png',
        '/cricbid/2.png',
        '/cricbid/3.png',
        '/cricbid/4.png',
        '/cricbid/5.png',
        '/cricbid/6.png'
      ]
    },
    {
      id: '02',
      name: 'Supercapacitor ML',
      category: 'MACHINE LEARNING',
      tech: 'PYTHON / TENSORFLOW / SCIKIT-LEARN',
      desc: 'ML-based prediction of Cyclic Voltammetry (CV) for supercapacitors using physical input parameters.',
      year: '2026',
      status: 'DEPLOYED',
      longDesc: 'A full-stack Machine Learning pipeline using a Stacked Meta-Model approach (ANN, Random Forest, XGBoost, RidgeCV Regressor) to predict complete CV current curves. The model achieved 99.74% accuracy (R² Score) on unseen validation datasets.',
      problem: 'Traditional Cyclic Voltammetry testing for supercapacitor materials is time-intensive and highly resource-dependent, creating severe bottlenecks in next-generation battery research.',
      solution: 'Replaced physical trial-and-error with a high-accuracy AI pipeline capable of predicting CV curves purely from physical parameters (Potential, Scan Rate, Oxidation state, etc).',
      color: '#10b981',
      github: 'https://github.com/AnirudhRao-24/cv-ml-supercapacitor-bfo',
      live: 'https://anirudhrao-24.github.io/cv-ml-supercapacitor-bfo/',
      images: [
        '/capacitor/1.png',
        '/capacitor/2.png',
        '/capacitor/3.png',
        '/capacitor/4.png',
        '/capacitor/5.png',
        '/capacitor/6.png',
        '/capacitor/7.png',
        '/capacitor/8.png',
        '/capacitor/9.png',
        '/capacitor/10.png',
        '/capacitor/11.png',
        '/capacitor/12.png',
        '/capacitor/13.png',
        '/capacitor/14.png'
      ]
    },
    {
      id: '03',
      name: 'Network Forecaster',
      category: 'CYBERSECURITY / AI',
      tech: 'PYTHON / PYTORCH / FASTAPI',
      desc: 'Predictive Cyber Defense & Attack Trajectory Forecaster using Causal Network World Modeling.',
      year: '2026',
      status: 'WORKING',
      longDesc: 'An Attention-Augmented Network World Model that learns environment state-transition probability distributions across time-windowed network telemetry to anticipate attacker progression and map future states to MITRE ATT&CK stages.',
      problem: 'Traditional Intrusion Detection Systems (IDS) operate in static, memoryless isolation, alerting defenders only after a breach has occurred.',
      solution: 'Implemented an autoregressive K-step forward simulation using an Attention-Augmented LSTM World Model to forecast infiltration trajectories proactively via a FastAPI microservice.',
      color: '#f59e0b',
      github: 'https://github.com/AnirudhRao-24/Network-Attack-Forecasting',
      live: 'https://anirudhrao-24.github.io/Network-Attack-Forecasting/',
      images: [
        '/network/1.png',
        '/network/2.png'
      ]
    }
  ],
  skills: [
    { category: 'LANGUAGES', items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'HTML/CSS'] },
    { category: 'FRONTEND', items: ['React', 'TailwindCSS', 'Framer Motion', 'Vanilla JS'] },
    { category: 'BACKEND', items: ['Firebase', 'FastAPI', 'Node.js', 'Express'] },
    { category: 'AI / ML', items: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'XGBoost', 'LSTMs', 'LLMs'] },
    { category: 'TOOLS', items: ['Git', 'Docker', 'Linux', 'Cloud Platforms'] }
  ],
  bootLines: [
    "INITIALIZING SYSTEM CORE...",
    "MOUNTING VFS...",
    "LOADING AI KERNEL...",
    "CHECKING HARDWARE ACCELERATION: OK",
    "ESTABLISHING NEURAL LINK...",
    "LOADING PORTFOLIO DATA...",
    "SYSTEM READY."
  ]
};
