'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { Breadcrumb, Button } from 'antd'
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons'
import ExpensesList from '@/components/Expense/ExpensesList'
import ExpenseUpsertModal from '@/components/Expense/ExpenseUpsertModal'
import getPageTitle from '@/ui/lib/getPageTitle'
import AuthenticatedPage from '@/ui/components/layouts/AuthenticatedPage'

export default function ExpensesMasterPage() {
  const [isUpsertModalVisible, setIsUpsertModalVisible] = useState(false)

  function showUpsertModal() {
    setIsUpsertModalVisible(true)
  }

  return (
    <AuthenticatedPage>
      <Head>
        <title>{getPageTitle({ pageTitle: 'Expenses' })}</title>
      </Head>
      <Breadcrumb items={[
        {
          title: <Link href='/' passHref><HomeOutlined /></Link>,
        },
        {
          title: <>
            <AppstoreOutlined />
            <span>Expenses</span>
          </>,
        },
      ]} />
      <div className='toolbar'>
        <Button type='primary' onClick={showUpsertModal}>
          Create Expense
        </Button>
      </div>
      <ExpenseUpsertModal
        isOpen={isUpsertModalVisible}
        setIsOpen={setIsUpsertModalVisible}
      />
      <ExpensesList />
      <style jsx>
        {`
        .toolbar {
          margin-bottom: 1rem;
        }
        `}
      </style>
    </AuthenticatedPage>
  )
}
