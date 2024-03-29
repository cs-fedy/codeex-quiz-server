import Either from 'src/utils/either'
import {
  CollectionNotAvailable,
  CollectionNotFound,
  CollectionQuizExist,
  NotCollectionOwner,
  NotQuizOwner,
  QuizNotFound,
} from 'src/utils/types'
import QuizDTO from '../quizzes/quizzes.dto'
import CollectionQuizDTO from './collection-quizzes.dto'

export type AddQuizArgs = {
  userId: string
  quizId: string
  collectionId: string
}

export type AddQuizResult = Either<
  QuizNotFound | CollectionNotFound | NotCollectionOwner | CollectionQuizExist | NotQuizOwner,
  CollectionQuizDTO
>

export type ListCollectionQuizzesArgs = {
  userId: string
  collectionId: string
}

export type ListCollectionQuizzesResult = Either<
  CollectionNotFound | CollectionNotAvailable,
  Array<QuizDTO>
>

export default interface ICollectionQuizService {
  addQuiz(args: AddQuizArgs): Promise<AddQuizResult>
  listCollectionQuizzes(args: ListCollectionQuizzesArgs): Promise<ListCollectionQuizzesResult>
}
