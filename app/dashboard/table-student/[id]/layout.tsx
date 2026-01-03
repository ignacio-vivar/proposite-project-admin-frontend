import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="py-2 px-2 absolute right-0">
        <Link href={"/"}>
          <Button className="m-2 p-5">Salir</Button>
        </Link>
      </div>

      <div className="py-2 px-2 absolute left-0">
        <Link href={"/dashboard/table-student"}>
          <Button className="m-2 p-5">Volver a la Tabla</Button>
        </Link>
      </div>

      <main>{children}</main>
    </div>
  );
}
