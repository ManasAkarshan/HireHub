import JobCard from "@/app/(job-listing)/jobs/components/job-card";
import { getMyJobs } from "@/app/db/apiJobs";
import { UserState } from "@/context/user-context";
import useFetch from "@/hooks/useFetch";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";

const CreatedJobs = () => {
  const { user, loading } = UserState();
  const {
    data: createdJobs,
    fn: fnGetCreatedJobs,
    loading: loadingCreatedJobs,
  } = useFetch(getMyJobs,{recruiter_id : user.id});

  useEffect(() => {
    fnGetCreatedJobs();
  }, []);

  if (loadingCreatedJobs)
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;

  return (
    <div>
      <div className="mt-8 grid md:grid-col-2 lg:grid-cols-3 gap-6">
        {createdJobs?.length > 0 ? (
          createdJobs.map((job) => {
            return (
              <JobCard
                key={job.id}
                job={job}
                isMyJob={true}
                onJobSaved={fnGetCreatedJobs}
              />
            );
          })
        ) : (
          <div>No jobs found</div>
        )}
      </div>
    </div>
  );
};

export default CreatedJobs;
