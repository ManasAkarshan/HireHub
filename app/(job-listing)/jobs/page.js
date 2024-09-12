"use client";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "@/components/protected-route";
import useFetch from "@/hooks/useFetch";
import { getJobs } from "@/app/db/apiJobs";
import { BarLoader } from "react-spinners";
import JobCard from "./components/job-card";
import { getCompanies } from "@/app/db/apiCompanies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { State } from "country-state-city";
import { UserState } from "@/context/user-context";
const page = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [company_id, setCompany_id] = useState("");
  const {loading} = UserState()

  // useFetch function for fetching jobs along with search parameter
  const {
    data: jobs,
    loading: loadingJobs,
    error,
    fn: fnFetchJobs,
  } = useFetch(getJobs, { location, company_id, searchQuery });
  //use fetch for fetching all companies
  const {data:companies, fn:fnCompanies, error:companyError, loading:loadingCompanies} = useFetch(getCompanies)
  // function for handling search
  const handleSearch = (e)=>{
    e.preventDefault()
    let formData = new FormData(e.target)

    let query = formData.get("search-query")
    if(query) setSearchQuery(query)
  }

  // function to clear search filters
  const clearFilters = ()=>{
    setSearchQuery("")
    setCompany_id("")
    setLocation("")
  }

  // use effect for fetching
  useEffect(() => {
    fnFetchJobs();
  }, [location, company_id, searchQuery]);

  useEffect(()=>{
    fnCompanies()
  }, [])

  if(loading) return <BarLoader className='mb-4' width={'100%'} color='#36d7b7'/>

  return (
    <ProtectedRoute>
      <div className="px-6">
        <h1 className="gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8">
          Latest Jobs
        </h1>
        {/* Filters here */}
        <form onSubmit={handleSearch} className="h-14 flex w-full gap-2 items-center mb-3">
          <Input type='text' placeholder='Search jobs by title...' name='search-query' className='h-full flex-1 px-4 text-md'/>
          <Button type="submit" className="h-full sm:w-28" variant="blue">Search</Button>
        </form>
        <div className="flex flex-col sm:flex-row gap-2">
        <Select value={location} onValueChange={(value)=>setLocation(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by location" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {State.getStatesOfCountry('IN').map(({name})=>{
                return <SelectItem key={name} value={name}>{name}</SelectItem>
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select value={company_id} onValueChange={(value)=>setCompany_id(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by company" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {companies?.map(({name, id})=>{
                return <SelectItem key={name} value={id}>{name}</SelectItem>
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button variant="destructive" className="sm:w-1/2" onClick={clearFilters}>Clear filters</Button>
        </div>
        {loadingJobs && (
          <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
        )}
        {!loadingJobs && (
          <div className="mt-8 grid md:grid-col-2 lg:grid-cols-3 gap-6">
            {jobs?.length>0 ? jobs.map((job) => {return <JobCard key={job.id} job={job} savedInit={job.saved.length > 0} />}) : <div>No jobs found</div>}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default page;
