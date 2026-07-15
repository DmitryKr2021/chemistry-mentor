export interface ScheduleLesson {
  id: string;
  topic: string | null;
  startTime: Date;
  endTime: Date | null;
  status: string;
  meetingLink: string | null;
  studentName: string;
  studentEmail: string;
}

// Ключ ячейки: "YYYY-MM-DD-HH"
export type CellKey = string;

// Сгруппированные уроки: ключ → массив уроков
export type GroupedLessons = Record<CellKey, ScheduleLesson[]>;

export interface WeekInfo {
  startDate: Date; // Понедельник 00:00
  endDate: Date; // Воскресенье 23:59:59
  days: Date[]; // 7 дат (пн-вс)
  weekLabel: string; // "15 – 21 июня 2026"
}
