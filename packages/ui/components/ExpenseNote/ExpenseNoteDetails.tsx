'use client'

import React, { useState } from 'react'
import {
  Button,
  Card,
  Skeleton,
  Space,
} from 'antd'
import ExpenseNoteUpsertModal from './ExpenseNoteUpsertModal'
import ExpenseNoteData from './ExpenseNoteData'
import AvatarNameLink from '../AvatarNameLink'

export default function ExpenseNoteDetails({
  expenseId,
  expenseNote,
}) {
  return (
    <Space size='large' direction='vertical' style={{width: '100%'}}>
      <ExpenseNoteDetailsDetails
        expenseId={expenseId}
        expenseNote={expenseNote}
      />
    </Space>
  )
}

function ExpenseNoteDetailsDetails({
  expenseId,
  expenseNote,
}) {
  const [isUpsertModalVisible, setIsUpsertModalVisible] = useState(false)
  if (!expenseNote) return <Skeleton />

  function showUpsertModal() {
    setIsUpsertModalVisible(true)
  }

  return (
    <Card
      bordered={false}
      title={expenseNote.user?.name}
      extra={(
        <Button type='primary' onClick={showUpsertModal}>
          Edit
        </Button>
      )}
    >
      <ExpenseNoteUpsertModal
        isOpen={isUpsertModalVisible}
        setIsOpen={setIsUpsertModalVisible}
        expenseNote={expenseNote}
        expenseId={expenseId}
      />
      <ExpenseNoteData expenseNote={expenseNote} />
    </Card>
  )
}
