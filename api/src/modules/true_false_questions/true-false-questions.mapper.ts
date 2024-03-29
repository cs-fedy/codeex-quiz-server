import { Injectable } from '@nestjs/common'
import IMapper from 'src/common/mapper'
import TrueFalseQuestion from './true-false-question.domain'
import TrueFalseQuestionDTO from './true-false-questions.dto'

@Injectable()
export default class TrueFalseQuestionMapper
  implements IMapper<TrueFalseQuestion, TrueFalseQuestionDTO>
{
  toDomain(raw: any): TrueFalseQuestion {
    return new TrueFalseQuestion(
      raw._id,
      raw.__type,
      raw.quizId,
      raw.title,
      raw.idealOption,
      raw.points,
      raw.timeLimit,
      raw.dificulity,
      raw.coverImageURL,
      raw.prevSubQuizId,
      raw.nextSubQuizId,
    )
  }

  toPersistence(domain: TrueFalseQuestion): any {
    return {
      _id: domain.subQuizId,
      __type: domain.type,
      quizId: domain.quizId,
      title: domain.title,
      idealOption: domain.idealOption,
      points: domain.points,
      timeLimit: domain.timeLimit,
      dificulity: domain.dificulity,
      coverImageURL: domain.coverImageURL,
      prevSubQuizId: domain.prevSubQuizId,
      nextSubQuizId: domain.nextSubQuizId,
    }
  }

  toDTO(domain: TrueFalseQuestion): TrueFalseQuestionDTO {
    return new TrueFalseQuestionDTO(
      domain.subQuizId,
      domain.type,
      domain.quizId,
      domain.title,
      domain.idealOption,
      domain.points,
      domain.timeLimit,
      domain.dificulity,
      domain.coverImageURL,
      domain.prevSubQuizId,
      domain.nextSubQuizId,
    )
  }
}
