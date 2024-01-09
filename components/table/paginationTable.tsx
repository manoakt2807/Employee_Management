'use client';
import { EmployeeState } from "@/app/(root)/page";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';

const PaginationTable = () => {
    const { data, page, setPage } = EmployeeState(state => state);

    return (
        <div className={`flex justify-center items-center`}>
            {data.length ? <ResponsivePagination
                current={page || 1}
                total={Math.ceil(data.length / 5) || 1}
                onPageChange={setPage}

            /> : <div className="text-muted-foreground">No Record Found</div>}
        </div>
    );
};

export default PaginationTable;
