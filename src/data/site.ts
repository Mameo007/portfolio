// Single source of truth for personal details used across the site.
// TODO: replace placeholder values (marked below) with real ones.

export const site = {
  name: 'Kanta Endo',
  role: 'Software Engineer',
  tagline: 'I build fast, thoughtful software for the web.',
  description:
    'Portfolio of Kanta Endo, a software engineer building fast, thoughtful software for the web.',
  email: 'hello@example.com', // TODO: real contact email
  resumePdf: '/resume.pdf',
  // TODO: create a form at https://formspree.io and paste its ID here.
  formspreeId: 'your-form-id',
} as const;

export const socials = [
  { label: 'GitHub', href: 'https://github.com/Mameo007' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kanta-endo' },
] as const;

export const navLinks = [
  { label: 'Work', href: '/work' },
  { label: 'Resume', href: '/resume' },
  { label: 'Contact', href: '/contact' },
] as const;
