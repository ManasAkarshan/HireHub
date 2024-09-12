import ApplicationCard from "@/app/(job-page)/job/_components/ApplicationCard";
import { getApplications } from "@/app/db/apiApplications";
import { UserState } from "@/context/user-context";
import useFetch from "@/hooks/useFetch";
import React, { useEffect } from "react";
import { BarLoader } from "react-spinners";

const CreatedApplications = () => {
  const { user, loading } = UserState();

  const {
    loading: loadingApplications,
    data: applications,
    fn: fnApplications,
  } = useFetch(getApplications, { user_id: user.id });

  useEffect(() => {
    fnApplications();
  }, []);

  console.log(applications);

  if (loadingApplications)
    return <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />;

  return (
    <div className="flex flex-col gap-2">
      {applications?.map((application) => {
        return (
          <ApplicationCard
            key={application.id}
            application={application}
            job={application.job}
            isCandidate={true}
          />
        );
      })}
    </div>
  );
};

export default CreatedApplications;
