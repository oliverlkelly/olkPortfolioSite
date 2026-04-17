-- Portfolio Database Schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT,
  tech_stack TEXT[] NOT NULL DEFAULT '{}',
  github_url VARCHAR(500),
  live_url VARCHAR(500),
  image_url VARCHAR(500),
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work experience table
CREATE TABLE IF NOT EXISTS experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  employment_type VARCHAR(50) DEFAULT 'Full-time',
  description TEXT NOT NULL,
  achievements TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  company_url VARCHAR(500),
  company_logo_url VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education table
CREATE TABLE IF NOT EXISTS education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  institution VARCHAR(255) NOT NULL,
  degree VARCHAR(255) NOT NULL,
  field_of_study VARCHAR(255),
  location VARCHAR(255),
  description TEXT,
  achievements TEXT[] DEFAULT '{}',
  grade VARCHAR(100),
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  institution_url VARCHAR(500),
  institution_logo_url VARCHAR(500),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profile / owner info
CREATE TABLE IF NOT EXISTS profile (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  bio TEXT,
  email VARCHAR(255),
  github_url VARCHAR(500),
  linkedin_url VARCHAR(500),
  twitter_url VARCHAR(500),
  website_url VARCHAR(500),
  avatar_url VARCHAR(500),
  location VARCHAR(255),
  skills TEXT[] DEFAULT '{}',
  resume_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Seed data
INSERT INTO profile (name, title, bio, email, github_url, linkedin_url, location, skills) VALUES (
  'Oliver Liam Kelly',
  'Full-Stack Engineer',
  'I build fast, accessible, and beautifully designed web applications. Passionate about developer experience and clean architecture.',
  'contact@oliverliamkelly.com',
  'https://github.com/oliverlk',
  'https://linkedin.com/in/oliverlk',
  'Sydney, Australia',
  ARRAY['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Next.js']
) ON CONFLICT DO NOTHING;

INSERT INTO projects (title, description, long_description, tech_stack, github_url, live_url, featured, display_order, start_date, end_date) VALUES
(
  'Realtime Analytics Dashboard',
  'A high-performance analytics platform processing 1M+ events per day with live charts and customisable widgets.',
  'Built a full-stack analytics platform with WebSocket-powered real-time updates, featuring draggable dashboard layouts, custom metric builders, and role-based access control. Reduced data query latency by 60% through strategic PostgreSQL indexing and Redis caching.',
  ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'WebSockets', 'Docker'],
  'https://github.com/alexmorgan/analytics-dashboard',
  'https://analytics-demo.alexmorgan.dev',
  true, 1,
  '2024-01-01', '2024-06-01'
),
(
  'E-Commerce Microservices Platform',
  'Scalable e-commerce backend with independent services for inventory, orders, payments, and notifications.',
  'Designed and implemented a microservices architecture handling 50K+ daily transactions. Each service communicates via a RabbitMQ event bus with full distributed tracing through Jaeger. Deployed on AWS ECS with auto-scaling and zero-downtime deployments.',
  ARRAY['Node.js', 'TypeScript', 'RabbitMQ', 'PostgreSQL', 'AWS ECS', 'Docker', 'Terraform'],
  'https://github.com/alexmorgan/ecommerce-microservices',
  NULL,
  true, 2,
  '2023-06-01', '2023-12-01'
),
(
  'AI Document Processor',
  'Automated document parsing and data extraction tool powered by LLM APIs with human-review workflow.',
  'Built a document intelligence pipeline that ingests PDFs and images, extracts structured data using Claude API, and routes uncertain results to human reviewers. Achieved 94% accuracy on invoice processing, cutting manual review time by 80%.',
  ARRAY['Python', 'FastAPI', 'React', 'TypeScript', 'PostgreSQL', 'Claude API', 'AWS S3'],
  'https://github.com/alexmorgan/ai-doc-processor',
  'https://docs.alexmorgan.dev',
  true, 3,
  '2024-06-01', NULL
),
(
  'Open Source CLI Toolkit',
  'A developer productivity CLI with project scaffolding, linting, and deployment helpers. 2K+ GitHub stars.',
  'Created and maintain a popular open-source CLI toolkit with 2,000+ stars. Features plugin architecture, interactive prompts, and integrations with popular cloud providers. Published to npm with automated CI/CD releasing on tags.',
  ARRAY['TypeScript', 'Node.js', 'Commander.js', 'Inquirer.js', 'GitHub Actions'],
  'https://github.com/alexmorgan/cli-toolkit',
  'https://cli-toolkit.dev',
  false, 4,
  '2022-09-01', NULL
);

INSERT INTO experience (company, role, location, employment_type, description, achievements, tech_stack, start_date, end_date, is_current, display_order) VALUES
(
  'Atlassian',
  'Senior Software Engineer',
  'Sydney, Australia',
  'Full-time',
  'Led development of new Jira board features serving 10M+ monthly active users. Drove architecture decisions for the frontend platform team.',
  ARRAY[
    'Shipped a re-architected sprint board reducing initial load time by 45%',
    'Mentored 3 junior engineers, running weekly code reviews and design sessions',
    'Led migration of legacy class components to React hooks across 80+ files',
    'Introduced Storybook-based component library adopted across 4 product teams'
  ],
  ARRAY['React', 'TypeScript', 'GraphQL', 'Node.js', 'PostgreSQL', 'AWS', 'Datadog'],
  '2022-03-01', NULL, true, 1
),
(
  'Canva',
  'Software Engineer',
  'Sydney, Australia',
  'Full-time',
  'Worked on the Canva Editor team, building performance-critical rendering features for the browser-based design canvas.',
  ARRAY[
    'Optimised canvas rendering pipeline, improving 60fps performance on complex designs',
    'Built collaborative cursors feature using CRDTs and WebSockets',
    'Reduced frontend bundle size by 30% via code-splitting and tree-shaking',
    'Contributed to internal design system with 15+ reusable components'
  ],
  ARRAY['TypeScript', 'React', 'WebGL', 'WebSockets', 'Rust (WASM)', 'Figma API'],
  '2020-07-01', '2022-02-01', false, 2
),
(
  'Freelance / Consulting',
  'Full-Stack Developer',
  'Remote',
  'Contract',
  'Delivered custom web applications and technical consulting for startups and SMEs across Australia and the UK.',
  ARRAY[
    'Delivered 12+ client projects ranging from MVPs to production systems',
    'Built a booking platform for a hospitality group with 50K+ monthly users',
    'Provided architecture reviews and technical due diligence for 3 startups'
  ],
  ARRAY['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Stripe', 'Vercel', 'AWS'],
  '2018-01-01', '2020-06-01', false, 3
);

INSERT INTO education (institution, degree, field_of_study, location, description, achievements, grade, start_date, end_date, display_order) VALUES
(
  'University of Sydney',
  'Bachelor of Engineering (Honours)',
  'Software Engineering',
  'Sydney, Australia',
  'Focused on software systems, algorithms, and distributed computing. Final year thesis on optimising graph traversal for social network analysis.',
  ARRAY[
    'First Class Honours — GPA 3.9 / 4.0',
    'Best Capstone Project Award 2018',
    'Vice-Chancellor''s Scholarship recipient',
    'President of the Computing Society (2017–2018)'
  ],
  'First Class Honours',
  '2014-02-01', '2018-11-01', 1
),
(
  'AWS',
  'Certification',
  'Solutions Architect – Associate',
  'Online',
  'Validated expertise in designing distributed systems on AWS, covering compute, storage, networking, and security best practices.',
  ARRAY['Scored 890 / 1000', 'Completed 2021'],
  'Pass (890/1000)',
  '2021-01-01', '2021-03-01', 2
);
