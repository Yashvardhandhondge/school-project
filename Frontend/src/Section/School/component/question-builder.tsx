import React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'
import { Question } from '@/lib/types'

type QuestionBuilderProps = {
  question: Question
  onUpdate: (question: Question) => void
  onRemove: (id: string) => void
}

export function QuestionBuilder({ question, onUpdate, onRemove }: QuestionBuilderProps) {
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...question, text: e.target.value })
  }

  const handleTypeChange = (value: 'text' | 'select') => {
    onUpdate({ ...question, type: value, options: value === 'select' ? [] : undefined })
  }

  const handleCompulsoryChange = (checked: boolean) => {
    onUpdate({ ...question, isCompulsory: checked })
  }

  const handleOptionChange = (index: number, value: string) => {
    if (question.options) {
      const newOptions = [...question.options]
      newOptions[index] = {value, points: 0}
      onUpdate({ ...question, options: newOptions })
    }
  }

  const addOption = () => {
    if (question.options) {
      onUpdate({ ...question, options: [...question.options, {value: '', points: 0}] })
    }
  }

  const removeOption = (index: number) => {
    if (question.options && question.options.length > 1) {
      const newOptions = question.options.filter((_, i) => i !== index)
      onUpdate({ ...question, options: newOptions })
    }
  }

  return (
    <div className="border p-4 rounded-md space-y-4">
      <Input
        type="text"
        value={question.text}
        onChange={handleTextChange}
        placeholder="Enter question text"
        className="w-full"
      />
      <div className="flex items-center space-x-4">
        <Select onValueChange={handleTypeChange} value={question.type}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Question type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="select">Select</SelectItem>
            <SelectItem value="number">Number</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Switch
            id={`compulsory-${question.id}`}
            checked={question.isCompulsory}
            onCheckedChange={handleCompulsoryChange}
          />
          <Label htmlFor={`compulsory-${question.id}`}>Compulsory</Label>
        </div>
        {(question.type === 'number' || question.type === 'text') && (
          <div className="flex items-center space-x-2">
            <Label htmlFor={`points-${question.id}`}>Points</Label>
            <Input
              type="number"
              value={question.points}
              onChange={(e) => onUpdate({ ...question, points: parseInt(e.target.value, 10) || 0 })}
              placeholder="Enter points"
              className="w-full"
            />
          </div>
        )}
      </div>
      {question.type === 'select' && question.options && (
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                type="text"
                value={option.value}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                className="flex-grow"
              />
              <Input
                 type="number"
                 value={option.points}
                 onChange={(e) => onUpdate({ ...question, options: question.options?.map((o, i) => i === index ? {...o, points: parseInt(e.target.value, 10) || 0} : o) })}
                 placeholder="Enter points"
                className="w-full"
              />

              <Button onClick={() => removeOption(index)} variant="destructive" size="sm">
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button onClick={addOption} variant="outline" size="sm">
            Add Option
          </Button>
        </div>
      )}
      <Button onClick={() => onRemove(question.id)} variant="destructive">
        Remove Question
      </Button>
    </div>
  )
}