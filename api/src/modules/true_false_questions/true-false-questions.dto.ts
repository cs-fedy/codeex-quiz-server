import { SubQuizTypes } from '../sub_quizzes/sub-quizzes.domain'
import SubQuizDTO from '../sub_quizzes/sub-quizzes.dto'

export default class TrueFalseQuestionDTO implements SubQuizDTO {
  constructor(
    public subQuizId: string,
    public type: SubQuizTypes,
    public quizId: string,
    public title: string,
    public idealOption: boolean,
    public points: number,
    public timeLimit: number,
    public dificulity: number,
    public coverImageURL?: string,
  ) {}
}
