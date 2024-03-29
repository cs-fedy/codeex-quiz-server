import Either from 'src/utils/either'
import {
  InvalidSubQuiz,
  PreviousSubQuizNotCompleted,
  QuizNotAvailable,
  QuizNotEnrolled,
  QuizNotFound,
  SubQuizAlreadyStarted,
  SubQuizNotFound,
  SubQuizNotStarted,
} from 'src/utils/types'
import EnrolledMultipleChoiceQuestionDTO from './enrolled-multiple-choice-questions.dto'

export type StartSubQuizArgs = {
  userId: string
  quizId: string
  subQuizId: string
}

export type StartSubQuizResult = Either<
  | QuizNotFound
  | QuizNotAvailable
  | QuizNotEnrolled
  | SubQuizNotFound
  | InvalidSubQuiz
  | SubQuizAlreadyStarted
  | PreviousSubQuizNotCompleted,
  EnrolledMultipleChoiceQuestionDTO
>

export type CompleteSubQuizArgs = {
  userId: string
  quizId: string
  subQuizId: string
  userAnswer: Array<number>
}

type CompleteSubQuizPayload =
  | { answerCorrectness: true }
  | {
      answerCorrectness: false
      userAnswer: Array<number>
      expectedAnswer: Array<number>
      points: number
      completionTime: number
    }

export type CompleteSubQuizResult = Either<
  QuizNotFound | QuizNotAvailable | SubQuizNotFound | SubQuizNotStarted,
  CompleteSubQuizPayload
>

export type GetEnrolledSubQuizArgs = {
  userId: string
  quizId: string
  subQuizId: string
}

export type GetEnrolledSubQuizResult = Either<
  QuizNotFound | QuizNotAvailable | InvalidSubQuiz | SubQuizNotFound | SubQuizNotStarted,
  EnrolledMultipleChoiceQuestionDTO
>

export default interface IEnrolledMultipleChoiceQuestionService {
  startSubQuiz(args: StartSubQuizArgs): Promise<StartSubQuizResult>
  completeSubQuiz(args: CompleteSubQuizArgs): Promise<CompleteSubQuizResult>
  getEnrolledSubQuiz(args: GetEnrolledSubQuizArgs): Promise<GetEnrolledSubQuizResult>
}
