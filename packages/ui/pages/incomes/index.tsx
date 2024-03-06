'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { Breadcrumb, Button } from 'antd'
import { HomeOutlined, AppstoreOutlined } from '@ant-design/icons'
import IncomesList from '@/components/Income/IncomesList'
import IncomeUpsertModal from '@/components/Income/IncomeUpsertModal'
import getPageTitle from '@/ui/lib/getPageTitle'
import AuthenticatedPage from '@/ui/components/layouts/AuthenticatedPage'

export default function IncomesMasterPage() {
  const [isUpsertModalVisible, setIsUpsertModalVisible] = useState(false)

  function showUpsertModal() {
    setIsUpsertModalVisible(true)
  }

  return (
    <AuthenticatedPage>
      <Head>
        <title>{getPageTitle({ pageTitle: 'Incomes' })}</title>
      </Head>
      <Breadcrumb items={[
        {
          title: <Link href='/' passHref><HomeOutlined /></Link>,
        },
        {
          title: <>
            <AppstoreOutlined />
            <span>Incomes</span>
          </>,
        },
      ]} />
      <div className='toolbar'>
        <Button type='primary' onClick={showUpsertModal}>
          Create Income
        </Button>
      </div>
      <IncomeUpsertModal
        isOpen={isUpsertModalVisible}
        setIsOpen={setIsUpsertModalVisible}
      />
      <IncomesList />
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
