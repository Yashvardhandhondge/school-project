export type FormType = 'AwardPoints' | 'DeductPoints' | 'Feedback' | 'PointWithdraw'
export type Question = {
    id: string
    text: string
    type: string
    isCompulsory: boolean
    options?: {value: string, points: number}[],
    points: number
  }
  
export type Form = {
    _id: string
    formName: string
    formType: string
    questions: Question[]
    createdAt: string
    schoolId: string | null
  }

export type AnswerType = {
    [key: string]: {answer: string, isAward: boolean, points: number}
}

export type AnswerTypeArray = {
  questionId: string,
  answer: string,
  isAward: boolean
}[]
  