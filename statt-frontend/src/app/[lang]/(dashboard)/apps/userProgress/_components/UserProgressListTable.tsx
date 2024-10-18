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
import type { UserProgressType, UsersType } from "@/types/apps/userTypes";

// Styles
import tableStyles from "@core/styles/table.module.css";
import ConfirmationModal from "./DeleteUserProgress";
import { flexRender } from "@tanstack/react-table";
import progress from '../../../../../../@core/theme/overrides/progress';

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
  action?: string;
};

const columnHelper = createColumnHelper<UsersTypeWithAction>();

const UserProgressListTable = () => {
  // States
  const [UserProgress, setUserProgress] = useState<UserProgressType[]>([]);
  const [allUsers, setAllUsers] = useState<UsersTypeWithAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [deleteSectionId, setDeleteSectionId] = useState<string | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const router = useRouter();

  const handleViewUser = (userId: string) => {
    router.push(`/apps/userProgress/${userId}`);
  };

  const fetchAllData = async () => {
    try {
      // Fetch users
      const usersResponse = await axios.get<UsersType[]>(
        "http://localhost:3001/user/all-users"
      );
  
      // Fetch progress
      const progressResponse = await axios.get("http://localhost:3001/user-progress/progress");
  
      // Log the full response to see the structure
      console.log("Full Progress Response:", progressResponse);
  
      // Extract the progress data
      const progressData = progressResponse.data.data; // Ensure you access the correct property
  
      // Handle the case when progressData is not an array
      if (!Array.isArray(progressData)) {
        setError("Progress data is not an array.");
        console.log("Unexpected format for progress data.");
        return;
      }
  
      const fetchedUsers = usersResponse.data;
  
      // Combine users with progress
      const combinedUsers = fetchedUsers.map((user: UsersType) => {
        // Filter progress data for the specific user
        const userProgress = progressData.filter(
          (progress: UserProgressType) => progress.user.id === user.id
        );
  
        // Calculate total progress and count completed sections
        const totalProgress = userProgress.reduce(
          (total, progress) => total + (progress.progress || 0),
          0
        );
        
        // Count the number of sections with progress > 0 (completed sections)
        const completedSectionsCount = userProgress.filter(
          (progress) => progress.progress > 0
        ).length;
  
        // Calculate the average progress based on completed sections
        const averageProgress =
          completedSectionsCount > 0
            ? (totalProgress / completedSectionsCount).toFixed(2)
            : 0; // Avoid division by zero
  
        return {
          ...user,
          progress: averageProgress, // Set the user's average progress
          user: user,
        };
      });
  
      // Set the combined data to state
      setAllUsers(combinedUsers);
      setLoading(false);
    } catch (error: any) {
      // Error handling and logging
      setError(`Failed to fetch data: ${error.message}`);
      console.error("Error details:", error);
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchAllData();
  }, []);

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

  const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(
    () => [
      columnHelper.accessor("id", {
        header: "ID",
        cell: (info) => <Typography>{info.row.index + 1}</Typography>,
      }),
      columnHelper.accessor("name", {
        header: "User Name",
        cell: (info) => (
          <Typography color="text.primary" className="font-medium">
            {info.getValue()}
          </Typography>
        ),
      }),
      columnHelper.accessor("isCompleted", {
        header: "Is Complete",
        cell: (info) => (
          <Typography>{info.getValue() ? "Yes" : "No"}</Typography>
        ),
      }),
      columnHelper.accessor("progress", {
        header: "Total Progress",
        cell: (info) => <Typography>{`${info.getValue()}%`}</Typography>,
      }),
      columnHelper.accessor("action", {
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center gap-0.5">
            {/* <IconButton size='small' onClick={() => handleEditUser(row.original.id.toString())}>
            <i className='ri-edit-box-line text-textSecondary' style={{ color: '#4CAF50' }} />
          </IconButton> */}
            <IconButton
              size="small"
              onClick={() => handleViewUser(row.original.id.toString())}
            >
              <i
                className="ri-eye-line text-textSecondary"
                style={{ color: "#2196F3" }}
              />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                setDeleteSectionId(row.original.id.toString());
                setDeleteModalOpen(true);
              }}
            >
              <i
                className="ri-delete-bin-5-line text-textSecondary"
                style={{ color: "#FF6F61" }}
              />
            </IconButton>
          </div>
        ),
        enableSorting: false,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: allUsers,
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
        <CardHeader title="User Progress List" />
        <Divider />

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
              {allUsers.length === 0 ? (
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
