'use client';

import useDebounce from '@/hooks/useDebounce';
import { SearchIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState<string | undefined>(undefined);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const router = useRouter();

  useEffect(() => {
    if (debouncedSearchTerm === undefined) return;

    router.push(`/posts?search=${debouncedSearchTerm}`);
  }, [debouncedSearchTerm, router]);

  return (
    <div className="relative">
      <SearchIcon
        className="absolute left-2.5 top-2.5 text-muted-foreground"
        width={18}
        height={18}
        data-testid="search-icon"
      />
      <Input
        type="search"
        placeholder="Search blog posts..."
        className="pl-8"
        onChange={(e) => setSearchTerm(e.currentTarget.value)}
        aria-label="Search blog posts"
      />
    </div>
  );
}
