import { getRisk, subjectNames } from '../utils/risk.js'

const studentNames = [
  'Aira Mae Abad', 'John Paulo Agustin', 'Mikaela Andaya', 'Nathaniel Aquino', 'Sophia Balagtas',
  'Elijah Bautista', 'Janelle Cabral', 'Rafael Corpuz', 'Althea Dela Cruz', 'Gabriel Domingo',
  'Francesca Evangelista', 'Marco Fernandez', 'Bea Garcia', 'Andrei Gonzales', 'Katrina Hernandez',
  'Luis Ignacio', 'Chloe Jimenez', 'Joshua Lagman', 'Patricia Manalo', 'Daniel Mendoza',
  'Nicole Navarro', 'Ethan Ocampo', 'Angela Pascual', 'Miguel Ramos', 'Clarisse Reyes',
  'Sean Rivera', 'Bianca Santos', 'Jericho Soriano', 'Louise Torres', 'Vincent Villanueva',
]

const advisers = [
  'Maria Lourdes Abella', 'Joan Agbayani', 'Teresa Alonzo', 'Carla Andres', 'Liza Aquino',
  'Ramon Banez', 'Michelle Bautista', 'Rina Beltran', 'Gemma Caballero', 'Helen Castro',
  'Nora Corpuz', 'Rogelio Cruz', 'Marites Dizon', 'Josephine Domingo', 'Arlene Estrada',
  'Catherine Flores', 'Leah Garcia', 'Dennis Gomez', 'Grace Hernandez', 'Bernadette Javier',
  'Eduardo Lim', 'Rosemarie Lopez', 'Janice Mercado', 'Paolo Navarro', 'Aileen Ortiz',
  'Cristina Ramos', 'Marvin Santos',
]

const sections = ['Mapagmahal', 'Masipag', 'Matatag', 'Magalang', 'Malikhain']
const behaviorNotes = [
  'Positive participation and works well with classmates.',
  'Needs reminders to submit late work.',
  'Quiet in class and may need participation support.',
  'Consistently respectful and prepared.',
  'Frequently distracted during independent work.',
  'Shows leadership during group activities.',
  'Serious concern: repeated conflict with classmates.',
  'Talkative but responds well to reminders.',
  'Steady improvement and good classroom habits.',
  'Needs encouragement to ask for help.',
]

const gradeProfiles = [92, 84, 78, 73, 88, 81, 76, 95, 86, 74]

export const studentsSeed = studentNames.map((name, index) => {
  const gradeLevel = `Grade ${(index % 6) + 1}`
  const base = gradeProfiles[index % gradeProfiles.length]
  const grades = Object.fromEntries(subjectNames.map((subject, subjectIndex) => [
    subject,
    Math.max(68, Math.min(98, base + ((index * 3 + subjectIndex * 2) % 7) - 3)),
  ]))
  const absent = [1, 2, 5, 8, 0, 4, 6, 1, 3, 9][index % 10]
  const present = 42 - absent
  const student = {
    studentId: `BES-2026-${String(index + 1).padStart(3, '0')}`,
    name,
    gradeLevel,
    section: sections[index % sections.length],
    adviser: advisers[index % advisers.length],
    gender: index % 2 === 0 ? 'Female' : 'Male',
    age: 6 + (index % 6),
    attendanceSummary: { present, absent, late: index % 4, excused: index % 3 },
    grades,
    behaviorNotes: behaviorNotes[index % behaviorNotes.length],
    status: index === 28 ? 'Inactive' : 'Active',
    transferStatus: index === 2 ? 'Transfer In' : index === 28 ? 'Transfer Out' : 'None',
  }
  return { ...student, riskLevel: getRisk(student).level }
})

export const teachersSeed = [
  ...advisers.map((name, index) => ({
    id: `T-${String(index + 1).padStart(3, '0')}`,
    name,
    role: 'Adviser',
    assignment: `Grade ${(index % 6) + 1} • ${sections[index % sections.length]}`,
    subject: 'All core subjects',
    email: `${name.toLowerCase().replace(/[^a-z]+/g, '.').replace(/\.$/, '')}@oratrack.edu.ph`,
    status: 'Active',
  })),
  {
    id: 'T-028', name: 'Mark Anthony Uy', role: 'Subject Teacher', assignment: 'Grades 4 to 6',
    subject: 'Science', email: 'mark.uy@oratrack.edu.ph', status: 'Active',
  },
  {
    id: 'T-029', name: 'Alyssa Mae Valdez', role: 'Subject Teacher', assignment: 'Grades 4 to 6',
    subject: 'MAPEH', email: 'alyssa.valdez@oratrack.edu.ph', status: 'Active',
  },
  {
    id: 'T-030', name: 'Noel Zamora', role: 'Subject Teacher', assignment: 'Grades 5 to 6',
    subject: 'EPP/TLE', email: 'noel.zamora@oratrack.edu.ph', status: 'Active',
  },
]

export const announcementsSeed = [
  {
    id: 'A-001', title: 'First Quarter Parent Meeting', category: 'School Update',
    date: '2026-06-26', audience: 'Parents and guardians',
    content: 'Parents and guardians are invited to the school covered court at 2:00 PM for the first quarter orientation and class updates.',
    pinned: true,
  },
  {
    id: 'A-002', title: 'Nutrition Month Activities', category: 'Student Activity',
    date: '2026-07-03', audience: 'All learners',
    content: 'Classes will prepare healthy meal posters and join a short school-wide wellness program. Learners may wear green shirts.',
    pinned: false,
  },
  {
    id: 'A-003', title: 'School Supplies Donation Drive', category: 'Community',
    date: '2026-07-08', audience: 'School community',
    content: 'The school is accepting notebooks, pencils, art supplies, and gently used storybooks at the main office.',
    pinned: false,
  },
  {
    id: 'A-004', title: 'Quarterly Assessment Schedule', category: 'Academic',
    date: '2026-07-20', audience: 'Grades 1 to 6',
    content: 'Quarterly assessments will run from July 20 to July 23. Class advisers will share the subject schedule.',
    pinned: true,
  },
  {
    id: 'A-005', title: 'Reading Buddies Fill the Library with Stories', category: 'Student Activity',
    date: '2026-07-10', audience: 'Grades 1 to 6',
    content: 'Older pupils will partner with younger readers for story sharing, drawing activities, and a joyful morning of reading together.',
    pinned: false,
  },
  {
    id: 'A-006', title: 'Clean and Green Family Volunteer Day', category: 'Community',
    date: '2026-07-31', audience: 'Families and community partners',
    content: 'Families are invited to help refresh garden beds, organize learning spaces, and prepare the campus for August activities.',
    pinned: false,
  },
  {
    id: 'A-007', title: 'Math Learning Camp Registration Opens', category: 'Academic',
    date: '2026-08-05', audience: 'Grades 4 to 6',
    content: 'Registration is open for a small-group mathematics learning camp focused on confidence, number sense, and practical problem solving.',
    pinned: false,
  },
  {
    id: 'A-008', title: 'Welcome to Our New Student Leaders', category: 'School Update',
    date: '2026-08-14', audience: 'School community',
    content: 'Meet the newly selected pupil leaders who will help organize school activities, model good citizenship, and represent learner voices.',
    pinned: false,
  },
]

export const eventsSeed = [
  { id: 'E-001', title: 'Brigada Eskwela Culmination', date: '2026-06-24', time: '8:00 AM', type: 'Community', location: 'School Grounds', description: 'Recognition program for volunteers and community partners.' },
  { id: 'E-002', title: 'Parent and Teacher Conference', date: '2026-06-26', time: '2:00 PM', type: 'Meeting', location: 'Covered Court', description: 'Quarter opening conference and classroom orientation.' },
  { id: 'E-003', title: 'Nutrition Month Launch', date: '2026-07-03', time: '9:00 AM', type: 'Student Activity', location: 'School Quadrangle', description: 'A morning of health, food, and wellness activities.' },
  { id: 'E-004', title: 'Reading Buddy Day', date: '2026-07-10', time: '10:00 AM', type: 'Academic', location: 'Library and Classrooms', description: 'Older pupils read with younger learning partners.' },
  { id: 'E-005', title: 'Quarterly Assessments', date: '2026-07-20', time: '7:30 AM', type: 'Academic', location: 'Classrooms', description: 'Quarterly assessments for Grades 1 to 6.' },
  { id: 'E-006', title: 'School Clean and Green Day', date: '2026-07-31', time: '7:00 AM', type: 'Community', location: 'School Grounds', description: 'Campus care day with families and local partners.' },
  { id: 'E-007', title: 'Math Learning Camp', date: '2026-08-08', time: '8:30 AM', type: 'Academic', location: 'Grade 5 Classrooms', description: 'Small-group mathematics activities focused on confidence and practical problem solving.' },
  { id: 'E-008', title: 'Buwan ng Wika Program', date: '2026-08-21', time: '1:00 PM', type: 'Student Activity', location: 'Covered Court', description: 'A celebration of Filipino language, stories, songs, and cultural presentations.' },
  { id: 'E-009', title: 'School Health Check', date: '2026-08-26', time: '8:00 AM', type: 'Wellness', location: 'School Clinic', description: 'Routine learner health screening with the school health team.' },
  { id: 'E-010', title: 'Family Learning Workshop', date: '2026-09-04', time: '2:00 PM', type: 'Meeting', location: 'Library', description: 'Practical home strategies for reading routines, study habits, and learner motivation.' },
]

export const transfersSeed = [
  { id: 'TR-001', studentName: 'Mikaela Andaya', gradeLevel: 'Grade 3', type: 'Transfer In', previousSchool: 'Longlong Elementary School', receivingSchool: 'Balili Elementary School', date: '2026-06-08', reason: 'Family relocation', status: 'Completed' },
  { id: 'TR-002', studentName: 'Louise Torres', gradeLevel: 'Grade 5', type: 'Transfer In', previousSchool: 'Pico Elementary School', receivingSchool: 'Balili Elementary School', date: '2026-06-12', reason: 'Change of residence', status: 'Completed' },
  { id: 'TR-003', studentName: 'Bianca Santos', gradeLevel: 'Grade 3', type: 'Transfer Out', previousSchool: 'Balili Elementary School', receivingSchool: 'Baguio Central School', date: '2026-06-18', reason: 'Guardian transfer', status: 'Processing' },
  { id: 'TR-004', studentName: 'Louise Torres', gradeLevel: 'Grade 5', type: 'Transfer Out', previousSchool: 'Balili Elementary School', receivingSchool: 'Buyagan Elementary School', date: '2026-07-01', reason: 'Family relocation', status: 'Pending' },
]

export const attendanceTrend = [
  { month: 'Jan', rate: 91.8, previous: 90.5 }, { month: 'Feb', rate: 92.6, previous: 91.2 },
  { month: 'Mar', rate: 93.1, previous: 92.0 }, { month: 'Apr', rate: 91.9, previous: 92.7 },
  { month: 'May', rate: 94.2, previous: 93.0 }, { month: 'Jun', rate: 95.1, previous: 94.2 },
]

export const subjectPerformance = subjectNames.map((subject, index) => ({
  subject: subject === 'Mathematics' ? 'Math' : subject === 'Filipino' ? 'Filipino' : subject,
  average: [84, 79, 82, 86, 83, 89, 88, 85][index],
}))

export const gradeAnalytics = Array.from({ length: 6 }, (_, index) => ({
  grade: `Grade ${index + 1}`,
  average: [86, 84, 81, 78, 83, 85][index],
  absences: [12, 17, 15, 25, 18, 14][index],
  students: studentsSeed.filter((student) => student.gradeLevel === `Grade ${index + 1}`).length,
}))

export const attendanceRecordsSeed = studentsSeed.map((student, index) => ({
  studentId: student.studentId,
  name: student.name,
  gradeLevel: student.gradeLevel,
  section: student.section,
  date: '2026-06-22',
  status: ['Present', 'Present', 'Late', 'Present', 'Absent', 'Excused'][index % 6],
}))

export const credentials = [
  { email: 'admin@oratrack.edu.ph', password: 'Admin123!', role: 'Admin', name: 'Dr. Elena D. Reyes' },
  { email: 'adviser@oratrack.edu.ph', password: 'Adviser123!', role: 'Adviser', name: 'Maria Lourdes Abella' },
  { email: 'subject@oratrack.edu.ph', password: 'Subject123!', role: 'Subject Teacher', name: 'Mark Anthony Uy' },
]

export const seedData = {
  students: studentsSeed,
  teachers: teachersSeed,
  announcements: announcementsSeed,
  events: eventsSeed,
  transfers: transfersSeed,
  attendance: attendanceRecordsSeed,
}
