'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Button,
  List,
} from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useListExpensesQuery } from './expenseHooks'
import ExpenseData from './ExpenseData'
import ExpenseUpsertModal from './ExpenseUpsertModal'
import ExpenseDeleteModal from './ExpenseDeleteModal'
import { usePages } from '../../lib/usePages'
import { DEFAULT_PAGE_SIZE } from '../../../common/pagination'

export default function ExpensesList() {
  const [selectedForEdit, setSelectedForEdit] = useState<any|null>()
  const [selectedForDelete, setSelectedForDelete] = useState<any|null>()
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [previousPage, setPreviousPage] = useState<any|null>()
  const listExpensesQuery = useListExpensesQuery({ page: currentPageIndex, lastEvaluatedKey: previousPage?.lastEvaluatedKey })
  const expenses = listExpensesQuery?.data?.data
  const { pages, totalPagedItemsPlusOneIfHasMorePages } = usePages({
    items: expenses,
    lastEvaluatedKey: listExpensesQuery?.data?.lastEvaluatedKey,
    currentPageIndex,
  })

  function onPaginate(pageNumber) {
    const pageNumberIndex = pageNumber - 1
    setPreviousPage(pages[pageNumberIndex - 1])
    setCurrentPageIndex(pageNumberIndex)
  }

  return (
    <>
      <ExpenseUpsertModal
        isOpen={Boolean(selectedForEdit)}
        setIsOpen={() => setSelectedForEdit(null)}
        expense={selectedForEdit}
      />
      <ExpenseDeleteModal
        onDelete={() => setSelectedForDelete(null)}
        onCancel={() => setSelectedForDelete(null)}
        expense={selectedForDelete}
      />
      <List
        loading={listExpensesQuery.isLoading}
        itemLayout='vertical'
        dataSource={expenses}
        pagination={{
          pageSize: DEFAULT_PAGE_SIZE,
          onChange: onPaginate, total: totalPagedItemsPlusOneIfHasMorePages,
        }}
        renderItem={(expense) => (
          <List.Item
            key={expense.expenseId}
            actions={[
              <Button
                key='edit'
                icon={<EditOutlined />}
                onClick={() => setSelectedForEdit(expense)}
              />, <Button
                key='delete'
                icon={<DeleteOutlined />}
                onClick={() => setSelectedForDelete(expense)}
                danger
              />,
            ]}
          >
            <List.Item.Meta
              title={<CardTitle
                expense={expense}
                expenseId={expense.expenseId}
              />}
            />
            <ExpenseData expense={expense} />
          </List.Item>
        )}
      />
    </>
  )
}

function CardTitle({ expense, expenseId }) {
  const title = expense.title || expenseId

  return <div 
    style={{
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      maxWidth: '100%',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <Link href={`/expenses/${expenseId}`}>{title}</Link>
  </div>
}