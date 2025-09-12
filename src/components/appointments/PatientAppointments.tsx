import React from 'react'
import HeadSection from '../HeadSection'
import { useTranslation } from 'react-i18next'

function PatientAppointments() {
  const { t } = useTranslation()
  
  return (
    <>
        <HeadSection>
          <h1 className="text-2xl font-bold">{t('departments.title')}</h1>
          <p className="text-gray-100">{t('departments.browseDepartments')}</p>
        </HeadSection>
    </>
  )
}

export default PatientAppointments
