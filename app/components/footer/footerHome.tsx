import QuickContactForm from "@/app/forms/footer.form";
import { Star } from "lucide-react";
import Image from "next/image";

const reviews = [
  {
    id: 1,
    name: "Алина К.",
    text: "Отличный репетитор! Помог разобраться с органикой за 2 месяца. Сдала ЕГЭ на 89 баллов.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Дмитрий В.",
    text: "Понятно объясняет даже самые сложные формулы. Занятия проходят легко и продуктивно.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 3,
    name: "Мария С.",
    text: "Готовились к олимпиаде, заняли 2 место в регионе. Очень рекомендую!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?img=5",
  },
];

const FooterHome = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 bg-slate-800 mb-16">
      {/* Left: Form */}
      <div>
        <h3 className="text-2xl font-bold mb-6">Готовы начать?</h3>
        <QuickContactForm />
      </div>

      {/* Right: Reviews */}
      <div>
        <h3 className="text-2xl font-bold mb-6 text-right md:text-left">
          Отзывы
        </h3>
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="flex gap-4 items-start">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-slate-600">
                <Image
                  src={review.avatar}
                  alt={review.name}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
              <div>
                <div className="flex text-yellow-400 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-slate-600"}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {review.text}
                </p>
                <p className="text-xs text-slate-500 mt-1">— {review.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterHome;
