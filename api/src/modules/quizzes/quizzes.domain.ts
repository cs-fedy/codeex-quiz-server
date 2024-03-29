export default class Quiz {
  constructor(
    public quizId: string,
    public title: string,
    public description: string,
    public coverImageURL: string,
    public isVisible: boolean,
    public isApproved: boolean,
    public creator: string,
    public subQuizzesCount: number,
    public points: number,
    public dificulity: number,
  ) {}
}
