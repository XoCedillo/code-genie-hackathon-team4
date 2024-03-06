'use client'

import React, { useState } from 'react'
import {
  Button,
  Card,
  Skeleton,
  Space,
} from 'antd'
import IncomeUpsertModal from './IncomeUpsertModal'
import IncomeData from './IncomeData'
import AvatarNameLink from '../AvatarNameLink'

export default function IncomeDetails({
  income,
}) {
  return (
    <Space size='large' direction='vertical' style={{width: '100%'}}>
      <IncomeDetailsDetails
        income={income}
      />
    </Space>
  )
}

function IncomeDetailsDetails({
  income,
}) {
  const [isUpsertModalVisible, setIsUpsertModalVisible] = useState(false)
  if (!income) return <Skeleton />

  function showUpsertModal() {
    setIsUpsertModalVisible(true)
  }

  return (
    <Card
      bordered={false}
      title={income.title}
      extra={(
        <Button type='primary' onClick={showUpsertModal}>
          Edit
        </Button>
      )}
    >
      <IncomeUpsertModal
        isOpen={isUpsertModalVisible}
        setIsOpen={setIsUpsertModalVisible}
        income={income}
      />
      <IncomeData income={income} />
    </Card>
  )
}
