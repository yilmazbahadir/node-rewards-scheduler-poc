import { Queue, QueueEvents, QueueScheduler } from "bullmq";
import moment from "moment";

export type Repeat = {
  cronExp?: string;
  every?: number;
};

export class ScheduledJob {
  constructor(
    public name: string,
    public enabled: boolean,
    public repeat: Repeat
  ) {}
}
export class Scheduler {
  schedule(job: ScheduledJob) {
    const queue = new Queue(job.name, { defaultJobOptions: {} });
    const myQueueScheduler = new QueueScheduler(job.name);
    console.log("Scheduling job:" + JSON.stringify(job));
    queue.add(
      job.name,
      {
        time: moment().format("MM-DD-YY HH:mm:ss:SSS"),
        fromPid: process.pid,
      },
      {
        repeat: {
          ...(job.repeat.every && { every: job.repeat.every }),
          ...(job.repeat.cronExp && { cron: job.repeat.cronExp }),
        },
      }
    );
  }
}
