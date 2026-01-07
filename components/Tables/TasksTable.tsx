"use client";

import { useEffect, useState, useCallback, useRef } from "react";
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
import {
  addAssigmentsByAssignature,
  getAssigmentsByAssignature,
  updateAssigments,
} from "@/services/assignatureServices";
import { useApi } from "@/hooks/useApi";
import { GradeByCourse } from "@/models/grades.model";
import { useApiParams } from "@/hooks/useApiParams";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";
import { PopoverContent } from "../ui/popover";
import { deleteGrade } from "@/services/gradesServices";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

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

function EditableCell({
  getValue,
  row: { index },
  column: { id },
  table,
}: {
  getValue: () => unknown;
  row: { index: number };
  column: { id: string };
  table: Table<GradeByCourse>;
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

function Filter({
  column,
  table,
}: {
  column: Column<GradeByCourse, unknown>;
  table: Table<GradeByCourse>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

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

type Props = {
  id: number;
};
export default function TasksTable({ id }: Props) {
  const requestFn = useCallback(() => getAssigmentsByAssignature(id), [id]);
  const {
    data: dataAssigments,
    fetch: refetchAssigments,
    loading: isLoadingData,
  } = useApi(requestFn, {
    autoFetch: true,
  });

  const defaultColumn: Partial<ColumnDef<GradeByCourse>> = {
    cell: EditableCell,
  };

  const { fetch: saveAssigments, loading: isSaving } = useApiParams(
    updateAssigments,
    { autoFetch: false },
  );

  const {
    fetch: deleteTask,
    data: dataDelete,
    loading: loadingDelete,
  } = useApiParams(deleteGrade, { autoFetch: false });

  const {
    fetch: addAssigments,
    loading: isCreating,
    data: createData,
  } = useApiParams(addAssigmentsByAssignature, {
    autoFetch: false,
  });

  const handleSave = (assigment: GradeByCourse) => {
    if (assigment.id < 0) {
      addAssigments({
        description: assigment.description,
        deadtime: assigment.deadtime,
        type_of_evaluation: assigment.type_of_evaluation,
        assignature_id: id,
      });
    } else {
      saveAssigments({
        id: assigment.id,
        description: assigment.description,
        deadtime: assigment.deadtime,
        type_of_evaluation: assigment.type_of_evaluation,
      });
    }
  };

  // Metodo para hacer una fila vacia
  const addEmptyRow = () => {
    const emptyAssignment: GradeByCourse = {
      id: -Date.now(), // ID temporal negativo
      description: "",
      deadtime: "",
      type_of_evaluation: "trabajo-practico",
    };
    setData((prev) => [emptyAssignment, ...prev]);
  };

  const columns: ColumnDef<GradeByCourse>[] = [
    {
      header: "Descripción",
      accessorKey: "description",
    },
    {
      header: "Tiempo Limite",
      accessorKey: "deadtime",
      cell: ({ row, table }) => {
        const currentDate = row.original.deadtime
          ? new Date(row.original.deadtime)
          : undefined;

        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
              >
                {row.original.deadtime || "Seleccionar fecha"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={currentDate}
                onSelect={(newDate) => {
                  const formatDate = newDate
                    ? newDate.toISOString().split("T")[0]
                    : "";
                  table.options.meta?.updateData(
                    row.index,
                    "deadtime",
                    formatDate,
                  );
                }}
              />
            </PopoverContent>
          </Popover>
        );
      },
    },

    {
      header: "Tipo de Tarea",
      accessorKey: "type_of_evaluation",
      cell: ({ row, table }) => (
        <select
          value={row.original.type_of_evaluation}
          onChange={(e) => {
            table.options.meta?.updateData(
              row.index,
              "type_of_evaluation",
              e.target.value,
            );
          }}
          className="border rounded px-2 py-1"
        >
          <option value="trabajo-practico">Trabajo Practico</option>
          <option value="formulario">Formulario</option>
          <option value="evaluación">Evaluación</option>
        </select>
      ),
    },
    {
      id: "delete",
      header: "❌",
      cell: ({ row }) => (
        <Button
          variant={"destructive"}
          size={"sm"}
          className="cursor-pointer"
          onClick={() => deleteTask(row.original.id)}
        >
          Eliminar
        </Button>
      ),
    },
    {
      id: "editar",
      header: "✔️",
      cell: ({ row }) => {
        return (
          <Button
            className="cursor-pointer"
            variant="outline"
            size="sm"
            onClick={() => {
              handleSave(row.original);
            }}
            disabled={isSaving || isCreating}
          >
            {isSaving || isCreating
              ? "Actualizando..."
              : row.original.id < 0
                ? "Crear"
                : "Actualizar"}
          </Button>
        );
      },
    },
  ];

  const [data, setData] = useState(dataAssigments || []);

  const prevIsCreating = useRef<boolean>(false);

  useEffect(() => {
    const finished = prevIsCreating.current && !isCreating;
    if (finished && createData) {
      refetchAssigments();
    }

    prevIsCreating.current = isCreating;
  }, [isCreating, createData]);

  const prevIsLoading = useRef<boolean>(false);

  useEffect(() => {
    const finished = prevIsLoading.current && !loadingDelete;
    if (finished && dataDelete) {
      refetchAssigments();
    }

    prevIsLoading.current = loadingDelete;
  }, [dataDelete, loadingDelete]);

  useEffect(() => {
    if (dataAssigments) {
      setData(dataAssigments);
    }
  }, [dataAssigments]);

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
      <div className="border rounded-lg shadow">
        <div className="bg-gray-100 flex justify-end">
          <Button className="mt-2 mr-2" onClick={addEmptyRow} variant="outline">
            Nueva Tarea
          </Button>
        </div>
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
