1. This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
2. What is working is the core functionality of the project. You can hover over any cell and schedule a job. The cell is labeled Pending only when valid data is present in the form. If user goes back and reselect that cell, the previous input loads as before until user submits form. The cell status changes depending on the current time and time slot the user chose from Scheduled - Busy - Available. Once the cell goes back to Available, the data that preexisted in the form gets erased.

3. Testing - Each of the test points were covered. Order Creation, Order Editing & Scheduling, Scheduling Validation, Table Interaction, and Dashboard Display. You run test by simply first starting the app using command line - npm run dev, then open another terminal windown and run - npx playwright test after opening the example.spec.ts file inside the tests folder where you will see all of the test. at line 18 remove two '/' before available-slots. Do the same for line 61 and 71. Currently the tests are all commented out. When you want to run a test, make sure each line is not commented out and remember to remove the forward slashes I just mentioned. Few of the tests will show that only 1 passed and 2 failed. That is because data is leaking through the other browsers Playwright test. When one browser hits the backend, the other two browsers hit the same back-end causing the other browsers to fail due to the errors I throw on the back-end. Getting one test to pass means that the logic works. It was quite difficult in trying to manage data when 3 different browsers are hitting the same endpoints. Given this, I found it best to run one test.describe block at a time and perhaps commenting out two of the browsers in the playwright.config.ts file.
4. I used Node-Cron to automatically do a time check on the jobs the user selected. Making an empty POST resquest to the same endpoint the submitted data goes for processing. I also created a data file that allows the user to dynamically add columns to the table by copying the structure of the existing objects that follow. The way I keep state of the array of jobs submitted, I use the array from the back-end useSWR renders.Thats what I use to prefill the form if the user decides to go back into the cell they originally selected.
5. There are few limitations and bugs that can be improved and fixed. I talked about the prefilling of the form. Say you click a cell with a Pending status, the form would be empty. But if you click the back button and go back into that Pending cell, the form prefills as expected. If you select a cell with an Available status, fill in the form and submit, the data that prefilled the form is deleted, but that data still renders if you go into that cell where you submitted. But if you go back and click into the cell again, the data deletes like its suppose to. I mentioned the testing portion above. Playwright uses 3 different browsers to test the app but there appears to be some data leakage that occurs. If you run one of the test.describe blocks, you may see only 1 test passed and 2 failed. That is because 3 different browsers are hitting the same backend that share one state. I tried changing state between browser test but did not have success given the time I have with this app. Another limitation is that you cannot schedule a time in the past, I throw an error on the server. This scheduling app is not a full calender where you can schedule out in advance. It is a simple scheduling app that functions in the present.
