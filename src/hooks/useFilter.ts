import { useState } from "react";

type FilterType = "recent" | "saved" | "planned" | null;

export function useFilter() {
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter((current) => (current === filter ? null : filter));
  };

  return {
    activeFilter,
    handleFilterClick,
    clearFilter: () => setActiveFilter(null),
  };
}
