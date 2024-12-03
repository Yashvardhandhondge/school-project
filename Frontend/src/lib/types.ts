export type FormType = 'AwardPoints' | 'DeductPoints' | 'Feedback' | 'PointWithdraw'
export type PointsType = 'Award' | 'Deduct' | 'None'
export type Question = {
    id: string
    text: string
    type: string
    isCompulsory: boolean
    options?: {value: string, points: number}[],
    maxPoints: number,
    pointsType: PointsType
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
    [key: string]: {answer: string, points: number}
}

export type AnswerTypeArray = {
  questionId: string,
  answer: string,
}[]
  