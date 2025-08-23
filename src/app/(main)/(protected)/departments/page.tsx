import { DepartmentsGrid } from '@/components/departments/departments-grid'
import HeadSection from '@/components/HeadSection'

function page() {
  return (
    <div className="container max-w-7xl mx-auto p-4 space-y-6">
        <HeadSection>
          <h1 className="text-2xl font-bold">Medical Departments</h1>
          <p className="text-gray-100">Browse our specialized medical departments and book appointments</p>
        </HeadSection>
        <DepartmentsGrid />
      </div>
  )
}

export default page
