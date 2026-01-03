"use client";

import { PopoverTrigger, Popover, PopoverContent } from "../ui/popover";
import { useState } from "react";
import { Button } from "../ui/button";
import { TextCalification } from "./TextCalification";
import { Row, Table } from "@tanstack/react-table";
import { Califications } from "@/models/grades.model";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "../ui/tabs";
import { PreviewCalification } from "./PreviewCalification";

type Props = {
  row: Row<Califications>;
  table: Table<Califications>;
};

export function CorrectionCell({ row, table }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className="w-full">Abrir</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] max-h-[600px] overflow-hidden">
        <Tabs>
          <TabsList>
            <TabsTrigger value="edit"> Editar </TabsTrigger>
            <TabsTrigger value="preview"> Preview </TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <TextCalification
              value={row.original.observation}
              onSave={(newValue) => {
                table.options.meta?.updateData(
                  row.index,
                  "observation",
                  newValue,
                );
                setOpen(false);
              }}
            />
          </TabsContent>
          <TabsContent value="preview">
            <PreviewCalification value={row.original.observation} />
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
