"use client";
import {navState} from "@/atoms";
import {LogOut} from "@/components/useAPI/Auth";
import {getUser} from "@/components/useAPI/GetUser";
import {TextInput} from "@mantine/core";
import Cookies from "js-cookie";
import {useTranslations} from "next-intl";
import Link from "next/link";
import {useRouter} from "next/navigation";

import React, {useEffect, useState} from "react";
import PhoneInput from "react-phone-number-input";
import {useRecoilState} from "recoil";
import api from '../api';
import { Alert } from "react-bootstrap";

// export const metadata = {
//   title: 'analytica | Account',
// }

function page() {
    const router = useRouter();
    const [show, setShow] = useState(false);

    const t = useTranslations('Account');
    const t2 = useTranslations('Sign');
    const [IsUser, setIsUser] = useRecoilState(navState);
    const [userData, setUserData] = useState();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState();
    const [phone_country, setPhone_country] = useState("");


    const [selectedFile, setSelectedFile] = useState(null);
    //Error
    const [ErrorName, setErrorName] = useState("");
    const [Erroremail, setErroremail] = useState("");
    const [ErrorPhone, setErrorPhone] = useState("");
    const [ErrorImage, setErrorImage] = useState("");
    const [ErrorMessage, setErrorMessage] = useState("");

    const [IsImage, setIsImage] = useState('');
    const [changeImage, setChangeImage] = useState(false);
    const handleHeaderInputChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setChangeImage(true)
    };

    const HandelLogOut = async () => {
        const UserLogOut = await LogOut(Cookies.get("token"));
        if (UserLogOut.message === "auth.logged_out") {
            console.log("done");
            setIsUser(false);
            Cookies.remove('token')
            router.push('/signIn')
        }
    };
    useEffect(() => {
        FetchDataOFUserData();
    }, []);
    const FetchDataOFUserData = async () => {
        const UserData = await getUser(Cookies.get("token"));
        if (!UserData) console.log(UserData?.message);
        setUserData(UserData);
        setName(UserData.name)
        setEmail(UserData.email)
        setIsImage(UserData.image ? UserData.image.url : null)
        setPhone(UserData.phone)
        setPhone_country(UserData.phone_country)
    };
    console.log(userData);


    const handelProfile = () => {
        setErrorName("")
        setErroremail("")
        setErrorPhone("")
        setErrorImage("")
        setErrorMessage("")
        const body = new FormData();
        body.append('name', name);
        body.append('email', email);
        changeImage ? body.append('image', selectedFile) : null;
        body.append('phone', phone);
        body.append('phone_country', phone_country);
        const po = api
            .post(
                "/api/v1/users/auth/update",
                body,
                {
                    headers: {
                        "Authorization": `Bearer ${Cookies.get('token')}`,
                        "Content-Type": "multipart/form-data",
                        "Accept": "application/json",
                    },
                }
            )
            .then((res) => {
                console.log(res);

            })
            .catch((res) => {
                res.response.status===500&&setShow(true)
                res.response.data.errors?.name
                    ? setErrorName(res.response.data.errors.name[0])
                    : setErrorName("");
                res.response.data.errors?.email
                    ? setErroremail(res.response.data.errors.email[0])
                    : setErroremail("");
                res.response.data.errors?.phone
                    ? setErrorPhone(res.response.data.errors.phone[0])
                    : setErrorPhone("");
                res.response.data.errors?.image
                    ? setErrorImage(res.response.data.errors.image[0])
                    : setErrorImage("");

                res.response.data.message
                    ? setErrorMessage(res.response.data.message)
                    : setErrorMessage("");
                console.log(res);
            });
    };


    return (
        <>
        {
    show&&<Alert variant="danger" onClose={() => setShow(false)} dismissible>
    <Alert.Heading>Oh snap! You got an error!</Alert.Heading>
    <p>
      Change this and that and try again. Duis mollis, est non commodo
      luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.
      Cras mattis consectetur purus sit amet fermentum.
    </p>
  </Alert>
}
            <section className="account container">
                <div className="account_info personal_info">
                    <div className="part1">
                        <h2>{t('account')}</h2>
                        <ul>
                            <li>
                                <Link href="/account" className="active">
                                    {t('personal')}
                                </Link>
                            </li>
                            <li>
                                <Link href="/account/password">{t('password')}</Link>
                            </li>
                            <li>
                                <Link href="/account/activeSessions">{t('active')}</Link>
                            </li>
                            <li>
                                <button onClick={() => {
                                    HandelLogOut();
                                }}>{t('logout')}</button>
                            </li>
                        </ul>
                    </div>
                    <div className="Profile">
                        <h2 className="cart_title2">{t('personal')}</h2>


                        <div className="img_persone">
                            <img
                                src={!changeImage ? IsImage : selectedFile ? URL.createObjectURL(selectedFile) : "/images/icons/person.webp"}
                                className="person" alt="person"/>
                            <div className='inputfile'>
                                <input type="file" onChange={handleHeaderInputChange}/>
                                <img src="/images/icons/Camera.svg" alt="Camera"/>
                            </div>

                        </div>
                        {ErrorImage && (
                            <p
                                style={{
                                    color: "red",

                                    fontSize: "12px",
                                    marginTop: "4px",
                                }}
                            >
                                {ErrorImage}
                            </p>
                        )}
                        <form className="row g-3 form_page">
                            <div className="col-md-12">
                                <TextInput
                                    placeholder={t2('enterFirst')}
                                    label={t2('first')}
                                    type="text"
                                    onChange={(e) => setName(e.target.value)}
                                    error={ErrorName}
                                    value={name}
                                />
                            </div>

                            <div className="col-md-12">
                                <label htmlFor="inputPhone " className="form-label">
                                    {t2('mobile')}
                                </label>
                                <PhoneInput
                                    defaultCountry={phone_country}
                                    placeholder={t2('enterNumber')}
                                    className="form-control"
                                    onCountryChange={(e) => setPhone_country(e)}
                                    value={phone}
                                    onChange={setPhone}
                                />
                            </div>
                            {ErrorPhone && (
                                <p
                                    style={{
                                        color: "red",

                                        fontSize: "12px",
                                        marginTop: "4px",
                                    }}
                                >
                                    {ErrorPhone}
                                </p>
                            )}
                            <div className="col-md-12">

                                <TextInput
                                    placeholder={t2('enterEmail')}
                                    label={t2('email')}
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    error={Erroremail}
                                />


                            </div>
                            <button type="submit" href="" className="next btn_page" onClick={(e) => {
                                e.preventDefault();
                                handelProfile()
                            }}>
                                {t('save')}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}

export default page;
