import { IconCornerDownLeft, IconPencil } from "@tabler/icons-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { useState } from "react";

type Props = {
  value: string;
  onSave: (value: string) => void;
};

export function TextCalification({ value, onSave }: Props) {
  const [localValue, setLocalValue] = useState(value);
  return (
    <div className="grid w-full gap-4">
      <InputGroup className="max-h-[280px]">
        <InputGroupTextarea
          id="textarea-code-32"
          value={localValue}
          placeholder="Corrección"
          className="h-[200px] resize-none overflow-y-auto flex-1"
          onChange={(e) => {
            setLocalValue(e.target.value);
          }}
        />
        <InputGroupAddon align="block-end" className="border-t">
          <InputGroupButton
            size="sm"
            className="ml-auto"
            variant="default"
            onClick={() => onSave(localValue)}
          >
            Guardar Cambios <IconCornerDownLeft />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupAddon align="block-start" className="border-b">
          <InputGroupText className="font-mono font-medium">
            <IconPencil />
            Corrección
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
