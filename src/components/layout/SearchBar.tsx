"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const collapse = () => {
    setIsExpanded(false);
    setQuery("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/productos?search=${encodeURIComponent(trimmed)}`);
    collapse();
  };

  if (!isExpanded) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-label="Buscar productos"
        onClick={() => setIsExpanded(true)}
      >
        <Search />
      </Button>
    );
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center gap-1 bg-background px-4 sm:static sm:w-56 sm:bg-transparent sm:px-0 lg:w-72">
      <form role="search" onSubmit={handleSubmit} className="flex w-full items-center gap-1">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar productos..."
          autoFocus
          aria-label="Buscar productos"
          className="h-8 flex-1"
        />
        <Button type="submit" variant="ghost" size="icon" aria-label="Buscar">
          <Search />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Limpiar búsqueda"
          onClick={collapse}
        >
          <X />
        </Button>
      </form>
    </div>
  );
}
