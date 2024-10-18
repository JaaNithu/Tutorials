"use client";

// React Imports
import { useEffect, useState, useMemo } from "react";

// Next Imports
import { useRouter } from "next/navigation";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";

// Third-party Imports
import axios from "axios";
import classnames from "classnames";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";

// Type Imports
import type { SectionType, UserProgressType, UsersType } from "@/types/apps/userTypes";

// Styles
import tableStyles from "@core/styles/table.module.css";
import ConfirmationModal from "./DeleteUserProgress";
import { flexRender } from "@tanstack/react-table";
import progress from '../../../../../../@core/theme/overrides/progress';
import { Button } from "@mui/material";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

type UsersTypeWithAction = UserProgressType & {
  title: SectionType;
  action?: string;
};

interface ViewProgressTableProps {
  userId: string | null;
}

const columnHelper = createColumnHelper<UsersTypeWithAction>();

const UserProgressListTable: React.FC<ViewProgressTableProps> = ({ userId }) => {
  // States
  const [UserProgress, setUserProgress] = useState<UserProgressType[]>([]);
  const [allSections, setAllSections] = useState<SectionType[]>([]);
  const [allUsers, setAllUsers] = useState<UsersTypeWithAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [deleteSectionId, setDeleteSectionId] = useState<string | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      fetchUserProgress();
      fetchUserName();
    }
  }, [userId]);

  const fetchUserProgress = async () => {
    try {
        setLoading(true);
        setError(null); // Reset error state before fetching

        // Fetch user's progress
        const userProgressResponse = await axios.get(`http://localhost:3001/user-progress/all/${userId}`);
        console.log("User Progress Response:", userProgressResponse.data);

        const userProgressData = userProgressResponse.data.data;

        // Ensure userProgressData is treated as an array
        if (!Array.isArray(userProgressData)) {
            throw new Error("User progress data is not an array");
        }

        // Fetch all sections
        const sectionsResponse = await axios.get("http://localhost:3001/section/");
        const sections = sectionsResponse.data;
        console.log("Sections Response:", sections);

        // Combine user progress with sections
        const combinedUserProgress = sections.map((section: SectionType) => {
            const userProgress = userProgressData.find(progress => progress.section.id === section.id);
            if (!userProgress) {
                console.warn(`No progress found for user in section: ${section.title}`);
                return {
                    id: section.id,
                    title: section.title,
                    progress: section.progress,
                    isCompleted: "N/A",
                    completionDate: "N/A"
                };
            }
            return {
                id: section.id,
                title: section.title,
                progress: userProgress.progress,
                isCompleted: userProgress.isCompleted,
                completionDate: userProgress.completionDate,
            };
        });

        // Set combined user progress
        setUserProgress(combinedUserProgress);
        setLoading(false);
    } catch (error) {
        setLoading(false);
        if (axios.isAxiosError(error)) {
            setError(`Failed to fetch data: ${error.response?.data?.message || error.message}`);
        } else {
            setError(`An unexpected error occurred: ${error.message}`);
        }
        console.error("Error fetching user progress:", error);
    }
};

const fetchUserName = async () => {
  try {
    const response = await axios.get<{ name: string }>(
      `http://localhost:3001/user/${userId}`
    );
    setUserName(response.data.name); // Set the user's name in the state
  } catch (err) {
    console.error("Error fetching user name:", err);
    setError("Failed to fetch user name");
  }
};

  const handleDeleteSection = async (userId: string) => {
    try {
      await axios.delete(
        `http://localhost:3001/user-progress/delete/${userId}`
      );
      setUserProgress((prevUserProgress) =>
        prevUserProgress.filter(
          (progress) => progress.user.id !== Number(userId)
        )
      );
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete section", error);
    }
  };

  
  const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(() => [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => <Typography>{info.getValue()}</Typography>,
    }),
    columnHelper.accessor("title", {
      header: "Section",
      cell: (info) => (
        <Typography color="text.primary" className="font-medium">
          {info.getValue()}
        </Typography>
      ),
    }),
    columnHelper.accessor("progress", {
      header: "Progress (%)",
      cell: (info) => (
        <Typography>
          {info.getValue() === "N/A" ? "N/A" : `${info.getValue()}%`}
        </Typography>
      ),
    }),
    columnHelper.accessor("isCompleted", {
      header: "Completed",
      cell: (info) => (
        <Typography>
          {info.getValue() ? "Yes" : "Not Done"}
        </Typography>
      ),
    }),
    columnHelper.accessor("completionDate", {
      header: "Completed Date",
      cell: (info) => {
        const completionDate = info.getValue();
        return (
          <Typography>
            {completionDate
              ? new Date(completionDate).toLocaleDateString() // Format date only
              : "Not Completed"}
          </Typography>
        );
      },
    }),
  ], []);
  

  const table = useReactTable({
    data: UserProgress,
    columns,
    filterFns: { fuzzy: fuzzyFilter },
    state: { rowSelection, globalFilter },
    initialState: { pagination: { pageSize: 10 } },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (loading) return <Typography>Loading user progress...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Card>
        <CardHeader title={`User ${userName}'s Progress`} className='pbe-4' />
        <Divider />
        <div className='flex justify-end gap-4 p-5 flex-col items-start sm:flex-row sm:items-center'>
          <Button variant='contained' onClick={() => router.back()} className='is-full sm:is-auto'>
            Back
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            "flex items-center": header.column.getIsSorted(),
                            "cursor-pointer select-none":
                              header.column.getCanSort(),
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === "asc" ? (
                              <i className="ri-arrow-up-s-line text-xl" />
                            ) : (
                              <i className="ri-arrow-down-s-line text-xl" />
                            )
                          ) : null}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {UserProgress.length === 0 ? (
                <tr>
                  <td
                    colSpan={table.getVisibleFlatColumns().length}
                    className="text-center"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={classnames({ selected: row.getIsSelected() })}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={allUsers.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
          onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
        />
      </Card>

      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => handleDeleteSection(deleteSectionId!)}
      />
    </>
  );
};

export default UserProgressListTable;
