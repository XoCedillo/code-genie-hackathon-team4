'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Button,
  List,
} from 'antd'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { useListIncomesQuery } from './incomeHooks'
import IncomeData from './IncomeData'
import IncomeUpsertModal from './IncomeUpsertModal'
import IncomeDeleteModal from './IncomeDeleteModal'
import { usePages } from '../../lib/usePages'
import { DEFAULT_PAGE_SIZE } from '../../../common/pagination'

export default function IncomesList() {
  const [selectedForEdit, setSelectedForEdit] = useState<any|null>()
  const [selectedForDelete, setSelectedForDelete] = useState<any|null>()
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [previousPage, setPreviousPage] = useState<any|null>()
  const listIncomesQuery = useListIncomesQuery({ page: currentPageIndex, lastEvaluatedKey: previousPage?.lastEvaluatedKey })
  const incomes = listIncomesQuery?.data?.data
  const { pages, totalPagedItemsPlusOneIfHasMorePages } = usePages({
    items: incomes,
    lastEvaluatedKey: listIncomesQuery?.data?.lastEvaluatedKey,
    currentPageIndex,
  })

  function onPaginate(pageNumber) {
    const pageNumberIndex = pageNumber - 1
    setPreviousPage(pages[pageNumberIndex - 1])
    setCurrentPageIndex(pageNumberIndex)
  }

  return (
    <>
      <IncomeUpsertModal
        isOpen={Boolean(selectedForEdit)}
        setIsOpen={() => setSelectedForEdit(null)}
        income={selectedForEdit}
      />
      <IncomeDeleteModal
        onDelete={() => setSelectedForDelete(null)}
        onCancel={() => setSelectedForDelete(null)}
        income={selectedForDelete}
      />
      <List
        loading={listIncomesQuery.isLoading}
        itemLayout='vertical'
        dataSource={incomes}
        pagination={{
          pageSize: DEFAULT_PAGE_SIZE,
          onChange: onPaginate, total: totalPagedItemsPlusOneIfHasMorePages,
        }}
        renderItem={(income) => (
          <List.Item
            key={income.incomeId}
            actions={[
              <Button
                key='edit'
                icon={<EditOutlined />}
                onClick={() => setSelectedForEdit(income)}
              />, <Button
                key='delete'
                icon={<DeleteOutlined />}
                onClick={() => setSelectedForDelete(income)}
                danger
              />,
            ]}
          >
            <List.Item.Meta
              title={<CardTitle
                income={income}
                incomeId={income.incomeId}
              />}
            />
            <IncomeData income={income} />
          </List.Item>
        )}
      />
    </>
  )
}

function CardTitle({ income, incomeId }) {
  const title = income.title || incomeId

  return <div 
    style={{
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      maxWidth: '100%',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <Link href={`/incomes/${incomeId}`}>{title}</Link>
  </div>
}