import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"
import { getStudents, deleteStudent, updateStudent } from "@/api"
import Loading from "../Loading"
import { Checkbox } from "@/components/ui/checkbox"
import Modal from "./Modal"

export default function ViewStudents() {
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingStudent, setEditingStudent] = useState<any | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null)
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
  }, [toast, editingStudent])

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token found.")

      await deleteStudent(id, token)
      setStudents((prev) => prev.filter((student) => student._id !== id))
      toast({
        title: "Success",
        description: "Student deleted successfully.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete student.",
        variant: "destructive",
      })
    } finally {
      setShowModal(false)
      setStudentToDelete(null)
    }
  }

  const handleUpdateSubmit = async (updatedStudent: any, id: string) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token found.")

      const updatedData = await updateStudent(updatedStudent, id, token)
      setStudents((prev) =>
        prev.map((student) =>
          student._id === updatedData._id ? updatedData : student
        )
      )
      setEditingStudent(null)
      toast({
        title: "Success",
        description: "Student updated successfully.",
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update student.",
        variant: "destructive",
      })
    }
  }

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
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student._id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.standard}</TableCell>
              <TableCell>{student.email}</TableCell>
              <TableCell>{student.parentEmail || "N/A"}</TableCell>
              <TableCell>
                <button
                  onClick={() => setEditingStudent(student)}
                  className="mr-2 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setStudentToDelete(student._id)
                    setShowModal(true)
                  }}
                  className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {editingStudent && (
        <div className="mt-8 p-5 border rounded-xl bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">Edit Student</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleUpdateSubmit(editingStudent, editingStudent._id)
            }}
          >
            <div className="mb-4">
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={editingStudent.name}
                onChange={(e) =>
                  setEditingStudent({ ...editingStudent, name: e.target.value })
                }
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Class</label>
              <input
                type="text"
                value={editingStudent.standard}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    standard: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={editingStudent.email}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    email: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Parent Email</label>
              <input
                type="email"
                value={editingStudent.parentEmail}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    parentEmail: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border rounded"
              />
              <Checkbox checked={editingStudent.sendNotifications} onCheckedChange={(e)=>setEditingStudent({...editingStudent,sendNotifications:e as boolean})} className="mt-2" />
              <span className="text-sm ml-2 gap-x-1 inline-block text-semibold">Send email notification to parent</span>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-2 text-white bg-green-500 rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="px-6 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal for deletion confirmation */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => studentToDelete && handleDelete(studentToDelete)}
        title="Delete Student"
        description="Are you sure you want to delete this student? This action cannot be undone."
      />
    </div>
  )
}
