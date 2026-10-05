// Content for the /resume page.
// TODO: everything below is placeholder — replace with your real history.

export const experience = [
  {
    company: 'Company Name',
    title: 'Software Engineer',
    period: '2024 — Present',
    points: [
      'Led the migration of a monolith to services, cutting deploy times from 40 to 6 minutes.',
      'Built a real-time notifications system serving 1M+ events per day.',
      'Mentored two junior engineers and introduced a code-review guide adopted team-wide.',
    ],
  },
  {
    company: 'Another Company',
    title: 'Software Engineering Intern',
    period: '2023',
    points: [
      'Shipped an internal analytics dashboard used daily by the operations team.',
      'Improved API p95 latency by 35% through query optimisation and caching.',
    ],
  },
];

export const education = [
  {
    school: 'University Name',
    degree: 'B.S. Computer Science',
    period: '2020 — 2024',
  },
];

export const skills = [
  { group: 'Languages', items: ['TypeScript', 'Python', 'Go', 'SQL'] },
  { group: 'Frontend', items: ['React', 'Next.js', 'Astro', 'Tailwind CSS'] },
  { group: 'Backend', items: ['Node.js', 'FastAPI', 'PostgreSQL', 'Redis'] },
  { group: 'Tooling', items: ['AWS', 'Docker', 'GitHub Actions', 'Terraform'] },
];
