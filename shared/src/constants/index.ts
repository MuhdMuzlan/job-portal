export const JOB_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
] as const;

export const EXPERIENCE_LEVELS = [
  { value: 'entry', label: 'Entry Level', years: '0-2 years' },
  { value: 'mid', label: 'Mid Level', years: '2-5 years' },
  { value: 'senior', label: 'Senior Level', years: '5-8 years' },
  { value: 'lead', label: 'Lead/Principal', years: '8-12 years' },
  { value: 'executive', label: 'Executive', years: '12+ years' },
] as const;

export const APPLICATION_STATUSES = [
  { value: 'pending', label: 'Pending', color: 'yellow' },
  { value: 'reviewing', label: 'Reviewing', color: 'blue' },
  { value: 'interview', label: 'Interview', color: 'purple' },
  { value: 'offered', label: 'Offered', color: 'green' },
  { value: 'rejected', label: 'Rejected', color: 'red' },
] as const;

export const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '500+', label: '500+ employees' },
] as const;

export const INDUSTRIES = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'E-commerce',
  'Manufacturing',
  'Consulting',
  'Media & Entertainment',
  'Real Estate',
  'Transportation',
  'Energy',
  'Other',
] as const;

// Common technical skills for suggestions
export const TECHNICAL_SKILLS = [
  // Programming Languages
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala',
  // Frontend
  'React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap',
  // Backend
  'Node.js', 'Express', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Rails', 'ASP.NET',
  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'SQLite', 'Oracle',
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Jenkins', 'GitHub Actions',
  // Data Science & ML
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'scikit-learn', 'Pandas', 'NumPy', 'NLP',
  // Mobile
  'React Native', 'Flutter', 'iOS Development', 'Android Development',
  // Other
  'Git', 'Agile', 'Scrum', 'REST API', 'GraphQL', 'Microservices', 'Linux', 'Bash',
] as const;

// Soft skills
export const SOFT_SKILLS = [
  'Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Time Management',
  'Critical Thinking', 'Adaptability', 'Creativity', 'Project Management', 'Presentation',
] as const;
