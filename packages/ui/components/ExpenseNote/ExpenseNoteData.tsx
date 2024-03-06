'use client'

import React from 'react'
import { Col, Row } from 'antd'
import dayjs from 'dayjs'

export default function ExpenseNoteData({ expenseNote, minColSpan = 24 }){
  const colSpans = {
    xs: Math.max(minColSpan, 24),
    sm: Math.max(minColSpan, 12),
    xl: Math.max(minColSpan, 8),
  }
  return <Row gutter={[48, 24]}>
    <Col {...colSpans}>
      <div><strong>Created</strong></div>
      <div>{expenseNote.created ? dayjs(expenseNote.created).format('D MMM \'YY') : ''}</div>
    </Col>
    <Col {...colSpans}>
      <div><strong>Parent</strong></div>
      <div>{expenseNote.parentId}</div>
    </Col>
    <Col xs={24}>
      <div><strong>Comment</strong></div>
      <div style={{whiteSpace: 'pre-line'}}>{expenseNote.comment}</div>
    </Col>
  </Row>
}
