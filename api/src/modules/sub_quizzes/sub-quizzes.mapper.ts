import { Injectable } from '@nestjs/common'
import IMapper from 'src/common/mapper'
import { default as SubQuiz, default as SubQuizDTO } from './sub-quizzes.domain'

@Injectable()
export default class SubQuizMapper implements IMapper<SubQuiz, SubQuizDTO> {
  toDomain(raw: any): SubQuiz {
    return new SubQuiz(
      raw._id,
      raw.__type,
      raw.quizId,
      raw.title,
      raw.points,
      raw.timeLimit,
      raw.dificulity,
      raw.coverImageURL,
      raw.prevSubQuiz,
      raw.nextSubQuiz,
    )
  }

  toPersistence(domain: SubQuiz): any {
    return {
      _id: domain.subQuizId,
      __type: domain.type,
      quizId: domain.quizId,
      title: domain.title,
      timeLimit: domain.timeLimit,
      dificulity: domain.dificulity,
      coverImageURL: domain.coverImageURL,
      prevSubQuiz: domain.prevSubQuiz,
      nextSubQuiz: domain.nextSubQuiz,
    }
  }

  toDTO(domain: SubQuiz): SubQuizDTO {
    return new SubQuizDTO(
      domain.subQuizId,
      domain.type,
      domain.quizId,
      domain.title,
      domain.points,
      domain.timeLimit,
      domain.dificulity,
      domain.coverImageURL,
      domain.prevSubQuiz,
      domain.nextSubQuiz,
    )
  }
}
