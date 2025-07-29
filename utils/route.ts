import { TimeJobSlot } from "@/app/components/types";

let latestJob = {
    id: {
        row: '', 
        column: ''
    },
    timeSlot: '',
    resource: '' 
};

export const setLatestJob = (job: typeof latestJob) => {
    console.log(job, 'this is in setLastJob');
    latestJob = job
};

export const getLatestJob = () =>  latestJob;

let pendingJobs: TimeJobSlot[] = [];

export const addPendingJob = (job: TimeJobSlot) => {
  
  const exists = pendingJobs.some(p =>
    p.id.row === job.id.row && p.id.column === job.id.column
  );

  if (!exists) {
    pendingJobs.push(job);
  }
};

export const getPendingJobs = () => pendingJobs;
