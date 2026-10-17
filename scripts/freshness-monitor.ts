import { JOB_DATABASE, JobRecord } from '../src/lib/data/jobs';

/**
 * UtilitySpace Freshness & Monitoring Workflow Document
 *
 * RUN FREQUENCY: Weekly via CI/CD pipelines (e.g. GitHub Actions or Render Cron)
 *
 * PROCESS:
 * 1. Discover: Parse official recruitment authority websites for new notifications.
 * 2. Evaluate: Check if current date > `applicationDeadline`.
 * 3. Flag: Transition status to `closing_soon` if deadline is within 7 days.
 *    Transition status to `closed` if deadline has passed.
 * 4. Alert: Flag unverified records for manual verification review.
 */

function checkFreshness(jobs: JobRecord[]) {
  const now = new Date();
  const report = {
    expired: [] as string[],
    closingSoon: [] as string[],
    requiresManualVerification: [] as string[]
  };

  jobs.forEach(job => {
    if (job.applicationDeadline) {
      const deadline = new Date(job.applicationDeadline);
      const diffTime = Math.abs(deadline.getTime() - now.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (now > deadline && job.applicationStatus !== 'closed' && job.applicationStatus !== 'archived') {
        report.expired.push(`${job.id} (Deadline: ${job.applicationDeadline}) -> Action: Should be marked 'closed'`);
      } else if (now <= deadline && diffDays <= 7 && job.applicationStatus !== 'closing_soon') {
        report.closingSoon.push(`${job.id} -> Action: Should be marked 'closing_soon'`);
      }
    }

    if (job.verificationStatus !== 'Verified for current cycle' && job.verificationStatus !== 'Historical archive') {
       report.requiresManualVerification.push(`${job.id} -> Current status: ${job.verificationStatus}`);
    }
  });

  return report;
}


const runScan = () => {
   console.log("Starting Freshness Scan...");
   const results = checkFreshness(JOB_DATABASE);
   console.log("\n--- ACTION REPORT ---");
   console.log("Expired Deadlines to Archive/Close:", results.expired.length > 0 ? results.expired : "None");
   console.log("Closing Soon Alerts:", results.closingSoon.length > 0 ? results.closingSoon : "None");
   console.log("Requires Manual Web Verification:", results.requiresManualVerification.length > 0 ? results.requiresManualVerification : "None");

   // In a real environment, this script would optionally send an alert to Slack/Email
   // and exit cleanly.
   process.exit(0);
}


runScan();
