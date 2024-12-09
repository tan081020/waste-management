import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react"; // Import icon tìm kiếm từ Lucide

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  return (
    
      <div className=" flex items-center w-full">
        <Input
          type="text"
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Tìm kiếm tin tức..."
          className="p-4 pl-10 border-2 border-green-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all ease-in-out placeholder:text-green-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500" />
      </div>
   
  );
};

export default SearchBar;
