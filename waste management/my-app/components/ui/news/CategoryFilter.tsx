
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategoryFilterProps {
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ onCategoryChange }: CategoryFilterProps) => {
  const categories = ["all", "waste-management", "recycling", "sustainability", "environmental-impact", "waste-disposal", "waste-reduction"];

  return (
    <div className="flex gap-2 items-center justify-center mx-4">
      <h3 className="font-bold text-lg flex-shrink-0">Filter by Category: </h3>

      <Select
        onValueChange={(value) =>
          onCategoryChange(value === "all" ? "" : value) // Gửi giá trị rỗng khi chọn "all"
        }
      >
        <SelectTrigger className="w-[160px] border rounded-md capitalize">
          <SelectValue placeholder="Select Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category} value={category} className="capitalize">
              {category.replace("-", " ").replace(/\b\w/g, (char) => char.toUpperCase())}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CategoryFilter;
