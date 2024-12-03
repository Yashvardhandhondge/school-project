import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FormDetails } from '@/Section/School/component/form-details'
import { CalendarIcon, ClipboardIcon, StarIcon, MinusCircleIcon } from 'lucide-react'
import { getForms } from '@/api'
import { toast } from '@/hooks/use-toast'
import { Form, Question } from '@/lib/types'


export default function ViewForms() {
  const [forms, setForms] = useState<Form[]>([])
  const [selectedForm, setSelectedForm] = useState<Form | null>(null)

  useEffect(() => {
    // Fetch forms from your API
    const fetchForms = async () => {
      try {
        const data = await getForms(localStorage.getItem('token')!)
        if (data.error) {
          toast({
            title: 'Error',
            description: data.error,
            variant: 'destructive'
          })
        } else {
          setForms(data.forms)
        }
      } catch (error) {
        console.error('Error fetching forms:', error)
      }
    }

    fetchForms()
  }, [])

  const getFormTypeIcon = (formType: string) => {
    switch (formType) {
      case 'AwardPoints':
        return <StarIcon className="h-6 w-6 text-yellow-500" />
      case 'Feedback':
        return <ClipboardIcon className="h-6 w-6 text-blue-500" />
      case 'PointWithdraw':
        return <MinusCircleIcon className="h-6 w-6 text-red-500" />
      case 'DeductPoints':
        return <MinusCircleIcon className="h-6 w-6 text-orange-500" />
      default:
        return <ClipboardIcon className="h-6 w-6 text-gray-500" />
    }
  }

  const calculateTotalPoints = (questions: Question[]) =>
  {
    if(questions.length === 0) return 0
    let sum = questions.reduce((sum, question) => sum + (question.maxPoints || 0), 0) 
     questions.forEach(question => {
      if(question.type == 'select'){
        question.options?.forEach(option => {
          sum += option.points
        })
      }
    })
    return sum
  }


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Forms</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {forms.map((form) => (
          <Card key={form._id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{form.formName}</CardTitle>
              {getFormTypeIcon(form.formType)}
            </CardHeader>
            <CardContent>
              <CardDescription>{form.formType}</CardDescription>
              <div className="flex items-center pt-2 text-xs text-muted-foreground">
                Total Points: {calculateTotalPoints(form.questions)}
              </div>
              <div className="flex items-center pt-4">
                <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
                <span className="text-xs text-muted-foreground">
                  {new Date(form.createdAt).toLocaleDateString()}
                </span>
              </div>
              <Button
                className="mt-4 w-full"
                onClick={() => setSelectedForm(form)}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedForm && (
        <FormDetails form={selectedForm} onClose={() => setSelectedForm(null)} />
      )}
    </div>
  )
}