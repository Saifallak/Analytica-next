"use client";
import { getOneCourse } from "@/components/useAPI/CorsesApi/GetCourses";
import Link from "next/link";
import React, { useEffect, useState } from "react";

// export const metadata = {
//   title: 'analytica | Course_Details',
// }

function CourseDetails({ params }) {
  const [allCourses, setAllCourses] = useState();

  useEffect(() => {
    FetchDataOFOneCourse();
  }, []);
  const FetchDataOFOneCourse = async () => {
    const AllCourses = await getOneCourse(params.id);
    if (!AllCourses) console.log(AllCourses?.message);
    setAllCourses(AllCourses);
  };
console.log(allCourses);
  return (
    <>
      {allCourses ? (
        <div className="coursesDetails coursesDetails1 ">
          <div className="part1">
            <div className="content container">
              <div className="contantAbout">
                <h2>{allCourses.name.en}</h2>
                {allCourses.short_description && <h3>{allCourses.short_description.en}</h3>}
                <p>
                  Instructor:{" "}
                  <Link href={`/instractorInfo/${allCourses.instructor.slug}`}>
                    {allCourses.instructor.name}
                  </Link>
                </p>
              </div>
              <div className="contantCart">
                <h3>Get started today</h3>
                <h4>Start your application or request more information.</h4>
                <Link href={`/checkOut?id=${params.id}`} className="btn_page">
                  Apply Now
                </Link>
                <ul>
                <li>
                    <img
                      src="/images/details/copywriting.svg"
                      alt="copywriting"
                    />
                    <p>{allCourses.users_count} Enrolled Students</p>
                  </li>
                  <li>
                    <img src="/images/details/video.svg" alt="video" />
                    <p>{allCourses.video_lessons_count} videos</p>
                  </li>
                  <li>
                    <img src="/images/details/test.svg" alt="test" />
                    <p>{allCourses.exams_count} Count Exams</p>
                  </li>
                 
                  <li>
                    <img
                      src="/images/details/copywriting.svg"
                      alt="copywriting"
                    />
                    <p>{allCourses.article_lessons_count} article</p>
                  </li>
                  <li>
                    <img
                      src="/images/details/smart-devices.svg"
                      alt="smart-devices"
                    />
                    <p>Access on mobile and PC</p>
                  </li>
                  <li>
                    <img src="/images/details/award.svg" alt="award" />
                    <p>Certificate of completion</p>
                  </li>
                  <li>
                    <img src="/images/details/infinity.svg" alt="infinity" />
                    <p>Full lifetime access</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="part2 ">
              {/*TODO*/ }
              <div className="part">
                <h2 className="headDetails">What you'll learn</h2>
                <div className="learn">
                  <ul className="row">
                    {
                      allCourses.learn.en.map((item,i)=>{
                        return(
                          <li className="col-md-5" key={i}>
                          <img src="/images/details/true.svg" alt="true" />
                          <p>
                            {item}
                          </p>
                        </li>
                        )
                      })
                    }
                 
                  </ul>
                </div>
              </div>
               {/*TODO*/ }
              <div className="part">
                <h2 className="headDetails">Skills you'll gain</h2>
                <div className="skills">
                  <ul>
                    {
                      allCourses.gain.en.map((item,i)=>{
                        return(
                          <li key={i}>{item}</li>
                        )
                      })
                    }
                    
                  </ul>
                </div>
              </div>
              <div className="part">
                <div className="course_Content">
                  <h2 className="headDetails">Course Content</h2>
                  <h3>6 sections • 32 lectures • 1h 15m total length</h3>
                  <div className="all_Course_Content">
                    <div
                      className="accordion accordion-flush"
                      id="accordionFlushExample2"
                    >
                      {
                        allCourses.lessons.map((lesson)=>{
                          return(
                            <div className="accordion-item" key={lesson.id}>
                            <h2 className="accordion-header">
                              <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#flush-collapse${lesson.id}`}
                                aria-expanded="false"
                                aria-controls={`flush-collapse${lesson.id}`}
                              >
                                {lesson.name.ar}
                              </button>
                             
                            </h2>
                            <div
                              id={`flush-collapse${lesson.id}`}
                              className="accordion-collapse collapse"
                              data-bs-parent="#accordionFlushExample2"
                            >
                              <div className="accordion-body">
                                <ul>
                                  <li>
                                    <img
                                      src="/images/details/video.svg"
                                      alt="video"
                                    />
                                    <p>{lesson.videos_count} videos</p>
                                  </li>
                                  <li>
                                    <img
                                      src="/images/details/test.svg"
                                      alt="test"
                                    />
                                    <p>{lesson.exams_count} Count Exams</p>
                                  </li>
                              
                                  <li>
                                    <img
                                      src="/images/details/copywriting.svg"
                                      alt="copywriting"
                                    />
                                    <p>{lesson.files_count} article</p>
                                  </li>
                                  <li>
                                    <img
                                      src="/images/details/smart-devices.svg"
                                      alt="smart-devices"
                                    />
                                    <p>Access on mobile and PC</p>
                                  </li>
                                  <li>
                                    <img
                                      src="/images/details/award.svg"
                                      alt="award"
                                    />
                                    <p>Certificate of completion</p>
                                  </li>
                                  <li>
                                    <img
                                      src="/images/details/infinity.svg"
                                      alt="infinity"
                                    />
                                    <p>Full lifetime access</p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          )
                        })
                      }
                    
                      
                    </div>
                  </div>
                </div>
              </div>
              {allCourses.requirements && (
                <div className="part">
                  <div className="description">
                    <h2 className="headDetails">Requirements</h2>
                    <p>
                    {allCourses.requirements.en}
                    </p>
                  </div>
                </div>
              )}
               {allCourses.description && (
                <div className="part">
                  <div className="description">
                    <h2 className="headDetails">Description</h2>
                    <p>
                    {allCourses.description.en}
                    </p>
                  </div>
                </div>
              )}
             
             
            </div>
          </div>
          <div className="part3 container">
            <div className="box">
              <img
                src="/images/details/certificate.webp"
                className="img_box"
                alt="certificate"
              />
              <h2>Earn a career certificate</h2>
              <p>
                Add this credential to your LinkedIn profile, resume, or CV
                Share it on social media and in your performance review
              </p>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default CourseDetails;
