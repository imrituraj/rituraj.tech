import { TimeTableEntry, CourseSummary } from '../types/study';

export const registeredCoursesSummary: CourseSummary[] = [
  {
    code: 'ECS 5101 / MCA20-303',
    name: 'Design & Analysis of Algorithms',
    type: 'Core',
    credits: 4,
    faculty: 'Dr. Rahul Mishra'
  },
  {
    code: 'ECS 5102',
    name: 'Foundations of Computer Systems',
    type: 'Core',
    credits: 4,
    faculty: 'Mr. Sundar Doraiswami'
  },
  {
    code: 'EMC 5103',
    name: 'Probability and Statistics',
    type: 'Core',
    credits: 5,
    faculty: 'Dr. Anuj Singh'
  },
  {
    code: 'EHS 5104',
    name: 'Technical Writing & Soft Skill',
    type: 'Core',
    credits: 4,
    faculty: 'Dr. Sweta Sinha'
  },
  {
    code: 'ECS 6101 / ECS 5103',
    name: 'Advanced Cyber Security',
    type: 'Elective',
    credits: 5,
    faculty: 'Dr. Ashish Karan'
  }
];

export const weeklyTimetable: TimeTableEntry[] = [
  // MONDAY
  {
    id: 'tt-mon-1',
    day: 'MONDAY',
    timeSlot: '06:00 PM – 08:00 PM',
    courseName: 'Probability and Statistics',
    courseCode: 'EMC 5103',
    type: 'CORE',
    credits: 'L3-T0-P2 • 5 Cr',
    faculty: 'Dr. Anuj Singh'
  },
  {
    id: 'tt-mon-2',
    day: 'MONDAY',
    timeSlot: '08:00 PM – 09:30 PM',
    courseName: 'Advanced Cyber Security',
    courseCode: 'ECS 6101 / ECS 5103',
    type: 'ELECTIVE',
    credits: 'L3-T0-P2 • 5 Cr',
    faculty: 'Dr. Ashish Karan'
  },

  // TUESDAY
  {
    id: 'tt-tue-1',
    day: 'TUESDAY',
    timeSlot: '08:00 PM – 09:30 PM',
    courseName: 'Advanced Cyber Security',
    courseCode: 'ECS 6101 / ECS 5103',
    type: 'ELECTIVE',
    credits: 'L3-T0-P2 • 5 Cr',
    faculty: 'Dr. Ashish Karan'
  },

  // WEDNESDAY
  {
    id: 'tt-wed-1',
    day: 'WEDNESDAY',
    timeSlot: '05:00 PM – 07:00 PM',
    courseName: 'Technical Writing and Soft Skill',
    courseCode: 'EHS 5104',
    type: 'CORE',
    credits: 'L1-T2-P2 • 4 Cr',
    faculty: 'Dr. Sweta Sinha'
  },
  {
    id: 'tt-wed-2',
    day: 'WEDNESDAY',
    timeSlot: '07:00 PM – 08:30 PM',
    courseName: 'Probability and Statistics',
    courseCode: 'EMC 5103',
    type: 'CORE',
    credits: 'L3-T0-P2 • 5 Cr',
    faculty: 'Dr. Anuj Singh'
  },

  // THURSDAY
  {
    id: 'tt-thu-1',
    day: 'THURSDAY',
    timeSlot: '05:00 PM – 07:00 PM',
    courseName: 'Technical Writing and Soft Skill',
    courseCode: 'EHS 5104',
    type: 'CORE',
    credits: 'L1-T2-P2 • 4 Cr',
    faculty: 'Dr. Sweta Sinha'
  },
  {
    id: 'tt-thu-2',
    day: 'THURSDAY',
    timeSlot: '07:00 PM – 08:30 PM',
    courseName: 'Probability and Statistics',
    courseCode: 'EMC 5103',
    type: 'CORE',
    credits: 'L3-T0-P2 • 5 Cr',
    faculty: 'Dr. Anuj Singh'
  },

  // FRIDAY
  {
    id: 'tt-fri-1',
    day: 'FRIDAY',
    timeSlot: 'All Day',
    courseName: 'No scheduled lectures (Project / Self Study)',
    courseCode: 'RESEARCH',
    type: 'SELF STUDY',
    credits: 'Self Guided',
    faculty: 'Independent Research'
  },

  // SATURDAY (Excluding 2 PM to 5 PM as corrected by user)
  {
    id: 'tt-sat-1',
    day: 'SATURDAY',
    timeSlot: '08:00 AM – 09:30 AM',
    courseName: 'Design and Analysis of Algorithms',
    courseCode: 'ECS 5101 / MCA20-303',
    type: 'CORE',
    credits: 'L3-T0-P2 • 4 Cr',
    faculty: 'Dr. Rahul Mishra'
  },
  {
    id: 'tt-sat-2',
    day: 'SATURDAY',
    timeSlot: '12:00 PM – 02:00 PM',
    courseName: 'Advanced Cyber Security',
    courseCode: 'ECS 6101 / ECS 5103',
    type: 'ELECTIVE',
    credits: 'L3-T0-P2 • 5 Cr',
    faculty: 'Dr. Ashish Karan'
  },
  {
    id: 'tt-sat-3',
    day: 'SATURDAY',
    timeSlot: '07:30 PM – 09:30 PM',
    courseName: 'Foundations of Computer Systems',
    courseCode: 'ECS 5102',
    type: 'CORE',
    credits: 'L3-T0-P2 • 4 Cr',
    faculty: 'Mr. Sundar Doraiswami'
  },

  // SUNDAY
  {
    id: 'tt-sun-1',
    day: 'SUNDAY',
    timeSlot: '08:00 AM – 09:30 AM',
    courseName: 'Design and Analysis of Algorithms',
    courseCode: 'ECS 5101 / MCA20-303',
    type: 'CORE',
    credits: 'L3-T0-P2 • 4 Cr',
    faculty: 'Dr. Rahul Mishra'
  },
  {
    id: 'tt-sun-2',
    day: 'SUNDAY',
    timeSlot: '11:30 AM – 01:00 PM',
    courseName: 'Design and Analysis of Algorithms',
    courseCode: 'ECS 5101 / MCA20-303',
    type: 'CORE',
    credits: 'L3-T0-P2 • 4 Cr',
    faculty: 'Dr. Rahul Mishra'
  }
];
