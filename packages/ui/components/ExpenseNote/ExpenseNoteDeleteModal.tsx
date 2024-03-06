'use client'

import React from 'react'
import { Modal } from 'antd'
import { useDeleteExpenseNoteMutation } from './expenseNoteHooks'

function DeleteModal({
  isOpen,
  entityName,
  name,
  isLoading,
  onDeleteButtonClick,
  onCancel,
}) {
  return (
    <Modal
      title={`Delete ${name}`}
      open={Boolean(isOpen)}
      okText={`Delete ${name}`}
      onOk={onDeleteButtonClick}
      onCancel={onCancel}
      okButtonProps={{
        loading: isLoading,
        danger: true,
      }}
    >
      Are you sure you want to delete the
      {' '}
      <strong>{entityName}</strong>
      :
      {' '}
      <strong>{name}</strong>
      ?
    </Modal>
  )
}

export default function ExpenseNoteDeleteModal({ expenseNote, onCancel, onDelete }) {
  const deleteMutation = useDeleteExpenseNoteMutation()

  async function onDeleteButtonClick() {
    const expenseId = expenseNote.expenseId
    await deleteMutation.mutateAsync({ expenseId, noteId: expenseNote.noteId })
    onDelete()
  }

  return (
    <DeleteModal
      isOpen={expenseNote}
      entityName='Note'
      name={expenseNote?.user?.name}
      isLoading={deleteMutation.isLoading}
      onDeleteButtonClick={onDeleteButtonClick}
      onCancel={onCancel}
    />
  )
}
