import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { addStudent } from "@/api/index"
import { Checkbox } from "@/components/ui/checkbox"

import Loading from "../Loading"


export default function AddStudent() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    className: "",
    name : "",
    parentEmail : "",
    sendNotifications : false
  })
  const [loading, setLoading] = useState(false)

  const { toast } = useToast()
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const { name, password, className, email, parentEmail, sendNotifications } = formData

    if (!name || !password || !className || !parentEmail) {
      toast({
        title: "Error",
        description: "Please fill all fields.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)

      const token = localStorage.getItem("token")

      if (!token) {
        toast({
          title: "Error",
          description: "You are not authenticated.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      const studentData = {
        name: name,
        password: password,
        standard: className,
        email : email,
        parentEmail : parentEmail,
        sendNotifications : sendNotifications
        
      }

      console.log("Student Data",studentData)

      const response = await addStudent(studentData,token)

      if (!response.error) {
        toast({
          title: "Student added successfully",
          description: `${name} has been added.`,
        })
        
        navigate("/viewstudent")
      } else {
        toast({
          title: "Error",
          description: "Failed to add student. Please try again.",
          variant: "destructive",
        })
      }

      setLoading(false)
      setFormData({
        name: "",
        password: "",
        className: "",
        email: "",
        parentEmail: "",
        sendNotifications : false
      })

    } catch (error) {
      console.error("An unexpected error occurred. Please try again.")
      setLoading(false)

      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return <Loading />
  }

  

  return (
    <div className="grid place-items-center w-full h-full mt-10 ">

      <div className="bg-white shadow-xl p-4 w-40 sm:w-60 md:w-60 lg:w-96 rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Add Student</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
       
        <div>
          <Label htmlFor="className">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Parent Email</Label>
          <Input
            id="parentEmail"
            name="parentEmail"
            value={formData.parentEmail}
            onChange={handleChange}
            required
          />
          <Checkbox className="mt-2" checked={formData.sendNotifications} onCheckedChange={(e)=>setFormData({...formData,sendNotifications:e as boolean})}  /><span className="text-sm ml-2 gap-x-1 inline-block  text-semibold ">Send email notification to parent</span>
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="className">Class</Label>
          <Input
            id="className"
            name="className"
            value={formData.className}
            onChange={handleChange}
            required
          />
        </div>
       
        <Button type="submit">Add Student</Button>
      </form>
    </div>
    </div>
  )
}
