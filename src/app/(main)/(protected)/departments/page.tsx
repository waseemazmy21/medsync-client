"use client"

import { DepartmentsGrid } from '@/components/departments/departments-grid'
import HeadSection from '@/components/HeadSection'
import { useTranslation } from 'react-i18next'

function Page() {
  const { t } = useTranslation()
  
  return (
    <>
      <HeadSection>
        <h1 className="text-2xl font-bold">{t('departments.title')}</h1>
        <p className="text-gray-100">{t('departments.browseDepartments')}</p>
      </HeadSection>
      <DepartmentsGrid />
    </>
  )
}

export default Page
