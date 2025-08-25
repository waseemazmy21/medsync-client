import { DepartmentsGrid } from '@/components/departments/departments-grid'
import HeadSection from '@/components/HeadSection'
import { useTranslations } from 'next-intl'

function Page() {
  const t = useTranslations('departments');
  return (
    <div className="container max-w-7xl mx-auto p-4 space-y-6">
        <HeadSection>
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          <p className="text-gray-100">{t('desc')}</p>
        </HeadSection>
        <DepartmentsGrid />
      </div>
  )
}

export default Page
