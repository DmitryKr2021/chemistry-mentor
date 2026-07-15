import { getAllStudents } from "../actions";
import { AddLessonForm } from "./AddLessonForm";

export default async function ManageSchedulePage() {
  const students = await getAllStudents();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Управление расписанием
          </h1>
          <p className="text-gray-600 mt-1">Добавление занятий для учеников</p>
        </div>

        <AddLessonForm students={students} />
      </main>
    </div>
  );
}
