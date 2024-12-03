
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AnswerType, Form, Question } from '@/lib/types'
import { getStudents } from '@/api'




type FormSubmissionProps = {
  form: Form
  onSubmit: (answers: AnswerType, submittedFor: string) => void
}

export function FormSubmission({ form, onSubmit }: FormSubmissionProps) {
  const [submittedFor, setSubmittedFor] = useState("")
  const [answers, setAnswers] = useState<AnswerType>({})
  const [isFormValid, setIsFormValid] = useState(false)
  const [student, setStudent] = useState<any>([])

  useEffect(() => {
    const allCompulsoryQuestionsAnswered = form.questions
      .filter(q => q.isCompulsory)
      .every(q => {
        const answer = answers[q.id]
        return answer !== undefined && answer.answer !== '' && (Array.isArray(answer.answer) ? answer.answer.length > 0 : true)
      })
    setIsFormValid(allCompulsoryQuestionsAnswered)
  }, [answers, form.questions])

  useEffect(() => {
    const getStudent = async () => {
      const token = localStorage.getItem("token") || ""
      const response = await getStudents(token)
      setStudent(response.students)
    }
    getStudent()
  }, [])

  const handleInputChange = (questionId: string, value: {answer: string, points: number}) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(answers, submittedFor)
  }

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            type="text"
            value={answers[question.id]?.answer as string || ''}
            onChange={(e) => handleInputChange(question.id, {answer: e.target.value, points: question.maxPoints})}
            required={question.isCompulsory}
          />
        )
      
      case 'number':
        return (
          <Input
            type="number"
            value={answers[question.id]?.answer as string || ''}
            onChange={(e) => handleInputChange(question.id, {answer: e.target.value, points: question.pointsType !== 'Deduct' ? parseInt(e.target.value) : parseInt(e.target.value) * -1})}
            required={question.isCompulsory}
            max={question.maxPoints}
            min={0}
          />
        )
      
      case 'select':
        
        return (
          <Select
            value={answers[question.id]?.answer as string || ''}
            onValueChange={(value) => {
              const selectedOption = question.options?.find(o => o.value === value);
              const points = selectedOption ? selectedOption.points : 0;
              handleInputChange(question.id, {
                answer: value,
                points: question.pointsType !== 'Deduct' ? points : points * -1,
              });
            }}
            required={question.isCompulsory}
          > 
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, index) => (
                <SelectItem key={index} value={option.value}>
                  {option.value} {option.points ? <span className="text-muted-foreground">({question.pointsType === 'Award' ? '+' : '-'} {option.points} Points)</span> : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto p-3 bg-white rounded-lg shadow-md">
      <div>
        <h1 className="text-2xl font-bold">{form.formName}</h1>
        <p className="text-muted-foreground">Form Type: {form.formType}</p>
      </div>
      <ScrollArea className="h-[43vh] pr-4">
        <div className="space-y-6 px-2">
          <div>
            <p>Student:</p>
            <Select value={submittedFor} onValueChange={(value) => setSubmittedFor(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a student" />
              </SelectTrigger>
              <SelectContent>
                {student && student.map((student: any) => (
                  <SelectItem key={student._id} value={student._id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {form.questions.map((question, index) => (
            <div key={question.id} className="border-b pb-4 ">
              
              <h3 className="font-medium mb-2">
                {index + 1}. {question.text} {
                  question.type === 'select' || question.pointsType === 'None' ? <span className="text-muted-foreground"></span> : <span className="text-muted-foreground">(Upto {question.maxPoints} Points)</span>
                }
                {
                  question.pointsType === 'Award' ? <span className="text-green-500 ml-1">Award</span> : question.pointsType === 'Deduct' ? <span className="text-red-500 ml-1">Deduct</span> : ''
                }
                {question.isCompulsory && <span className="text-red-500 ml-1">*</span>}
              </h3>
              {renderQuestion(question)}
              <div>
              </div>
              <div>
             </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <Button type="submit" disabled={!isFormValid}>Submit</Button>
    </form>
  )
}

