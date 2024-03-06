'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { Breadcrumb, Button, Typography } from 'antd'
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons'
import ExpensesList from '@/components/Expense/ExpensesList'
import ExpenseUpsertModal from '@/components/Expense/ExpenseUpsertModal'
import getPageTitle from '@/ui/lib/getPageTitle'
import AuthenticatedPage from '@/ui/components/layouts/AuthenticatedPage'
import { useMeQuery } from '@/ui/components/Me/meHooks'
import ExpenseCard from '@/ui/components/Expense/ExpenseCard'

export default function ExpensesMasterPage() {
  const [isUpsertModalVisible, setIsUpsertModalVisible] = useState(false)
  const meQuery = useMeQuery()
  const currentUser = meQuery.data?.data

  const { Title } = Typography

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
      <Title className='title_expense' level={2}>
        {currentUser && `Welcome, ${currentUser?.name}`}
      </Title>

      <div className='card-container'>
        <ExpenseCard />

        <ExpenseCard />

        <ExpenseCard />

        <ExpenseCard />
      </div>
      <ExpensesList />
      <style jsx>
        {`
          .toolbar {
            margin-bottom: 1rem;
          }
          .title_expense {
            text-align: center;
            text-shadow: 2px 4px 4px rgb(68 76 75 / 60%);
            transition: all 1s easy-out;
          }
          .card-container {
            display: flex;
            justify-content: center;
            gap: 15px;
            padding-top: 20px;
          }
        `}
      </style>
    </AuthenticatedPage>
  )
}
