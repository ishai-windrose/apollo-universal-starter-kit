package services.publisher.monix

import javax.inject.{Inject, Singleton}
import monix.execution.Scheduler
import monix.reactive.subjects.ConcurrentSubject
import org.reactivestreams.Publisher
import services.publisher.PublisherService
import util.Logger

@Singleton
class MonixPublisherServiceImpl[T] @Inject()(implicit val scheduler: Scheduler) extends PublisherService[T] with Logger {

  lazy val sourceCounter: ConcurrentSubject[T, T] = ConcurrentSubject.publish[T]

  override def getPublisher: Publisher[T] = sourceCounter.toReactivePublisher[T]

  override def publish(event: T) = {
    log.info(s"Event [$event] is publishing...")
    sourceCounter.onNext(event)
  }
}