"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";

export function AdminSearchInput({
  placeholder,
  defaultValue = "",
  onChange,
}: {
  placeholder: string;
  defaultValue?: string;
  onChange: (value: string) => void;
}) {
  const [local, setLocal] = useState(defaultValue);
  const onChangeRef = useRef(onChange);
  const isFirstRun = useRef(true);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const timer = setTimeout(() => onChangeRef.current(local), 350);
    return () => clearTimeout(timer);
  }, [local]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={local}
        onChange={(event) => setLocal(event.target.value)}
        placeholder={placeholder}
        className="w-64 pl-8 pr-8"
      />
      {local !== "" && (
        <button
          type="button"
          aria-label="Limpiar búsqueda"
          onClick={() => {
            setLocal("");
            onChangeRef.current("");
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
