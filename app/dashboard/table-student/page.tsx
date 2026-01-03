"use client";

import { StudentTable } from "@/components/Tables/StudentTable";
import { useApi } from "@/hooks/useApi";
import { getAllStudentData } from "@/services/studentServices";

export default function TableView() {
  const { data: userData, fetch: fetchData } = useApi(getAllStudentData, {
    autoFetch: true,
  });

  const handleStudentUpdate = () => {
    fetchData();
  };
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-2xl">
        <StudentTable
          data={userData}
          onStudentUpdateAction={handleStudentUpdate}
        />
      </div>
    </div>
  );
}
