'use client'

import React, { useState } from 'react'
import {
  Button,
  List,
} from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useListExpenseNotesQuery } from './expenseNoteHooks'
import ExpenseNoteData from './ExpenseNoteData'
import ExpenseNoteUpsertModal from './ExpenseNoteUpsertModal'
import ExpenseNoteDeleteModal from './ExpenseNoteDeleteModal'
import { usePages } from '../../lib/usePages'
import { DEFAULT_PAGE_SIZE } from '../../../common/pagination'

export default function ExpenseNotesList({
  expenseId,
}) {
  const [selectedForEdit, setSelectedForEdit] = useState<any|null>()
  const [selectedForDelete, setSelectedForDelete] = useState<any|null>()
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [previousPage, setPreviousPage] = useState<any|null>()
  const listExpenseNotesQuery = useListExpenseNotesQuery({ page: currentPageIndex, lastEvaluatedKey: previousPage?.lastEvaluatedKey, expenseId })
  const expenseNotes = listExpenseNotesQuery?.data?.data
  const { pages, totalPagedItemsPlusOneIfHasMorePages } = usePages({
    items: expenseNotes,
    lastEvaluatedKey: listExpenseNotesQuery?.data?.lastEvaluatedKey,
    currentPageIndex,
  })

  function onPaginate(pageNumber) {
    const pageNumberIndex = pageNumber - 1
    setPreviousPage(pages[pageNumberIndex - 1])
    setCurrentPageIndex(pageNumberIndex)
  }

  return (
    <>
      <ExpenseNoteUpsertModal
        isOpen={Boolean(selectedForEdit)}
        setIsOpen={() => setSelectedForEdit(null)}
        expenseNote={selectedForEdit}
        expenseId={expenseId}
      />
      <ExpenseNoteDeleteModal
        onDelete={() => setSelectedForDelete(null)}
        onCancel={() => setSelectedForDelete(null)}
        expenseNote={selectedForDelete}
      />
      <List
        loading={listExpenseNotesQuery.isLoading}
        itemLayout='vertical'
        dataSource={expenseNotes}
        pagination={{
          pageSize: DEFAULT_PAGE_SIZE,
          onChange: onPaginate, total: totalPagedItemsPlusOneIfHasMorePages,
        }}
        renderItem={(expenseNote) => (
          <List.Item
            key={expenseNote.noteId}
            actions={[
              <Button
                key='edit'
                icon={<EditOutlined />}
                onClick={() => setSelectedForEdit(expenseNote)}
              />, <Button
                key='delete'
                icon={<DeleteOutlined />}
                onClick={() => setSelectedForDelete(expenseNote)}
                danger
              />,
            ]}
          >
            <List.Item.Meta
              title={<CardTitle
                expenseNote={expenseNote}
                noteId={expenseNote.noteId}
              />}
            />
            <ExpenseNoteData expenseNote={expenseNote} />
          </List.Item>
        )}
      />
    </>
  )
}

function CardTitle({ expenseNote, noteId }) {
  const title = expenseNote.user?.name || noteId

  return <div 
    style={{
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      maxWidth: '100%',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    {title}
  </div>
}