// import { ProfileManagement } from "@/components/profile/profile-management"

// export default function ProfilePage() {
//   return (
//       <div className="space-y-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
//           <p className="text-gray-600">Manage your personal information and account settings</p>
//         </div>
//         <ProfileManagement />
//       </div>
//   )
// }

"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { User, Lock, Save, Edit3 } from "lucide-react"
// import { useAuth } from "@/contexts/auth-context"
// import { useToast } from "@/hooks/use-toast"
// import { z } from "zod"
// import { patientService } from "@/lib/services"
import { Label } from "@/components/ui/label"
import { updateUser, UserInfoUpdate } from "@/services/userServices"
import { Gender, Doctor } from "@/lib/types"
import { useAuth } from "@/hooks/useAuth"

export default function ProfilePage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const { user,setUser } = useAuth()
  console.log("user",user);
  
  const queryClient = useQueryClient()

  // Profile form
  const profileForm = useForm({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      gender: user?.gender || "male", // Updated default value to be a non-empty string
      birthDate: user?.birthDate || "",
      bloodType: user?.bloodType || "",
      allergies: user?.allergies || undefined,
    },
  })

  // Password form
  const passwordForm = useForm()

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data) => {
      const userInfo = {id: user?._id, role : user?.role} as UserInfoUpdate
      const res = await updateUser(userInfo, data)
      setUser(res.data.user)
      console.log("updateProfileMutation mutationFn",data);
      
    },
    onSuccess: (data) => {
      setIsEditingProfile(false)
      console.log("Success",data);
      
      queryClient.invalidateQueries({ queryKey: ["user-profile"] })
      // toast({
      //   title: "Profile updated successfully",
      //   description: "Your profile information has been saved.",
      // })
    },
    onError: (error: any) => {
      console.log("Err",error);
      
      // toast({
      //   title: "Update failed",
      //   description: error.response?.data?.message || "Please try again later.",
      //   variant: "destructive",
      // })
    },
  })

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data) => {
      console.log("changePasswordMutation mutationFn",data);
      
    },
    onSuccess: () => {
      passwordForm.reset()
      // toast({
      //   title: "Password changed successfully",
      //   description: "Your password has been updated.",
      // })
    },
    onError: (error: any) => {
      // toast({
      //   title: "Password change failed",
      //   description: error.response?.data?.message || "Please try again later.",
      //   variant: "destructive",
      // })
    },
  })

  const onProfileSubmit = (data: any) => {
    updateProfileMutation.mutate(data)
  }

  const onPasswordSubmit = (data: any) => {
    changePasswordMutation.mutate(data)
  }

  const handleCancelEdit = () => {
    setIsEditingProfile(false)
    profileForm.reset()
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground mb-2">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and account settings</p>
      </div>

      <div className="max-w-4xl">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                    <CardDescription>Update your personal details and medical information</CardDescription>
                  </div>
                  {!isEditingProfile && (
                    <Button variant="outline" onClick={() => setIsEditingProfile(true)} className="bg-transparent">
                      <Edit3 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {!isEditingProfile ? (
                  // Display Mode
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      {/* <Avatar className="h-16 w-16">
                        <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar> */}
                      <div>
                        <h3 className="text-lg font-medium">{user?.name}</h3>
                        <p className="text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                        <p className="text-sm mt-1">{user?.phone || "Not provided"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Gender</Label>
                        <p className="text-sm mt-1 capitalize">{user?.gender || "Not provided"}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
                        <p className="text-sm mt-1">
                          {user?.birthDate
                            ? new Date(user.birthDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Not provided"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-muted-foreground">Blood Type</Label>
                        <p className="text-sm mt-1">{user?.bloodType || "Not specified"}</p>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-sm font-medium text-muted-foreground">Allergies</Label>
                        <p className="text-sm mt-1">
                          {user?.allergies && user.allergies.length > 0
                            ? user.allergies.join(", ")
                            : "No known allergies"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Edit Mode
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          {...profileForm.register("name")}
                          className="focus:ring-2 focus:ring-primary"
                        />
                        {profileForm.formState.errors.name && (
                          <p className="text-sm text-destructive">{profileForm.formState.errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          placeholder="01xxxxxxxxx"
                          {...profileForm.register("phone")}
                          className="focus:ring-2 focus:ring-primary"
                        />
                        {profileForm.formState.errors.phone && (
                          <p className="text-sm text-destructive">{profileForm.formState.errors.phone.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Gender</Label>
                        <Select
                          value={profileForm.watch("gender")}
                          onValueChange={(value) => profileForm.setValue("gender", value as Gender)}
                        >
                          <SelectTrigger className="focus:ring-2 focus:ring-primary">
                            <SelectValue placeholder="Select your gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        {profileForm.formState.errors.gender && (
                          <p className="text-sm text-destructive">{profileForm.formState.errors.gender.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birthDate" className="text-sm font-medium">
                          Date of Birth
                        </Label>
                        <Input
                          id="birthDate"
                          type="date"
                          {...profileForm.register("birthDate")}
                          className="focus:ring-2 focus:ring-primary"
                        />
                        {profileForm.formState.errors.birthDate && (
                          <p className="text-sm text-destructive">{profileForm.formState.errors.birthDate.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium">Blood Type (Optional)</Label>
                        <Select
                          value={profileForm.watch("bloodType") || "unspecified"}
                          onValueChange={(value) =>
                            profileForm.setValue("bloodType", value === "unspecified" ? undefined : (value as any))
                          }
                        >
                          <SelectTrigger className="focus:ring-2 focus:ring-primary">
                            <SelectValue placeholder="Select your blood type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unspecified">Not specified</SelectItem>
                            <SelectItem value="A+">A+</SelectItem>
                            <SelectItem value="A-">A-</SelectItem>
                            <SelectItem value="B+">B+</SelectItem>
                            <SelectItem value="B-">B-</SelectItem>
                            <SelectItem value="AB+">AB+</SelectItem>
                            <SelectItem value="AB-">AB-</SelectItem>
                            <SelectItem value="O+">O+</SelectItem>
                            <SelectItem value="O-">O-</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="allergies" className="text-sm font-medium">
                          Allergies (Optional)
                        </Label>
                        <Input
                          id="allergies"
                          placeholder="List any allergies, separated by commas"
                          defaultValue={user?.allergies?.join(", ") || ""}
                          onChange={(e) => {
                            const allergies = e.target.value
                              .split(",")
                              .map((a) => a.trim())
                              .filter(Boolean)
                            profileForm.setValue("allergies", allergies)
                          }}
                          className="focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t">
                      <Button type="submit" disabled={updateProfileMutation.isPending}>
                        {updateProfileMutation.isPending ? (
                          <>
                            {/* <LoadingSpinner size="sm" className="mr-2" /> */}
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button type="button" variant="outline" onClick={handleCancelEdit} className="bg-transparent">
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Change Password
                </CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm font-medium">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      {...passwordForm.register("currentPassword")}
                      className="focus:ring-2 focus:ring-primary"
                    />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.currentPassword.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      {...passwordForm.register("newPassword")}
                      className="focus:ring-2 focus:ring-primary"
                    />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-destructive">{passwordForm.formState.errors.newPassword.message as string}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...passwordForm.register("confirmPassword")}
                      className="focus:ring-2 focus:ring-primary"
                    />
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-destructive">
                        {passwordForm.formState.errors.confirmPassword.message as string}
                      </p>
                    )}
                  </div>

                  <Button type="submit" disabled={changePasswordMutation.isPending} className="w-full">
                    {changePasswordMutation.isPending ? (
                      <>
                        {/* <LoadingSpinner size="sm" className="mr-2" /> */}
                        Changing Password...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your account details and registration information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                    <p className="text-sm mt-1">{user?.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Account Type</Label>
                    <p className="text-sm mt-1 capitalize">{user?.role}</p>
                  </div>
                  {user?.role == "Doctor" && <>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                    <p className="text-sm mt-1 capitalize">{(user as Doctor)?.department?.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Specialization</Label>
                    <p className="text-sm mt-1 capitalize">{(user as Doctor)?.specialization}</p>
                  </div>
                  </>}
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Member Since</Label>
                    <p className="text-sm mt-1">
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

