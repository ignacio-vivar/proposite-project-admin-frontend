"use client";
import TasksTable from "@/components/Tables/TasksTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TableView() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Tabs defaultValue="cnc" className="max-w-[90%]">
        <TabsList className="w-full">
          <TabsTrigger value="cnc">CNC</TabsTrigger>
          <TabsTrigger value="ep">Electrónica de Potencia</TabsTrigger>
          <TabsTrigger value="te">Tecnología de la Energía</TabsTrigger>
          <TabsTrigger value="tc">Tecnología de Control</TabsTrigger>
        </TabsList>
        <TabsContent value="ep">
          <TasksTable id={1} />
        </TabsContent>
        <TabsContent value="tc">
          <TasksTable id={2} />
        </TabsContent>
        <TabsContent value="te">
          <TasksTable id={3} />
        </TabsContent>
        <TabsContent value="cnc" className="max-h-[400px]">
          <TasksTable id={4} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
