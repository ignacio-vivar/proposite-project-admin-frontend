"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ComponentTags from "../Specials/ComponentTags";
import Link from "next/link";
import { StudentData } from "@/models";
import { FilterSearchStudentTable } from "../Specials/FilterSearchStudentTable";
import { FilterByAssignatures } from "../Specials/FilterByAssignatures";
import {
  disableSelectedStudent,
  enableSelectedStudent,
  getStudentAssignatures,
} from "@/services/studentServices";
import { useApiParamsFinish } from "@/hooks/useApiParamsFinish";

const columnLabels: Record<string, string> = {
  name: "Nombre",
  email: "Correo",
  group: "Grupo",
  year: "Año",
  status: "Estado",
};

type StudentAssignature = { id: number; tag: string };
type StudentAssignatures = { assignatures: StudentAssignature[] };

// extiende tu StudentData con el campo nuevo
type StudentWithTags = StudentData & {
  materiasTags: string[];
};
type customProps = {
  data: StudentData[];
  onStudentUpdateAction?: () => void;
};
export const columns: ColumnDef<StudentWithTags>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorFn: (row) => row.user.name,
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown />
        </Button>
      );
    },
    accessorFn: (row) => row.user.email,
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorFn: (row) => row.group,
    id: "Grupo",
    header: "Grupo",
    filterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId);
      return Number(rowValue) === Number(value);
    },

    cell: ({ row }) => row.getValue("Grupo"),
  },
  {
    accessorFn: (row) => row.year,
    id: "Año",
    header: "Año",
    filterFn: (row, columnId, value) => {
      const rowValue = row.getValue(columnId);
      return Number(rowValue) === Number(value);
    },
    cell: ({ row }) => row.getValue("Año"),
  },
  {
    accessorFn: (row) => (row.active ? "Activo" : "Inactivo"),
    id: "status",
    header: "Estado",
    cell: ({ row }) => row.getValue("status"),
  },
  {
    id: "materias",
    header: "Materias",
    accessorKey: "materiasTags",
    filterFn: (row, colId, tag) => {
      const tags = (row.getValue(colId) as string[] | undefined) ?? [];
      return tags.includes(tag as string);
    },
    cell: ({ row }) => <ComponentTags id={row.original.id} />,
  },
  {
    id: "editar",
    header: "Editar",
    cell: ({ row }) => (
      <Link href={`/dashboard/table-student/${row.original.id}`}>
        <Button className="cursor-pointer" variant="outline" size="sm">
          Ver detalles
        </Button>
      </Link>
    ),
  },
];

export function StudentTable({ data, onStudentUpdateAction }: customProps) {
  const [fullData, setFullData] = React.useState<StudentWithTags[]>([]);
  const [isLoadingData, setIsLoadingData] = React.useState(true); // <-- Nuevo estado
  const [change, setChange] = React.useState(0);
  const { fetch: fetchAssigns } = useApiParamsFinish<
    StudentAssignatures,
    number
  >(getStudentAssignatures);

  const { fetch: disabledStudentsAPI } = useApiParamsFinish<string, number[]>(
    disableSelectedStudent,
  );

  const { fetch: enableStudentsAPI } = useApiParamsFinish<string, number[]>(
    enableSelectedStudent,
  );

  React.useEffect(() => {
    if (!data || !data.length) {
      setFullData([]);
      return;
    }

    async function loadAll() {
      try {
        const promises: Promise<StudentWithTags>[] = data.map(
          (student) =>
            new Promise<StudentWithTags>((resolve, reject) => {
              fetchAssigns(student.id, (assigns: StudentAssignatures) => {
                try {
                  const tags = (assigns?.assignatures ?? []).map((x) => x.tag);
                  resolve({
                    ...student,
                    materiasTags: tags,
                  });
                } catch (err) {
                  reject(err);
                }
              });
            }),
        );

        const results = await Promise.all(promises);
        setFullData(results);
      } catch (error) {
        console.error("error de carga", error);
      } finally {
        setIsLoadingData(false);
      }
    }

    loadAll();
  }, [data, fetchAssigns, change]);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable<StudentWithTags>({
    data: fullData,
    columns,
    getRowId: (row) => row.user.email,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const copySelectedEmails = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const emails = selectedRows.map((row) => row.getValue("email"));
    const emailsText = emails.join(", ");
    navigator.clipboard.writeText(emailsText);
  };

  const disabledStudents = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const user_ids = selectedRows.map((row) => row.original.user.id);
    disabledStudentsAPI(user_ids, () => {
      onStudentUpdateAction?.();
      setRowSelection({});
      setChange((prev) => prev + 1);
    });
  };

  const enableStudents = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const user_ids = selectedRows.map((row) => row.original.user.id);
    enableStudentsAPI(user_ids, () => {
      onStudentUpdateAction?.();
      setRowSelection({});
      setChange((prev) => prev + 1);
    });
  };
  const allVisible = table.getAllColumns().every((col) => col.getIsVisible());
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <FilterSearchStudentTable table={table} />
        <FilterByAssignatures table={table} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Filtrar <ChevronDown />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={allVisible}
              onCheckedChange={(value) => {
                table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .forEach((column) => column.toggleVisibility(!!value));
              }}
            >
              {allVisible ? "Ocultar todo" : "Mostrar todo"}
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator />

            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {columnLabels[column.id] ?? column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoadingData ? ( // <-- Nuevo: estado de carga
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-gray-500"
                >
                  Cargando datos...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Sin resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>{" "}
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
        <Button
          variant="outline"
          className="ml-2"
          onClick={copySelectedEmails}
          disabled={table.getFilteredSelectedRowModel().rows.length === 0}
        >
          Copiar emails
        </Button>
        <Button
          variant="outline"
          className="ml-2"
          onClick={enableStudents}
          disabled={table.getFilteredSelectedRowModel().rows.length === 0}
        >
          Hab.
        </Button>
        <Button
          variant="outline"
          className="ml-2"
          onClick={disabledStudents}
          disabled={table.getFilteredSelectedRowModel().rows.length === 0}
        >
          Desh.
        </Button>
      </div>
    </div>
  );
}
