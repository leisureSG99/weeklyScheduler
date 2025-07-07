import { ScheduleEntry } from '@/lib/types';
import { getBackgroundColorByType } from '@/lib/utils';

interface TableCellProps {
  entries: ScheduleEntry[];
}

export default function TableCell({ entries }: TableCellProps) {
  return (
    <td className="border border-gray-300 p-2 min-w-[200px] align-top">
      {entries.length > 0 ? (
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`p-2 rounded ${getBackgroundColorByType(entry.type)}`}
            >
              {entry.title}
            </div>
          ))}
        </div>
      ) : null}
    </td>
  );
} 