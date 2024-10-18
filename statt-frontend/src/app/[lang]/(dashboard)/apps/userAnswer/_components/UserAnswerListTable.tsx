"use client";

// React Imports
import { useEffect, useState, useMemo } from "react";

// Next Imports
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";

// Third-party Imports
import axios from "axios";
import classnames from "classnames";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from "@tanstack/react-table";
import type { ColumnDef, FilterFn } from "@tanstack/react-table";

// Type Imports
import type {
  QuestionType,
  UserAnswerType,
  UsersType,
} from "@/types/apps/userTypes";

// Component Imports
// Styles
import tableStyles from "@core/styles/table.module.css";
import ConfirmationModal from "./DeleteUserAnswer";
import ViewAnswerTable from "./ViewUserAnswerTable";

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

type UsersTypeWithAction = UserAnswerType & {
  action?: string;
};

const columnHelper = createColumnHelper<UsersTypeWithAction>();

const UsersAnswerListTable = () => {
  // States
  const [addUserAnswerOpen, setAddUserAnswerOpen] = useState(false);
  const [isEditModelOpen, setEditModelOpen] = useState(false);
  const [userAnswers, setUserAnswers] = useState<UserAnswerType[]>([]);
  const [users, setUsers] = useState<UsersTypeWithAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditDrawerOpen, setEditDrawerOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [viewUser, setViewUserOpen] = useState(false);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [allUsers, setAllUsers] = useState<UsersTypeWithAction[]>([]);
  const [editUser, setEditUserOpen] = useState(false);
  const [deleteSectionId, setDeleteSectionId] = useState<string | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const router = useRouter();

  const handleViewUser = (userId: string) => {
    router.push(`/apps/userAnswer/${userId}`);
  };

  const fetchAllData = async () => {
    try {
      // Fetch users
      const usersResponse = await axios.get<UsersType[]>(
        "http://localhost:3001/user/all-users"
      );

      // Fetch user answers
      const answersResponse = await axios.get<UserAnswerType[]>(
        "http://localhost:3001/user-answers"
      );

      const fetchedUsers = usersResponse.data;
      const fetchedAnswers = answersResponse.data;

      // Map user data with answer counts
      const userAnswerCounts = fetchedUsers.map((user: UsersType) => {
        const userAnswers = fetchedAnswers.filter(
          (answer: UserAnswerType) => answer.user.id === user.id
        );

        const correctCount = userAnswers.reduce(
          (count, answer) => count + (answer.isCorrect ? 1 : 0),
          0
        );
        const wrongCount = userAnswers.reduce(
          (count, answer) => count + (!answer.isCorrect ? 1 : 0),
          0
        );

        return {
          ...user,
          correctAnswers: correctCount,
          wrongAnswers: wrongCount,
          answerText: userAnswers.map((answer) => answer.answerText).join(", "),
          isCorrect: correctCount > 0,
          question: userAnswers.map((answer) => answer.question),
          user: user,
        };
      });

      setAllUsers(userAnswerCounts);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDeleteSection = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3001/user-answers/${id}`);
      setUsers((prevUserAnswer) =>
        prevUserAnswer.filter((user) => user.id !== Number(id))
      );
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete section", error);
    }
  };

  const handleEditUser = (userId: string) => {
    setSelectedUserId(userId);
    setEditDrawerOpen(true);
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
      columnHelper.accessor("correctAnswers", {
        header: "Correct Answer Count",
        cell: (info) => (
          <Typography>
            {info.getValue() > 0 ? info.getValue() : "N/A"}
          </Typography>
        ),
      }),
      columnHelper.accessor("wrongAnswers", {
        header: "Wrong Answer Count",
        cell: (info) => (
          <Typography>
            {info.getValue() > 0 ? info.getValue() : "N/A"}
          </Typography>
        ),
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
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  if (loading) return <Typography>Loading user answers...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Card>
        <CardHeader title="User Answers List" />
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
      {/* <AddNewUserAnswer open={addUserAnswerOpen} handleClose={() => setAddUserAnswerOpen(false)} />

      <EditUserAnswer open={isEditModelOpen} handleClose={() => setEditModelOpen(false)} userId={selectedUserId} />

      <ViewUserAnswer open={viewUser} handleClose={() => setViewUserOpen(false)} userId={selectedUserId} /> */}

      <ConfirmationModal
        open={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={() => handleDeleteSection(deleteSectionId!)}
      />
    </>
  );
};

export default UsersAnswerListTable;
