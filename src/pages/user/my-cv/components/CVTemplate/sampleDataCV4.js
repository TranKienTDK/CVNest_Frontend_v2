const sampleDataCV4 = {
  personalInfo: {
    fullName: "Nguyen Van A",
    jobPosition: "Senior Software Engineer",
    phone: "+84 123 456 789",
    email: "nguyenvana@example.com",
    address: "Ha Noi, Viet Nam",
    github: "github.com/nguyenvana"
  },
  skills: [
    { name: "JavaScript/TypeScript" },
    { name: "React.js/Next.js" },
    { name: "Node.js/Express" },
    { name: "MongoDB/PostgreSQL" },
    { name: "Docker/Kubernetes" },
    { name: "AWS/Azure Cloud" },
    { name: "CI/CD Pipelines" },
    { name: "RESTful APIs" }
  ],
  languages: [
    { language: "Vietnamese", proficiency: "Native" },
    { language: "English", proficiency: "Fluent" },
    { language: "Japanese", proficiency: "Intermediate" }
  ],
  hobbies: [
    "Photography",
    "Reading tech blogs",
    "Hiking",
    "Playing chess",
    "Cooking"
  ],
  introduction: "Experienced software engineer with over 7 years of expertise in building modern web applications. Specializing in React.js and Node.js with a strong focus on performance optimization and scalable architecture. Passionate about clean code and user-centric design. Currently seeking opportunities to leverage my skills in a challenging and innovative environment.",
  workExperience: [
    {
      position: "Senior Frontend Engineer",
      company: "Tech Solutions Vietnam",
      duration: "2020 - Present",
      description: "Lead developer for enterprise SaaS platform serving 50,000+ users. Architected and implemented major features resulting in 40% increase in user retention.",
      technologies: [
        "Implemented CI/CD pipeline reducing deployment time by 65%",
        "Optimized React rendering performance resulting in 35% faster load times",
        "Mentored junior developers and established code review processes"
      ]
    },
    {
      position: "Full Stack Developer",
      company: "Digital Innovation Co.",
      duration: "2017 - 2020",
      description: "Developed and maintained multiple client projects from concept to deployment. Worked closely with design team to implement responsive UI components.",
      technologies: [
        "Built RESTful APIs using Node.js and Express",
        "Designed and implemented MongoDB database schemas",
        "Integrated third-party payment processing services"
      ]
    },
    {
      position: "Junior Developer",
      company: "StartUp Tech",
      duration: "2015 - 2017",
      description: "Contributed to frontend development using React.js. Participated in daily scrums and sprint planning.",
      technologies: [
        "Converted UI designs to functional React components",
        "Fixed cross-browser compatibility issues",
        "Implemented unit tests using Jest"
      ]
    }
  ],
  education: [
    {
      degree: "Master of Computer Science",
      school: "Hanoi University of Science and Technology",
      duration: "2013 - 2015",
      description: "Specialized in Software Engineering. Thesis on 'Optimizing React Applications for Large-Scale Deployment'."
    },
    {
      degree: "Bachelor of Engineering in Information Technology",
      school: "Vietnam National University",
      duration: "2009 - 2013",
      description: "Graduated with High Distinction. Dean's List for all semesters."
    }
  ],
  projects: [
    {
      name: "E-commerce Platform",
      description: "Built a full-featured e-commerce platform with inventory management, payment processing, and analytics dashboard.",
      technologies: ["React", "Redux", "Node.js", "MongoDB", "AWS"]
    },
    {
      name: "Healthcare Management System",
      description: "Developed a system for healthcare providers to manage patient records, appointments, and billing.",
      technologies: ["TypeScript", "Next.js", "Express", "PostgreSQL", "Docker"]
    },
    {
      name: "Real-time Chat Application",
      description: "Created a scalable chat application supporting group conversations, file sharing, and end-to-end encryption.",
      technologies: ["React", "Socket.IO", "Node.js", "Redis", "JWT"]
    }
  ]
};

export default sampleDataCV4;
