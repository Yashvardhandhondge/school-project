import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { QuestionBuilder } from '@/Section/School/component/question-builder'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { createForm } from '@/api'
import { toast } from '@/hooks/use-toast'
import { Question } from '@/lib/types'

type FormType = 'AwardPoints' | 'Feedback' | 'PointWithdraw' | 'DeductPoints'


export default function FormBuilder() {
  const [formName, setFormName] = useState('')
  const [formType, setFormType] = useState<FormType>('AwardPoints')
  const [questions, setQuestions] = useState<Question[]>([])

const clearForm = () => {
  setFormName('')
  setFormType('AwardPoints')
  setQuestions([])
}

  const handleCreateForm = async () => {
    console.log(JSON.stringify({formName, formType, questions}))
    const response = await createForm({formName, formType, questions},localStorage.getItem('token')!)
    if(response.error){
      toast({
        title: 'Error',
        description: response.error,
        variant: 'destructive'
      })   
    }else{
      toast({
        title: 'Success',
        description: 'Form Created Successfully'
      })
      clearForm()
    }
  }

  const addQuestion = (question: Question) => {
    setQuestions([...questions, question])
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestion = (updatedQuestion: Question) => {
    setQuestions(questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q))
  }

  return (
    <div className="max-w-4xl p-4 space-y-6 bg-white rounded-lg shadow-md mx-auto mt-12">
      <h1 className="text-2xl font-bold">Form Builder</h1>
      <div>
            <Label htmlFor="formName">Form Name</Label>
            <Input
              id="formName"
              name="formName"
              value={formName}
              placeholder='Enter Form Name'
              onChange={(e)=>setFormName(e.target.value)}
              required
            />
      </div>

      <div>
        <label htmlFor="formType" className="block text-sm font-medium text-gray-700 mb-1">
          Select Form Type
        </label>
        <Select onValueChange={(value: FormType) => setFormType(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select form type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AwardPoints">Award Points</SelectItem>
            <SelectItem value="Feedback">Feedback</SelectItem>
            <SelectItem value="PointWithdraw">Point Withdraw</SelectItem>
            <SelectItem value="DeductPoints">Deduct Points</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        {questions.map((question) => (
          <QuestionBuilder
            key={question.id}
            question={question}
            onUpdate={updateQuestion}
            onRemove={removeQuestion}
          />
        ))}
      </div>
      <Button
      variant='outline'
       onClick={() => addQuestion({
        id: Date.now().toString(),
        text: '',
        type: 'text',
        isCompulsory: false,
        points: 0
      })}>
        Add Question
      </Button>
      <Button className='w-full' onClick={handleCreateForm}>Create Form</Button>
    </div>
  )
}