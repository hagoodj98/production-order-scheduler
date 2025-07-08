//This file serves as the brain that checks the time and make the status changes

import type {Resource, SlotKey } from '../app/components/types';
import { newResources } from '@/app/components/Resources';

function parseTime(time: string): Date {
  //Taking the time from the user and breaking it at the colon and take each item in the array and convert it to a Number. Because the setHours method expects numbers, not strings. Then set the time using the method
  const [hour, minute] = time.split(":").map(Number);
  const now = new Date();
  now.setHours(hour, minute, 0, 0);
  return now;
  }
  //created array to store jobs the user selected.
  const pendingJobs: Resource[] = [];

  //This function takes the pendingJobs array I created in this file. Because I want to store my own version of jobs selected for use
  function loopThroughPendingJobs (jobArray: Resource[]):void {
    
    //I verify what jobArray looks like before trying to loop through the whole thing
    console.log(jobArray);//Debugging
    console.log('^^^^whats currently in pendingJobs^^^^');
   
    //loop through jobArray, which also loops through each key and make the status change that way.
    for (let i = 0; i < jobArray.length; i++) {
      const alreadyDocumentedjob = jobArray[i];//this is an object but we want to tap into the keys of slots not id or name. 
      Object.keys(alreadyDocumentedjob).forEach((slotKey) => {
        //Simply ignore these keys
        if (slotKey === 'id' || slotKey === 'name') return;
      //I want to have access each individual object inside the array I created and looping through each key
        const job = alreadyDocumentedjob;
        console.log( slotKey);
        console.log('whats available in addJobToArray here');
        
        //Before sending the slotKey, we want to make sure the value does not equal Available, send the slot for status changing. cause if I select a time, the other slots would change to Pending. In simple terms, when slotKey equals Availbable, it tells me that the user has not selected that time yet.
        if (job[slotKey as SlotKey] === 'Available') {
          return;
        }
        //Sending over the individual object, and the slotKey to changeStatus to parse the data and check the status depending on the current time
        changeStatus(job, slotKey); 
      })
    }
  }
  function changeStatus(job: Resource, slotKey: string) : Resource {

    console.log(slotKey);//Currently getting an error coming from addJobToArray. slotKey = 'Available'.
    console.log('watching inside changeStatus');

    const [start, end] = slotKey.split("-");
    //In order to compare start and end times, I used a function that would convert the military time(string) into an actual date object
    const startTime = parseTime(start);
    const endTime = parseTime(end);
    const now = new Date();
  
    //For debugging issues
    /*
    console.log('now', now.toLocaleTimeString());
    console.log('startTime', startTime.toLocaleTimeString());
    console.log('endTime', endTime.toLocaleTimeString());
    */
    if (now >= startTime && now < endTime) {
    
      //console.log('✅ Condition met — marking busy');//debugging
    
      job[slotKey as SlotKey] = 'Busy';
  
    } else if (now < startTime) {
      
      job[slotKey as SlotKey] = 'Pending';
   
    } else {
        job[slotKey as SlotKey] = 'Available';
      }
      return job;
  }

  function addToArray(job: Resource, timeSlot: string) { 

    console.log(job);//Debugging
    console.log('^^^^job before pushed to array^^^^^^');

    //using changeStatus function to change status of job before pushing to array.
    const jobStatusChanged = changeStatus(job, timeSlot);
    console.log( changeStatus(job, timeSlot));//Debugging. Making sure I get back what I expect
    console.log('^^^what changeStatus function returned^^^');

    //Because Cron every 5 seconds we don't want to keep pushing the same object to the array. Instead we want to check if it already exists. If it does, then we want to loop through the whole array. That is what loopThroughPendingJobs function is doing 
    const isExistingJob = pendingJobs.find( obj => obj.id === jobStatusChanged.id); 
    //working so far
    //If the id of the job/object does not exist then push it to array
    if (!isExistingJob) {
      // Clone the job object so we can mutate it independently
        pendingJobs.push(jobStatusChanged);
      // If it does exist, then check if
    } else {
        loopThroughPendingJobs(pendingJobs);
    }
  }
//According to the node-cron documentation. Any task files need to have their own separate file.
/**This function in imported in schedule-task where the logic once was. So every time user submits form, the appropiate data is processed
 * 
 * The logic is pretty much identical as when it was in schedule-task. The difference is the time conversions from military to standard. Its easier to use operators with actual date objects then strings
 * 
*/
// timeSlot and resource are parameters from the user
export const myTasks= (timeSlot: string, resource: string): void => {
  
 //All we are doing is selecting the resource from the newResource array based on the job name
  const requestedJob = newResources.filter((job) => job.name === resource);

//Selecting the object and renaming it to job
  const job = requestedJob[0]; //Fresh off the press. holds all keys
  //sending the object and the timeslot for processing. 
  addToArray(job, timeSlot);

}

