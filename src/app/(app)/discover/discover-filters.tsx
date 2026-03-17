"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DiscoverFiltersProps {
  currentFilters: {
    lookingFor?: string;
    availability?: string;
    interest?: string;
  };
}

export function DiscoverFilters({ currentFilters }: DiscoverFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setFilter(key: string, value: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const hasFilters = Object.values(currentFilters).some(Boolean);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-slate-600">Filter:</span>

      {[
        { key: "lookingFor", value: "individual", label: "Individual friends" },
        { key: "lookingFor", value: "couple", label: "Couple friends" },
      ].map((filter) => (
        <button
          key={`${filter.key}-${filter.value}`}
          onClick={() =>
            setFilter(
              filter.key,
              currentFilters[filter.key as keyof typeof currentFilters] === filter.value
                ? undefined
                : filter.value
            )
          }
          className={cn(
            "rounded-full border px-3 py-1 text-sm font-medium transition-colors",
            currentFilters[filter.key as keyof typeof currentFilters] === filter.value
              ? "border-navy-700 bg-navy-700 text-white"
              : "border-slate-300 bg-white text-slate-700 hover:border-navy-300"
          )}
        >
          {filter.label}
        </button>
      ))}

      {hasFilters && (
        <button
          onClick={() => router.push(pathname)}
          className="text-sm text-slate-500 underline hover:text-slate-700"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
