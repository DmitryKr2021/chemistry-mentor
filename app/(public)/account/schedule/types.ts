export interface Lesson {
  id: string;
  topic: string | null;
  subject: string;
  startTime: Date;
  endTime: Date | null;
  meetingLink: string | null;
  format: string;
  status: string;
  notes: string | null;
  userId: string;
  tutorId: string | null;
  createdAt: Date;
  updatedAt: Date;

  // 🔹 Сделайте homework опциональным
  homework?: {
    id: string;
    title: string;
    description: string | null;
    dueDate: Date;
    status: string;
    grade: number | null;
    feedback: string | null;
  } | null;
}
