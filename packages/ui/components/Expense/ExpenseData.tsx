'use client'

import React from 'react'
import { Col, Row, Space, Tag } from 'antd'
import dayjs from 'dayjs'
import AvatarNameLink from '../AvatarNameLink'
import numberFormatter from '@/ui/lib/numberFormatter'

export default function ExpenseData({ expense, minColSpan = 8 }){
  const colSpans = {
    xs: Math.max(minColSpan, 24),
    sm: Math.max(minColSpan, 12),
    xl: Math.max(minColSpan, 8),
  }
  return <Row gutter={[48, 24]}>
    <Col {...colSpans}>
      <div><strong>Created</strong></div>
      <div>{expense.created ? dayjs(expense.created).format('D MMM \'YY') : ''}</div>
    </Col>
    <Col {...colSpans}>
      <div><strong>User</strong></div>
      <div>
        <AvatarNameLink
          name={expense.user?.name}
          image={expense.user?.avatar}
          imageAlt='avatar'
          linkRoute={`/users/${expense.user?.userId}`}
        />
      </div>
    </Col>
    <Col {...colSpans}>
      <div><strong>Ammount</strong></div>
      <div>${numberFormatter.format(expense.ammount)}</div>
    </Col>
    <Col {...colSpans}>
      <div><strong>Category</strong></div>
      <div>{expense.category ? <Space wrap>{expense.category.map(v => <Tag key={v}>{v}</Tag>)}</Space> : null}</div>
    </Col>
    <Col xs={24}>
      <div><strong>Note</strong></div>
      <div style={{whiteSpace: 'pre-line'}}>{expense.note}</div>
    </Col>
  </Row>
}
