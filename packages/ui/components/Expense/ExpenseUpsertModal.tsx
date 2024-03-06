'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  Form,
  Modal,
  Input,
  InputNumber,
  Select,
} from 'antd'
import { useCreateExpenseMutation, useUpdateExpenseMutation } from './expenseHooks'

const DEFAULT_VALUES = {
}

interface ExpenseUpsertModalParams {
  isOpen: boolean
  expense?: any
  setIsOpen: any
}

export default function ExpenseUpsertModal({
  isOpen,
  expense,
  setIsOpen,
}: ExpenseUpsertModalParams) {
  const expenseMutation = expense ? useUpdateExpenseMutation() : useCreateExpenseMutation()

  function onCancel() {
    setIsOpen(false)
  }

  return (
    <Modal
      centered
      title='Expense'
      open={isOpen}
      destroyOnClose
      onCancel={onCancel}
      footer={[
        <Button
          key='cancel'
          disabled={expenseMutation.isLoading}
          onClick={onCancel}
        >
          Cancel
        </Button>,
        <Button
          type='primary'
          form='expense'
          key='submit'
          htmlType='submit'
          loading={expenseMutation.isLoading}
        >
          {expense ? 'Update Expense' : 'Create Expense'}
        </Button>,
      ]}
    >
      <ExpenseUpsertForm
        expense={expense}
        onEdit={() => setIsOpen(false)}
        expenseMutation={expenseMutation}
      />
    </Modal>
  )
}

function ExpenseUpsertForm({
  expense,
  onEdit,
  expenseMutation,
  shouldNavigateToDetailsPageOnCreate = true,
}) {
  const router = useRouter()
  const [expenseForm] = Form.useForm()

  // When editing multiple records on the same page, we need to call resetFields,
  // otherwise the form lags behind, showing the previously selected record's values.
  // https://github.com/ant-design/ant-design/issues/22372
  useEffect(() => {
    expenseForm.resetFields()
  }, [expense])

  async function submitForm() {
    const formValues = await expenseForm.validateFields()
    let { expenseId } = expense || {}

    const response = expense ? await expenseMutation.mutateAsync({
      expenseId,
      data: formValues,
    }) : await expenseMutation.mutateAsync({
      data: {
        ...formValues,
      },
    })

    if (response) {
      if (!expense && shouldNavigateToDetailsPageOnCreate) {
        expenseId = response.data.data.expenseId
        router.push(`/expenses/${expenseId}`)
      } else {
        onEdit()
      }
    }
  }

  const initialValues = expense ? {
    ...expense,
  } : DEFAULT_VALUES

  return (
    <Form
      name='expense'
      preserve={false}
      initialValues={initialValues}
      form={expenseForm}
      onFinish={submitForm}
      layout='vertical'
      disabled={expenseMutation.isLoading}
    >
      <Form.Item
        label='Title'
        name='title'
        rules={[
          {
            required: true,
            message: 'Please enter title.',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label='Ammount'
        name='ammount'
        rules={[
          {
            required: true,
            message: 'Please enter ammount.',
          },
        ]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        label='Note'
        name='note'
      >
        <Input.TextArea showCount autoSize={{ minRows: 2 }} />
      </Form.Item>
      <Form.Item
        label='Category'
        name='category'
        rules={[
          {
            required: true,
            message: 'Please enter category.',
          },
        ]}
      >
        <Select showSearch placeholder='Select a category...' mode='multiple' showArrow>
          <Select.Option value='home'>home</Select.Option>
          <Select.Option value='food'>food</Select.Option>
          <Select.Option value='insurance'>insurance</Select.Option>
        </Select>
      </Form.Item>
    </Form>
  )
}
