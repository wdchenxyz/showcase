"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"

type SearchInputProps = {
  onSearch: (query: string) => void
  isSearching: boolean
}

export function SearchInput({ onSearch, isSearching }: SearchInputProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      onSearch(trimmed)
    }
  }

  return (
    <div className="flex h-full items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a topic to explore..."
          disabled={isSearching}
          className="h-9 text-sm"
          autoFocus
        />
      </form>
    </div>
  )
}
