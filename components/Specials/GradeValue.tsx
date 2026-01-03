import { CellContext } from "@tanstack/react-table";
import { Califications } from "@/models/grades.model";

type Props = CellContext<Califications, unknown>;

export function GradeCell({ getValue, row, column, table }: Props) {
  const raw = getValue() ?? "";

  const value = raw === undefined || raw === null ? "" : String(raw);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;

    if (val === "") {
      table.options.meta?.updateData(row.index, column.id, "");
      return;
    }

    const numValue = parseFloat(val);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 10) {
      table.options.meta?.updateData(row.index, column.id, val);
    }
  };

  return (
    <input
      className="w-[80px] text-center border-2 rounded-lg p-1"
      value={value}
      onChange={handleChange}
      min="0"
      max="10"
      step="0.1"
    />
  );
}
