import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { getStudents } from "@/api"
import Loading from "../Loading"

export default function ViewTeacherStudents() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          toast({
            title: "Error",
            description: "No token found.",
            variant: "destructive",
          })
          setLoading(false)
          return
        }

        const data = await getStudents(token)
        setStudents(data.students)
        setLoading(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch student data.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }

    fetchStudents()
  }, [toast])



  if (loading) {
    return <Loading />
  }

  if (students.length === 0) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-bold">No students found</h1>
        <p>Please ensure there are students in the system and try again.</p>
      </div>
    )
  }

  return (
    <div className="p-5 bg-white rounded-xl shadow-xl mt-10">
      <h1 className="text-3xl font-bold mb-6">View Students</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Parent Email</TableHead>
            <TableHead>Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student._id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.standard}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.parentEmail || "N/A"}</TableCell>
              <TableCell>{student.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>


      
    </div>
  )
}
