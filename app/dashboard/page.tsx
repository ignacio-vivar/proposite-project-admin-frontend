import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
export default function Dashboard() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-xl grid grid-rows-3 grid-flow-col gap-4">
        <Link href={"/dashboard/table-student"}>
          <Card className="bg-black-100">
            <CardHeader>
              <CardTitle>Administración de Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Listado de Alumnos Registrados</p>
            </CardContent>
          </Card>
        </Link>
        <Link href={"/dashboard/register-student"}>
          <Card className="bg-black-100">
            <CardHeader>
              <CardTitle>Creación de Usuarios</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Formulario Creación de Usuarios</p>
            </CardContent>
          </Card>
        </Link>

        <Link href={"/dashboard/table-tasks"}>
          <Card className="bg-black-100">
            <CardHeader>
              <CardTitle>Administración de Tareas</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Listado de Tareas</p>
            </CardContent>
          </Card>
        </Link>

        <Link href={"/dashboard/table-grades"}>
          <Card className="bg-black-100">
            <CardHeader>
              <CardTitle>Administración de Calificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Listado de Calificaciones por Materia</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
