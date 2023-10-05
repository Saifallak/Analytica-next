"use client";
import { StateSearch, navState } from "@/atoms";
import ItemCourse2 from "@/components/ItemCourse2";
import { getHomePage } from "@/components/useAPI/GetUser";
import { Checkbox, Group, Radio, RangeSlider, Slider } from "@mantine/core";
import Cookies from "js-cookie";
import { useLocale } from "next-intl";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { useRecoilState } from "recoil";
import api from "../api";

// export const metadata = {
//   title: 'analytica | Courses',
// }

function Courses() {
  const [allCourses, setAllCourses] = useState([]);
  const [Rating, setRating] = useState(5);
  const [Duration, setDuration] = useState();
  const [Level_id, setLevel_id] = useState([]);
  const [Topic, setTopic] = useState();
  const [Page, setPage] = useState(1);
  const [Categories, setCategories] = useState([]);
  const [CategoriesID, setCategoriesID] = useState([]);
  const [Language, setLanguage] = useState();
  const [PriceType, setPriceType] = useState("");
  const [PriceFrom, setPriceFrom] = useState();
  const [PriceTo, setPriceTo] = useState();
  const [Price, setPrice] = useState();
  const [AllTopic, setAllTopic] = useState([]);
  const [show, setShow] = useState(false);
  const [UrlNew, setUerNew] = useState("");
  const [IsUser, setIsUser] = useRecoilState(navState);
  const [Search, setSearch] = useRecoilState(StateSearch);
  const locale = useLocale();
  const router = useRouter();
  const [hasMore, setHasMore] = useState(true);
  const searchParams2 = useSearchParams();
  //console.log(searchParams.getAll());
  searchParams2.get("search");
  let headersToken = {
    Authorization: `Bearer ${Cookies.get("token")} `,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  let header = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  //to get value in params
  /*
  const url2 = "level_ids%5B0%5D=1&level_ids%5B1%5D=7&level_ids%5B2%5D=8&level_ids%5B3%5D=13";
  const valueString = url2.replace(/level_ids%5B\d+%5D=/g, ''); 
  console.log(valueString);
  const values = valueString.split("&");
  const result = values.map(value => parseInt(value, 10));
    console.log(result);
*/

  useEffect(() => {
    if (Search) {
      handellogin();
    }
    FetchDataOFHomePage();
  }, [Search]);
  const FetchDataOFHomePage = async () => {
    const AllData = await getHomePage();
    if (!AllData) console.log(AllData?.message);
    setAllTopic(AllData.levels);
    setCategories(AllData.categories);
    console.log(AllData);
  };
  console.log(Search ? true : false);

  useEffect(() => {
    if (
      Language ||
      PriceFrom ||
      PriceTo ||
      PriceType ||
      CategoriesID ||
      Level_id
    ) {
      setAllCourses([]);
      handellogin(1);
    }
  }, [Language, PriceFrom, PriceTo, PriceType, CategoriesID, Level_id]);

  const handellogin = (id) => {
    const url = new URL(
      `https://education.aquadic.com/api/v1/users/courses?page=${
        id ? id : Page
      }&price_type=${PriceType}&price_from=${PriceFrom}&price_to=${PriceTo}&price_type=${PriceType}&search=${Search}&language=${Language}`
    );

    const body = new FormData();

    setPage(Page + 1);
    if (Level_id.length > 0) {
      Level_id.map((item, i) => {
        url.searchParams.append(`level_ids[${i}]`, item);
      });
    }

    if (CategoriesID.length > 0) {
      CategoriesID.map((item, i) => {
        url.searchParams.append(`category_ids[${i}]`, item);
      });
    }

    const po = api
      .get(url, {
        headers: IsUser ? headersToken : header,
      })
      .then((res) => {
        if (res.data.data.length === 0) {
          setHasMore(false);
        } else {
          setAllCourses((dataGet) => [...dataGet, ...res.data.data]);
        }

        console.log(res);
        return res.data.data;
      })
      .catch((res) => {
        console.log(res);
      });
  };

  return (
    <>
      {show && (
        <Alert variant="danger" onClose={() => setShow(false)} dismissible>
          <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
          <p>
            Change this and that and try again. Duis mollis, est non commodo
            luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
            Cras mattis consectetur purus sit amet fermentum.
          </p>
        </Alert>
      )}
      {/*  <Link href={{ pathname: '/courses', query: { name: ['566',"56565"], id: '11' } }}>
      rthrt
    </Link>
      <button  onClick={handleClick}>rtgerththbtrh</button>*/}
      <div className="courses container">
        <div className="part1">
          <div className="accordion accordion-flush" id="accordionFlushExample">
            {/*  <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseOne"
                  aria-expanded="false"
                  aria-controls="flush-collapseOne"
                >
                  Rating
                </button>
              </h2>
              <div
                id="flush-collapseOne"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <Radio.Group name="favoriteFramework" withAsterisk>
                    <Group mt="xs">
                      <Radio size="xs" value="react" label="React" />
                      <Radio size="xs" value="svelte" label="Svelte" />
                      <Radio size="xs" value="ng" label="Angular" />
                      <Radio size="xs" value="vue" label="Vue" />
                    </Group>
                  </Radio.Group>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="exampleRadios"
                      id="exampleRadios1"
                      value="option1"
                    />
                    <label
                      className="form-check-label optionStar"
                      htmlFor="exampleRadios1"
                    >
                      <img src="./images/star.svg" alt="star" />
                      <p>4.5</p>
                    </label>
                  </div>
                </div>
              </div>
      </div>*/}
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapsetwo"
                  aria-expanded="false"
                  aria-controls="flush-collapsetwo"
                >
                  Video Duration
                </button>
              </h2>
              <div
                id="flush-collapsetwo"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <Checkbox.Group
                    color="red"
                    style={{ display: "flex", flexDirection: "column" }}
                    onChange={setDuration}
                  >
                    <Group mt="xs">
                      <Checkbox value="0-1" color="indigo" label="0-1 Hour" />
                      <Checkbox value="2-4" color="indigo" label="2-4 Hour" />
                      <Checkbox value="4-7" color="indigo" label="4-7 Hour" />
                      <Checkbox value="7-17" color="indigo" label="7-17 Hour" />
                    </Group>
                  </Checkbox.Group>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapsethree"
                  aria-expanded="false"
                  aria-controls="flush-collapsethree"
                >
                  Category
                </button>
              </h2>
              <div
                id="flush-collapsethree"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <Checkbox.Group
                    color="red"
                    style={{ display: "flex", flexDirection: "column" }}
                    onChange={setCategoriesID}
                  >
                    <Group mt="xs">
                      {Categories.map((item) => {
                        return (
                          <Checkbox
                            key={item.id}
                            value={`${item.id}`}
                            color="indigo"
                            label={item.name[locale]}
                          />
                        );
                      })}
                    </Group>
                  </Checkbox.Group>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapsefour"
                  aria-expanded="false"
                  aria-controls="flush-collapsefour"
                >
                  Level
                </button>
              </h2>
              <div
                id="flush-collapsefour"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <Checkbox.Group
                    color="red"
                    style={{ display: "flex", flexDirection: "column" }}
                    onChange={setLevel_id}
                  >
                    <Group mt="xs">
                      {AllTopic.map((item) => {
                        return (
                          <Checkbox
                            key={item.id}
                            value={`${item.id}`}
                            color="indigo"
                            label={item.name[locale]}
                          />
                        );
                      })}
                    </Group>
                  </Checkbox.Group>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapsefive"
                  aria-expanded="false"
                  aria-controls="flush-collapsefive"
                >
                  Language
                </button>
              </h2>
              <div
                id="flush-collapsefive"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <Radio.Group
                    name="favoriteFramework2"
                    onChange={setLanguage}
                    value={Language}
                  >
                    <Group mt="xs">
                      <Radio size="xs" value="en" color="indigo" label="EN" />
                      <Radio size="xs" value="ar" color="indigo" label="AR" />
                    </Group>
                  </Radio.Group>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapsefive2"
                  aria-expanded="false"
                  aria-controls="flush-collapsefive2"
                >
                  Course Type
                </button>
              </h2>
              <div
                id="flush-collapsefive2"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <Radio.Group
                    name="favoriteFramework3"
                    onChange={setPriceType}
                    value={PriceType}
                  >
                    <Group mt="xs">
                      <Radio
                        size="xs"
                        value="free"
                        color="indigo"
                        label="Free"
                      />
                      <Radio
                        size="xs"
                        value="paid"
                        color="indigo"
                        label="Paid"
                      />
                    </Group>
                  </Radio.Group>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapsesix"
                  aria-expanded="false"
                  aria-controls="flush-collapsesix"
                >
                  Price
                </button>
              </h2>
              <div
                id="flush-collapsesix"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <RangeSlider
                    min={0}
                    color="indigo"
                    onChange={(e) => {
                      setPriceFrom(e[0]);
                      setPriceTo(e[1]);
                    }}
                    thumbSize={22}
                    max={1000}
                    labelAlwaysOn
                  />
                </div>
              </div>
            </div>
          </div>
          <button
            className="btn_page"
            onClick={(e) => {
              e.preventDefault();
              handellogin();
            }}
          >
            Apply
          </button>
        </div>
        <div className="part2">
          {/* <h2  >User Experience Design Courses</h2> */}
          <div
            className="fillter_Courses"
            style={{
              minHeight: "700px",

              overflow: "auto",
              display: "flex",
            }}
          >
            <InfiniteScroll
              dataLength={allCourses.length}
              next={handellogin}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
              hasMore={hasMore}
              loader={<h3> Loading...</h3>}
              endMessage={
                <h4 style={{ textAlign: "center" }}>Nothing more to show</h4>
              }
            >
              {allCourses?.map((course, i) => (
                <ItemCourse2
                  key={i}
                  id={course.id}
                  title={course.name[locale]}
                  imageCourse={course.image.url}
                  is_purchased={course.is_purchased ? true : false}
                  last_watched={course.last_watched_lesson_id}
                  star="4.8"
                  dec={course.instructor.name}
                  newsalary={course.price ? "EG " + course.price : "free"}
                />
              ))}
            </InfiniteScroll>
          </div>
        </div>
      </div>
    </>
  );
}

export default Courses;
