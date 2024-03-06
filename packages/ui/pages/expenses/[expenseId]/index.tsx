'use client'

import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Breadcrumb } from 'antd'
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons'
import ExpenseDetails from '@/components/Expense/ExpenseDetails'
import { useGetExpenseQuery } from '@/components/Expense/expenseHooks'
import getPageTitle from '@/ui/lib/getPageTitle'
import AuthenticatedPage from '@/ui/components/layouts/AuthenticatedPage'

export default function ExpensesDetailsPage() {
  const router = useRouter()
  const {
    expenseId,
  } = router.query
  const getExpenseQuery = useGetExpenseQuery({ expenseId })

  const expense = getExpenseQuery.data?.data

  return (
    <AuthenticatedPage>
      <Head>
        <title>{getPageTitle({ pageTitle: expense ? `${expense.title} | Expense` : 'Expense' })}</title>
      </Head>
      <Breadcrumb items={[
        {
          title: <Link href='/' passHref><HomeOutlined /></Link>,
        },
        {
          title: <Link href='/expenses' passHref>
            <AppstoreOutlined />{' '}Expenses
          </Link>,
        },
        {
          title: expense?.title || expense?.expenseId,
        },
      ]} />
      <div className='detailsContainer'>
        <ExpenseDetails
          expense={expense}
        />
      </div>
      <style jsx>
        {`
        .detailsContainer {
          margin-top: 1rem;
        }
        `}
      </style>
    </AuthenticatedPage>
  )
}
