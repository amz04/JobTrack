// ============================================================
// DESIGN: Neon Command Center — Dark canvas, luminous accents
// All mock data for JobTrack application
// ============================================================

export type ApplicationStatus = 'Applied' | 'Interview' | 'Assessment' | 'Offer' | 'Rejected';

export interface Application {
  id: string;
  company: string;
  role: string;
  dateApplied: string;
  status: ApplicationStatus;
  progress: number;
  logo: string; // initials
  logoColor: string;
  location: string;
  salary: string;
  notes: string;
}

export interface Deadline {
  id: string;
  company: string;
  role: string;
  type: 'Application Deadline' | 'Interview' | 'Assessment' | 'Follow-up';
  date: string;
  daysLeft: number;
  urgency: 'red' | 'orange' | 'green';
}

export interface Email {
  id: string;
  sender: string;
  senderEmail: string;
  company: string;
  companyColor: string;
  subject: string;
  preview: string;
  body: string;
  date: string;
  time: string;
  read: boolean;
  category: 'Interviews' | 'Assessments' | 'Offers' | 'Rejections' | 'Follow-ups';
}

export const applications: Application[] = [
  {
    id: '1',
    company: 'Google',
    role: 'Software Engineering Intern',
    dateApplied: 'Apr 15, 2026',
    status: 'Interview',
    progress: 60,
    logo: 'G',
    logoColor: '#4285F4',
    location: 'Mountain View, CA',
    salary: '$8,500/mo',
    notes: 'Phone screen completed. On-site interview scheduled for May 12.',
  },
  {
    id: '2',
    company: 'McKinsey & Co.',
    role: 'Business Analyst Intern',
    dateApplied: 'Apr 10, 2026',
    status: 'Assessment',
    progress: 40,
    logo: 'M',
    logoColor: '#003B5C',
    location: 'Dubai, UAE',
    salary: '$7,000/mo',
    notes: 'Problem solving test scheduled for May 8.',
  },
  {
    id: '3',
    company: 'Amazon',
    role: 'Product Management Intern',
    dateApplied: 'Apr 8, 2026',
    status: 'Offer',
    progress: 90,
    logo: 'A',
    logoColor: '#FF9900',
    location: 'Seattle, WA',
    salary: '$9,200/mo',
    notes: 'Offer received! Decision deadline is May 20.',
  },
  {
    id: '4',
    company: 'Microsoft',
    role: 'Software Engineering Intern',
    dateApplied: 'Apr 5, 2026',
    status: 'Interview',
    progress: 60,
    logo: 'MS',
    logoColor: '#00A4EF',
    location: 'Redmond, WA',
    salary: '$8,800/mo',
    notes: 'Second round interview next week.',
  },
  {
    id: '5',
    company: 'Noon',
    role: 'Data Analyst Intern',
    dateApplied: 'Apr 18, 2026',
    status: 'Applied',
    progress: 20,
    logo: 'N',
    logoColor: '#FEEE00',
    location: 'Dubai, UAE',
    salary: '$4,500/mo',
    notes: 'Application submitted. Waiting for response.',
  },
  {
    id: '6',
    company: 'Deloitte',
    role: 'Consulting Intern',
    dateApplied: 'Apr 2, 2026',
    status: 'Rejected',
    progress: 100,
    logo: 'D',
    logoColor: '#86BC25',
    location: 'London, UK',
    salary: '$6,000/mo',
    notes: 'Received rejection after final round.',
  },
  {
    id: '7',
    company: 'Careem',
    role: 'UX Design Intern',
    dateApplied: 'Apr 20, 2026',
    status: 'Applied',
    progress: 20,
    logo: 'C',
    logoColor: '#49B649',
    location: 'Dubai, UAE',
    salary: '$4,000/mo',
    notes: 'Just applied through their careers page.',
  },
  {
    id: '8',
    company: 'KPMG',
    role: 'Audit Intern',
    dateApplied: 'Apr 12, 2026',
    status: 'Interview',
    progress: 60,
    logo: 'K',
    logoColor: '#00338D',
    location: 'Abu Dhabi, UAE',
    salary: '$5,500/mo',
    notes: 'Video interview completed. Awaiting results.',
  },
  {
    id: '9',
    company: 'Meta',
    role: 'Frontend Engineering Intern',
    dateApplied: 'Apr 22, 2026',
    status: 'Assessment',
    progress: 40,
    logo: 'MT',
    logoColor: '#0668E1',
    location: 'Menlo Park, CA',
    salary: '$9,000/mo',
    notes: 'Online coding assessment due May 6.',
  },
  {
    id: '10',
    company: 'Goldman Sachs',
    role: 'Summer Analyst',
    dateApplied: 'Mar 28, 2026',
    status: 'Offer',
    progress: 90,
    logo: 'GS',
    logoColor: '#6BA4D9',
    location: 'New York, NY',
    salary: '$10,000/mo',
    notes: 'Verbal offer received. Written offer pending.',
  },
];

export const deadlines: Deadline[] = [
  { id: '1', company: 'Google', role: 'SWE Intern', type: 'Interview', date: 'May 6, 2026', daysLeft: 2, urgency: 'red' },
  { id: '2', company: 'Meta', role: 'Frontend Intern', type: 'Assessment', date: 'May 6, 2026', daysLeft: 2, urgency: 'red' },
  { id: '3', company: 'McKinsey', role: 'BA Intern', type: 'Assessment', date: 'May 8, 2026', daysLeft: 4, urgency: 'orange' },
  { id: '4', company: 'Microsoft', role: 'SWE Intern', type: 'Interview', date: 'May 10, 2026', daysLeft: 6, urgency: 'orange' },
  { id: '5', company: 'Amazon', role: 'PM Intern', type: 'Follow-up', date: 'May 12, 2026', daysLeft: 8, urgency: 'green' },
  { id: '6', company: 'Noon', role: 'Data Analyst', type: 'Application Deadline', date: 'May 14, 2026', daysLeft: 10, urgency: 'green' },
  { id: '7', company: 'KPMG', role: 'Audit Intern', type: 'Follow-up', date: 'May 15, 2026', daysLeft: 11, urgency: 'green' },
  { id: '8', company: 'Goldman Sachs', role: 'Summer Analyst', type: 'Follow-up', date: 'May 18, 2026', daysLeft: 14, urgency: 'green' },
  { id: '9', company: 'Careem', role: 'UX Design Intern', type: 'Application Deadline', date: 'May 20, 2026', daysLeft: 16, urgency: 'green' },
  { id: '10', company: 'Deloitte', role: 'Consulting Intern', type: 'Follow-up', date: 'May 22, 2026', daysLeft: 18, urgency: 'green' },
];

export const emails: Email[] = [
  {
    id: '1',
    sender: 'Google Recruiting',
    senderEmail: 'recruiting@google.com',
    company: 'Google',
    companyColor: '#4285F4',
    subject: 'Interview Invitation — Software Engineering Intern',
    preview: 'We are pleased to invite you to the next round of interviews...',
    body: `Dear Fares,

Thank you for your interest in the Software Engineering Intern position at Google. We were impressed by your application and would like to invite you to the next round of interviews.

Your interview is scheduled for May 12, 2026 at 10:00 AM PST via Google Meet. The interview will consist of two 45-minute technical sessions focusing on data structures, algorithms, and system design.

Please confirm your availability by replying to this email. If you need to reschedule, please let us know at least 48 hours in advance.

We look forward to speaking with you!

Best regards,
Sarah Chen
University Recruiting Team
Google`,
    date: 'May 2, 2026',
    time: '9:15 AM',
    read: false,
    category: 'Interviews',
  },
  {
    id: '2',
    sender: 'Amazon University',
    senderEmail: 'university@amazon.com',
    company: 'Amazon',
    companyColor: '#FF9900',
    subject: 'Congratulations! Offer for Product Management Intern',
    preview: 'We are thrilled to extend an offer for the Product Management Intern role...',
    body: `Dear Fares,

Congratulations! On behalf of the Amazon team, I am thrilled to extend you an offer for the Product Management Intern position in Seattle, WA.

Your compensation package includes:
• Monthly salary: $9,200
• Housing stipend: $3,500/month
• Relocation assistance: $2,500
• Start date: June 15, 2026

Please review the attached offer letter and respond by May 20, 2026. If you have any questions about the offer or benefits, don't hesitate to reach out.

We're excited about the possibility of you joining our team!

Warm regards,
Michael Torres
Amazon University Programs`,
    date: 'May 1, 2026',
    time: '2:30 PM',
    read: false,
    category: 'Offers',
  },
  {
    id: '3',
    sender: 'McKinsey Recruiting',
    senderEmail: 'recruiting@mckinsey.com',
    company: 'McKinsey',
    companyColor: '#003B5C',
    subject: 'Problem Solving Test — Business Analyst Intern',
    preview: 'Your problem solving test has been scheduled for May 8...',
    body: `Dear Fares,

Thank you for applying to the Business Analyst Intern position at McKinsey & Company.

We would like to invite you to complete our Problem Solving Test (PST). The test is scheduled for:

Date: May 8, 2026
Time: 2:00 PM GST
Duration: 60 minutes
Format: Online proctored

Please ensure you have a stable internet connection and a quiet environment. You will receive a separate email with the test link 24 hours before the scheduled time.

Good luck with your preparation!

Best regards,
Recruitment Team
McKinsey & Company`,
    date: 'Apr 30, 2026',
    time: '11:00 AM',
    read: true,
    category: 'Assessments',
  },
  {
    id: '4',
    sender: 'Deloitte HR',
    senderEmail: 'hr@deloitte.com',
    company: 'Deloitte',
    companyColor: '#86BC25',
    subject: 'Application Update — Consulting Intern',
    preview: 'Thank you for your time and interest. After careful consideration...',
    body: `Dear Fares,

Thank you for your interest in the Consulting Intern position at Deloitte and for the time you invested in our interview process.

After careful consideration, we have decided to move forward with other candidates whose experience more closely aligns with our current needs. This was a difficult decision given the high caliber of applicants.

We encourage you to apply for future opportunities at Deloitte. Your profile will remain in our talent database for 12 months.

We wish you the best in your career journey.

Sincerely,
HR Team
Deloitte`,
    date: 'Apr 28, 2026',
    time: '4:45 PM',
    read: true,
    category: 'Rejections',
  },
  {
    id: '5',
    sender: 'Microsoft Recruiting',
    senderEmail: 'recruiting@microsoft.com',
    company: 'Microsoft',
    companyColor: '#00A4EF',
    subject: 'Second Round Interview — SWE Intern',
    preview: 'Congratulations on passing the first round! We would like to schedule...',
    body: `Dear Fares,

Congratulations on successfully completing the first round of interviews for the Software Engineering Intern position at Microsoft!

We would like to invite you to the second round, which will take place on May 10, 2026. The session will include:

1. A 60-minute technical coding interview
2. A 30-minute behavioral interview with your potential team lead

The interviews will be conducted via Microsoft Teams. A calendar invite with the meeting link will be sent separately.

Please confirm your availability at your earliest convenience.

Best regards,
Lisa Park
Microsoft University Recruiting`,
    date: 'Apr 27, 2026',
    time: '10:30 AM',
    read: true,
    category: 'Interviews',
  },
  {
    id: '6',
    sender: 'Meta Careers',
    senderEmail: 'careers@meta.com',
    company: 'Meta',
    companyColor: '#0668E1',
    subject: 'Online Assessment — Frontend Engineering Intern',
    preview: 'Please complete the online coding assessment by May 6...',
    body: `Dear Fares,

Thank you for applying to the Frontend Engineering Intern position at Meta.

As the next step in our process, we would like you to complete an online coding assessment. Here are the details:

Platform: HackerRank
Deadline: May 6, 2026
Duration: 90 minutes (once started)
Topics: JavaScript, React, DOM manipulation, algorithms

You will receive the assessment link in a separate email. Please complete it before the deadline.

Tips:
• Ensure a stable internet connection
• You may use your preferred IDE alongside the platform
• Focus on code quality and edge cases

Good luck!

Best,
Meta University Recruiting Team`,
    date: 'Apr 26, 2026',
    time: '3:00 PM',
    read: false,
    category: 'Assessments',
  },
  {
    id: '7',
    sender: 'KPMG Talent',
    senderEmail: 'talent@kpmg.com',
    company: 'KPMG',
    companyColor: '#00338D',
    subject: 'Interview Feedback — Audit Intern',
    preview: 'Thank you for completing your video interview. We are currently reviewing...',
    body: `Dear Fares,

Thank you for completing your video interview for the Audit Intern position at KPMG Abu Dhabi.

We are currently in the process of reviewing all candidate interviews and expect to have an update for you by May 15, 2026.

In the meantime, if you have any questions about the role or our firm, please don't hesitate to reach out.

Thank you for your patience.

Kind regards,
Ahmed Al-Rashid
KPMG Talent Acquisition`,
    date: 'Apr 25, 2026',
    time: '1:15 PM',
    read: true,
    category: 'Follow-ups',
  },
  {
    id: '8',
    sender: 'Goldman Sachs Campus',
    senderEmail: 'campus@goldmansachs.com',
    company: 'Goldman Sachs',
    companyColor: '#6BA4D9',
    subject: 'Verbal Offer — Summer Analyst Program',
    preview: 'I am delighted to inform you that we would like to extend a verbal offer...',
    body: `Dear Fares,

I am delighted to inform you that the Goldman Sachs team would like to extend a verbal offer for our Summer Analyst Program in New York.

Key details:
• Position: Summer Analyst, Investment Banking Division
• Location: 200 West Street, New York, NY
• Compensation: $10,000/month
• Duration: 10 weeks (June 8 – August 14, 2026)

A formal written offer will follow within the next 5 business days. In the meantime, please feel free to reach out with any questions.

Congratulations once again!

Best regards,
Jennifer Wu
Goldman Sachs Campus Recruiting`,
    date: 'Apr 24, 2026',
    time: '5:00 PM',
    read: false,
    category: 'Offers',
  },
  {
    id: '9',
    sender: 'Noon Careers',
    senderEmail: 'careers@noon.com',
    company: 'Noon',
    companyColor: '#FEEE00',
    subject: 'Application Received — Data Analyst Intern',
    preview: 'Thank you for applying to the Data Analyst Intern position at Noon...',
    body: `Dear Fares,

Thank you for applying to the Data Analyst Intern position at Noon.

We have received your application and it is currently under review. Our hiring team will evaluate your profile and get back to you within 2-3 weeks.

In the meantime, you can track your application status through our careers portal.

Thank you for your interest in joining Noon!

Best regards,
Noon Talent Team`,
    date: 'Apr 22, 2026',
    time: '8:45 AM',
    read: true,
    category: 'Follow-ups',
  },
  {
    id: '10',
    sender: 'Careem Talent',
    senderEmail: 'talent@careem.com',
    company: 'Careem',
    companyColor: '#49B649',
    subject: 'Application Confirmation — UX Design Intern',
    preview: 'We have received your application for the UX Design Intern role...',
    body: `Dear Fares,

Thank you for your interest in the UX Design Intern position at Careem!

We have received your application and portfolio submission. Our design team will review your materials and reach out if your profile matches our requirements.

We typically respond within 2 weeks. Please keep an eye on your email for updates.

Best of luck!

Warm regards,
Careem People Team`,
    date: 'Apr 21, 2026',
    time: '12:00 PM',
    read: true,
    category: 'Follow-ups',
  },
  {
    id: '11',
    sender: 'Google Recruiting',
    senderEmail: 'recruiting@google.com',
    company: 'Google',
    companyColor: '#4285F4',
    subject: 'Phone Screen Completed — Next Steps',
    preview: 'Thank you for completing the phone screen. We are moving you forward...',
    body: `Dear Fares,

Thank you for completing the phone screen for the Software Engineering Intern position. We enjoyed our conversation and are pleased to inform you that we would like to move you forward to the on-site interview round.

Details for the next round will be shared in a separate email. Please expect to hear from us within the next few days.

Best regards,
Sarah Chen
Google University Recruiting`,
    date: 'Apr 20, 2026',
    time: '6:30 PM',
    read: true,
    category: 'Interviews',
  },
  {
    id: '12',
    sender: 'Microsoft Recruiting',
    senderEmail: 'recruiting@microsoft.com',
    company: 'Microsoft',
    companyColor: '#00A4EF',
    subject: 'First Round Results — SWE Intern',
    preview: 'Great news! You have passed the first round technical assessment...',
    body: `Dear Fares,

Great news! You have successfully passed the first round technical assessment for the Software Engineering Intern position at Microsoft.

Your performance was strong, particularly in the algorithmic problem-solving section. We will be scheduling the second round of interviews shortly.

Stay tuned for the calendar invite!

Best,
Lisa Park
Microsoft University Recruiting`,
    date: 'Apr 18, 2026',
    time: '9:00 AM',
    read: true,
    category: 'Assessments',
  },
];

export const weeklyActivity = [
  { week: 'Week 1', applications: 3 },
  { week: 'Week 2', applications: 5 },
  { week: 'Week 3', applications: 2 },
  { week: 'Week 4', applications: 4 },
  { week: 'Week 5', applications: 6 },
  { week: 'Week 6', applications: 3 },
  { week: 'Week 7', applications: 1 },
  { week: 'Week 8', applications: 4 },
];

export const stats = {
  totalApplications: 10,
  interviewsScheduled: 3,
  offersReceived: 2,
  responseRate: 80,
};

export const statusColors: Record<ApplicationStatus, string> = {
  Applied: 'bg-neon-blue/20 text-neon-blue border-neon-blue/30',
  Interview: 'bg-neon-purple/20 text-neon-purple border-neon-purple/30',
  Assessment: 'bg-neon-amber/20 text-neon-amber border-neon-amber/30',
  Offer: 'bg-neon-emerald/20 text-neon-emerald border-neon-emerald/30',
  Rejected: 'bg-neon-rose/20 text-neon-rose border-neon-rose/30',
};

export const statusProgressColors: Record<ApplicationStatus, string> = {
  Applied: 'bg-neon-blue',
  Interview: 'bg-neon-purple',
  Assessment: 'bg-neon-amber',
  Offer: 'bg-neon-emerald',
  Rejected: 'bg-neon-rose',
};

export const profileData = {
  name: 'Fares',
  fullName: 'Fares Al-Mansouri',
  university: 'New York University Abu Dhabi',
  graduationYear: '2027',
  fieldOfStudy: 'Computer Science & Business',
  email: 'fares.almansouri@nyu.edu',
  avatarUrl: 'https://d2xsxph8kpxj0f.cloudfront.net/310419663029430919/DXq4Kckp3tEZgiQpA6EUKp/profile-avatar-3spFosYqGN9HxkUSVGXXUd.webp',
};

// ============================================================
// Recommended Jobs
// ============================================================

export type JobSource = 'LinkedIn' | 'Indeed' | 'Company Website' | 'Bayt' | 'Dubizzle';

export interface RecommendedJob {
  id: string;
  title: string;
  company: string;
  logo: string;
  logoColor: string;
  source: JobSource;
  location: string;
  postedAgo: string;
  matchScore: number;
  easyApply: boolean; // true for LinkedIn/Indeed/Bayt, false for Company Website/Dubizzle
}

export const recommendedJobs: RecommendedJob[] = [
  {
    id: 'rj1',
    title: 'Software Engineering Intern',
    company: 'Google',
    logo: 'G',
    logoColor: '#4285F4',
    source: 'LinkedIn',
    location: 'Dubai, UAE',
    postedAgo: '2 days ago',
    matchScore: 95,
    easyApply: true,
  },
  {
    id: 'rj2',
    title: 'Product Intern',
    company: 'Noon',
    logo: 'N',
    logoColor: '#FEEE00',
    source: 'Bayt',
    location: 'Dubai, UAE',
    postedAgo: '1 day ago',
    matchScore: 88,
    easyApply: true,
  },
  {
    id: 'rj3',
    title: 'Data Analyst Intern',
    company: 'PwC',
    logo: 'PwC',
    logoColor: '#D04A02',
    source: 'Company Website',
    location: 'Abu Dhabi, UAE',
    postedAgo: '3 days ago',
    matchScore: 82,
    easyApply: false,
  },
  {
    id: 'rj4',
    title: 'UX Designer Intern',
    company: 'Careem',
    logo: 'C',
    logoColor: '#49B649',
    source: 'Indeed',
    location: 'Dubai, UAE',
    postedAgo: '5 hours ago',
    matchScore: 91,
    easyApply: true,
  },
  {
    id: 'rj5',
    title: 'Business Analyst Intern',
    company: 'Chalhoub Group',
    logo: 'CG',
    logoColor: '#1A1A2E',
    source: 'Dubizzle',
    location: 'Dubai, UAE',
    postedAgo: '4 days ago',
    matchScore: 76,
    easyApply: false,
  },
  {
    id: 'rj6',
    title: 'Marketing Intern',
    company: 'Majid Al Futtaim',
    logo: 'MAF',
    logoColor: '#E31837',
    source: 'LinkedIn',
    location: 'Dubai, UAE',
    postedAgo: '1 day ago',
    matchScore: 84,
    easyApply: true,
  },
];

// ============================================================
// CV / Resume Data
// ============================================================

export const cvData = {
  name: 'Fares Al-Mansoori',
  degree: 'BSc Computer Science, expected 2026',
  skills: [
    { name: 'Python', color: '#3B82F6' },
    { name: 'Figma', color: '#A259FF' },
    { name: 'Excel', color: '#10B981' },
    { name: 'SQL', color: '#F59E0B' },
    { name: 'Communication', color: '#EC4899' },
    { name: 'React', color: '#22D3EE' },
    { name: 'Data Analysis', color: '#8B5CF6' },
  ],
  experience: [
    'Marketing Intern \u2013 Noon, Summer 2024',
    'Research Assistant \u2013 University Lab, 2023',
  ],
  matchedJobs: 6,
};
