import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { getPointHistory } from "@/api"
import Loading from "../../Loading"


export default function ViewPointHistory() {
  const [pointHistory, setPointHistory] = useState<any[]>([])
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

        const data = await getPointHistory(token)
        setPointHistory(data.pointHistory)
        setLoading(false)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch point history.",
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

  if (pointHistory.length === 0) {
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
            <TableHead>Form</TableHead>
            <TableHead>Teacher</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
                {pointHistory.map((history) => (
                <TableRow key={history._id}>
                <TableCell>{history.formName}</TableCell>
                <TableCell>{history.submittedByName}</TableCell>
                <TableCell>{history.submittedForName}</TableCell>
                <TableCell>{new Date(history.submittedAt).toLocaleDateString()}</TableCell>
                <TableCell>{history.points}</TableCell>
                </TableRow>
            ))}
        </TableBody>
      </Table>

     

     
    </div>
  )
}
