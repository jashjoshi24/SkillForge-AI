export const TARGET_ROLES = [
  "Backend Developer",
  "Frontend Developer",
  "Data Analyst",
  "ML Engineer",
  "DevOps Engineer",
  "Cybersecurity Specialist"
];

export const MOCK_DATA_BY_ROLE = {
  "Backend Developer": {
    user: {
      name: "Charmi Sonagra",
      targetRole: "Backend Developer",
      educationLevel: "B.S. Computer Science (Senior)",
      matchPercentage: 84
    },
    extractedProfile: {
      skills: [
        { id: "s1", name: "Python", proficiency: "Advanced", category: "Languages", score: 88 },
        { id: "s2", name: "JavaScript", proficiency: "Intermediate", category: "Languages", score: 72 },
        { id: "s3", name: "SQL & Relational DBs", proficiency: "Intermediate", category: "Databases", score: 75 },
        { id: "s4", name: "Git / GitHub", proficiency: "Advanced", category: "Tools", score: 90 },
        { id: "s5", name: "REST APIs", proficiency: "Intermediate", category: "Web Services", score: 80 }
      ],
      experience: [
        { id: "e1", role: "Software Engineering Intern", company: "TechPulse Labs", duration: "Jun 2025 - Sep 2025", description: "Built asynchronous Python microservices using FastAPI and optimized SQL queries reducing latency by 24%." }
      ],
      projects: [
        { id: "p1", title: "Distributed Task Queue", tech: "Python, Redis, Docker", description: "Asynchronous task processing system supporting background worker scaling." }
      ],
      education: [
        { id: "ed1", degree: "B.S. Computer Science", institution: "State University", year: "2026" }
      ]
    },
    skillGaps: [
      { id: "g1", name: "Docker & Containerization", currentLevel: "Beginner", targetLevel: "Advanced", priority: "HIGH", scoreGap: 45 },
      { id: "g2", name: "PostgreSQL Optimization & Indexing", currentLevel: "Intermediate", targetLevel: "Advanced", priority: "HIGH", scoreGap: 30 },
      { id: "g3", name: "System Architecture & Scalability", currentLevel: "Beginner", targetLevel: "Intermediate", priority: "MEDIUM", scoreGap: 50 },
      { id: "g4", name: "Redis Caching Patterns", currentLevel: "None", targetLevel: "Intermediate", priority: "MEDIUM", scoreGap: 70 }
    ],
    roadmap: [
      {
        id: "phase-1",
        phaseNumber: "01",
        title: "FOUNDATIONS & CORE PARADIGMS",
        description: "Master modern async backend mechanics and clean API architecture.",
        status: "completed",
        completionPercent: 100,
        items: [
          { id: "rm-101", title: "Asynchronous I/O with Python asyncio & FastAPI", completed: true, resourceUrl: "https://fastapi.tiangolo.com", effort: "8 hrs", difficulty: "Intermediate" },
          { id: "rm-102", title: "RESTful API Specification & OpenAPI Standard", completed: true, resourceUrl: "https://swagger.io/specification/", effort: "5 hrs", difficulty: "Beginner" }
        ]
      },
      {
        id: "phase-2",
        phaseNumber: "02",
        title: "DATABASE & CACHING ARCHITECTURE",
        description: "Deep dive into query execution plans, indexes, and cache invalidation.",
        status: "in-progress",
        completionPercent: 50,
        items: [
          { id: "rm-201", title: "PostgreSQL B-Tree Indexing & Query EXPLAIN ANALYZE", completed: true, resourceUrl: "https://www.postgresql.org/docs/current/using-explain.html", effort: "10 hrs", difficulty: "Advanced" },
          { id: "rm-202", title: "Redis Data Structures & Cache-Aside Pattern", completed: false, resourceUrl: "https://redis.io/docs/", effort: "6 hrs", difficulty: "Intermediate" }
        ]
      },
      {
        id: "phase-3",
        phaseNumber: "03",
        title: "CONTAINERIZATION & CLOUD DEPLOYMENT",
        description: "Package services into microcontainers and automate orchestration pipelines.",
        status: "not-started",
        completionPercent: 0,
        items: [
          { id: "rm-301", title: "Multi-stage Dockerfiles & Container Security Best Practices", completed: false, resourceUrl: "https://docs.docker.com/", effort: "12 hrs", difficulty: "Intermediate" },
          { id: "rm-302", title: "CI/CD Pipeline with GitHub Actions & Automated Testing", completed: false, resourceUrl: "https://docs.github.com/actions", effort: "8 hrs", difficulty: "Intermediate" }
        ]
      },
      {
        id: "phase-4",
        phaseNumber: "04",
        title: "SYSTEM DESIGN & INTERVIEW READINESS",
        description: "Practice distributed systems trade-offs and backend architectural interviews.",
        status: "not-started",
        completionPercent: 0,
        items: [
          { id: "rm-401", title: "Rate Limiting & Token Bucket Algorithms", completed: false, resourceUrl: "https://bytebytego.com", effort: "6 hrs", difficulty: "Advanced" },
          { id: "rm-402", title: "Mock Interview: Designing a URL Shortener at Scale", completed: false, resourceUrl: "https://interviewing.io", effort: "4 hrs", difficulty: "Advanced" }
        ]
      }
    ],
    recommendations: {
      projects: [
        {
          id: "rec-p1",
          title: "High-Throughput Rate-Limited API Gateway",
          matchedGap: "Redis Caching Patterns & System Architecture",
          difficulty: "Advanced",
          skills: ["FastAPI", "Redis", "Docker"],
          description: "Build a custom reverse-proxy API Gateway in Python with Redis-backed sliding-window rate limiting."
        },
        {
          id: "rec-p2",
          title: "Containerized Microservices E-Commerce Service",
          matchedGap: "Docker & Containerization",
          difficulty: "Intermediate",
          skills: ["PostgreSQL", "Docker Compose", "SQLAlchemy"],
          description: "Multi-container setup with database connection pooling and asynchronous worker tasks."
        }
      ],
      certifications: [
        {
          id: "rec-c1",
          name: "AWS Certified Developer – Associate",
          issuer: "Amazon Web Services",
          level: "Intermediate",
          relevance: "High",
          url: "https://aws.amazon.com/certification/certified-developer-associate/"
        },
        {
          id: "rec-c2",
          name: "Docker Certified Associate (DCA)",
          issuer: "Mirantis / Docker",
          level: "Intermediate",
          relevance: "Critical Gap",
          url: "https://www.docker.com/certification/"
        }
      ],
      interviewQuestions: [
        {
          id: "rec-q1",
          question: "How does Postgres execute a B-tree index lookup versus a Sequential Scan, and when should you avoid adding an index?",
          topic: "Databases & Performance",
          difficulty: "Hard",
          answer: "B-tree indexes create a hierarchical tree structure allowing O(log N) lookup time. Sequential scans read every page on disk sequentially. Adding an index should be avoided on low-cardinality columns (e.g. boolean flags) or heavily written tables where index write overhead outweighs query read gains."
        },
        {
          id: "rec-q2",
          question: "Explain the Cache-Aside pattern and how you handle cache stampedes during high concurrent requests.",
          topic: "Caching & Distributed Systems",
          difficulty: "Medium",
          answer: "Cache-Aside loads data on demand: check cache -> if miss, load from DB -> update cache. Cache stampedes occur when cache expires and hundreds of requests hit DB at once. Mitigation: Mutex locking (single-flight execution) or probabilistic early expiration."
        }
      ]
    },
    terrainNodes: [
      { id: "tn-1", name: "Python", x: 22, y: 35, elevation: 88, status: "achieved", category: "Core" },
      { id: "tn-2", name: "REST APIs", x: 45, y: 28, elevation: 80, status: "achieved", category: "Core" },
      { id: "tn-3", name: "PostgreSQL", x: 68, y: 40, elevation: 75, status: "achieved", category: "Database" },
      { id: "tn-4", name: "Docker", x: 30, y: 72, elevation: 35, status: "gap", category: "DevOps" },
      { id: "tn-5", name: "Redis Caching", x: 75, y: 78, elevation: 20, status: "gap", category: "Architecture" },
      { id: "tn-6", name: "System Design", x: 52, y: 85, elevation: 25, status: "gap", category: "Architecture" }
    ]
  },
  "Frontend Developer": {
    user: {
      name: "Sam Chen",
      targetRole: "Frontend Developer",
      educationLevel: "B.S. Information Systems",
      matchPercentage: 81
    },
    extractedProfile: {
      skills: [
        { id: "fs1", name: "JavaScript / ES6+", proficiency: "Advanced", category: "Languages", score: 85 },
        { id: "fs2", name: "React.js", proficiency: "Intermediate", category: "Frameworks", score: 78 },
        { id: "fs3", name: "HTML5 & CSS3 / Tailwind", proficiency: "Advanced", category: "Styling", score: 92 },
        { id: "fs4", name: "Git Version Control", proficiency: "Advanced", category: "Tools", score: 88 }
      ],
      experience: [
        { id: "fe1", role: "Frontend Development Intern", company: "PixelForge Interactive", duration: "Jan 2025 - May 2025", description: "Created responsive UI components in React and improved page load times by 30%." }
      ],
      projects: [
        { id: "fp1", title: "Real-Time Dashboard UI", tech: "React, Tailwind, Chart.js", description: "Interactive analytics dashboard with dynamic dark theme controls." }
      ],
      education: [
        { id: "fed1", degree: "B.S. Information Systems", institution: "Tech Institute", year: "2025" }
      ]
    },
    skillGaps: [
      { id: "fg1", name: "TypeScript Type Safety", currentLevel: "Beginner", targetLevel: "Advanced", priority: "HIGH", scoreGap: 40 },
      { id: "fg2", name: "Next.js & SSR/SSG Architecture", currentLevel: "None", targetLevel: "Intermediate", priority: "HIGH", scoreGap: 75 },
      { id: "fg3", name: "State Management (Redux Toolkit / Zustand)", currentLevel: "Beginner", targetLevel: "Intermediate", priority: "MEDIUM", scoreGap: 50 },
      { id: "fg4", name: "Web Performance & Core Web Vitals Optimization", currentLevel: "Intermediate", targetLevel: "Advanced", priority: "MEDIUM", scoreGap: 35 }
    ],
    roadmap: [
      {
        id: "fphase-1",
        phaseNumber: "01",
        title: "FOUNDATIONS & TYPESCRIPT MASTERY",
        description: "Transition from JavaScript to strictly typed production React applications.",
        status: "completed",
        completionPercent: 100,
        items: [
          { id: "frm-101", title: "TypeScript Generics, Utility Types & React Prop Interfaces", completed: true, resourceUrl: "https://www.typescriptlang.org/docs/", effort: "10 hrs", difficulty: "Intermediate" },
          { id: "frm-102", title: "Advanced React Hooks (useCallback, useMemo, useRef)", completed: true, resourceUrl: "https://react.dev/reference/react", effort: "6 hrs", difficulty: "Intermediate" }
        ]
      },
      {
        id: "fphase-2",
        phaseNumber: "02",
        title: "NEXT.JS & SERVER-SIDE RENDERING",
        description: "Master App Router, Server Components, and API routes.",
        status: "in-progress",
        completionPercent: 50,
        items: [
          { id: "frm-201", title: "Next.js App Router, Server Components vs Client Components", completed: true, resourceUrl: "https://nextjs.org/docs", effort: "12 hrs", difficulty: "Advanced" },
          { id: "frm-202", title: "Global State with Zustand & React Query Server Caching", completed: false, resourceUrl: "https://tanstack.com/query/latest", effort: "8 hrs", difficulty: "Intermediate" }
        ]
      },
      {
        id: "fphase-3",
        phaseNumber: "03",
        title: "UI ARCHITECTURE & MICRO-ANIMATIONS",
        description: "Build reusable design systems with Tailwind, Radix UI, and Framer Motion.",
        status: "not-started",
        completionPercent: 0,
        items: [
          { id: "frm-301", title: "Design System Architecture with Storybook & Component Tokens", completed: false, resourceUrl: "https://storybook.js.org", effort: "10 hrs", difficulty: "Intermediate" },
          { id: "frm-302", title: "Lighthouse Performance Tuning & Code Splitting", completed: false, resourceUrl: "https://web.dev/vitals/", effort: "8 hrs", difficulty: "Advanced" }
        ]
      },
      {
        id: "fphase-4",
        phaseNumber: "04",
        title: "INTERVIEW PREP & CODING CHALLENGES",
        description: "Master DOM manipulation, custom hooks, and frontend system design.",
        status: "not-started",
        completionPercent: 0,
        items: [
          { id: "frm-401", title: "Frontend System Design: Building a Virtualized Infinite List", completed: false, resourceUrl: "https://frontendmasterminds.com", effort: "6 hrs", difficulty: "Advanced" },
          { id: "frm-402", title: "Mock Technical Interview: Custom Debounced Search Component", completed: false, resourceUrl: "https://greatfrontend.com", effort: "4 hrs", difficulty: "Intermediate" }
        ]
      }
    ],
    recommendations: {
      projects: [
        {
          id: "frec-p1",
          title: "Next.js 14 E-Commerce Platform with TypeScript",
          matchedGap: "TypeScript Type Safety & Next.js SSR",
          difficulty: "Advanced",
          skills: ["Next.js", "TypeScript", "TailwindCSS", "Zustand"],
          description: "Full-stack SSR web app featuring typed cart state management and server-side product search."
        }
      ],
      certifications: [
        {
          id: "frec-c1",
          name: "Meta Front-End Developer Professional Certificate",
          issuer: "Meta / Coursera",
          level: "Intermediate",
          relevance: "High",
          url: "https://www.coursera.org/professional-certificates/meta-front-end-developer"
        }
      ],
      interviewQuestions: [
        {
          id: "frec-q1",
          question: "What is the difference between React Server Components (RSC) and traditional Server-Side Rendering (SSR)?",
          topic: "Next.js & React Architecture",
          difficulty: "Hard",
          answer: "RSC execute exclusively on the server and send a zero-bundle-size serialized UI tree to the browser without re-hydrating JS code. SSR generates HTML on server, but still requires the full JS bundle to hydrate client-side event handlers."
        }
      ]
    },
    terrainNodes: [
      { id: "ftn-1", name: "JavaScript", x: 25, y: 30, elevation: 85, status: "achieved", category: "Core" },
      { id: "ftn-2", name: "React.js", x: 48, y: 25, elevation: 78, status: "achieved", category: "Framework" },
      { id: "ftn-3", name: "HTML & CSS", x: 70, y: 35, elevation: 92, status: "achieved", category: "Styling" },
      { id: "ftn-4", name: "TypeScript", x: 35, y: 70, elevation: 40, status: "gap", category: "Core" },
      { id: "ftn-5", name: "Next.js SSR", x: 65, y: 80, elevation: 25, status: "gap", category: "Framework" }
    ]
  },
  "Data Analyst": {
    user: {
      name: "Jordan Vance",
      targetRole: "Data Analyst",
      educationLevel: "B.A. Economics & Statistics",
      matchPercentage: 86
    },
    extractedProfile: {
      skills: [
        { id: "ds1", name: "SQL Data Modeling", proficiency: "Advanced", category: "Databases", score: 90 },
        { id: "ds2", name: "Python (Pandas / NumPy)", proficiency: "Intermediate", category: "Analytics", score: 82 },
        { id: "ds3", name: "Excel & Pivot Tables", proficiency: "Advanced", category: "Tools", score: 95 },
        { id: "ds4", name: "Tableau Visualization", proficiency: "Intermediate", category: "BI Tools", score: 76 }
      ],
      experience: [
        { id: "de1", role: "Junior Data Analyst", company: "Insight Analytics", duration: "Aug 2024 - Present", description: "Executed automated SQL queries and created weekly operational dashboards in Tableau." }
      ],
      projects: [
        { id: "dp1", title: "Customer Churn Predictive Dashboard", tech: "Python, SQL, Tableau", description: "Analyzed 50,000+ subscription accounts to identify key churn indicators." }
      ],
      education: [
        { id: "ded1", degree: "B.A. Economics & Statistics", institution: "Metro University", year: "2024" }
      ]
    },
    skillGaps: [
      { id: "dg1", name: "A/B Testing & Hypothesis Testing", currentLevel: "Beginner", targetLevel: "Advanced", priority: "HIGH", scoreGap: 45 },
      { id: "dg2", name: "dbt (Data Build Tool) Transformation", currentLevel: "None", targetLevel: "Intermediate", priority: "HIGH", scoreGap: 80 },
      { id: "dg3", name: "Data Warehouse Architecture (Snowflake / BigQuery)", currentLevel: "Beginner", targetLevel: "Intermediate", priority: "MEDIUM", scoreGap: 55 }
    ],
    roadmap: [
      {
        id: "dphase-1",
        phaseNumber: "01",
        title: "ADVANCED SQL & DATA WAREHOUSING",
        description: "Master window functions, CTEs, and star-schema dimensional modeling.",
        status: "completed",
        completionPercent: 100,
        items: [
          { id: "drm-101", title: "SQL Window Functions (LEAD/LAG, NTILE, DENSE_RANK)", completed: true, resourceUrl: "https://mode.com/sql-tutorial/", effort: "8 hrs", difficulty: "Intermediate" }
        ]
      },
      {
        id: "dphase-2",
        phaseNumber: "02",
        title: "MODERN DATA STACK & DBT TRANSFORMATIONS",
        description: "Build production SQL transformations with automated testing and documentation.",
        status: "in-progress",
        completionPercent: 50,
        items: [
          { id: "drm-201", title: "dbt Fundamentals: Models, Materializations & Testing", completed: true, resourceUrl: "https://docs.getdbt.com/", effort: "10 hrs", difficulty: "Intermediate" },
          { id: "drm-202", title: "Snowflake Virtual Warehouses & Query Optimization", completed: false, resourceUrl: "https://docs.snowflake.com/", effort: "8 hrs", difficulty: "Intermediate" }
        ]
      },
      {
        id: "dphase-3",
        phaseNumber: "03",
        title: "EXPERIMENTATION & STATISTICAL A/B TESTING",
        description: "Design rigorous randomized controlled trials and statistical significance tests.",
        status: "not-started",
        completionPercent: 0,
        items: [
          { id: "drm-301", title: "Statistical Significance, P-Values & Confidence Intervals in Python", completed: false, resourceUrl: "https://scipy.org/", effort: "10 hrs", difficulty: "Advanced" }
        ]
      },
      {
        id: "dphase-4",
        phaseNumber: "04",
        title: "BI EXECUTIVE DASHBOARDING & CASE STUDIES",
        description: "Present actionable business insight metrics to C-suite stakeholders.",
        status: "not-started",
        completionPercent: 0,
        items: [
          { id: "drm-401", title: "Cohort Retention Analysis & Customer Lifetime Value (CLV)", completed: false, resourceUrl: "https://tableau.com", effort: "6 hrs", difficulty: "Intermediate" }
        ]
      }
    ],
    recommendations: {
      projects: [
        {
          id: "drec-p1",
          title: "End-to-End dbt + Snowflake Data Pipeline",
          matchedGap: "dbt & Data Warehouse Architecture",
          difficulty: "Intermediate",
          skills: ["dbt", "Snowflake", "SQL", "Git"],
          description: "Transform raw e-commerce event logs into clean dimensional staging tables with dbt docs."
        }
      ],
      certifications: [
        {
          id: "drec-c1",
          name: "dbt Fundamentals Certification",
          issuer: "dbt Labs",
          level: "Intermediate",
          relevance: "Critical Gap",
          url: "https://www.getdbt.com/certifications/"
        }
      ],
      interviewQuestions: [
        {
          id: "drec-q1",
          question: "How do you calculate sample size for an A/B test to prevent false positives (Type I error) and false negatives (Type II error)?",
          topic: "Statistics & A/B Testing",
          difficulty: "Hard",
          answer: "Sample size depends on statistical power (1-beta, usually 80%), significance level (alpha, usually 5%), baseline conversion rate, and Minimum Detectable Effect (MDE). Formula uses z-score critical values."
        }
      ]
    },
    terrainNodes: [
      { id: "dtn-1", name: "SQL Modeling", x: 28, y: 32, elevation: 90, status: "achieved", category: "Core" },
      { id: "dtn-2", name: "Python Pandas", x: 50, y: 28, elevation: 82, status: "achieved", category: "Core" },
      { id: "dtn-3", name: "Tableau", x: 72, y: 38, elevation: 76, status: "achieved", category: "BI" },
      { id: "dtn-4", name: "A/B Testing", x: 38, y: 72, elevation: 45, status: "gap", category: "Stats" },
      { id: "dtn-5", name: "dbt Pipelines", x: 68, y: 78, elevation: 20, status: "gap", category: "Tools" }
    ]
  },
  "ML Engineer": {
    user: {
      name: "Elena Rostova",
      targetRole: "ML Engineer",
      educationLevel: "M.S. Data Science",
      matchPercentage: 79
    },
    extractedProfile: {
      skills: [
        { id: "ms1", name: "Python & NumPy/PyTorch", proficiency: "Advanced", category: "Languages", score: 89 },
        { id: "ms2", name: "Scikit-Learn ML Models", proficiency: "Advanced", category: "ML Libraries", score: 85 },
        { id: "ms3", name: "SQL & Data Wrangling", proficiency: "Intermediate", category: "Databases", score: 80 }
      ],
      experience: [
        { id: "me1", role: "AI Research Assistant", company: "DataLab Institute", duration: "Sep 2024 - Present", description: "Trained vision transformers and deep neural network models on AWS EC2 GPU instances." }
      ],
      projects: [
        { id: "mp1", title: "Automated Document OCR System", tech: "PyTorch, OpenCV, Flask", description: "End-to-end computer vision model extracting structured text from noisy scans." }
      ],
      education: [
        { id: "med1", degree: "M.S. Data Science", institution: "Polytechnic Institute", year: "2025" }
      ]
    },
    skillGaps: [
      { id: "mg1", name: "MLOps & MLflow Model Tracking", currentLevel: "Beginner", targetLevel: "Advanced", priority: "HIGH", scoreGap: 50 },
      { id: "mg2", name: "FastAPI / Triton Model Serving", currentLevel: "Intermediate", targetLevel: "Advanced", priority: "HIGH", scoreGap: 30 },
      { id: "mg3", name: "Feature Store Setup (Feast)", currentLevel: "None", targetLevel: "Intermediate", priority: "MEDIUM", scoreGap: 75 }
    ],
    roadmap: [
      {
        id: "mphase-1",
        phaseNumber: "01",
        title: "PRODUCTION MODEL SERVING ARCHITECTURE",
        description: "Deploy low-latency machine learning inference microservices.",
        status: "completed",
        completionPercent: 100,
        items: [
          { id: "mrm-101", title: "Packaging PyTorch Artifacts into Async FastAPI Endpoints", completed: true, resourceUrl: "https://pytorch.org", effort: "8 hrs", difficulty: "Intermediate" }
        ]
      },
      {
        id: "mphase-2",
        phaseNumber: "02",
        title: "MLOPS & EXPERIMENT TRACKING WITH MLFLOW",
        description: "Automate hyperparameter tracking, model registry, and artifact versioning.",
        status: "in-progress",
        completionPercent: 50,
        items: [
          { id: "mrm-201", title: "MLflow Model Registry & Deployment Pipelines", completed: true, resourceUrl: "https://mlflow.org", effort: "10 hrs", difficulty: "Intermediate" },
          { id: "mrm-202", title: "Continuous Model Drift Monitoring & Data Quality Checks", completed: false, resourceUrl: "https://evidentlyai.com", effort: "8 hrs", difficulty: "Advanced" }
        ]
      },
      {
        id: "mphase-3",
        phaseNumber: "03",
        title: "SCALABLE INFERENCE & GPU PIPELINES",
        description: "Optimize tensor latency with ONNX Runtime and NVIDIA Triton Server.",
        status: "not-started",
        completionPercent: 0,
        items: [
          { id: "mrm-301", title: "Model Quantization & ONNX Runtime Optimization", completed: false, resourceUrl: "https://onnxruntime.ai", effort: "12 hrs", difficulty: "Advanced" }
        ]
      },
      {
        id: "mphase-4",
        phaseNumber: "04",
        title: "SYSTEM DESIGN & LLM DEPLOYMENT INTERVIEWS",
        description: "Design scalable ML pipelines for recommendation systems and RAG.",
        status: "not-started",
        completionPercent: 0,
        items: [
          { id: "mrm-401", title: "Designing a Scalable Vector Search & Retrieval (RAG) Pipeline", completed: false, resourceUrl: "https://pinecone.io", effort: "8 hrs", difficulty: "Advanced" }
        ]
      }
    ],
    recommendations: {
      projects: [
        {
          id: "mrec-p1",
          title: "MLOps Pipeline: Automated Model Retraining & Drift Alerts",
          matchedGap: "MLOps & MLflow Tracking",
          difficulty: "Advanced",
          skills: ["PyTorch", "MLflow", "Docker", "FastAPI"],
          description: "Build an automated pipeline that detects feature drift and retrains models via Docker containers."
        }
      ],
      certifications: [
        {
          id: "mrec-c1",
          name: "AWS Certified Machine Learning – Specialty",
          issuer: "Amazon Web Services",
          level: "Advanced",
          relevance: "High",
          url: "https://aws.amazon.com/certification/certified-machine-learning-specialty/"
        }
      ],
      interviewQuestions: [
        {
          id: "mrec-q1",
          question: "How do you handle concept drift versus covariate shift in a live production machine learning model?",
          topic: "MLOps & Monitoring",
          difficulty: "Hard",
          answer: "Covariate shift: input distribution P(X) changes while P(Y|X) remains fixed. Concept drift: relationship P(Y|X) changes. Detection via KS-tests or PSI for covariate shift; ground-truth label monitoring for concept drift."
        }
      ]
    },
    terrainNodes: [
      { id: "mtn-1", name: "PyTorch Deep Learning", x: 26, y: 30, elevation: 89, status: "achieved", category: "Core" },
      { id: "mtn-2", name: "Scikit-Learn", x: 48, y: 35, elevation: 85, status: "achieved", category: "Core" },
      { id: "mtn-3", name: "FastAPI Inference", x: 70, y: 40, elevation: 70, status: "achieved", category: "Serving" },
      { id: "mtn-4", name: "MLOps & MLflow", x: 38, y: 74, elevation: 50, status: "gap", category: "Infrastructure" },
      { id: "mtn-5", name: "ONNX Optimization", x: 66, y: 82, elevation: 25, status: "gap", category: "Serving" }
    ]
  },
  "DevOps Engineer": {
    user: {
      name: "Marcus Vance",
      targetRole: "DevOps Engineer",
      educationLevel: "B.S. Network Engineering",
      matchPercentage: 82
    },
    extractedProfile: {
      skills: [
        { id: "dos1", name: "Linux Systems & Bash", proficiency: "Advanced", category: "OS", score: 92 },
        { id: "dos2", name: "Docker Containerization", proficiency: "Advanced", category: "Containers", score: 88 },
        { id: "dos3", name: "Python Scripting", proficiency: "Intermediate", category: "Languages", score: 78 }
      ],
      experience: [
        { id: "doe1", role: "Junior SysAdmin", company: "CloudScale Hosting", duration: "Feb 2024 - Present", description: "Maintained 100+ Linux servers, managed Nginx proxies, and automated backups." }
      ],
      projects: [
        { id: "dop1", title: "Automated Infrastructure Provisioning", tech: "Ansible, Docker, Bash", description: "Automated multi-server deployment reducing setup times from hours to minutes." }
      ],
      education: [
        { id: "doed1", degree: "B.S. Network Engineering", institution: "State Tech", year: "2024" }
      ]
    },
    skillGaps: [
      { id: "dog1", name: "Kubernetes (k8s) Cluster Management", currentLevel: "Beginner", targetLevel: "Advanced", priority: "HIGH", scoreGap: 45 },
      { id: "dog2", name: "Terraform Infrastructure as Code (IaC)", currentLevel: "Beginner", targetLevel: "Advanced", priority: "HIGH", scoreGap: 40 },
      { id: "dog3", name: "Prometheus & Grafana Observability", currentLevel: "Intermediate", targetLevel: "Advanced", priority: "MEDIUM", scoreGap: 35 }
    ],
    roadmap: [
      {
        id: "dophase-1",
        phaseNumber: "01",
        title: "INFRASTRUCTURE AS CODE WITH TERRAFORM",
        description: "Provision AWS cloud infrastructure using declarative HCL configuration.",
        status: "completed",
        completionPercent: 100,
        items: [
          { id: "dorm-101", title: "Terraform State Management, Modules & AWS VPC Provisioning", completed: true, resourceUrl: "https://www.terraform.io", effort: "10 hrs", difficulty: "Intermediate" }
        ]
      },
      {
        id: "dophase-2",
        phaseNumber: "02",
        title: "KUBERNETES CONTAINER ORCHESTRATION",
        description: "Deploy production k8s manifests, ingress controllers, and Helm charts.",
        status: "in-progress",
        completionPercent: 50,
        items: [
          { id: "dorm-201", title: "Kubernetes Pods, Deployments, Services & Ingress Nginx", completed: true, resourceUrl: "https://kubernetes.io/docs/", effort: "14 hrs", difficulty: "Advanced" },
          { id: "dorm-202", title: "Packaging Applications with Helm 3 Charts", completed: false, resourceUrl: "https://helm.sh", effort: "8 hrs", difficulty: "Intermediate" }
        ]
      },
      {
        id: "dophase-3",
        phaseNumber: "03",
        title: "OBSERVABILITY & METRIC ALERTING",
        description: "Setup Prometheus metrics scraping, Loki logging, and Grafana dashboards.",
        status: "not-started",
        completionPercent: 0,
        items: [
          { id: "dorm-301", title: "PromQL Queries & Custom Alertmanager Notifications", completed: false, resourceUrl: "https://prometheus.io", effort: "8 hrs", difficulty: "Intermediate" }
        ]
      },
      {
        id: "dophase-4",
        phaseNumber: "04",
        title: "SRE PRINCIPLES & CKA CERTIFICATION PREP",
        description: "Master zero-downtime rolling updates and disaster recovery procedures.",
        status: "not-started",
        completionPercent: 0,
        items: [
          { id: "dorm-401", title: "CKA Certified Kubernetes Administrator Practice Labs", completed: false, resourceUrl: "https://cncf.io", effort: "15 hrs", difficulty: "Advanced" }
        ]
      }
    ],
    recommendations: {
      projects: [
        {
          id: "dorec-p1",
          title: "GitOps Kubernetes Deployment with ArgoCD & Terraform",
          matchedGap: "Kubernetes Orchestration & Terraform",
          difficulty: "Advanced",
          skills: ["Kubernetes", "Terraform", "ArgoCD", "AWS"],
          description: "Full IaC setup provisioning an EKS cluster and automatically synchronizing k8s manifests via ArgoCD."
        }
      ],
      certifications: [
        {
          id: "dorec-c1",
          name: "Certified Kubernetes Administrator (CKA)",
          issuer: "Linux Foundation / CNCF",
          level: "Advanced",
          relevance: "Critical Gap",
          url: "https://www.cncf.io/certification/cka/"
        }
      ],
      interviewQuestions: [
        {
          id: "dorec-q1",
          question: "What happens when a Kubernetes Pod enters CrashLoopBackOff state, and how do you systematically troubleshoot it?",
          topic: "Kubernetes & SRE",
          difficulty: "Hard",
          answer: "CrashLoopBackOff means k8s tried starting the container repeatedly and it kept failing. Steps: 1. `kubectl describe pod` to check events/exit codes, 2. `kubectl logs --previous` to inspect app panic traces, 3. Verify liveness/readiness probes and env config secrets."
        }
      ]
    },
    terrainNodes: [
      { id: "dotn-1", name: "Linux Bash", x: 24, y: 32, elevation: 92, status: "achieved", category: "Core" },
      { id: "dotn-2", name: "Docker", x: 46, y: 28, elevation: 88, status: "achieved", category: "Core" },
      { id: "dotn-3", name: "Python Automation", x: 68, y: 38, elevation: 78, status: "achieved", category: "Core" },
      { id: "dotn-4", name: "Kubernetes", x: 34, y: 72, elevation: 45, status: "gap", category: "Orchestration" },
      { id: "dotn-5", name: "Terraform IaC", x: 64, y: 78, elevation: 40, status: "gap", category: "Cloud" }
    ]
  },
  "Cybersecurity Specialist": {
    user: {
      name: "Morgan Reed",
      targetRole: "Cybersecurity Specialist",
      educationLevel: "B.S. Cybersecurity & Forensics",
      matchPercentage: 83
    },
    extractedProfile: {
      skills: [
        { id: "cs1", name: "Network Protocol Analysis (Wireshark)", proficiency: "Advanced", category: "Networking", score: 90 },
        { id: "cs2", name: "Linux & Bash Scripting", proficiency: "Advanced", category: "OS", score: 88 },
        { id: "cs3", name: "Python for PenTesting", proficiency: "Intermediate", category: "Languages", score: 76 }
      ],
      experience: [
        { id: "ce1", role: "SOC Analyst Intern", company: "SecureDefend Systems", duration: "May 2025 - Aug 2025", description: "Monitored SIEM log alerts, triaged phishing threats, and executed vulnerability scans." }
      ],
      projects: [
        { id: "cp1", title: "Custom Port & Vulnerability Scanner", tech: "Python, Scapy, Nmap API", description: "Asynchronous multi-threaded port scanner identifying open ports and OS fingerprints." }
      ],
      education: [
        { id: "ced1", degree: "B.S. Cybersecurity & Forensics", institution: "National Defense Univ", year: "2026" }
      ]
    },
    skillGaps: [
      { id: "cg1", name: "Active Directory Exploitation & Kerberoasting", currentLevel: "Beginner", targetLevel: "Advanced", priority: "HIGH", scoreGap: 45 },
      { id: "cg2", name: "Web Application Pentesting (OWASP Top 10)", currentLevel: "Intermediate", targetLevel: "Advanced", priority: "HIGH", scoreGap: 30 },
      { id: "cg3", name: "SIEM Threat Hunting (Splunk / Elastic ELK)", currentLevel: "Intermediate", targetLevel: "Advanced", priority: "MEDIUM", scoreGap: 35 }
    ],
    roadmap: [
      {
        id: "cphase-1",
        phaseNumber: "01",
        title: "WEB APPLICATION PENETRATION TESTING",
        description: "Master OWASP Top 10 vulnerabilities, Burp Suite Pro, and SQL injection payloads.",
        status: "completed",
        completionPercent: 100,
        items: [
          { id: "crm-101", title: "Burp Suite Repeater, Intruder & SQLi Payloads", completed: true, resourceUrl: "https://portswigger.net/web-security", effort: "10 hrs", difficulty: "Intermediate" }
        ]
      },
      {
        id: "cphase-2",
        phaseNumber: "02",
        title: "ACTIVE DIRECTORY & RED TEAMING",
        description: "Exploit Kerberos authentication, privilege escalation, and BloodHound domain graphs.",
        status: "in-progress",
        completionPercent: 50,
        items: [
          { id: "crm-201", title: "Active Directory Attacks: Kerberoasting, AS-REP Roasting & Pass-the-Hash", completed: true, resourceUrl: "https://tryhackme.com", effort: "12 hrs", difficulty: "Advanced" },
          { id: "crm-202", title: "Domain Enumeration using PowerView & BloodHound", completed: false, resourceUrl: "https://github.com/BloodHoundAD/BloodHound", effort: "8 hrs", difficulty: "Advanced" }
        ]
      },
      {
        id: "cphase-3",
        phaseNumber: "03",
        title: "SIEM LOG ANALYSIS & THREAT HUNTING",
        description: "Author Splunk SPL detection rules for Sigma rule signatures and zero-day alerts.",
        status: "not-started",
        completionPercent: 0,
        items: [
          { id: "crm-301", title: "Writing Detection Rules in Splunk SPL & Elastic KQL", completed: false, resourceUrl: "https://splunk.com", effort: "10 hrs", difficulty: "Intermediate" }
        ]
      },
      {
        id: "cphase-4",
        phaseNumber: "04",
        title: "OSCP CERTIFICATION & PENETRATION EXAM PREP",
        description: "Execute 24-hour offensive security practical lab examinations.",
        status: "not-started",
        completionPercent: 0,
        items: [
          { id: "crm-401", title: "OffSec PEN-200 Lab Buffer Overflows & Privilege Escalation", completed: false, resourceUrl: "https://offsec.com", effort: "20 hrs", difficulty: "Advanced" }
        ]
      }
    ],
    recommendations: {
      projects: [
        {
          id: "crec-p1",
          title: "Vulnerable AD Lab & Automated Threat Detection Suite",
          matchedGap: "Active Directory & SIEM Threat Hunting",
          difficulty: "Advanced",
          skills: ["Active Directory", "Splunk", "Python", "Sysmon"],
          description: "Build a virtualized Active Directory domain, launch Kerberoasting attacks, and trigger Splunk SIEM alerts."
        }
      ],
      certifications: [
        {
          id: "crec-c1",
          name: "Offensive Security Certified Professional (OSCP)",
          issuer: "OffSec",
          level: "Advanced",
          relevance: "Critical Gap",
          url: "https://www.offsec.com/courses/pen-200/"
        }
      ],
      interviewQuestions: [
        {
          id: "crec-q1",
          question: "How does Kerberoasting work under the hood, and how can defenders audit for it in Windows Event Logs?",
          topic: "Active Directory Security",
          difficulty: "Hard",
          answer: "Kerberoasting targets Active Directory service accounts with SPNs. Any domain user can request a TGS ticket encrypted with the service account's NTLM hash, then crack it offline. Defenders audit Event ID 4769 (TGS requested) for RC4 encryption (0x17)."
        }
      ]
    },
    terrainNodes: [
      { id: "ctn-1", name: "Wireshark Protocol", x: 22, y: 35, elevation: 90, status: "achieved", category: "Core" },
      { id: "ctn-2", name: "Linux Bash", x: 45, y: 30, elevation: 88, status: "achieved", category: "Core" },
      { id: "ctn-3", name: "Python Pentesting", x: 68, y: 38, elevation: 76, status: "achieved", category: "Core" },
      { id: "ctn-4", name: "Active Directory", x: 32, y: 74, elevation: 45, status: "gap", category: "Exploitation" },
      { id: "ctn-5", name: "Splunk SIEM", x: 65, y: 80, elevation: 35, status: "gap", category: "Defense" }
    ]
  }
};
