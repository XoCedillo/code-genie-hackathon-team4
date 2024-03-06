'use client'

import React, { useState } from 'react'
import {
  Button,
  Card,
  Skeleton,
  Space,
} from 'antd'
import ExpenseUpsertModal from './ExpenseUpsertModal'
import ExpenseData from './ExpenseData'
import ExpenseNotesList from '../ExpenseNote/ExpenseNotesList'
import ExpenseNoteUpsertModal from '../ExpenseNote/ExpenseNoteUpsertModal'
import AvatarNameLink from '../AvatarNameLink'

export default function ExpenseDetails({
  expense,
}) {
  return (
    <Space size='large' direction='vertical' style={{width: '100%'}}>
      <ExpenseDetailsDetails
        expense={expense}
      />
      <ExpenseNotes
        expense={expense}
      />
    </Space>
  )
}

function ExpenseDetailsDetails({
  expense,
}) {
  const [isUpsertModalVisible, setIsUpsertModalVisible] = useState(false)
  if (!expense) return <Skeleton />

  function showUpsertModal() {
    setIsUpsertModalVisible(true)
  }

  return (
    <Card
      bordered={false}
      title={expense.title}
      extra={(
        <Button type='primary' onClick={showUpsertModal}>
          Edit
        </Button>
      )}
    >
      <ExpenseUpsertModal
        isOpen={isUpsertModalVisible}
        setIsOpen={setIsUpsertModalVisible}
        expense={expense}
      />
      <ExpenseData expense={expense} />
    </Card>
  )
}

export function ExpenseNotes({
  expense,
}) {
  const [isUpsertModalVisible, setIsUpsertModalVisible] = useState(false)

  if (!expense) return <Skeleton />

  function showUpsertModal() {
    setIsUpsertModalVisible(true)
  }

  return (
    <Card
      bordered={false}
      title='Notes'
      extra={(
        <Button type='primary' onClick={showUpsertModal}>
          Create Note
        </Button>
      )}
    >
      <ExpenseNoteUpsertModal
        isOpen={isUpsertModalVisible}
        setIsOpen={setIsUpsertModalVisible}
        expenseId={expense.expenseId}
      />
      <ExpenseNotesList
        expenseId={expense.expenseId}
      />
    </Card>
  )
}
