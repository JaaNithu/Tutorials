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
import ViewUser from './ViewQuestion'
import EditUser from './EditQuestion'
import AddNewQuestion from './AddNewQuestion'
import EditQuestion from './EditQuestion'
import ViewQuestion from './ViewQuestion'
import ConfirmationModal from './DeleteQuestion'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

type QuestionTypeWithAction = QuestionType & {
  action?: string
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

const columnHelper = createColumnHelper<QuestionTypeWithAction>()

const QuestionList = () => {
  // States
  const [addQuestionOpen, setAddQuestionOpen] = useState(false)
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  const [questions, setQuestions] = useState<QuestionTypeWithAction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editQuestion, setEditQuestionOpen] = useState(false)
  const [viewQuestion, setViewQuestionOpen] = useState(false)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [isEditDrawerOpen, setEditDrawerOpen] = useState(false);
  const [sections, setSections] = useState<SectionType[]>([]) // Section data
  const [options, setOptions] = useState<AnswerType[]>([]) // Options data
  const [deleteQuestionId, setDeleteQuestionId] = useState<string | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [question, setQuestion] = useState<QuestionTypeWithAction[]>([])

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await axios.delete(`http://localhost:3001/questions/delete/${questionId}`);
      setQuestions((prevQuestions) =>
        prevQuestions.filter((question) => question.id.toString() !== questionId)
      );
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Failed to delete question', error);
      // Optionally show an error message to the user
    }
  };

  const handleEditQuestion = (questionId: string) => {
    setSelectedQuestionId(questionId);
    setEditDrawerOpen(true);
  };

  // Fetch users using Axios
  useEffect(() => {
    let isMounted = true; // flag to track mounting status
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:3001/questions/');
        if (isMounted) {
          setQuestions(response.data);
          setLoading(false); // Set loading to false after fetching data
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to fetch questions.');
          setLoading(false); // Ensure loading is set to false on error
        }
      }
    };
    fetchQuestions();
    return () => { isMounted = false; }; // cleanup on unmount
  }, []);


  const columns = useMemo(() => [
    columnHelper.accessor('id', {
      header: 'ID',
      cell: (info) => <Typography>{info.row.index + 1}</Typography>
    }),
    columnHelper.accessor('question', {
      header: 'Question',
      cell: (info) => (
        <Typography color='text.primary' className='font-medium'>
          {info.getValue()}
        </Typography>
      )
    }),
    columnHelper.accessor('section', {
      header: 'Section',
      cell: (info) => {
        const section = info.getValue();
        return (
          <Typography>{section ? `${section.title}` : 'N/A'}</Typography>
        );
      }
    }),
    columnHelper.accessor('options', {
      header: 'Options',
      cell: (info) => {
        const options = info.getValue();
        return (
          <Typography>
            {options && options.length > 0
              ? options.map(option => `${option.text}`).join(', ')
              : 'N/A'}
          </Typography>
        );
      }
    }),
    columnHelper.accessor('action', {
      header: 'Action',
      cell: ({ row }) => (
        <div className='flex items-center gap-0.5'>
          <IconButton onClick={() => handleEditQuestion(row.original.id.toString())}>
          <i className='ri-edit-box-line text-textSecondary' style={{ color: '#4CAF50' }} />
          </IconButton>
          <IconButton
            size='small'
            onClick={() => {
              setSelectedQuestionId(row.original.id.toString());
              setViewQuestionOpen(true);
            }}
          >
            <i className='ri-eye-line text-textSecondary' style={{ color: '#2196F3' }} />
          </IconButton>

          <IconButton
            size='small'
            onClick={() => {
              setDeleteQuestionId(row.original.id.toString());
              setDeleteModalOpen(true);
          }}
          >
            <i className='ri-delete-bin-5-line text-textSecondary'
                style={{ color: '#FF6F61' }} />
          </IconButton>
        </div>
      ),
      enableSorting: false
    })
  ], [handleEditQuestion, handleDeleteQuestion]);
  

  const table = useReactTable({
    data: questions,
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

  // Rendering logic
if (loading) {
  return <Typography>Loading questions...</Typography>;
}

if (error) {
  return <Typography color='error'>{error}</Typography>;
}

if (questions.length === 0) {
  return <Typography>No questions available.</Typography>;
}

  return (
    <>
      <Card>
        <CardHeader title='Question Data Table' className='pbe-4' />
        <Divider></Divider>
        <div className='flex justify-end gap-4 p-5 flex-col items-start sm:flex-row sm:items-center'>
          <Button variant='contained' onClick={() => setAddQuestionOpen(!addQuestionOpen)} className='is-full sm:is-auto'>
            Add New Question
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
      <AddNewQuestion open={addQuestionOpen} handleClose={() => setAddQuestionOpen(!addQuestionOpen)} />
      <EditQuestion
        open={isEditDrawerOpen}
        handleClose={() => setEditDrawerOpen(false)}
        questionId={selectedQuestionId}
      />

<ViewQuestion 
  open={viewQuestion} 
  handleClose={() => setViewQuestionOpen(false)} 
  questionId={selectedQuestionId} 
/>


        <ConfirmationModal
          open={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={() => handleDeleteQuestion(deleteQuestionId!)}
      />
    </>
  )
}

export default QuestionList
