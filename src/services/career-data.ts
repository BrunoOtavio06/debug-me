// Interfaces
export interface Competency {
  name: string;
  category: string;
  description: string;
}

export interface Career {
  name: string;
  requiredCompetencies: Record<string, number>; // competency name -> weight (0-1)
  learningPath: string[];
  calculateCompatibilityScore: (competencies: Record<string, number>) => number;
}

export interface Profile {
  name: string;
  competencies: Record<string, number>; // competency name -> level (1-5)
}

export interface AutomationRisk {
  level: 'low' | 'medium' | 'high';
  percentage: number;
  taskBreakdown: Array<{
    task: string;
    riskLevel: 'low' | 'medium' | 'high';
    automationLikelihood: string;
  }>;
  adaptationStrategies: string[];
  complementarySkills: string[];
}

// Default competencies
export const defaultCompetencies: Competency[] = [
  {
    name: "Programming Logic",
    category: "Technical",
    description: "Ability to understand algorithms and logical structures"
  },
  {
    name: "Creativity",
    category: "Behavioral",
    description: "Ability to propose innovative and original solutions"
  },
  {
    name: "Collaboration",
    category: "Behavioral",
    description: "Work well in teams and share knowledge"
  },
  {
    name: "Adaptability",
    category: "Behavioral",
    description: "Ability to adjust quickly to changes"
  },
  {
    name: "Analytical Thinking",
    category: "Technical",
    description: "Analyze data and problems in a structured way"
  },
  {
    name: "Artificial Intelligence",
    category: "Technical",
    description: "Knowledge of AI algorithms and tools"
  },
  {
    name: "Communication",
    category: "Behavioral",
    description: "Express ideas clearly and objectively"
  },
  {
    name: "Problem Solving",
    category: "Behavioral",
    description: "Diagnose and solve problems effectively"
  },
  {
    name: "Curiosity",
    category: "Behavioral",
    description: "Continuous desire to learn new things"
  },
  {
    name: "Leadership",
    category: "Behavioral",
    description: "Influence and motivate people to achieve goals"
  }
];

// Learning paths by competency
export const competencyLearningPaths: Record<string, string[]> = {
  "Programming Logic": [
    "Introductory logic course on Codecademy",
    "Solve challenges on platforms like HackerRank or LeetCode"
  ],
  "Creativity": [
    "Practice brainstorming and design thinking",
    "Participate in innovation workshops"
  ],
  "Collaboration": [
    "Work on team projects",
    "Study agile methodologies"
  ],
  "Adaptability": [
    "Take courses on change management",
    "Exercise flexibility in multidisciplinary projects"
  ],
  "Analytical Thinking": [
    "Learn basic statistics and data analysis",
    "Practice interpreting dashboards and graphs"
  ],
  "Artificial Intelligence": [
    "Take an introduction to Machine Learning course",
    "Explore AI libraries like TensorFlow or PyTorch"
  ],
  "Communication": [
    "Participate in debates and presentations",
    "Study storytelling techniques"
  ],
  "Problem Solving": [
    "Practice logic and puzzles",
    "Apply methodologies like Design Thinking"
  ],
  "Curiosity": [
    "Read articles from different areas regularly",
    "Explore new hobbies and tools"
  ],
  "Leadership": [
    "Take team management courses",
    "Read biographies of inspiring leaders"
  ]
};

// Create career with calculateCompatibilityScore method
export function createCareer(
  name: string,
  requiredCompetencies: Record<string, number>,
  learningPath: string[]
): Career {
  return {
    name,
    requiredCompetencies,
    learningPath,
    calculateCompatibilityScore(competencies: Record<string, number>): number {
      const weights = Object.values(this.requiredCompetencies) as number[];
      const sumWeights = weights.reduce((a, b) => a + b, 0);
      if (sumWeights === 0) {
        return 0.0;
      }
      let total = 0.0;
      for (const [comp, weight] of Object.entries(this.requiredCompetencies)) {
        const level = competencies[comp] || 0;
        total += (level / 5) * (weight as number); // normalize level (1-5) to 0-1
      }
      return (total / sumWeights) * 100; // return percentage
    }
  };
}

// Default careers
export const defaultCareers: Career[] = [
  createCareer(
    "Data Scientist",
    {
      "Programming Logic": 0.25,
      "Analytical Thinking": 0.30,
      "Curiosity": 0.10,
      "Collaboration": 0.10,
      "Problem Solving": 0.25
    },
    [
      "Python programming course",
      "Specialization in data science and statistics",
      "Practical data analysis projects"
    ]
  ),
  createCareer(
    "Software Engineer",
    {
      "Programming Logic": 0.30,
      "Problem Solving": 0.25,
      "Collaboration": 0.15,
      "Adaptability": 0.15,
      "Communication": 0.15
    },
    [
      "Advanced object-oriented programming course",
      "Practice versioning with Git and GitHub",
      "Contribute to open source projects"
    ]
  ),
  createCareer(
    "UX Designer",
    {
      "Creativity": 0.30,
      "Communication": 0.20,
      "Curiosity": 0.10,
      "Collaboration": 0.20,
      "Adaptability": 0.20
    },
    [
      "User interface and experience design courses",
      "Usability and user behavior studies",
      "Build a portfolio with design projects"
    ]
  ),
  createCareer(
    "Cybersecurity Specialist",
    {
      "Programming Logic": 0.20,
      "Analytical Thinking": 0.30,
      "Problem Solving": 0.30,
      "Adaptability": 0.20
    },
    [
      "Information security training",
      "Certifications like CEH or CompTIA Security+",
      "Practice in capture the flag (CTF) environments"
    ]
  ),
  createCareer(
    "Machine Learning Engineer",
    {
      "Programming Logic": 0.20,
      "Artificial Intelligence": 0.40,
      "Analytical Thinking": 0.25,
      "Curiosity": 0.15
    },
    [
      "Intensive Machine Learning course",
      "AI projects applied to real problems",
      "Study advanced learning algorithms"
    ]
  ),
  createCareer(
    "Tech Entrepreneur",
    {
      "Creativity": 0.30,
      "Leadership": 0.30,
      "Adaptability": 0.20,
      "Communication": 0.20
    },
    [
      "Entrepreneurship and innovation courses",
      "Participation in hackathons and incubators",
      "Reading about business models and startups"
    ]
  )
];

// Automation risk data for each career
export const automationRiskData: Record<string, AutomationRisk> = {
  "Data Scientist": {
    level: "medium",
    percentage: 45,
    taskBreakdown: [
      {
        task: "Data cleaning and preprocessing",
        riskLevel: "high",
        automationLikelihood: "80% - Automated tools can handle routine data cleaning"
      },
      {
        task: "Statistical analysis and modeling",
        riskLevel: "medium",
        automationLikelihood: "50% - AI can assist but human insight needed for interpretation"
      },
      {
        task: "Business strategy and communication",
        riskLevel: "low",
        automationLikelihood: "20% - Requires human judgment and stakeholder interaction"
      },
      {
        task: "Complex problem-solving and research",
        riskLevel: "low",
        automationLikelihood: "25% - Creative problem-solving remains human domain"
      }
    ],
    adaptationStrategies: [
      "Focus on strategic thinking and business acumen",
      "Develop expertise in domain-specific knowledge",
      "Enhance communication and storytelling skills",
      "Learn to work alongside AI tools rather than compete",
      "Specialize in areas requiring human judgment (ethics, bias detection)"
    ],
    complementarySkills: ["Communication", "Leadership", "Creativity", "Problem Solving"]
  },
  "Software Engineer": {
    level: "medium",
    percentage: 40,
    taskBreakdown: [
      {
        task: "Code generation for routine tasks",
        riskLevel: "high",
        automationLikelihood: "70% - AI coding assistants can generate boilerplate code"
      },
      {
        task: "Bug fixing and debugging",
        riskLevel: "medium",
        automationLikelihood: "45% - AI can help identify issues but complex debugging requires human insight"
      },
      {
        task: "System architecture and design",
        riskLevel: "low",
        automationLikelihood: "25% - Requires deep understanding of business needs and trade-offs"
      },
      {
        task: "Code review and team collaboration",
        riskLevel: "low",
        automationLikelihood: "30% - Human judgment needed for code quality and team dynamics"
      }
    ],
    adaptationStrategies: [
      "Focus on system design and architecture",
      "Develop expertise in complex problem-solving",
      "Enhance collaboration and mentoring skills",
      "Learn to leverage AI tools to increase productivity",
      "Specialize in areas requiring security and performance optimization"
    ],
    complementarySkills: ["Problem Solving", "Collaboration", "Communication", "Adaptability"]
  },
  "UX Designer": {
    level: "low",
    percentage: 25,
    taskBreakdown: [
      {
        task: "Basic wireframing and prototyping",
        riskLevel: "medium",
        automationLikelihood: "40% - AI tools can generate initial designs but lack human creativity"
      },
      {
        task: "User research and empathy",
        riskLevel: "low",
        automationLikelihood: "15% - Understanding human emotions and needs requires human insight"
      },
      {
        task: "Creative design and aesthetics",
        riskLevel: "low",
        automationLikelihood: "20% - Artistic vision and creativity are uniquely human"
      },
      {
        task: "Stakeholder communication and strategy",
        riskLevel: "low",
        automationLikelihood: "10% - Requires human interaction and negotiation skills"
      }
    ],
    adaptationStrategies: [
      "Deepen user research and empathy skills",
      "Focus on strategic design thinking",
      "Enhance storytelling and presentation abilities",
      "Develop expertise in accessibility and inclusive design",
      "Build strong collaboration skills with cross-functional teams"
    ],
    complementarySkills: ["Creativity", "Communication", "Collaboration", "Curiosity"]
  },
  "Cybersecurity Specialist": {
    level: "low",
    percentage: 30,
    taskBreakdown: [
      {
        task: "Automated threat detection",
        riskLevel: "medium",
        automationLikelihood: "50% - AI can detect patterns but human analysis needed for context"
      },
      {
        task: "Vulnerability scanning",
        riskLevel: "high",
        automationLikelihood: "75% - Automated tools excel at finding known vulnerabilities"
      },
      {
        task: "Incident response and forensics",
        riskLevel: "low",
        automationLikelihood: "25% - Complex investigations require human judgment and experience"
      },
      {
        task: "Security strategy and policy",
        riskLevel: "low",
        automationLikelihood: "15% - Strategic planning requires understanding business context"
      }
    ],
    adaptationStrategies: [
      "Focus on advanced threat hunting and incident response",
      "Develop expertise in security architecture",
      "Enhance communication skills for explaining risks to stakeholders",
      "Learn to leverage AI for threat intelligence while maintaining human oversight",
      "Specialize in areas requiring ethical judgment (privacy, compliance)"
    ],
    complementarySkills: ["Analytical Thinking", "Problem Solving", "Communication", "Adaptability"]
  },
  "Machine Learning Engineer": {
    level: "medium",
    percentage: 35,
    taskBreakdown: [
      {
        task: "Model training and hyperparameter tuning",
        riskLevel: "medium",
        automationLikelihood: "55% - AutoML can automate some tasks but expert knowledge still needed"
      },
      {
        task: "Data pipeline development",
        riskLevel: "high",
        automationLikelihood: "65% - Many data engineering tasks can be automated"
      },
      {
        task: "Model interpretation and ethics",
        riskLevel: "low",
        automationLikelihood: "20% - Understanding bias and fairness requires human judgment"
      },
      {
        task: "Research and innovation",
        riskLevel: "low",
        automationLikelihood: "25% - Novel research and creative solutions remain human domain"
      }
    ],
    adaptationStrategies: [
      "Focus on model interpretability and ethics",
      "Develop expertise in specialized domains (healthcare, finance, etc.)",
      "Enhance research and innovation capabilities",
      "Learn to design AI systems that augment human capabilities",
      "Specialize in areas requiring domain expertise and human judgment"
    ],
    complementarySkills: ["Analytical Thinking", "Curiosity", "Problem Solving", "Communication"]
  },
  "Tech Entrepreneur": {
    level: "low",
    percentage: 20,
    taskBreakdown: [
      {
        task: "Market research and analysis",
        riskLevel: "medium",
        automationLikelihood: "40% - AI can gather data but strategic insights require human judgment"
      },
      {
        task: "Business strategy and vision",
        riskLevel: "low",
        automationLikelihood: "10% - Vision and strategic thinking are uniquely human"
      },
      {
        task: "Team building and leadership",
        riskLevel: "low",
        automationLikelihood: "5% - Human relationships and motivation cannot be automated"
      },
      {
        task: "Innovation and creativity",
        riskLevel: "low",
        automationLikelihood: "15% - Creative problem-solving and innovation require human insight"
      }
    ],
    adaptationStrategies: [
      "Focus on building strong human relationships",
      "Develop deep domain expertise in your industry",
      "Enhance leadership and team-building skills",
      "Learn to leverage AI tools for market insights while maintaining strategic vision",
      "Build skills in areas that require human judgment (negotiation, fundraising, partnerships)"
    ],
    complementarySkills: ["Leadership", "Creativity", "Communication", "Adaptability"]
  }
};

