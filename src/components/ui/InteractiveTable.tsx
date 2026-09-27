interface Props {
  data: { feature: string; windows: string; linux: string }[];
}

export default function InteractiveTable({ data }: Props) {
  return (
    <div className="overflow-x-auto glass rounded-2xl p-4">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-white/20">
            <th className="p-3 font-semibold">Feature</th>
            <th className="p-3 font-semibold text-blue-600">Windows</th>
            <th className="p-3 font-semibold text-orange-600">Linux</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-white/10 hover:bg-white/10 transition">
              <td className="p-3 font-medium">{row.feature}</td>
              <td className="p-3">{row.windows}</td>
              <td className="p-3">{row.linux}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
