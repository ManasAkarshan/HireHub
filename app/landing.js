"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Briefcase, Users, TrendingUp } from "lucide-react";
import { UserState } from "@/context/user-context";
import { useRouter } from "next/navigation";


export default function JobPortalLanding() {
  const {isAuthenticated, user} = UserState()
  const router = useRouter()
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary">
          <div className="px-4 md:px-6 w-full">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Find Your Dream Job Today
                </h1>
                <p className="mx-auto max-w-[700px]  md:text-xl">
                  Discover thousands of job opportunities with top employers.
                  Your next career move starts here.
                </p>
              </div>
              <div className="w-full max-w-sm flex gap-2 mt-2 items-center justify-center">
                {
                  isAuthenticated ? (
                    <>
                    {user?.user_metadata.role === 'candidate' && <Button onClick={()=>router.push('/jobs')} size="lg" variant='blue'>
                      Find jobs
                    </Button>}
                    {user?.user_metadata.role === 'recruiter' && <Button onClick={()=>router.push('/post-job')} size="lg"variant='destructive'>
                      Post Jobs
                    </Button>}
                    {user?.user_metadata.role === undefined && <><Button onClick={()=>router.push('/post-job')} size="lg"variant='destructive'>
                      Post Jobs
                    </Button><Button onClick={()=>router.push('/jobs')} size="lg" variant='blue'>
                      Find jobs
                    </Button></>}
                    </>
                  ) : <Button onClick={()=>router.push('/auth')} >Get Started</Button>
                }
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className=" px-4 md:px-6">
            <div className="grid gap-6 items-center">
              <div className="flex flex-col justify-center space-y-8 text-center">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Why Choose HireHub
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed mx-auto">
                    We connect talented professionals with top employers across
                    various industries.
                  </p>
                </div>
              </div>
              <div className="mx-auto grid gap-8 sm:grid-cols-2 md:grid-cols-3 items-start lg:gap-12">
                <div className="grid gap-1">
                  <Briefcase className="w-12 h-12 mx-auto" />
                  <h3 className="text-xl font-bold text-center">
                    Diverse Opportunities
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Access a wide range of job listings across multiple
                    industries and sectors.
                  </p>
                </div>
                <div className="grid gap-1">
                  <Users className="w-12 h-12 mx-auto" />
                  <h3 className="text-xl font-bold text-center">
                    Expert Career Advice
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Get personalized career guidance and tips from industry
                    professionals.
                  </p>
                </div>
                <div className="grid gap-1">
                  <TrendingUp className="w-12 h-12 mx-auto" />
                  <h3 className="text-xl font-bold text-center">
                    Career Growth
                  </h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Find opportunities that align with your career goals and
                    help you grow professionally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className=" px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
              Frequently Asked Questions
            </h2>
            <Accordion
              type="single"
              collapsible
              className="w-full max-w-3xl mx-auto"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger>How do I create an account?</AccordionTrigger>
                <AccordionContent>
                  To create an account, click on the "Sign Up" button in the top
                  right corner of the homepage. Fill in your details, including
                  your name, email address, and password. Once completed, you'll
                  receive a confirmation email to activate your account.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Is it free to apply for jobs?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, it's completely free for job seekers to create an
                  account, search for jobs, and apply to positions on our
                  platform. We do not charge any fees for these services.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  How can employers post job listings?
                </AccordionTrigger>
                <AccordionContent>
                  Employers can post job listings by creating an employer
                  account and selecting the "Post a Job" option from their
                  dashboard. We offer various packages to suit different hiring
                  needs and budgets.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Can I set up job alerts?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can set up job alerts based on your preferences. Go
                  to your account settings and select "Job Alerts." You can
                  specify your desired job titles, locations, and other criteria
                  to receive email notifications when matching jobs are posted.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © 2023 HireHub. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
