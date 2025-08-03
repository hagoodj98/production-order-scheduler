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


export const addPendingJobToArrays = (job: TimeJobSlot) => {
  
  const exists = pendingJobs.some(p =>
    p.id.row === job.id.row && p.id.column === job.id.column
  );

  if (!exists) {
    pendingJobs.push(job);
  } else {
     //In order to be able to go into a pending cell with its previous entries, I created an array containing the cell id, resource name and timeslot. If the cell already exist in the array simply dont add it but instead update the existing cells' properties. That way we can go into any cell and see our last input before deciding to submit the job.
      const editExistingPendingJob = pendingJobs.findIndex(pendingJob => pendingJob.id.row === job.id.row && pendingJob.id.column === job.id.column);
            if (editExistingPendingJob !== -1) {
                pendingJobs[editExistingPendingJob].resource = job.resource;
                pendingJobs[editExistingPendingJob].timeslot = job.timeslot;
            }
   
  }
};

export const getPendingJobs = () => pendingJobs;
