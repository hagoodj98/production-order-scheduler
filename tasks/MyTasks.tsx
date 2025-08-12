//This file serves as the brain that checks the time and make the status changes
import { setLatestJob } from '../utils/route';
import type {Resource, SlotKey, CellID } from '../app/components/types';
import { newResources } from '../app/components/Resources';
import { CustomError } from '../utils/CustomErrors';

//created array to store jobs the user selected with a Scheduled status.
export const scheduleJobs: Resource[] = [];
//This function is called for every job with a Scheduled Status inside the pendingJobs array I created. I want the job object and the slotKey from the loopThroughPendingJobs function. SlotKey is a string that I can parse and use to compare timing. If the current time is before or after the slotKeys, then change the statuses according. 
function changeStatuses (job: Resource, slotKey: string) {

  try {
    if (!(job || slotKey)) {
      throw new CustomError('Missing information to process the times for status changes', 404)
    }
    const [start, end] = slotKey.split("-");
    const startTime = parseTime(start);  //In order to compare start and end times, I used a function that would convert the military time(string) into an actual date object
    const endTime = parseTime(end);
    const now = new Date();
    //For debugging issues
    /*
    console.log('now', now.toLocaleTimeString());
    console.log('startTime', startTime.toLocaleTimeString());
    console.log('endTime', endTime.toLocaleTimeString());
    */
    if (now >= startTime && now < endTime) {
      job[slotKey as SlotKey] = 'Busy';
    } else if (now < startTime) {
      //const removePendingStatus = getPendingJobs();
        console.log(job[slotKey as SlotKey]);
        console.log('here');
        job[slotKey as SlotKey] = 'Scheduled';
    } else {
        job[slotKey as SlotKey] = 'Available';
        scheduleJobs.forEach((toDelete, index) => {
          //We want to skip these keys. All I want are the timeSlot keys. If there is an object within the array that does not have any pending slots, get rid of them.
          const slotKeys = Object.keys(toDelete).filter(key => key !== 'id' && key !== 'name' && key !== 'row');
          const allAvailable = slotKeys.every(key => toDelete[key as SlotKey] === 'Available');
          if (allAvailable) {
            scheduleJobs.splice(index, 1);
          }
        });
      }
  } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('There was a problem processing the current time or time slot', 500);
    }
}
export const parseTime = (time: string): Date => {
  try {
    //Taking the time from the user and breaking it at the colon and take each item in the array and convert it to a Number. Because the setHours method expects numbers, not strings. Then set the time using the method
    const [hour, minute] = time.split(":").map(Number);
    const now = new Date();
    now.setHours(hour, minute, 0, 0);
    return now;
  } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('There was a problem parsing the start and endtimes', 500);
    }
  }
  //This function takes the pendingJobs array I created in this file. Because I want to store my own version of jobs selected for use. I go in and grab each object from the array and extract the object itself along with the slotKey and pass them to the changeStatues function, to change the status for each individual cell.

  export const loopThroughPendingJobs = (jobArray: Resource[]): void => {
    try {
      if (!jobArray) {
        throw new CustomError('Cannot find array or array is empty', 404);
      }
      //I verify what jobArray looks like before trying to loop through the whole thing
      //console.log(jobArray);//Debugging
      //console.log('^^^^whats currently in pendingJobs^^^^');
      for (let i = 0; i < jobArray.length; i++) {
        const alreadyDocumentedjob = jobArray[i];//this is an object but we want to tap into the keys of slots not id or name or row. 
        Object.keys(alreadyDocumentedjob).forEach((slotKey) => {
          //Simply ignore these keys
          if (slotKey === 'id' || slotKey === 'name' || slotKey === 'row') return;
        //I want to have access each individual object inside the array I created and looping through each key
    
        //Before passing slotKey to changeStatuses, we want to make sure the value does not equal Available or Pending. Because Pending is handled by mark-pending endpoint which does not constitute a user submission and Available simply means the user has not selected this time. So there is no reason to check.
          if (alreadyDocumentedjob[slotKey as SlotKey] === 'Available' || alreadyDocumentedjob[slotKey as SlotKey] === 'Pending' ) {
            return;
          } 
        //Sending over the individual object, and the slotKey to changeStatus to parse the data and check the status depending on the current time
          changeStatuses(alreadyDocumentedjob, slotKey); 
        });
      }
    } catch (error) {
        if (error instanceof CustomError) {
          throw error;
        }
        throw new CustomError('There was a problem looping through the array', 500);
    }
  }

function updateStatusOnSelection(job: Resource, slotKey: string) : Resource {
  try {
    if (!(job || slotKey)) {
      throw new CustomError('Some or all of the necessary information is missing', 404);
    }
      //We want to return job with the appropriate status before pushing to array
      changeStatuses(job, slotKey);
    return job;  
  } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      throw new CustomError('There was a problem in determining the order in which cells were selected', 500);
    }
}
  function addToArray(job: Resource, timeSlot: string, id: CellID) { 
    try {
      if (!(job || timeSlot || id)) {
        throw new CustomError('Missing information to send for processing statuses', 404);
      }
      console.log(job);//Debugging
      console.log('^^^^job before pushed to array^^^^^^');
      //Just confirming the object before pushing to array. But first I use updateStatusOnSelection and changeStatuses based on what cell was selected to request a job. Essentially, updateStatusOnSelection updates the object,the status, before pushing it to the pendingJobs array.
      
      const jobStatusChanged = updateStatusOnSelection(job, timeSlot);
      //console.log('<<<belongs to addToArray function>>');
  
      console.log(jobStatusChanged);//Debugging. Making sure I get back what I expect from updateStatusOnSelection
      console.log('^^^what changeStatus function returned^^^');

      //If after a status is changed, if there are no pending slots for a job, then delete it from the array because we will eventually send the array to the loopThroughPendingJobs function which will look for any job with a pending status and change the status based on the relative time. This part is very important given that we are expected a return from updateStatusOnSelection.
      scheduleJobs.forEach((toDelete, index) => {
        //We want to skip these keys. All I want are the timeSlot keys. If there is an object within the array that does not have any pending slots, get rid of them.
        const slotKeys = Object.keys(toDelete).filter(key => key !== 'id' && key !== 'name' && key !== 'row');
        const allAvailable = slotKeys.every(key => toDelete[key as SlotKey] === 'Available');
        if (allAvailable) {
          scheduleJobs.splice(index, 1);
        }
      });
      //Because Cron every few seconds we don't want to keep pushing the same object to the array. Instead we want to check if it already exists. If it does, then we want to loop through the whole array looking for any pending statuses. That is what loopThroughPendingJobs function is doing 
      const isExistingJob = scheduleJobs.find( obj => obj.id === jobStatusChanged.id); 
      //working so far
      //If the id of the job/object does not exist then push it to array
      if (!isExistingJob) {
        // Clone the job object so we can mutate it independently
        scheduleJobs.push(jobStatusChanged);
        // If it does exist, then
      } 
      loopThroughPendingJobs(scheduleJobs);
    } catch (error) {
        if (error instanceof CustomError) {
          throw error;
        }
        throw new CustomError('There was a problem in passing the data over for processing', 500);
    }
  }
  
//According to the node-cron documentation. Any task files need to have their own separate file.
/**This function is imported in schedule-task where the logic once was. So every time user submits form, the appropiate data is processed
 * 
 * The logic is pretty much identical as when it was in the schedule-task file. The difference is the time conversions from military to standard. Its easier to use operators with actual date objects then strings
 * 
*/
// I want access to the timeSlot, resource(name) and what cell(id:{row:"", column:""}) the selection took place
export const myTasks = (timeSlot: string, resource: string, id: CellID ): void => {
  try {
    if (!(timeSlot || resource || id)) {
      throw new CustomError('Missing field information', 404);
    }
    //console.log(timeSlot, resource, id);
    //console.log('data ready for use in myTasks');
    //All we are doing is selecting the resource from the newResource array based on the job name the user selected
    const requestedJob = newResources.filter((job) => job.name === resource);
    //Selecting the object and renaming it to job
    const job = requestedJob[0]; //Fresh off the press. holds all keys
    //Before calling any functions I want to check the incoming data, if an incoming job wants to set a slot to another slot that is taken. We throw an error if so.
    const checkJobWithScheduled = scheduleJobs.find((existJob) => existJob.name === job.name && existJob[timeSlot as SlotKey] === 'Scheduled');
    console.log(checkJobWithScheduled);
    console.log(scheduleJobs);
 
    if (checkJobWithScheduled === undefined) {
      //sending the object and the timeslot along with cell info for processing. 
      addToArray(job, timeSlot, id);
      //Once the job has been processed, we want Cron to stop sending that job
      setLatestJob({id: {row: '', column: ''}, timeSlot: '', resource: '' });
      console.log('in myTasks function');
    } else {
        throw new CustomError('Slot is already filled. Please choose another!', 400);
    }
  } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      if (error instanceof Error) {
        throw new CustomError(`Error retrieving information that was submitted: ${error.message}`, 500);
      } else {
          throw new CustomError('An unknown error occurred', 500);
      }
    }
}

