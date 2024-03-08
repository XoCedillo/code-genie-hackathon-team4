'use client'

import React, { useContext, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { Breadcrumb, Button, Progress, Typography } from 'antd'
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons'
import ExpensesList from '@/components/Expense/ExpensesList'
import ExpenseUpsertModal from '@/components/Expense/ExpenseUpsertModal'
import getPageTitle from '@/ui/lib/getPageTitle'
import AuthenticatedPage from '@/ui/components/layouts/AuthenticatedPage'
import { useMeQuery } from '@/ui/components/Me/meHooks'
import ExpenseCard from '@/ui/components/Expense/ExpenseCard'
import { ExampleChart } from '@/ui/components/charts/ApexChart'
import { ThemeContext } from '@/ui/themes/theme-provider'

export default function ExpensesMasterPage() {
  const [isUpsertModalVisible, setIsUpsertModalVisible] = useState(false)
  const meQuery = useMeQuery()
  const currentUser = meQuery.data?.data

  const { theme } = useContext<any>(ThemeContext)
  const strokeColor = theme === 'light' ? '#121417' : '#FFF'
  const trailColor = theme === 'light' ? '#DBE0E5' : '#8e8e8e'

  const { Title, Text } = Typography

  function showUpsertModal() {
    setIsUpsertModalVisible(true)
  }

  return (
    <AuthenticatedPage>
      <Head>
        <title>{getPageTitle({ pageTitle: 'Expenses' })}</title>
      </Head>
      <Breadcrumb
        items={[
          {
            title: (
              <Link href='/' passHref>
                <HomeOutlined />
              </Link>
            ),
          },
          {
            title: (
              <>
                <AppstoreOutlined />
                <span>Expenses</span>
              </>
            ),
          },
        ]}
      />
      <div className='dashboard_toolbar'>
        <Button type='primary' onClick={showUpsertModal}>
          Create Expense
        </Button>
      </div>
      <ExpenseUpsertModal
        isOpen={isUpsertModalVisible}
        setIsOpen={setIsUpsertModalVisible}
      />
      <Title className='dashboard_title--expense' level={2}>
        {currentUser && `Welcome, ${currentUser?.name}`}
      </Title>

      <div className='dashboard__card-container'>
        <ExpenseCard />
        <ExpenseCard />
        <ExpenseCard />
        <ExpenseCard />
      </div>

      <div className='dashboard__progress-container'>
        <Text className='dashboard__progress-text'>
          You've used 80% of your credit limit
        </Text>

        <Progress
          percent={80}
          trailColor={trailColor}
          strokeColor={strokeColor}
        />
      </div>

      <div className='dashboard__chart-container'>
        <ExampleChart />
      </div>

      <Title level={3}>Recent transactions</Title>

      <ExpensesList />
      <style jsx>
        {`
          .dashboard_toolbar {
            margin-bottom: 1rem;
          }
          .dashboard_title--expense {
            padding-bottom: 10px;
            text-align: center;
            text-shadow: 2px 4px 4px rgb(68 76 75 / 60%);
            transition: all 1s easy-out;
          }
          .dashboard__card-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }
          .dashboard__progress-container {
            padding: 40px 0;
          }
          .dashboard__progress-text {
            font-weight: 500;
          }
          .dashboard__chart-container {
            padding: 10px;
            border: 1px solid #dbe0e5;
            border-radius: 20px;
          }
        `}
      </style>
    </AuthenticatedPage>
  )
}
