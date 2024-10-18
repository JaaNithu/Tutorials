'use client'

// React Imports
import { useEffect, useState, useMemo } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'

// Third-party Imports
import axios from 'axios'
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'
import type { Locale } from '@configs/i18n'

// Component Imports
import AddNewUser from './AddNewUser'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import React from 'react'
import ViewUser from './ViewUser'
import EditUser from './EditUser'
import ConfirmationModal from './DeleteUser'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type UsersTypeWithAction = UsersType & {
  action?: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const columnHelper = createColumnHelper<UsersTypeWithAction>()

const UsersList = () => {
  // States
  const [addUserOpen, setAddUserOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [users, setUsers] = useState<UsersTypeWithAction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editUser, setEditUserOpen] = useState(false)
  const [viewUser, setViewUserOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isEditDrawerOpen, setEditDrawerOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);


  const handleEditUser = (userId: string) => {
    setSelectedUserId(userId);
    setEditDrawerOpen(true);
  };

  // Fetch users using Axios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/user/all-users');
        console.log(response.data); // Log the data to verify it's correct
        setUsers(response.data); // Set data to the state
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users.');
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);

  const handleDeleteUser = async () => {
    if (userIdToDelete) {
      try {
        await axios.delete(`http://localhost:3001/user/delete/${userIdToDelete}`);
        setUsers(users.filter(user => user.id !== Number(userIdToDelete)));
      } catch (err) {
        setError('Failed to delete user.');
      } finally {
        setConfirmationModalOpen(false);
        setUserIdToDelete(null);
      }
    }
  };
  


  const columns = useMemo<ColumnDef<UsersTypeWithAction, any>[]>(() => [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: info => <Typography>{info.row.index + 1}</Typography>
      // If you want sequential numbering
    }),
    columnHelper.accessor('name', {
      header: 'Name',
      cell: info => (
        <Typography color='text.primary' className='font-medium'>
          {info.getValue()}
        </Typography>
      )
    }),
    columnHelper.accessor('email', {
      header: 'Email',
      cell: info => <Typography>{info.getValue()}</Typography>
    }),
    columnHelper.accessor('action', {
      header: 'Action',
      cell: ({ row }) => (
        <div className='flex items-center gap-0.5'>
          {/* Edit button */}
          <IconButton onClick={() => handleEditUser(row.original.id.toString())}>
          <i className='ri-edit-box-line text-textSecondary' style={{ color: '#4CAF50' }} />
          </IconButton>

          {/* View button */}
          <IconButton
            size='small'
            onClick={() => {
              setSelectedUserId(row.original.id.toString());
              setViewUserOpen(true);
            }}
          >
            <i className='ri-eye-line text-textSecondary' style={{ color: '#2196F3' }} />
          </IconButton>

          {/* Delete button */}
          <IconButton
            size='small'
            onClick={() => openConfirmationModal(row.original.id.toString())}
          >
            <i className='ri-delete-bin-5-line text-textSecondary'
                style={{ color: '#FF6F61' }} />
          </IconButton>
        </div>
      ),
      enableSorting: false
    })
  ], [handleEditUser, setSelectedUserId, setViewUserOpen, handleDeleteUser]);
  

  const table = useReactTable({
    data: users,
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
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  if (loading) {
    return <Typography>Loading users...</Typography>
  }

  if (error) {
    return <Typography color='error'>{error}</Typography>
  }

  const openConfirmationModal = (userId: string) => {
    setUserIdToDelete(userId);
    setConfirmationModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader title='User Data Table' className='pbe-4' />
        <Divider></Divider>
        <div className='flex justify-end gap-4 p-5 flex-col items-start sm:flex-row sm:items-center'>
          <Button variant='contained' onClick={() => setAddUserOpen(!addUserOpen)} className='is-full sm:is-auto'>
            Add New User
          </Button>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
          <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={classnames({
                            'flex items-center': header.column.getIsSorted(),
                            'cursor-pointer select-none': header.column.getCanSort()
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() ? (
                            header.column.getIsSorted() === 'asc' ? (
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
            {table.getFilteredRowModel().rows.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component='div'
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => table.setPageIndex(page)}
          onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
        />
      </Card>
      <AddNewUser open={addUserOpen} handleClose={() => setAddUserOpen(!addUserOpen)} />
      <EditUser
        open={isEditDrawerOpen}
        handleClose={() => setEditDrawerOpen(false)}
        userId={selectedUserId}
      />

        <ViewUser open={viewUser} handleClose={() => setViewUserOpen(!viewUser)} userId={selectedUserId} />

          {/* Confirmation Modal */}
      <ConfirmationModal
        open={isConfirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={handleDeleteUser}
      />
    </>
  )
}

export default UsersList
