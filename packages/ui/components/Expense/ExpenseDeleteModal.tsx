'use client'

import React from 'react'
import { Modal } from 'antd'
import { useDeleteExpenseMutation } from './expenseHooks'

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

export default function ExpenseDeleteModal({ expense, onCancel, onDelete }) {
  const deleteMutation = useDeleteExpenseMutation()

  async function onDeleteButtonClick() {
    const expenseId = expense.expenseId
    await deleteMutation.mutateAsync({ expenseId })
    onDelete()
  }

  return (
    <DeleteModal
      isOpen={expense}
      entityName='Expense'
      name={expense?.title}
      isLoading={deleteMutation.isLoading}
      onDeleteButtonClick={onDeleteButtonClick}
      onCancel={onCancel}
    />
  )
}
