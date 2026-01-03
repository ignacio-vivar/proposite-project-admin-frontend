import { StudentWithTags } from "@/models";
import { Table } from "@tanstack/react-table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

type Props = {
  table: Table<StudentWithTags>;
};

const column_materias = { id: "materias", label: "Materias", type: "string" };

const assignatures = [
  { name: "Todos", tag: "all" },
  { name: "Electrónica de Potencia", tag: "E.P." },
  { name: "Tecnología de Control", tag: "T.C." },
  { name: "Tecnología de Energía", tag: "T.E" },
  { name: "Control Númerico y Computalizado", tag: "CNC" },
];
export function FilterByAssignatures({ table }: Props) {
  return (
    <>
      <Select
        onValueChange={(tag) => {
          const value = tag === "all" ? undefined : tag;
          table.getColumn(column_materias.id)?.setFilterValue(value);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Seleccionar Campo" />
        </SelectTrigger>
        <SelectContent>
          {assignatures.map((u) => (
            <SelectItem key={u.name} value={u.tag}>
              {u.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
}
