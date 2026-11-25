export default function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="card flex flex-col items-center gap-3 py-12 text-center">
      {Icon && (
        <div className="rounded-full bg-teal-50 p-3 text-teal-600">
          <Icon size={28} />
        </div>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      {text && <p className="max-w-md text-sm text-slate-500">{text}</p>}
      {action}
    </div>
  );
}