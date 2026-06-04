import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

const TableSkeleton = ({ columns, rows = 10 }: TableSkeletonProps) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow
          key={rowIndex}
          className="even:bg-gray-50 border-b border-gray-100"
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              {/* Random widths to look like real data */}
              <Skeleton
                className={`h-4 rounded ${colIndex === 0 ? "w-8" : "w-full"}`}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableSkeleton;
