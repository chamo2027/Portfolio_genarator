const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Portfolio = require('./models/Portfolio');
const { connectDB, disconnectDB } = require('./config/db');

dotenv.config();

const samplePortfolios = [
  {
    username: 'alexchen',
    fullName: 'Alex Chen',
    title: 'Senior Full Stack Engineer',
    bio: 'Passionate software craftsman with 6+ years of experience engineering high-performance web applications and distributed systems. Enthusiast for clean architecture, TypeScript, and modern developer tooling.',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    contact: {
      email: 'alex.chen.dev@example.com',
      phone: '+1 (415) 890-2341',
      linkedin: 'https://linkedin.com/in/alexchen-dev',
      github: 'https://github.com/alexchen-demo',
      website: 'https://alexchen.dev',
      twitter: 'https://twitter.com/alexchen_tech',
      location: 'San Francisco, CA',
    },
    skills: [
      'React',
      'TypeScript',
      'Node.js',
      'Express',
      'GraphQL',
      'Next.js',
      'PostgreSQL',
      'MongoDB',
      'Docker',
      'Kubernetes',
      'AWS',
      'Redis',
    ],
    projects: [
      {
        name: 'CloudScale Observability Dashboard',
        description: 'Real-time telemetry and microservices metrics aggregator processing over 10M events/sec with sub-second alert latency.',
        techStack: ['React', 'TypeScript', 'Node.js', 'Redis', 'TailwindCSS'],
        githubLink: 'https://github.com/alexchen-demo/cloudscale',
        liveDemo: 'https://cloudscale-demo.example.com',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'FlowState Collaborative Workspace',
        description: 'Blazing-fast Notion-style multiplayer document editor built using CRDTs (Yjs) and WebSockets with encrypted offline sync.',
        techStack: ['Next.js', 'WebSockets', 'MongoDB', 'Node.js'],
        githubLink: 'https://github.com/alexchen-demo/flowstate',
        liveDemo: 'https://flowstate-demo.example.com',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'DevPulse Code Review CLI',
        description: 'Automated AI-assisted PR reviewer analyzing security vulnerabilities and performance bottlenecks prior to merge.',
        techStack: ['Node.js', 'Go', 'Docker', 'GitHub Actions API'],
        githubLink: 'https://github.com/alexchen-demo/devpulse',
        liveDemo: '',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
      },
    ],
    experience: [
      {
        company: 'Vanguard Systems',
        role: 'Lead Full Stack Architect',
        duration: '2022 - Present',
        description: 'Spearheaded migration to micro-frontends architecture reducing bundle load times by 48%. Mentored team of 12 engineers and led cloud cost optimization initiatives.',
      },
      {
        company: 'HyperFlow Tech',
        role: 'Senior Software Engineer',
        duration: '2020 - 2022',
        description: 'Engineered event-driven pipeline processing streaming payments with 99.999% uptime across multi-region AWS deployments.',
      },
      {
        company: 'Apex Code Studio',
        role: 'Frontend Developer',
        duration: '2018 - 2020',
        description: 'Developed responsive client dashboards for Fortune 500 fintech and e-commerce clients using React, Redux, and modern styling architectures.',
      },
    ],
    education: [
      {
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science',
        duration: '2014 - 2018',
        description: 'Graduated with Honors. Focus on Distributed Systems and Software Architecture.',
      },
    ],
    theme: 'modern-dark',
    views: 342,
    resumeUrl: '',
    isFeatured: true,
  },
  {
    username: 'sarahjenkins',
    fullName: 'Sarah Jenkins',
    title: 'Design Systems & UI Engineer',
    bio: 'Obsessed with smooth micro-interactions, responsive accessibility, and fluid 3D web experiences. Bridging the gap between pixel-perfect product design and performant web architecture.',
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    contact: {
      email: 'sarah.j.design@example.com',
      phone: '+44 20 7946 0912',
      linkedin: 'https://linkedin.com/in/sarahjenkins-ui',
      github: 'https://github.com/sarah-jenkins',
      website: 'https://sarahdesigns.io',
      twitter: 'https://twitter.com/sarah_ui',
      location: 'London, UK',
    },
    skills: [
      'React',
      'Three.js',
      'GSAP Animations',
      'Tailwind CSS',
      'Figma to Code',
      'Next.js',
      'CSS Glassmorphism',
      'Web Accessibility (a11y)',
    ],
    projects: [
      {
        name: 'Aurora Design System',
        description: 'Open-source accessible component library with 60+ headless components, theme token generation, and zero runtime CSS.',
        techStack: ['React', 'TypeScript', 'Storybook', 'Figma API'],
        githubLink: 'https://github.com/sarah-jenkins/aurora-ui',
        liveDemo: 'https://aurora-ui.example.com',
        image: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Spatial 3D Model Explorer',
        description: 'Interactive web-based 3D model customizer running in WebGL with procedural lighting, environment reflections, and AR export.',
        techStack: ['Three.js', 'React Three Fiber', 'WebAudio API'],
        githubLink: 'https://github.com/sarah-jenkins/spatial3d',
        liveDemo: 'https://spatial-3d.example.com',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      },
    ],
    experience: [
      {
        company: 'Prism Creative Labs',
        role: 'Senior UI/UX Engineer',
        duration: '2021 - Present',
        description: 'Crafted award-winning interactive brand sites with custom shader animations and dynamic micro-interactions.',
      },
      {
        company: 'Starlight Digital',
        role: 'Frontend UI Developer',
        duration: '2019 - 2021',
        description: 'Built cross-platform responsive web applications with AA accessibility compliance.',
      },
    ],
    education: [
      {
        institution: 'Royal College of Art, London',
        degree: 'Master of Arts',
        fieldOfStudy: 'Digital Media & Interactive Design',
        duration: '2017 - 2019',
        description: 'Specialized in Human-Computer Interaction and Generative Visual Interfaces.',
      },
    ],
    theme: 'glassmorphism',
    views: 520,
    resumeUrl: '',
    isFeatured: true,
  },
  {
    username: 'marcus-ai',
    fullName: 'Marcus Vance',
    title: 'AI & Backend Systems Architect',
    bio: 'Building low-latency distributed systems, scalable inference backends, and agentic workflows. Passionate about machine learning pipelines and high-throughput systems.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    contact: {
      email: 'marcus.vance@example.com',
      phone: '+1 (512) 674-9821',
      linkedin: 'https://linkedin.com/in/marcus-vance-ai',
      github: 'https://github.com/marcus-vance',
      website: 'https://marcusvance.ai',
      location: 'Austin, TX',
    },
    skills: [
      'Python',
      'Go',
      'FastAPI',
      'PyTorch',
      'Node.js',
      'Docker',
      'PostgreSQL',
      'Redis',
      'Kafka',
      'Vector DBs',
    ],
    projects: [
      {
        name: 'Nexus Vector Search Engine',
        description: 'High-throughput semantic similarity search API powered by HNSW indexing handling 50k QPS under 8ms latency.',
        techStack: ['Go', 'Python', 'gRPC', 'Docker'],
        githubLink: 'https://github.com/marcus-vance/nexus-search',
        liveDemo: 'https://nexus.example.com',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Synapse LLM Router',
        description: 'Intelligent cost-performance optimizer routing prompts between frontier and open-weight models dynamically.',
        techStack: ['Python', 'FastAPI', 'Redis', 'OpenAI API'],
        githubLink: 'https://github.com/marcus-vance/synapse-router',
        liveDemo: 'https://synapse.example.com',
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
      },
    ],
    experience: [
      {
        company: 'Cognitive Matrix AI',
        role: 'Principal Backend Engineer',
        duration: '2022 - Present',
        description: 'Architected distributed model serving infrastructure processing 100M daily API queries.',
      },
    ],
    education: [
      {
        institution: 'Stanford University',
        degree: 'Master of Science',
        fieldOfStudy: 'Artificial Intelligence & Computer Systems',
        duration: '2020 - 2022',
        description: 'Research in High-Performance Neural Network Serving and Parallel Compute Systems.',
      },
    ],
    theme: 'cyberpunk',
    views: 689,
    resumeUrl: '',
    isFeatured: true,
  },
];

const seedDatabase = async () => {
  try {
    const count = await Portfolio.countDocuments();
    if (count === 0) {
      console.log('[Seed] Database is empty. Seeding sample developer portfolios...');
      await Portfolio.insertMany(samplePortfolios);
      console.log(`[Seed] Successfully inserted ${samplePortfolios.length} starter portfolios!`);
    } else {
      console.log(`[Seed] Database already has ${count} portfolios.`);
    }
  } catch (error) {
    console.error('[Seed Error]', error);
  }
};

module.exports = { seedDatabase, samplePortfolios };
