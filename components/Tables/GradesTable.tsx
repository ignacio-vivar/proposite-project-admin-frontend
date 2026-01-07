"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import {
  Column,
  Table,
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
} from "@tanstack/react-table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useApi } from "@/hooks/useApi";
import { Califications } from "@/models/grades.model";
import { useApiParams } from "@/hooks/useApiParams";
import { getGradesByAssignature, updateGrade } from "@/services/gradesServices";
import { CorrectionCell } from "../Specials/CorrectionCell";
import { GradeCell } from "../Specials/GradeValue";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

// Hook personalizado para evitar reset de paginación
function useSkipper() {
  const shouldSkipRef = useRef(true);
  const shouldSkip = shouldSkipRef.current;

  const skip = useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

// Componente de celda editable
function EditableCell({
  getValue,
  row: { index },
  column: { id },
  table,
}: {
  getValue: () => unknown;
  row: { index: number };
  column: { id: string };
  table: Table<Califications>;
}) {
  const initialValue = getValue();
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    table.options.meta?.updateData(index, id, value);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      value={value as string}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      className="w-full px-2 py-1 border rounded"
    />
  );
}

// Componente de filtro
function Filter({
  column,
  table,
}: {
  column: Column<Califications, unknown>;
  table: Table<Califications>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const blackList = ["Observaciones", "Nota"];

  const header = column.columnDef.header;
  const headerChecked = typeof header === "string" ? header : "";

  const isCointained = blackList.includes(headerChecked);

  if (isCointained) {
    return null;
  } else {
    return typeof firstValue === "number" ? (
      <div className="flex space-x-2 mt-1">
        <input
          type="number"
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old: [number, number]) => [
              e.target.value,
              old?.[1],
            ])
          }
          placeholder={`Min`}
          className="w-20 px-1 py-1 border shadow rounded text-sm"
        />
        <input
          type="number"
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old: [number, number]) => [
              old?.[0],
              e.target.value,
            ])
          }
          placeholder={`Max`}
          className="w-20 px-1 py-1 border shadow rounded text-sm"
        />
      </div>
    ) : (
      <input
        type="text"
        value={(columnFilterValue ?? "") as string}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder={`Filtrar...`}
        className="w-full px-2 py-1 mt-1 border shadow rounded text-sm"
      />
    );
  }
}

type Props = {
  id: number;
};

export default function GradesTable({ id }: Props) {
  const requestFn = useCallback(() => getGradesByAssignature(id), [id]);
  const {
    data: dataAssigments,
    fetch: refetchAssigments,
    loading: isLoadingData,
  } = useApi(requestFn, {
    autoFetch: true,
  });

  // Columna por defecto con celda editable
  const defaultColumn: Partial<ColumnDef<Califications>> = {
    cell: EditableCell,
  };

  const { fetch: saveAssigments, loading: isSaving } = useApiParams(
    updateGrade,
    { autoFetch: false },
  );

  const handleSave = (grade: Califications) => {
    saveAssigments({
      id: grade.id,
      grade: grade.grade,
      observation: grade.observation,
      status: grade.status,
    });
  };

  const columns = useMemo<ColumnDef<Califications>[]>(
    () => [
      {
        header: "Trabajo",
        accessorKey: "task_name",
      },
      {
        header: "Estudiante",
        accessorKey: "student_name",
      },
      {
        header: "Nota",
        accessorKey: "grade",
        cell: GradeCell,
      },
      {
        header: "Observaciones",
        accessorKey: "observation",
        cell: ({ row, table }) => <CorrectionCell row={row} table={table} />,
      },

      {
        header: "Estado",
        accessorKey: "status",
        cell: ({ row, table }) => (
          <select
            value={row.original.status}
            onChange={(e) => {
              table.options.meta?.updateData(
                row.index,
                "status",
                e.target.value,
              );
            }}
            className="border rounded px-2 py-1"
          >
            <option value="sin-entregar">Sin Entregar</option>
            <option value="entregado">Entregado</option>
            <option value="desaprobado">Desaprobado</option>
            <option value="aprobado">Aprobado</option>
            <option value="rehacer">Rehacer</option>
          </select>
        ),
      },
      {
        id: "editar",
        header: "Editar",
        cell: ({ row }) => (
          <Button
            className="cursor-pointer"
            variant="outline"
            size="sm"
            onClick={() => {
              handleSave(row.original);
            }}
            disabled={isSaving}
          >
            {isSaving ? "Actualizando..." : "Actualizar"}
          </Button>
        ),
      },
    ],
    [],
  );

  const [data, setData] = useState(dataAssigments || []);

  useEffect(() => {
    if (dataAssigments) {
      setData(dataAssigments);
    }
  }, [dataAssigments, refetchAssigments]);

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    initialState: {
      pagination: { pageSize: 5, pageIndex: 0 },
    },
    meta: {
      updateData: (rowIndex, columnId, value) => {
        skipAutoResetPageIndex();
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          }),
        );
      },
    },
  });

  return (
    <div className="mx-auto">
      <div className=" border rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className="px-4 py-2 text-center border-b"
                  >
                    {header.isPlaceholder ? null : (
                      <div className="space-y-3">
                        <div className="font-semibold">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </div>
                        <div>
                          {header.column.getCanFilter() ? (
                            <Filter column={header.column} table={table} />
                          ) : null}
                        </div>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  {isLoadingData ? "Cargando..." : "No hay datos disponibles"}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 border-b">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}{" "}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-row justify-around items-center gap-2">
        <button
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>

        <span className="flex items-center gap-1">
          <strong>
            Página {table.getState().pagination.pageIndex + 1} de{" "}
            {table.getPageCount()}
          </strong>
        </span>

        <span className="flex items-center gap-1 p-2">
          Ir a página:
          <Input
            className="border rounded text-center w-20 [&::-webkit-inner-spin-button]:opacity-100 [&::-webkit-outer-spin-button]:opacity-100"
            // Toda esta propiedad esta porque me daba toc que parezca descentrado el número, producto del spinner
            type="number"
            min="1"
            max={table.getPageCount()}
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
          />
        </span>

        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          className="border p-1 rounded"
        >
          {[5, 10, 15].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Elementos : {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
