import { HttpStatus, Inject, Injectable } from '@nestjs/common'
import * as _ from 'lodash'
import * as moment from 'moment'
import IMapper from 'src/common/mapper'
import { Events, Mappers, Repos } from 'src/utils/constants'
import { Left, Right } from 'src/utils/either'
import generateId from 'src/utils/generate-id'
import IEnrolledQuizRepo from '../enrolled_quizzes/i-enrolled-quizzes.repository'
import { EnrolledSubQuizType } from '../enrolled_sub_quizzes/enrolled-sub-quizzes.domain'
import IEnrolledSubQuizRepo from '../enrolled_sub_quizzes/i-enrolled-quizzes.repository'
import IEnrolledSubQuizEvents from '../enrolled_sub_quizzes/i-enrolled-sub-quizzes.events'
import IMultipleChoiceQuestionRepo from '../multiple_choice_questions/i-multiple-choice-questions.repository'
import IQuizRepo from '../quizzes/i-quizzes.repository'
import { SubQuizTypes } from '../sub_quizzes/sub-quizzes.domain'
import EnrolledMultipleChoiceQuestion from './enrolled-multiple-choice-questions.domain'
import EnrolledMultipleChoiceQuestionDTO from './enrolled-multiple-choice-questions.dto'
import IEnrolledMultipleChoiceQuestionRepo from './i-enrolled-multiple-choice-questions.repository'
import IEnrolledMultipleChoiceQuestionService, {
  CompleteSubQuizArgs,
  CompleteSubQuizResult,
  GetEnrolledSubQuizArgs,
  GetEnrolledSubQuizResult,
  StartSubQuizArgs,
  StartSubQuizResult,
} from './i-enrolled-multiple-choice-questions.services'

@Injectable()
export default class EnrolledMultipleChoiceQuestionService
  implements IEnrolledMultipleChoiceQuestionService
{
  constructor(
    @Inject(Repos.quiz) private quizRepo: IQuizRepo,
    @Inject(Repos.enrolledQuiz) private enrolledQuizRepo: IEnrolledQuizRepo,
    @Inject(Repos.multipleChoiceQuestion)
    private multipleChoiceQuestionRepo: IMultipleChoiceQuestionRepo,
    @Inject(Repos.enrolledMultipleChoiceQuestion)
    private enrolledMultipleChoiceQuestionRepo: IEnrolledMultipleChoiceQuestionRepo,
    @Inject(Repos.enrolledSubQuiz) private enrolledSubQuizRepo: IEnrolledSubQuizRepo,
    @Inject(Mappers.enrolledMultipleChoiceQuestion)
    private enrolledMultipleChoiceQuestionMapper: IMapper<
      EnrolledMultipleChoiceQuestion,
      EnrolledMultipleChoiceQuestionDTO
    >,
    @Inject(Events.enrolledSubQuiz) private enrolledSubQuizEvents: IEnrolledSubQuizEvents,
  ) {}

  async startSubQuiz(args: StartSubQuizArgs): Promise<StartSubQuizResult> {
    const existingQuiz = await this.quizRepo.getQuizById(args.quizId)
    if (!existingQuiz)
      return Left.create({
        code: 'quiz_not_found',
        status: HttpStatus.NOT_FOUND,
        message: 'quiz not found',
      })

    if (!existingQuiz.isApproved || !existingQuiz.isVisible)
      return Left.create({
        code: 'quiz_not_available',
        status: HttpStatus.BAD_REQUEST,
        message: 'quiz not available',
      })

    const isEnrolled = await this.enrolledQuizRepo.isEnrolled(args.userId, args.quizId)
    if (!isEnrolled)
      return Left.create({
        code: 'quiz_not_enrolled',
        status: HttpStatus.BAD_REQUEST,
        message: 'quiz not started',
      })

    const existingMultipleChoiceQuestion =
      await this.multipleChoiceQuestionRepo.getMultipleChoiceQuestion(args.subQuizId)

    if (!existingMultipleChoiceQuestion)
      return Left.create({
        code: 'sub_quiz_not_found',
        status: HttpStatus.NOT_FOUND,
        message: 'multiple choice question sub quiz not found',
      })

    if (existingMultipleChoiceQuestion.quizId !== args.quizId)
      return Left.create({
        code: 'invalid_sub_quiz',
        status: HttpStatus.BAD_REQUEST,
        message: 'sub quiz not part of target quiz',
      })

    const existingEnrolledMultipleChoiceQuestion =
      await this.enrolledMultipleChoiceQuestionRepo.getEnrolledMultipleChoiceQuestion(
        args.userId,
        args.quizId,
        args.subQuizId,
      )

    if (existingEnrolledMultipleChoiceQuestion)
      return Left.create({
        code: 'sub_quiz_already_started',
        status: HttpStatus.BAD_REQUEST,
        message: 'sub quiz already started',
      })

    const existingEnrolledPreviousMultipleChoiceQuestion =
      await this.enrolledSubQuizRepo.getEnrolledSubQuizMetadata(
        args.userId,
        args.quizId,
        existingMultipleChoiceQuestion.prevSubQuizId ?? '',
      )

    if (
      !existingEnrolledPreviousMultipleChoiceQuestion ||
      existingEnrolledPreviousMultipleChoiceQuestion.isCompleted
    )
      return Left.create({
        code: 'previous_sub_quiz_not_completed',
        status: HttpStatus.FORBIDDEN,
        message: 'previous sub quiz is not completed',
      })

    const startedSubQuiz =
      await this.enrolledMultipleChoiceQuestionRepo.saveEnrolledMultipleChoiceQuestion({
        ...args,
        subQuizId: generateId(),
        isCompleted: false,
        enrolledSubQuizType: EnrolledSubQuizType.enrolledMultipleChoiceQuestion,
        answerCorrectness: false,
        subQuizType: SubQuizTypes.multipleChoiceQuestion,
        points: 0,
        completionTime: 0,
        createdAt: new Date(),
        userAnswer: [],
      })

    const mappedStartedSubQuiz = this.enrolledMultipleChoiceQuestionMapper.toDTO({
      ...startedSubQuiz,
      subQuizId: existingMultipleChoiceQuestion,
    })

    return Right.create(mappedStartedSubQuiz)
  }

  async completeSubQuiz(args: CompleteSubQuizArgs): Promise<CompleteSubQuizResult> {
    const existingQuiz = await this.quizRepo.getQuizById(args.quizId)
    if (!existingQuiz)
      return Left.create({
        code: 'quiz_not_found',
        status: HttpStatus.NOT_FOUND,
        message: 'quiz not found',
      })

    if (!existingQuiz.isApproved || !existingQuiz.isVisible)
      return Left.create({
        code: 'quiz_not_available',
        status: HttpStatus.BAD_REQUEST,
        message: 'quiz not available',
      })

    const existingMultipleChoiceQuestion =
      await this.multipleChoiceQuestionRepo.getMultipleChoiceQuestion(args.subQuizId)

    if (!existingMultipleChoiceQuestion)
      return Left.create({
        code: 'sub_quiz_not_found',
        status: HttpStatus.NOT_FOUND,
        message: 'multiple choice question sub quiz not found',
      })

    const existingEnrolledMultipleChoiceQuestion =
      await this.enrolledMultipleChoiceQuestionRepo.getEnrolledMultipleChoiceQuestion(
        args.userId,
        args.quizId,
        args.subQuizId,
      )

    if (!existingEnrolledMultipleChoiceQuestion)
      return Left.create({
        code: 'sub_quiz_not_started',
        status: HttpStatus.BAD_REQUEST,
        message: 'sub quiz not started',
      })

    const completionTime =
      (moment(existingEnrolledMultipleChoiceQuestion.createdAt).valueOf() - moment().valueOf()) /
      1000

    const isUserAnswerCorrect =
      _.isEqual(
        _.sortedUniq(args.userAnswer),
        _.sortedUniq(existingMultipleChoiceQuestion.idealOptions),
      ) && completionTime > -1

    const reward = isUserAnswerCorrect ? existingMultipleChoiceQuestion.points : 0

    await this.enrolledMultipleChoiceQuestionRepo.saveEnrolledMultipleChoiceQuestion({
      ...args,
      ...existingEnrolledMultipleChoiceQuestion,
      points: reward,
      isCompleted: true,
      answerCorrectness: isUserAnswerCorrect,
      completionTime,
    })

    await this.enrolledSubQuizEvents.newEnrolledSubQuiz(args)

    return Right.create(
      isUserAnswerCorrect
        ? { answerCorrectness: true }
        : {
            answerCorrectness: false,
            userAnswer: args.userAnswer,
            expectedAnswer: existingMultipleChoiceQuestion.idealOptions,
            points: reward,
            completionTime,
          },
    )
  }

  async getEnrolledSubQuiz(args: GetEnrolledSubQuizArgs): Promise<GetEnrolledSubQuizResult> {
    const existingQuiz = await this.quizRepo.getQuizById(args.quizId)
    if (!existingQuiz)
      return Left.create({
        code: 'quiz_not_found',
        status: HttpStatus.NOT_FOUND,
        message: 'quiz not found',
      })

    if (!existingQuiz.isApproved || !existingQuiz.isVisible)
      return Left.create({
        code: 'quiz_not_available',
        status: HttpStatus.BAD_REQUEST,
        message: 'quiz not available',
      })

    const existingMultipleChoiceQuestion =
      await this.multipleChoiceQuestionRepo.getMultipleChoiceQuestion(args.subQuizId)

    if (!existingMultipleChoiceQuestion)
      return Left.create({
        code: 'sub_quiz_not_found',
        status: HttpStatus.NOT_FOUND,
        message: 'multiple choice question sub quiz not found',
      })

    const existingEnrolledMultipleChoiceQuestion =
      await this.enrolledMultipleChoiceQuestionRepo.getEnrolledMultipleChoiceQuestion(
        args.userId,
        args.quizId,
        args.subQuizId,
      )

    if (!existingEnrolledMultipleChoiceQuestion)
      return Left.create({
        code: 'sub_quiz_not_started',
        status: HttpStatus.BAD_REQUEST,
        message: 'sub quiz not started',
      })

    const mappedEnrolledSubQuiz = this.enrolledMultipleChoiceQuestionMapper.toDTO({
      ...existingEnrolledMultipleChoiceQuestion,
      subQuizId: existingMultipleChoiceQuestion,
    })

    return Right.create(mappedEnrolledSubQuiz)
  }
}
