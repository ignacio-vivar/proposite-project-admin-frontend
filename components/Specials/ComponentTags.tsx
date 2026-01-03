"use client";
import { useApi } from "@/hooks/useApi";
import { getStudentAssignatures } from "@/services/studentServices";
import { useCallback } from "react";
import { Badge } from "../ui/badge";

type Props = {
  id: number;
};

export default function ComponentTags({ id }: Props) {
  const requestFn = useCallback(() => getStudentAssignatures(id), [id]);
  const { data: dataAssignatures } = useApi(requestFn, {
    autoFetch: true,
  });

  return (
    <div>
      <ul>
        {dataAssignatures?.assignatures?.map((u) => {
          switch (u.id) {
            case 1:
              return (
                <Badge key={u.tag} className="bg-green-300 mx-1">
                  {u.tag}
                </Badge>
              );
            case 2:
              return (
                <Badge key={u.tag} className="bg-blue-300 mx-1">
                  {u.tag}
                </Badge>
              );
            case 3:
              return (
                <Badge key={u.tag} className="bg-red-300 mx-1">
                  {u.tag}
                </Badge>
              );
            case 4:
              return (
                <Badge key={u.tag} className="bg-yellow-300 mx-1">
                  {u.tag}
                </Badge>
              );
          }
        })}
      </ul>
    </div>
  );
}
