"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Star, TrendingUp, Eye } from "lucide-react"
import { ViewReportModal } from "@/components/report/ViewReportModal"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { generateReport as generateReportApi, reports as reportsApi } from "@/services/reportService"
import { useAuth } from "@/hooks/useAuth"
import { Doctor, Report } from "@/lib/types"
import { toast } from "sonner"
import { formatDate, handleError } from "@/lib/utils"

const getRatingBadgeColor = (rating: number) => {
  if (rating >= 4.5) return "bg-green-100 text-green-800"
  if (rating >= 4.0) return "bg-blue-100 text-blue-800"
  if (rating >= 3.5) return "bg-yellow-100 text-yellow-800"
  return "bg-red-100 text-red-800"
}

export default function Reports() {
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  const {user} = useAuth()
  const doctor = user as Doctor;
  const queryClient = useQueryClient()

  const {data = {} as Report} = useQuery<{reports: Report[], totalReports: number, averageRating: number}>({
    queryKey: ["reports"],
    queryFn: async ()=> {
      const data = await reportsApi(doctor.department._id)
      console.log("Dzta", data);
      
      return  data
    }
  })

  const {reports = [],totalReviews , averageRating} = data as {reports: Report[], totalReports: number,totalReviews: number, averageRating: number}

  const {mutate: GenerateReport, isPending: isGenerating } = useMutation({
    mutationFn: async () => {
      const response = await generateReportApi(doctor.department._id)
      console.log("response",response);
      
      return response
    },
    onSuccess: () => {
      toast.success("Report generated successfully")

      queryClient.invalidateQueries({ queryKey: ["reports"] })
    },
    onError: (error: unknown) => {
      toast.error(handleError(error))
    },
  })

  const handleViewReport = (report: Report & {departmentName: string}) => {
    setSelectedReport(report)
    setViewModalOpen(true)
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department Reports</h1>
          <p className="text-gray-600 mt-1">View analytics and insights for department performance</p>
        </div>
        <Button onClick={()=> GenerateReport()} disabled={isGenerating} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
            {isGenerating? "Generating...":"Generate New Report"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{reports?.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {averageRating?.toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalReviews}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>

        {reports.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Reports Yet</h3>
              <p className="text-gray-600 mb-4">Generate your first department report to get started with analytics.</p>
              <Button  onClick={() => GenerateReport()} disabled={isGenerating}>
                <Plus className="h-4 w-4 mr-2" />
                {isGenerating? "Generating...":"Generate Report"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <Card key={report._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{doctor.department.name}</h3>
                        <Badge className={getRatingBadgeColor(report.averageRating)}>
                          <Star className="h-3 w-3 mr-1" />
                          {report.averageRating}
                        </Badge>
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-2">{report.overview}</p>

                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        {/* <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(report?.dateRange.from)} - {formatDate(report?.dateRange.to)}
                        </div> */}
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          {report.totalReviews} reviews
                        </div>
                        <div className="text-gray-400">Generated on {formatDate(report.createdAt)}</div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" onClick={() => handleViewReport({...report, departmentName:doctor.department.name})} className="ml-4">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {selectedReport && <ViewReportModal report={{...selectedReport, departmentName:doctor.department.name}} open={viewModalOpen} onOpenChange={setViewModalOpen} />}
    </div>
  )
}
