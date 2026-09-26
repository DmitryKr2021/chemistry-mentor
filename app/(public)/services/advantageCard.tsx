interface AdvantageCardProps {
  title: string;
  description: string;
  icon: string;
}

export function AdvantageCard({
  title,
  description,
  icon,
}: AdvantageCardProps) {
  return (
    <div className="bg-slate-50 p-6 rounded-lg text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm">{description}</p>
    </div>
  );
}
