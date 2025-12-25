"use client"

import {useState} from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

export function SortDropdown({onChange}) {
  const [sort, setSort] = useState("price_asc");

  const options = [
    { value: "price_asc", label: "السعر من الأقل للأعلى" },
    { value: "price_desc", label: "السعر من الأعلى للأقل" },
  ];

  const handleChange = (value) => {
    setSort(value)
    onChange(value)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger >
        
        <button className="p-2 border bg-muted flex gap-20 justify-between">
          <span>{options[0].value === sort ? options[0].label : options[1].label}</span>
          <ChevronDown />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-48">
        
        <DropdownMenuRadioGroup
          value={sort}
          onValueChange={handleChange}
        >
            {options.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
