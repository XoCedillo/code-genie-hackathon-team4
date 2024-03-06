'use client'

import React from 'react'
import { Modal } from 'antd'
import { useDeleteIncomeMutation } from './incomeHooks'

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

export default function IncomeDeleteModal({ income, onCancel, onDelete }) {
  const deleteMutation = useDeleteIncomeMutation()

  async function onDeleteButtonClick() {
    const incomeId = income.incomeId
    await deleteMutation.mutateAsync({ incomeId })
    onDelete()
  }

  return (
    <DeleteModal
      isOpen={income}
      entityName='Income'
      name={income?.title}
      isLoading={deleteMutation.isLoading}
      onDeleteButtonClick={onDeleteButtonClick}
      onCancel={onCancel}
    />
  )
}
