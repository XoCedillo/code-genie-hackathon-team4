'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  Form,
  Modal,
  Input,
  InputNumber,
} from 'antd'
import { useCreateIncomeMutation, useUpdateIncomeMutation } from './incomeHooks'

const DEFAULT_VALUES = {
}

interface IncomeUpsertModalParams {
  isOpen: boolean
  income?: any
  setIsOpen: any
}

export default function IncomeUpsertModal({
  isOpen,
  income,
  setIsOpen,
}: IncomeUpsertModalParams) {
  const incomeMutation = income ? useUpdateIncomeMutation() : useCreateIncomeMutation()

  function onCancel() {
    setIsOpen(false)
  }

  return (
    <Modal
      centered
      title='Income'
      open={isOpen}
      destroyOnClose
      onCancel={onCancel}
      footer={[
        <Button
          key='cancel'
          disabled={incomeMutation.isLoading}
          onClick={onCancel}
        >
          Cancel
        </Button>,
        <Button
          type='primary'
          form='income'
          key='submit'
          htmlType='submit'
          loading={incomeMutation.isLoading}
        >
          {income ? 'Update Income' : 'Create Income'}
        </Button>,
      ]}
    >
      <IncomeUpsertForm
        income={income}
        onEdit={() => setIsOpen(false)}
        incomeMutation={incomeMutation}
      />
    </Modal>
  )
}

function IncomeUpsertForm({
  income,
  onEdit,
  incomeMutation,
  shouldNavigateToDetailsPageOnCreate = true,
}) {
  const router = useRouter()
  const [incomeForm] = Form.useForm()

  // When editing multiple records on the same page, we need to call resetFields,
  // otherwise the form lags behind, showing the previously selected record's values.
  // https://github.com/ant-design/ant-design/issues/22372
  useEffect(() => {
    incomeForm.resetFields()
  }, [income])

  async function submitForm() {
    const formValues = await incomeForm.validateFields()
    let { incomeId } = income || {}

    const response = income ? await incomeMutation.mutateAsync({
      incomeId,
      data: formValues,
    }) : await incomeMutation.mutateAsync({
      data: {
        ...formValues,
      },
    })

    if (response) {
      if (!income && shouldNavigateToDetailsPageOnCreate) {
        incomeId = response.data.data.incomeId
        router.push(`/incomes/${incomeId}`)
      } else {
        onEdit()
      }
    }
  }

  const initialValues = income ? {
    ...income,
  } : DEFAULT_VALUES

  return (
    <Form
      name='income'
      preserve={false}
      initialValues={initialValues}
      form={incomeForm}
      onFinish={submitForm}
      layout='vertical'
      disabled={incomeMutation.isLoading}
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
        label='Description'
        name='description'
      >
        <Input.TextArea showCount autoSize={{ minRows: 2 }} />
      </Form.Item>
    </Form>
  )
}
