import { ScheduledJob, Scheduler } from "./Scheduler";
import { Worker } from "bullmq";
import moment from "moment";

const argsObj: any = (() => {
  const args = {};
  console.log("Args:" + JSON.stringify(process.argv.slice(3)));
  process.argv.slice(3).map((element) => {
    const matches = element.match("([a-zA-Z0-9]+)=(.*)");
    if (matches) {
      args[matches[1]] = matches[2].replace(/^['"]/, "").replace(/['"]$/, "");
    }
  });
  return args;
})();

const taskWorker = (jobName: string, taskNames = "all") =>
  new Worker(
    jobName,
    async (job) =>
      new Promise((resolve) => {
        const timeout = Math.ceil(Math.random() * 30_000);
        setTimeout(() => {
          console.log(
            `${
              job.name
            }-worker running tasks[${taskNames}], data[${JSON.stringify(
              job.data
            )}], processed on:${moment(job.processedOn).format(
              "MM-DD-YY HH:mm:ss:SSS"
            )}, took ${timeout} ms`
          );
          resolve(true);
        }, timeout);
      })
  );

const scheduler = new Scheduler();
scheduler.schedule(
  new ScheduledJob("nodeTestingJob", true, { cronExp: "0/2 * * * *" })
);
scheduler.schedule(
  new ScheduledJob("enrolJob", true, { cronExp: "0/3 * * * *" })
);
scheduler.schedule(new ScheduledJob("payoutJob", true, { every: 5000 }));
taskWorker(
  "nodeTestingJob",
  "ComputingPower, Bandwidth, Ping, Responsiveness, ChainHeigt, ChainPart, NodeBalance, NodeVersion"
);
taskWorker("enrolJob");
taskWorker("payoutJob");
