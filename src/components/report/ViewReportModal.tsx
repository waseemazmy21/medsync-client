"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
import { Star, Calendar, Users, TrendingUp, TrendingDown, FileText, Download, X } from "lucide-react"
import { Report } from "@/lib/types"
import { formatDate } from "@/lib/utils"

interface ViewReportModalProps {
  report: Report & {departmentName: string} | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewReportModal({ report, open, onOpenChange }: ViewReportModalProps) {
  if (!report) return null

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600"
    if (rating >= 4.0) return "text-blue-600"
    if (rating >= 3.5) return "text-yellow-600"
    return "text-red-600"
  }

  const getRatingBadgeColor = (rating: number) => {
    if (rating >= 4.5) return "bg-green-100 text-green-800"
    if (rating >= 4.0) return "bg-blue-100 text-blue-800"
    if (rating >= 3.5) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const handleDownload = () => {
    // Simulate report download
    const element = document.createElement("a")
    const file = new Blob(
      [
        `Department Report: ${report.departmentName}\n\n` +
          `Generated: ${formatDate(report.createdAt)}\n\n` +
          `Overview:\n${report.overview}\n\n` +
          `Positive Feedback:\n${report.pros.map((pro, i) => `${i + 1}. ${pro}`).join("\n")}\n\n` +
          `Areas for Improvement:\n${report.cons.map((con, i) => `${i + 1}. ${con}`).join("\n")}\n\n` +
          `Statistics:\n` +
          `Total Reviews: ${report.totalReviews}\n` +
          `Average Rating: ${report.averageRating}/5`,
      ],
      { type: "text/plain" },
    )
    element.href = URL.createObjectURL(file)
    element.download = `${report.departmentName.replace(/\s+/g, "_")}_Report_${report._id}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {report.departmentName} - Analytics Report
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Header */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Report Summary</span>
                <Badge className={getRatingBadgeColor(report.averageRating)}>
                  <Star className="h-3 w-3 mr-1" />
                  {report.averageRating} / 5.0
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600">Report Period</p>
                  <p className="font-medium">
                    {formatDate(report.dateRange.from)} - {formatDate(report.dateRange.to)}
                  </p>
                </div> */}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Users className="h-4 w-4 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                  <p className="font-medium">{report.totalReviews}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-4 w-4 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600">Average Rating</p>
                  <p className={`font-medium ${getRatingColor(report.averageRating)}`}>{report.averageRating}</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <FileText className="h-4 w-4 text-gray-500" />
                  </div>
                  <p className="text-sm text-gray-600">Generated</p>
                  <p className="font-medium">{formatDate(report.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overview Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Executive Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{report.overview}</p>
            </CardContent>
          </Card>

          {/* Pros and Cons */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Positive Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <TrendingUp className="h-5 w-5" />
                  Positive Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.pros.map((pro, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-700">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{pro}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <TrendingDown className="h-5 w-5" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {report.cons.map((con, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-orange-700">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{con}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Rating Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-600" />
                Rating Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Performance</span>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.round(report.averageRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{report.averageRating}/5.0</span>
                  </div>
                </div>

                {/* <Separator /> */}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Reviews Analyzed</p>
                    <p className="font-medium">{report.totalReviews} patient reviews</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Performance Level</p>
                    <p className="font-medium">
                      {report.averageRating >= 4.5
                        ? "Excellent"
                        : report.averageRating >= 4.0
                          ? "Very Good"
                          : report.averageRating >= 3.5
                            ? "Good"
                            : "Needs Improvement"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
