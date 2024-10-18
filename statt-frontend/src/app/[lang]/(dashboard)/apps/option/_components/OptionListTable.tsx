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
import type { AnswerType, QuestionType, SectionType } from '@/types/apps/userTypes'
import type { Locale } from '@configs/i18n'

// Component Imports
import AddNewUser from './'
import { getLocalizedUrl } from '@/utils/i18n'

// Style Imports
import tableStyles from '@core/styles/table.module.css'
import React from 'react'
import ViewUser from './ViewOptions'
import EditUser from './EditOption'
import AddNewOption from './AddNewOption'
import EditOption from './EditOption'
import ViewOption from './ViewOptions'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type OptionTypeWithAction = AnswerType & {
  action?: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const columnHelper = createColumnHelper<OptionTypeWithAction>()

const OptionList = () => {
  // States
  const [addOptionOpen, setAddOptionOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [options, setOptions] = useState<OptionTypeWithAction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editOption, setEditOptionOpen] = useState(false)
  const [viewOption, setViewOptionOpen] = useState(false)
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [isEditDrawerOpen, setEditDrawerOpen] = useState(false);
  const [sections, setSections] = useState<SectionType[]>([])


  const handleEditOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    setEditDrawerOpen(true);
  };

  // Fetch users using Axios
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3001/question/option/');
        
        // Check if 'options' array exists and update state accordingly
        if (Array.isArray(response.data.options)) {
          setOptions(response.data.options); // Accessing 'options' from the response
        } else {
          console.error('Unexpected data format:', response.data);
          setError('Invalid data format');
        }
      } catch (err) {
        console.error('Failed to fetch options:', err);
        setError('Failed to fetch options');
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);
  
  console.log('Options for table:', options);

  const columns = useMemo(() => [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => <Typography>{info.row.index + 1}</Typography>
    }),
    columnHelper.accessor('text', {
      header: 'Option',
      cell: (info) => (
        <Typography color='text.primary' className='font-medium'>
          {info.getValue()}
        </Typography>
      )
    }),
    columnHelper.accessor('isCorrect', {
      header: 'Correct Answer',
      cell: (info) => {
        const isCorrect = info.getValue();
        return (
          <Typography>
            {isCorrect ? 'Correct' : 'Wrong'}
          </Typography>
        );
      }
    }),
    columnHelper.accessor('question', {
      header: 'Question',
      cell: (info) => {
        const question = info.getValue();
        return (
          <Typography>
            {question ? `${question.question}` : 'N/A'}
          </Typography>
        );
      }
    }),
    columnHelper.accessor('action', {
      header: 'Action',
      cell: ({ row }) => (
        <div className='flex items-center gap-0.5'>
          <IconButton onClick={() => handleEditOption(row.original.id.toString())}>
            <i className='ri-edit-box-line text-textSecondary' />
          </IconButton>
          <IconButton
            size='small'
            onClick={() => {
              setSelectedOptionId(row.original.id.toString());
              setViewOptionOpen(true);
            }}
          >
            <i className='ri-eye-line text-textSecondary' />
          </IconButton>
        </div>
      ),
      enableSorting: false
    })
  ], [handleEditOption]);

  const table = useReactTable({
    data: options,
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
    return <Typography>Loading option...</Typography>
  }

  if (error) {
    return <Typography color='error'>{error}</Typography>
  }

  return (
    <>
      <Card>
        <CardHeader title='Option Data Table' className='pbe-4' />
        <Divider></Divider>
        <div className='flex justify-end gap-4 p-5 flex-col items-start sm:flex-row sm:items-center'>
          <Button variant='contained' onClick={() => setAddOptionOpen(!addOptionOpen)} className='is-full sm:is-auto'>
            Add New Option
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
      <AddNewOption open={addOptionOpen} handleClose={() => setAddOptionOpen(!addOptionOpen)} />
      <EditOption
        open={isEditDrawerOpen}
        handleClose={() => setEditDrawerOpen(false)}
        optionId={selectedOptionId}
      />

        <ViewOption open={viewOption} handleClose={() => setViewOptionOpen(!viewOption)}/>
    </>
  )
}

export default OptionList
