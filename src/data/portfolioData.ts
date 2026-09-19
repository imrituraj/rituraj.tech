import { ProjectItem, HonorItem, ArchiveItem, SocialLink, EducationItem } from '../types/portfolio';

export const personalInfo = {
  name: 'Ritu Raj',
  firstName: 'Ritu',
  lastName: 'Raj',
  role: 'Software Development Engineer & Systems Researcher',
  education: 'M.Tech CSE at IIT Patna (2026 - Present) | B.Tech from TIU, Kolkata (2022 - 2026)',
  email: 'riturcse@gmail.com',
  resumeUrl: 'https://drive.google.com/file/d/1U5NAthx0EEo74rxlabnclimdemVzTaMy/view?usp=sharing',
  musicUrl: '/music.mp3',
  year: 2026
};

export const socialLinks: SocialLink[] = [
  {
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/irituraj/',
    handle: 'irituraj'
  },
  {
    platform: 'YouTube',
    url: 'https://www.youtube.com/@ritu_onyt',
    handle: '@ritu_onyt'
  },
  {
    platform: 'Instagram',
    url: 'https://www.instagram.com/rituraj_onig',
    handle: '@rituraj_onig'
  },
  {
    platform: 'GitHub',
    url: 'https://github.com/imrituraj',
    handle: 'imrituraj'
  },
  {
    platform: 'Twitter',
    url: 'https://x.com/ritu_ontw',
    handle: '@ritu_ontw'
  }
];

export const heroInfo = {
  passions: [
    'Scalable Distributed Systems,',
    'High-Performance Backend Engineering,',
    'Algorithmic Computing & Architecture'
  ],
  socialCta: "Don't forget to checkout my Social media"
};

export const services = [
  'Web Development',
  'Video Making & Editing',
  'Social Media Branding',
  'Designing (Posters, Logos)'
];

export const educationHistory: EducationItem[] = [
  {
    degree: 'M.Tech — Computer Science & Engineering (CSE)',
    institution: 'IIT Patna (Indian Institute of Technology, Patna)',
    period: '2026 – Present',
    location: 'Patna, Bihar',
    field: 'Computer Science & Engineering',
    details: 'Postgraduate studies focusing on advanced computer systems, distributed architecture, and software engineering.',
    current: true,
    logo: '/images/iitp-logo.png'
  },
  {
    degree: 'B.Tech — Computer Science & Engineering',
    institution: 'Techno India University (TIU), Kolkata',
    period: '2022 – 2026',
    location: 'Kolkata, West Bengal',
    field: 'Computer Science & Engineering',
    details: 'Undergraduate degree focusing on core algorithms, full-stack web architectures, and software engineering.',
    logo: '/images/tiu-logo.png'
  }
];

export const projects: ProjectItem[] = [
  {
    id: 'authrax',
    title: 'Team Authrax',
    accentWord: 'Authrax',
    subtitle: 'Reva Hackathon Winner',
    category: 'Decentralized Authentication & Security',
    domain: 'SYSTEMS & WEB',
    year: '2023',
    image: '/images/auth-main.jpg',
    url: 'https://github.com/NikithGanga/AUTHRAX',
    githubUrl: 'https://github.com/NikithGanga/AUTHRAX',
    techStack: 'Solidity, Ethereum, React, Node.js, Express',
    description: 'A decentralized biometric identity verification and authentication system engineered during the national-level Reva Hackathon. Eliminates centralized credential storage vulnerabilities.',
    highlights: [
      'Smart contract-based authentication eliminating single points of failure',
      'End-to-end encrypted session tokens and MetaMask wallet handshake',
      'Awarded top honors at Reva National Hackathon 2023'
    ],
    previewImages: [
      '/images/auth-main.jpg',
      '/images/auth-1.jpg',
      '/images/auth-2.jpg',
      '/images/auth-3.jpg',
      '/images/auth-4.jpg',
      '/images/auth-5.jpg'
    ]
  },
  {
    id: 'apartment-management',
    title: 'Apartment Management System',
    accentWord: 'Management',
    subtitle: 'Full-Stack Relational Database System',
    category: 'Database Architecture & Web Application',
    domain: 'SYSTEMS & WEB',
    year: '2023',
    image: '/images/app-main.jpg',
    url: 'https://github.com/imrituraj',
    githubUrl: 'https://github.com/imrituraj',
    techStack: 'MySQL, Express.js, React.js, Node.js, Tailwind',
    description: 'Enterprise-grade residential complex management suite handling maintenance requests, tenant lease indexing, billing automation, and role-based staff administration.',
    highlights: [
      'Normalized relational schema designed with ACID-compliant MySQL transactions',
      'Role-based access control (RBAC) for Super Admin, Tenants, and Maintenance Crew',
      'Automated utility invoice generation and resident ledger tracking'
    ],
    previewImages: [
      '/images/app-main.jpg',
      '/images/app-1.jpg',
      '/images/app-2.jpg',
      '/images/app-3.jpg',
      '/images/app-4.jpg',
      '/images/app-5.jpg'
    ]
  },
  {
    id: 'leetcode',
    title: 'Algorithmic Problem Solving',
    accentWord: 'Algorithms',
    subtitle: 'Competitive Programming & DSA Mastery',
    category: 'Data Structures & Algorithmic Optimization',
    domain: 'ALGORITHMS',
    year: '2023 – Present',
    image: '/images/leet-main.jpg',
    url: 'https://github.com/imrituraj',
    githubUrl: 'https://github.com/imrituraj',
    techStack: 'C++, Java, Dynamic Programming, Graph Theory',
    description: 'Rigorous algorithmic practice solving hundreds of complex problems covering Graph Algorithms, Advanced Dynamic Programming, Trees, and Trie implementations.',
    highlights: [
      'Focus on asymptotic time/space bounds and memory locality in C++',
      'Extensive implementations of Dijkstra, Union-Find, Segment Trees & DFS/BFS',
      'Strong analytical foundations applied to M.Tech CSE research at IIT Patna'
    ],
    previewImages: [
      '/images/leet-main.jpg',
      '/images/leet-1.jpeg',
      '/images/leet-2.jpg',
      '/images/leet-3.jpg',
      '/images/leet-4.jpg'
    ]
  },
  {
    id: 'video-editing',
    title: 'Vis a Via Media & Motion',
    accentWord: 'Motion',
    subtitle: 'Cinematic Storytelling & Visual Direction',
    category: 'Creative Production & Visual Direction',
    domain: 'CREATIVE MEDIA',
    year: '2021 – 2026',
    image: '/images/edit-main.jpg',
    url: 'https://www.youtube.com/@ritu_onyt',
    techStack: 'Adobe Premiere Pro, After Effects, CapCut, DaVinci',
    description: 'High-energy video editing, narrative sound design, and custom motion graphics created for digital platforms, accumulating hundreds of thousands of organic views.',
    highlights: [
      'Advanced multi-track audio engineering, sound design, and dynamic pacing',
      'Custom typography animations and kinetic visual effects in After Effects',
      'Directed visual style guide and brand identity for digital creator channels'
    ],
    previewImages: [
      '/images/edit-main.jpg',
      '/images/edit-1.jpg',
      '/images/edit-2.jpg',
      '/images/edit-3.webp',
      '/images/edit-4.webp',
      '/images/edit-5.jpg'
    ]
  }
];

export const archiveItems: ArchiveItem[] = [
  {
    title: 'Logo Designs',
    url: 'https://drive.google.com/drive/folders/1Np7R2IN-ySFYQIpyx-lKArLXpSRG4t1s'
  },
  {
    title: "Block n' Minor (GDSC Project)",
    url: 'https://dsc-team4.vercel.app/'
  },
  {
    title: 'Notes keeper (MERN)',
    url: 'https://akashb2003.github.io/notes-keeper/'
  },
  {
    title: 'Apple AirPods Pro UI',
    url: 'https://akashb2003.github.io/airpods-animaiton.github.io/'
  },
  {
    title: 'Drum kit',
    url: 'https://akashb2003.github.io/drum-kit.github.io/'
  },
  {
    title: '& Much More',
    url: 'https://github.com/imrituraj'
  }
];

export const honors: HonorItem[] = [
  {
    id: 'gdsc',
    title: 'GDSC Club',
    accentWord: 'GDSC',
    year: '2023',
    description: 'Core Member of Google Developer Club RIT',
    url: 'https://gdsc.community.dev/ramaiah-institute-of-technology-bengaluru/'
  },
  {
    id: 'reva',
    title: 'Reva Hackathon',
    year: '2023',
    description: 'Won Hackathon',
    url: 'https://drive.google.com/drive/folders/1sy6K36No1qmFmgj1xKnEmGuHyAQAxju_'
  },
  {
    id: 'tharun-speaks',
    title: 'Tharun Speaks Challenge',
    accentWord: 'Challenge',
    year: '2026',
    description: '2nd Place in 21 days Challenge',
    url: 'https://drive.google.com/drive/folders/1OtFEmP3MyA9LHRj-rKT2To_2zRkWi4Ex'
  },
  {
    id: 'hospitality',
    title: 'Hospitality Volunteer',
    accentWord: 'Hospitality',
    year: '2022',
    description: 'Volunteer in CentuRITon (National Level Hackathon)',
    url: 'https://drive.google.com/drive/folders/1Elkmn23H73Sig__TUYF4owdiwOP2r-Qs'
  },
  {
    id: 'nss',
    title: 'Volunteer in NSS',
    accentWord: 'Volunteer',
    year: '2023',
    description: 'Helped many people in NSS',
    url: 'https://drive.google.com/drive/folders/1W6i6mvf72H1XNlZgHavhoT1IkuagwRNw'
  },
  {
    id: 'internship',
    title: 'Internship',
    year: '2023',
    description: 'CodingRaja Tech. Front-End Dev',
    url: 'https://drive.google.com/drive/folders/1VUQDuTATecG8PzphTX_HS3KcXRpVayz2'
  }
];
