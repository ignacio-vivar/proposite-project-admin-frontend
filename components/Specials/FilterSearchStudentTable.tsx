import { StudentWithTags } from "@/models";
import { Table } from "@tanstack/react-table";
import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Input } from "../ui/input";

type Props = {
  table: Table<StudentWithTags>;
};

const filterableFields = [
  { id: "email", label: "Email", type: "string" },
  { id: "name", label: "Nombre", type: "string" },
  { id: "Grupo", label: "Grupo", type: "number" },
  { id: "Año", label: "Año", type: "number" },
];
export function FilterSearchStudentTable({ table }: Props) {
  const [selectField, setSelectField] = useState(filterableFields[0]);
  const [value, setValue] = useState("");
  return (
    <>
      <Select
        onValueChange={(id) => {
          const field = filterableFields.find((f) => f.id === id);
          if (field) {
            setSelectField(field);
            setValue("");
            table.getColumn(selectField.id)?.setFilterValue(undefined);
          }
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Seleccionar Campo" />
        </SelectTrigger>
        <SelectContent>
          {filterableFields.map((u) => (
            <SelectItem key={u.id} value={u.id}>
              {u.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectField.type === "string" && (
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            table.getColumn(selectField.id)?.setFilterValue(e.target.value);
          }}
        />
      )}

      {selectField.type === "number" && (
        <Input
          type="number"
          value={value}
          onChange={(e) => {
            const raw = e.target.value;
            setValue(raw);

            if (raw === "") {
              table.getColumn(selectField.id)?.setFilterValue(undefined);
              return;
            }

            const parsed = Number(raw);

            if (Number.isNaN(parsed)) {
              table.getColumn(selectField.id)?.setFilterValue(undefined);
              return;
            }

            table.getColumn(selectField.id)?.setFilterValue(parsed);
          }}
        />
      )}
    </>
  );
}
