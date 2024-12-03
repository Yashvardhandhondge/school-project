
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AnswerType, Form, Question } from '@/lib/types'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'



type FormSubmissionProps = {
  form: Form
  onSubmit: (answers: AnswerType) => void
}

export function FormSubmission({ form, onSubmit }: FormSubmissionProps) {
  const [answers, setAnswers] = useState<AnswerType>({})
  const [isFormValid, setIsFormValid] = useState(false)

  useEffect(() => {
    const allCompulsoryQuestionsAnswered = form.questions
      .filter(q => q.isCompulsory)
      .every(q => {
        const answer = answers[q.id]
        return answer !== undefined && answer.answer !== '' && (Array.isArray(answer.answer) ? answer.answer.length > 0 : true)
      })
    setIsFormValid(allCompulsoryQuestionsAnswered)
  }, [answers, form.questions])

  const handleInputChange = (questionId: string, value: {answer: string, isAward: boolean, points: number}) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(answers)
  }

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'text':
        return (
          <Input
            type="text"
            value={answers[question.id]?.answer as string || ''}
            onChange={(e) => handleInputChange(question.id, {answer: e.target.value, isAward: answers[question.id]?.isAward || false, points: question.points})}
            required={question.isCompulsory}
          />
        )
      
      case 'number':
        return (
          <Input
            type="number"
            value={answers[question.id]?.answer as string || ''}
            onChange={(e) => handleInputChange(question.id, {answer: e.target.value, isAward: answers[question.id]?.isAward || false, points: question.points})}
            required={question.isCompulsory}
          />
        )
      
      case 'select':
        return (
          <Select
            value={answers[question.id]?.answer as string || ''}
            onValueChange={(value) => handleInputChange(question.id, {answer: value, isAward: answers[question.id]?.isAward || false, points: question.options?.find(o => o.value === value)?.points || 0})}
            required={question.isCompulsory}
          > 
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option, index) => (
                <SelectItem key={index} value={option.value}>
                  {option.value} {option.points ? <span className="text-muted-foreground">({option.points} Points)</span> : ''}
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
        <div className="space-y-6">
          {form.questions.map((question, index) => (
            <div key={question.id} className="border-b pb-4 px-2">
              <h3 className="font-medium mb-2">
                {index + 1}. {question.text} {
                  question.type === 'select' ? <span className="text-muted-foreground"></span> : <span className="text-muted-foreground">({question.points} Points)</span>
                }
                {question.isCompulsory && <span className="text-red-500 ml-1">*</span>}
              </h3>
              {renderQuestion(question)}
              <div>
                <RadioGroup
                  value={answers[question.id]?.isAward || false ? 'Award' : 'Deduct'}
                  onValueChange={(value) => handleInputChange(question.id, {answer: answers[question.id]?.answer as string, isAward: value === 'Award', points: answers[question.id]?.points || 0})}
                  className='flex flex-row gap-2 my-2'
                >
                  <RadioGroupItem  value="Award" id="r1" />
                  <Label htmlFor="r1">Award</Label>
                  <RadioGroupItem value="Deduct" id="r2" />
                  <Label htmlFor="r2">Deduct</Label>
                </RadioGroup>
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

