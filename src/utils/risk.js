export const subjectNames = ['English', 'Mathematics', 'Science', 'Filipino', 'AP', 'MAPEH', 'ESP', 'EPP/TLE']

export function averageGrade(grades = {}) {
  const values = Object.values(grades).map(Number).filter(Number.isFinite)
  return values.length ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10 : 0
}

export function getRisk(student) {
  const average = averageGrade(student.grades)
  const absences = Number(student.attendanceSummary?.absent || 0)
  const note = (student.behaviorNotes || '').toLowerCase()
  const serious = ['serious', 'bullying', 'aggressive', 'repeated conflict'].some((word) => note.includes(word))
  const mild = ['distracted', 'quiet', 'late work', 'needs reminders', 'talkative', 'participation'].some((word) => note.includes(word))

  if (average < 75 || absences >= 7 || serious) {
    const reasons = []
    if (average < 75) reasons.push(`Low average grade of ${average}`)
    if (absences >= 7) reasons.push(`${absences} recorded absences`)
    if (serious) reasons.push('Serious behavior concern noted')
    return { level: 'High', reasons, action: 'Contact the guardian and prepare an immediate support plan.' }
  }

  if (average <= 79 || absences >= 4 || mild) {
    const reasons = []
    if (average <= 79) reasons.push(`Average grade needs support at ${average}`)
    if (absences >= 4) reasons.push(`${absences} recorded absences`)
    if (mild) reasons.push('Classroom behavior needs monitoring')
    return { level: 'Moderate', reasons, action: 'Monitor weekly and provide focused remediation.' }
  }

  return { level: 'Low', reasons: ['Grades and attendance are within a healthy range'], action: 'Continue regular classroom support and recognition.' }
}

export function performanceLabel(value) {
  if (value >= 90) return 'Excellent'
  if (value >= 80) return 'Satisfactory'
  if (value >= 75) return 'Needs Support'
  return 'At Risk'
}
