'use client'

import React from 'react'
import { Col, Row } from 'antd'
import dayjs from 'dayjs'
import AvatarNameLink from '../AvatarNameLink'
import numberFormatter from '@/ui/lib/numberFormatter'

export default function IncomeData({ income, minColSpan = 12 }){
  const colSpans = {
    xs: Math.max(minColSpan, 24),
    sm: Math.max(minColSpan, 12),
    xl: Math.max(minColSpan, 8),
  }
  return <Row gutter={[48, 24]}>
    <Col {...colSpans}>
      <div><strong>Created</strong></div>
      <div>{income.created ? dayjs(income.created).format('D MMM \'YY') : ''}</div>
    </Col>
    <Col {...colSpans}>
      <div><strong>User</strong></div>
      <div>
        <AvatarNameLink
          name={income.user?.name}
          image={income.user?.avatar}
          imageAlt='avatar'
          linkRoute={`/users/${income.user?.userId}`}
        />
      </div>
    </Col>
    <Col {...colSpans}>
      <div><strong>Ammount</strong></div>
      <div>${numberFormatter.format(income.ammount)}</div>
    </Col>
    <Col xs={24}>
      <div><strong>Description</strong></div>
      <div style={{whiteSpace: 'pre-line'}}>{income.description}</div>
    </Col>
  </Row>
}
