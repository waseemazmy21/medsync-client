"use client"

import { DepartmentsGrid } from '@/components/departments/departments-grid'
import HeadSection from '@/components/HeadSection'
import { useTranslation } from 'react-i18next'

function page() {
  const { t } = useTranslation()
  
  return (
    <div className="container max-w-7xl mx-auto p-4 space-y-6">
        <HeadSection>
          <h1 className="text-2xl font-bold">{t('departments.title')}</h1>
          <p className="text-gray-100">{t('departments.browseDepartments')}</p>
        </HeadSection>
        <DepartmentsGrid />
    </div>
  )
}

export default page
