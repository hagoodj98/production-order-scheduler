//This file serves as the brain that checks the time and make the status changes
import { setLatestJob } from '@/utils/route';
import type {Resource, SlotKey, CellID } from '../app/components/types';
import { newResources } from '@/app/components/Resources';


//created array to store jobs the user selected with a Scheduled status.
const pendingJobs: Resource[] = [];

//This function is called for every job with a Scheduled Status inside the pendingJobs array I created. I want the job object and the slotKey from the loopThroughPendingJobs function. SlotKey is a string that I can parse and use to compare timing. If the current time is before or after the slotKeys, then change the statuses according. 
function changeStatuses (job: Resource, slotKey: string) {
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
    job[slotKey as SlotKey] = 'Pending';
  } else {
      job[slotKey as SlotKey] = 'Available';
    }
}

function parseTime(time: string): Date {
  //Taking the time from the user and breaking it at the colon and take each item in the array and convert it to a Number. Because the setHours method expects numbers, not strings. Then set the time using the method
  const [hour, minute] = time.split(":").map(Number);
  const now = new Date();
  now.setHours(hour, minute, 0, 0);
  return now;
  }

  //This function takes the pendingJobs array I created in this file. Because I want to store my own version of jobs selected for use. I go in and grab each object from the array and extract the object itself along with the slotKey and pass them to the changeStatues function, to change the status for each individual cell.

  function loopThroughPendingJobs (jobArray: Resource[]): void {

    //I verify what jobArray looks like before trying to loop through the whole thing
    //console.log(jobArray);//Debugging
    //console.log('^^^^whats currently in pendingJobs^^^^');
    
    for (let i = 0; i < jobArray.length; i++) {
      const alreadyDocumentedjob = jobArray[i];//this is an object but we want to tap into the keys of slots not id or name or row. 
      
      Object.keys(alreadyDocumentedjob).forEach((slotKey) => {
        //Simply ignore these keys
        if (slotKey === 'id' || slotKey === 'name' || slotKey === 'row') return;
      //I want to have access each individual object inside the array I created and looping through each key
   
      //Before sending the slotKey, we want to make sure the value does not equal Available, cause if I select a time, the other slots would change to Pending even if I did not select them. In simple terms, when slotKey equals Availbable, it tells me that the user has not selected that time yet.
        if (alreadyDocumentedjob[slotKey as SlotKey] === 'Available') {
          return;
        } 
      //Sending over the individual object, and the slotKey to changeStatus to parse the data and check the status depending on the current time
        changeStatuses(alreadyDocumentedjob, slotKey); 
      });
    }
  }

function updateStatusOnSelection(job: Resource, slotKey: string, id: CellID) : Resource {
  //Debugging
  //console.log(pendingJobs);
  //console.log('currently in array in changeStatus function');   
  
  //This block works. If user wants to go back into a previously selected cell and change the job and slot, then it will be removed from the array along with a status change back to Available. If id.row,the cell in which the user selected is not equal to the job.row, every job has a row property, then we knwo the user went into a cell but decided to change jobs and possibly a time slot. Which has to mean, the previous selected was stored in the array somewhere.
  if (id.row !== job.row) {
    //So we want to find the object
    const foundMatchingDocumentedJob = pendingJobs.findIndex((match) => match.row === id.row);
    console.log(foundMatchingDocumentedJob);//confirming we get the right job
    //If it does exist then we want to find where the column in which the cell was selected along with the key that we looped through to see if they match and if the value of the property is Pending. If it is, then we want to change it back to Available 
    if (foundMatchingDocumentedJob !== -1) {
      Object.keys(pendingJobs[foundMatchingDocumentedJob]).forEach((pending) => {
        if (pending === 'id' || pending === 'name' || pending === 'row') return;

        if (id.column === pending && !(pendingJobs[foundMatchingDocumentedJob][pending as SlotKey] === 'Available')) {
          pendingJobs[foundMatchingDocumentedJob][id.column as SlotKey] = 'Available';
          console.log(pendingJobs[foundMatchingDocumentedJob][pending as SlotKey],'the new status');
          console.log('changed to Available^^^^^');
          changeStatuses(job, slotKey);//without this line, the status that changed from Pending back to Availbale will eventually happen, but after a couple rounds of Cron. But to change it in the heat of the moment, I called a function to do just that
          }
      });
      //If a user go into a previously selected cell and changes the job and/or time slot, then we should make this the most recent input or request from the user for Cron to use when making a call to schedule-task.
      setLatestJob({id: {row: `${job.row}`, column: `${slotKey}`}, timeSlot: `${slotKey}`, resource: `${job.name}` });

    } else {
      //If the job, the user selected is not found in the array then we simply go in and change the status and time slot like requested even if the job and id rows are different at first
      changeStatuses(job, slotKey);
    }
  } else {
    //If the job and id rows match, then the user went into the same row but selected a different cell. So fill the request like normal
      changeStatuses(job, slotKey);
    }
    //We want to return job with the appriopriate status before pushing to array
  return job;  
}

  function addToArray(job: Resource, timeSlot: string, id: CellID) { 
    console.log(job);//Debugging
    console.log('^^^^job before pushed to array^^^^^^');
    //Just confirming the object before pushing to array. But first I use updateStatusOnSelection and changeStatuses based on what cell was selected to request a job. Essentially, updateStatusOnSelection updates the object,the status, before pushing it to the pendingJobs array.
    const jobStatusChanged = updateStatusOnSelection(job, timeSlot, id);
    //console.log('<<<belongs to addToArray function>>');
 
    console.log( updateStatusOnSelection(job, timeSlot, id));//Debugging. Making sure I get back what I expect from updateStatusOnSelection
    console.log('^^^what changeStatus function returned^^^');

    //If after a status is changed, if there are no pending slots for a job, then delete it from the array because we will eventually send the array to the loopThroughPendingJobs function which will look for any job with a pending status and change the status based on the relative time. This part is very important given that we are expected a return from updateStatusOnSelection.
    pendingJobs.forEach((toDelete, index) => {
      //We want to skip these keys. All I want are the timeSlot keys. If there is an object within the array that does not have any pending slots, get rid of them.
      const slotKeys = Object.keys(toDelete).filter(key => key !== 'id' && key !== 'name' && key !== 'row');
      const allAvailable = slotKeys.every(key => toDelete[key as SlotKey] === 'Available');

      if (allAvailable) {
        pendingJobs.splice(index, 1);
      }
    })
    //Because Cron every few seconds we don't want to keep pushing the same object to the array. Instead we want to check if it already exists. If it does, then we want to loop through the whole array looking for any pending statuses. That is what loopThroughPendingJobs function is doing 
    const isExistingJob = pendingJobs.find( obj => obj.id === jobStatusChanged.id); 
    //working so far
    //If the id of the job/object does not exist then push it to array
    if (!isExistingJob) {
      // Clone the job object so we can mutate it independently
        pendingJobs.push(jobStatusChanged);
      // If it does exist, then
    } 
    loopThroughPendingJobs(pendingJobs);
  }
  
//According to the node-cron documentation. Any task files need to have their own separate file.
/**This function is imported in schedule-task where the logic once was. So every time user submits form, the appropiate data is processed
 * 
 * The logic is pretty much identical as when it was in the schedule-task file. The difference is the time conversions from military to standard. Its easier to use operators with actual date objects then strings
 * 
*/
// I want access to the timeSlot, resource(name) and what cell(id:{row:"", column:""}) the selection took place
export const myTasks= (timeSlot: string, resource: string, id: CellID ): void => {
  /*
  console.log(timeSlot, resource, id);
  console.log('data ready for use in myTasks');
  */
 
  //All we are doing is selecting the resource from the newResource array based on the job name the user selected
  const requestedJob = newResources.filter((job) => job.name === resource);

//Selecting the object and renaming it to job
  const job = requestedJob[0]; //Fresh off the press. holds all keys
  //sending the object and the timeslot along with cell info for processing. 
  addToArray(job, timeSlot, id);

}
