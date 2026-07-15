import { create } from "zustand";

export interface TestQuestion {
  id: string;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correctOption: number;
  explanation?: string | null;
  category?: string | null;
}

export interface UserAnswer {
  questionId: string;
  selectedOption: number | null;
  isCorrect: boolean;
}

interface TestState {
  questions: TestQuestion[];
  currentIndex: number;
  answers: Record<string, number | null>;
  studentName: string;
  studentEmail: string;
  startTime: number | null;
  isFinished: boolean;

  // Actions
  setQuestions: (questions: TestQuestion[]) => void;
  setStudentInfo: (name: string, email: string) => void;
  selectAnswer: (questionId: string, option: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  finishTest: () => void;
  resetTest: () => void;

  // Computed
  getCurrentQuestion: () => TestQuestion | null;
  getAnswers: () => UserAnswer[];
  getScore: () => { correct: number; total: number; percentage: number };
  getProgress: () => number;
}

export const useTestStore = create<TestState>((set, get) => ({
  questions: [],
  currentIndex: 0,
  answers: {},
  studentName: "",
  studentEmail: "",
  startTime: null,
  isFinished: false,

  setQuestions: (questions) => set({ questions, startTime: Date.now() }),

  setStudentInfo: (name, email) =>
    set({ studentName: name, studentEmail: email }),

  selectAnswer: (questionId, option) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: option },
    })),

  nextQuestion: () =>
    set((state) => ({
      currentIndex: Math.min(
        state.currentIndex + 1,
        state.questions.length - 1,
      ),
    })),

  prevQuestion: () =>
    set((state) => ({
      currentIndex: Math.max(state.currentIndex - 1, 0),
    })),

  goToQuestion: (index) =>
    set((state) => ({
      currentIndex: Math.max(0, Math.min(index, state.questions.length - 1)),
    })),

  finishTest: () => set({ isFinished: true }),

  resetTest: () =>
    set({
      questions: [],
      currentIndex: 0,
      answers: {},
      studentName: "",
      studentEmail: "",
      startTime: null,
      isFinished: false,
    }),

  getCurrentQuestion: () => {
    const { questions, currentIndex } = get();
    return questions[currentIndex] || null;
  },

  getAnswers: () => {
    const { questions, answers } = get();
    return questions.map((q) => ({
      questionId: q.id,
      selectedOption: answers[q.id] ?? null,
      isCorrect: answers[q.id] === q.correctOption,
    }));
  },

  getScore: () => {
    const { questions, answers } = get();
    const correct = questions.filter(
      (q) => answers[q.id] === q.correctOption,
    ).length;
    const total = questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return { correct, total, percentage };
  },

  getProgress: () => {
    const { questions, answers } = get();
    const answered = Object.keys(answers).length;
    return questions.length > 0
      ? Math.round((answered / questions.length) * 100)
      : 0;
  },
}));
