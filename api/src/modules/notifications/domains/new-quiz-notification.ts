import { NotificationStatus } from 'src/utils/constants'
import Notification from './notifications'

export default class NewQuizNotification implements Notification {
  constructor(
    public notificationId: string,
    public type: string,
    public emitter: string,
    public status: NotificationStatus,
    public emittedAt: Date,
    public quizId: string,
    public decision?: string,
  ) {}
}
