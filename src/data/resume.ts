// Content for the /resume page.

export const experience = [
  {
    company: 'Valor',
    location: 'Fort Worth, TX',
    title: 'Software Engineering Intern',
    period: 'Jun 2026 — Present',
    points: [
      'Built Spencer, an AI-powered software-spend auditor, using Python/Flask from architecture through deployment.',
      'Partner with engineering and accounting leadership to translate audit standards into product features.',
      'Diagnosed web scraping bottlenecks, cutting runtime 42% by optimizing request timing and session management.',
      'Support IT operations via workstation provisioning and hardware inventory management.',
      'Participate in daily standups and cross-functional technical meetings.',
    ],
  },
  {
    company: 'Texas Christian University',
    location: 'Fort Worth, TX',
    title: 'Teaching Assistant',
    period: 'Jan 2026 — May 2026',
    points: [
      'Graded programming assignments for correctness, style, and conceptual understanding.',
      'Co-developed clear, consistent grading rubrics with fellow TAs and the professor.',
    ],
  },
  {
    company: 'Church of Praise International',
    location: 'Osaka, Japan',
    title: 'Web Designer/Developer',
    period: 'Jun 2025 — Jul 2025',
    points: [
      'Built a responsive WordPress site using the Divi builder, optimizing layouts for desktop, tablet, and mobile.',
      'Partnered with church leaders to turn their mission into a cohesive visual identity.',
      'Trained staff to update site content independently via the WordPress dashboard.',
    ],
  },
];

export const education = [
  {
    school: 'Texas Christian University',
    degree: 'B.S. Computer Science, Minor in Mathematics',
    period: 'Aug 2023 — May 2027',
    details: [
      'GPA: 3.8',
      'Coursework: Data Structures, Analysis of Algorithms, Operating Systems, Database Systems, Computer Organization, Web Technologies, Software Engineering, Cloud Computing',
    ],
  },
];

export const skills = [
  { group: 'Languages', items: ['Java', 'Python', 'C', 'JavaScript', 'HTML/CSS', 'SQL (MySQL, PostgreSQL)'] },
  { group: 'Frameworks', items: ['Flask', 'Jinja2', 'Spring Boot', 'Vue.js'] },
  { group: 'Systems & Tools', items: ['Linux', 'Bash', 'Docker', 'Git', 'GitHub', 'AWS'] },
  { group: 'Developer Tools', items: ['VS Code', 'IntelliJ', 'Cursor', 'Claude Code'] },
];

export const awards = [
  { name: 'CodePath Intro to Web Development', issuer: 'CodePath', year: 2025 },
  { name: 'David B. Kutinskas Award', issuer: 'TCU Housing', year: 2025 },
];
