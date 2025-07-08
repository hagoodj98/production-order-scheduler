let latestJob = {timeSlot: '', resource: '' }

export const setLatestJob = (job: typeof latestJob) => {
    console.log(job, 'this is in setLastJob');
    latestJob = job
};

export const getLatestJob = () =>  latestJob;
