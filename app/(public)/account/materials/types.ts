// Типизация задачи по химии
export type Problem = {
  id: string;
  question: string;
  type: "calculation" | "test" | "equation" | "matching";
  difficulty: "easy" | "medium" | "hard";
  options?: string[];
  correctAnswer: string | number | string[];
  explanation: string;
  image?: string;
};

// Типизация темы внутри модуля
export type Topic = {
  id: string;
  title: string;
  theory: string;
  videoUrl?: string;
  practice: Problem[];
  status: "locked" | "available" | "completed";
};

// Типизация учебного модуля
export type ChemistryModule = {
  id: string;
  title: string;
  description?: string;
  topics: Topic[];
};
