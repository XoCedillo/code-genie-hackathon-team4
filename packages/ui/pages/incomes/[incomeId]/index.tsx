'use client'

import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Breadcrumb } from 'antd'
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons'
import IncomeDetails from '@/components/Income/IncomeDetails'
import { useGetIncomeQuery } from '@/components/Income/incomeHooks'
import getPageTitle from '@/ui/lib/getPageTitle'
import AuthenticatedPage from '@/ui/components/layouts/AuthenticatedPage'

export default function IncomesDetailsPage() {
  const router = useRouter()
  const {
    incomeId,
  } = router.query
  const getIncomeQuery = useGetIncomeQuery({ incomeId })

  const income = getIncomeQuery.data?.data

  return (
    <AuthenticatedPage>
      <Head>
        <title>{getPageTitle({ pageTitle: income ? `${income.title} | Income` : 'Income' })}</title>
      </Head>
      <Breadcrumb items={[
        {
          title: <Link href='/' passHref><HomeOutlined /></Link>,
        },
        {
          title: <Link href='/incomes' passHref>
            <AppstoreOutlined />{' '}Incomes
          </Link>,
        },
        {
          title: income?.title || income?.incomeId,
        },
      ]} />
      <div className='detailsContainer'>
        <IncomeDetails
          income={income}
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
