export const portfolioConfig = {
  name: "JOHN DOE",
  role: "BUILDING THINGS THAT SHOULD EXIST.",
  title: "SOFTWARE ENGINEER // OPEN SOURCE CONTRIBUTOR",
  terminalUsername: "guest@johndoe",
  email: "hello@johndoe.com",
  github: {
    username: "johndoe",
    url: "https://github.com/johndoe"
  },
  linkedin: {
    url: "https://www.linkedin.com/in/johndoe/"
  },
  twitter: {
    url: "https://x.com/johndoe"
  },
  instagram: {
    url: "https://www.instagram.com/johndoe"
  },
  resume: "/resume.pdf",
  projects: [
    {
      id: '01',
      name: 'Project Alpha',
      category: 'WEB APP',
      tech: 'REACT / NODE / MONGODB',
      desc: 'A full-stack web application demonstrating CRUD operations and user authentication.',
      year: '2026',
      status: 'DEPLOYED',
      longDesc: 'Project Alpha is a comprehensive web application designed to showcase modern web development practices. It features a responsive frontend built with React and TailwindCSS, and a robust backend powered by Node.js and MongoDB.',
      problem: 'Many tutorials lack end-to-end examples of deploying a full-stack application.',
      solution: 'Built a complete end-to-end template that includes CI/CD pipelines, automated testing, and scalable architecture.',
      color: '#3b82f6',
      github: 'https://github.com/johndoe/project-alpha',
      live: 'https://project-alpha.example.com/',
      images: [
        '/placeholder-1.png',
        '/placeholder-2.png'
      ]
    },
    {
      id: '02',
      name: 'Project Beta',
      category: 'MOBILE APP',
      tech: 'REACT NATIVE / FIREBASE',
      desc: 'A cross-platform mobile application for tracking daily habits.',
      year: '2025',
      status: 'WORKING',
      longDesc: 'Project Beta provides users with a seamless way to track their daily habits and routines. Utilizing React Native, the app runs smoothly on both iOS and Android devices, with real-time data synchronization via Firebase.',
      problem: 'Users struggle to maintain consistency with their habits without engaging tracking mechanisms.',
      solution: 'Implemented a gamified tracking system with push notifications and progress visualization to keep users motivated.',
      color: '#10b981',
      github: 'https://github.com/johndoe/project-beta',
      live: '#',
      images: [
        '/placeholder-3.png',
        '/placeholder-4.png'
      ]
    }
  ],
  skills: [
    { category: 'LANGUAGES', items: ['JavaScript', 'TypeScript', 'Python', 'Java', 'C++'] },
    { category: 'FRONTEND', items: ['React', 'Next.js', 'Vue.js', 'TailwindCSS'] },
    { category: 'BACKEND', items: ['Node.js', 'Express', 'Django', 'PostgreSQL'] },
    { category: 'TOOLS', items: ['Git', 'Docker', 'AWS', 'Linux'] }
  ],
  bootLines: [
    "INITIALIZING SYSTEM CORE...",
    "MOUNTING VFS...",
    "LOADING USER CONFIGURATION...",
    "CHECKING HARDWARE ACCELERATION: OK",
    "ESTABLISHING SECURE LINK...",
    "LOADING PORTFOLIO DATA...",
    "SYSTEM READY."
  ]
};
