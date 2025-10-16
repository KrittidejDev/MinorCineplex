import { Button } from "../ui/button";

interface AdminStPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

const AdminStPagination = ({ currentPage, totalPages, setCurrentPage }: AdminStPaginationProps) => {
  return (
    <div className="px-15 flex items-center gap-2 justify-center">
      <Button disabled={currentPage === 1} onClick={() => setCurrentPage(1)}>
        {"<<"}
      </Button>
      <Button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage(currentPage - 1)}
      >
        {"<"}
      </Button>
      <span className="text-fm-14 text-gray-g63f">{`Page ${currentPage} of ${totalPages || 1}`}</span>
      <Button
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={() => setCurrentPage(currentPage + 1)}
      >
        {">"}
      </Button>
      <Button
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={() => setCurrentPage(totalPages)}
      >
        {">>"}
      </Button>
    </div>
  );
};
export default AdminStPagination;
