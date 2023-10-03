"use client";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { Group, Input, NumberInput, Radio, TextInput } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { getMyCourses, getOneCourse } from "../useAPI/CorsesApi/GetCourses";
import { getHomePage } from "../useAPI/GetUser";
import Cookies from "js-cookie";
import { useRecoilState } from "recoil";
import { navState } from "@/atoms";
import api from "../../app/[locale]/api";
import { Alert } from "react-bootstrap";

function CCheckOut() {
  const [IsUser, setIsUser] = useRecoilState(navState);
  const [show, setShow] = useState(false);
  const t = useTranslations("CheckOut");
  const [paymentValue, setPayment] = useState("1");
  const [payment_methods, setPayment_methods] = useState([]);
  const [course, setCourse] = useState();
  const [code, setCode] = useState("");
  const [Phone, setPhone] = useState("");
  const [discount, setDiscount] = useState(0);
  const [discountID, setDiscountID] = useState();
  const [Price, setPrice] = useState();
  const [ErrorMessage, setErrorMessage] = useState("");
  const [ErrorMessage2, setErrorMessage2] = useState("");
  const SearchParams = useSearchParams();
  const [HaveMyCourses, setHaveMyCourses] = useState();

  const router = useRouter();
  const CoursesID = SearchParams.get("id");

  useEffect(() => {
    FetchDataOFHomePage();
    FetchDataOFOneCourse();
    FetchDataOFMyCourses();
  }, []);
  const FetchDataOFOneCourse = async () => {
    const Courses = await getOneCourse(CoursesID);
    if (!Courses) router.push("/courses");
    if (!Courses.id) {
      router.push("/courses");
    } else {
      setCourse(Courses);
      console.log(Courses);
      setPrice(Courses.price);
    }
  };

  const FetchDataOFHomePage = async () => {
    const AllData = await getHomePage();
    if (!AllData) console.log(AllData?.message);
    setPayment_methods(AllData.payment_methods);
  };
  console.log(payment_methods);
  const handelCoupons = () => {
    const po = api
      .post(
        "/api/v1/users/coupons/check",
        {
          code: code,
          course_id: CoursesID,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")} `,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        setDiscountID(res.data.coupon.id);
        setDiscount(res.data.coupon.value);
      })
      .catch((res) => {
        /*  setLoading(false);*/
        res.response.status === 500 && setShow(true);

        res.response.data.message
          ? setErrorMessage(res.response.data.message)
          : setErrorMessage("");
        console.log(res);
      });
  };

  const handelCheckOut = () => {
    if (!IsUser) {
      router.push("/signIn");
    } else {
      const po = api
        .post(
          "/api/v1/users/purchase/purchase",
          paymentValue === "10"
            ? {
                course_id: CoursesID,
                payment_method_id: paymentValue,
                coupon_id: discountID ? discountID : null,
                phone: Phone,
              }
            : {
                course_id: CoursesID,
                payment_method_id: paymentValue,
                coupon_id: discountID ? discountID : null,
               
              },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")} `,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res);
          res.data.payment_link
            ? router.push(res.data.payment_link)
            : router.push("/checkOut/successfull");
        })
        .catch((res) => {
          /*  setLoading(false);*/
          res.response?.status === 500 && setShow(true);
          res.response.data.message
            ? setErrorMessage2(res.response.data.message)
            : setErrorMessage2("");

          console.log(res);
        });
    }
  };

  console.log(Phone);
  const FetchDataOFMyCourses = async () => {
    const MyCourses = await getMyCourses();
    if (!MyCourses) console.log(MyCourses?.message);
    console.log(MyCourses);
    MyCourses.map((item) => {
      item.id === CoursesID ? setHaveMyCourses(true) : setHaveMyCourses(false);
    });
  };
  console.log(HaveMyCourses);
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
      {course ? (
        <>
          <div className="checkOut container">
            <div className="part1">
              <h2>{t("title")}</h2>
              <form action="">
                <h3>{t("paymentMethod")}</h3>
                <div className="part">
                  <Radio.Group
                    name="favoriteFramework"
                    withAsterisk
                    onChange={setPayment}
                    value={paymentValue}
                  >
                    <Group mt="xs">
                      {payment_methods.map((payment) => {
                        return (
                          <Radio
                            key={payment.id}
                            value={payment.id.toString()}
                            label={payment.name.en}
                          />
                        );
                      })}
                    </Group>
                  </Radio.Group>
                  {paymentValue === "10" && (
                    <TextInput
                      label="Mobile Phone"
                      onChange={(e) => {
                        setPhone(e.target.value);
                      }}
                      value={Phone}
                      placeholder="Your Mobile Phone"
                    />
                  )}
                </div>
                <div className="part"></div>
                <h3>{t("discountCode")}</h3>
                <div className="part apply">
                  <input
                    type="text"
                    placeholder={t("enterCode")}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <input
                    type="submit"
                    className="btn_page2"
                    onClick={(e) => {
                      e.preventDefault();
                      handelCoupons();
                    }}
                    value={t("apply")}
                  />
                </div>
                {ErrorMessage && (
                  <p
                    style={{
                      color: "red",
                      fontSize: "12px",
                      marginTop: "-30px",
                    }}
                  >
                    {ErrorMessage}
                  </p>
                )}
              </form>
            </div>
            <div className="part2">
              <h3>{t("summary")}</h3>
              <h4>{course.name.en}</h4>
              <ul>
                <li>
                  <h5>{t("originalPrice")}</h5>
                  <p>EG{course.price}</p>
                </li>
                {discount ? (
                  <li>
                    <h5>{t("discount")}</h5>
                    <p className="green">-EG{discount}</p>
                  </li>
                ) : (
                  <></>
                )}

                <li>
                  <h5>{t("total")}</h5>
                  <p>EG{Price - discount < 0 ? 0 : Price - discount}</p>
                </li>
              </ul>
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handelCheckOut();
                }}
                className="btn_page"
              >
                {t("title")}
              </button>
              {ErrorMessage2 && (
                <p
                  style={{
                    color: "red",
                    fontSize: "12px",
                    marginTop: "6px",
                    textAlign: "center",
                  }}
                >
                  {ErrorMessage2}
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default CCheckOut;
