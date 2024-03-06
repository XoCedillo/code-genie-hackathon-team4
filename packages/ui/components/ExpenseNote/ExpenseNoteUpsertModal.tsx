'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  Form,
  Modal,
  Input,
} from 'antd'
import { useCreateExpenseNoteMutation, useUpdateExpenseNoteMutation } from './expenseNoteHooks'

const DEFAULT_VALUES = {
}

interface ExpenseNoteUpsertModalParams {
  isOpen: boolean
  expenseNote?: any
  expenseId: any
  setIsOpen: any
}

export default function ExpenseNoteUpsertModal({
  isOpen,
  expenseNote,
  expenseId,
  setIsOpen,
}: ExpenseNoteUpsertModalParams) {
  const expenseNoteMutation = expenseNote ? useUpdateExpenseNoteMutation() : useCreateExpenseNoteMutation()

  function onCancel() {
    setIsOpen(false)
  }

  return (
    <Modal
      centered
      title='Note'
      open={isOpen}
      destroyOnClose
      onCancel={onCancel}
      footer={[
        <Button
          key='cancel'
          disabled={expenseNoteMutation.isLoading}
          onClick={onCancel}
        >
          Cancel
        </Button>,
        <Button
          type='primary'
          form='note'
          key='submit'
          htmlType='submit'
          loading={expenseNoteMutation.isLoading}
        >
          {expenseNote ? 'Update Note' : 'Create Note'}
        </Button>,
      ]}
    >
      <ExpenseNoteUpsertForm
        expenseNote={expenseNote}
        expenseId={expenseId}
        onEdit={() => setIsOpen(false)}
        expenseNoteMutation={expenseNoteMutation}
      />
    </Modal>
  )
}

function ExpenseNoteUpsertForm({
  expenseNote,
  expenseId,
  onEdit,
  expenseNoteMutation,
}) {
  const router = useRouter()
  const [noteForm] = Form.useForm()

  // When editing multiple records on the same page, we need to call resetFields,
  // otherwise the form lags behind, showing the previously selected record's values.
  // https://github.com/ant-design/ant-design/issues/22372
  useEffect(() => {
    noteForm.resetFields()
  }, [expenseNote])

  async function submitForm() {
    const formValues = await noteForm.validateFields()
    const { noteId } = expenseNote || {}

    const response = expenseNote ? await expenseNoteMutation.mutateAsync({
      expenseId,
      noteId,
      data: formValues,
    }) : await expenseNoteMutation.mutateAsync({
      expenseId,
      data: {
        ...formValues,
        expenseId,
      },
    })

    if (response) {
      onEdit()
    }
  }

  const initialValues = expenseNote ? {
    ...expenseNote,
  } : DEFAULT_VALUES

  return (
    <Form
      name='note'
      preserve={false}
      initialValues={initialValues}
      form={noteForm}
      onFinish={submitForm}
      layout='vertical'
      disabled={expenseNoteMutation.isLoading}
    >
      <Form.Item
        label='Comment'
        name='comment'
        rules={[
          {
            required: true,
            message: 'Please enter comment.',
          },
        ]}
      >
        <Input.TextArea showCount autoSize={{ minRows: 2 }} />
      </Form.Item>
    </Form>
  )
}
