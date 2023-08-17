
import { useSelector, useDispatch } from 'react-redux'
import { useFormik, FieldArray, Field } from "formik";
import * as Yup from "yup";
import React, { useState, useEffect } from "react";
import { register, updateDialogPopup, removeUser } from "../features/register/registerSlice.js"
import UpdatePopup from './UpdatePopup.jsx';


import { nanoid } from "nanoid"

const Register = () => {

    const [id, setId] = useState()
    const initialValues = {
        id: "",
        userName: '',
        dob: '',
        age: '',
        address: '',
        phonenumber: '',
        password: '',
        confirmPassword: '',
        addressArr: [""],
    };


    const dispatch = useDispatch()
    const [age, setAge] = useState(0);


    // console.log("userData", userData)
    const [autoFocus, setAutoFocus] = useState(1);
    const userData = useSelector((state) => state.userData)
    const [mulAddress, setMulAddress] = useState([]);
    // useEffect(() => {
    //     // autoFocusRef.current.focus();

    // }, [userData]);
    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: Yup.object({
            userName: Yup.string()
                .max(20, "Must be 15 characters or less")
                .matches(
                    /^[a-zA-Z\ ]+$/,
                    "Username cannot contain white number and special character"
                )
                .required("Username is required"),

            dob: Yup.date().max(
                new Date().toISOString().split("T")[0],
                "start date can't be before before date"
            ).required("DOB is required"),
            phonenumber: Yup.string()
                .max(10, "Must be 10 digits number")
                .min(8, "Must be 8 digits number")
                .matches(/^[0-9]+$/, "Phone Number cannot contain letters")
                .required("Phone number is required"),
            addressArr: Yup.string()
                .required("Invalid address"),
            password: Yup.string()
                .min(10, "Must be 10 characters or less")
                .matches(/[A-Z]/, "at least one uppercase char")
                .matches(
                    /[a-zA-Z]+[^a-zA-Z\s]+/,
                    "at least 1 number or special char (@,!,#, etc)."
                )
                .required("Password is required"),
            confirmPassword: Yup.string()
                .required("Confirm password is required")
                .oneOf([Yup.ref("password"), null], "passwords don't match"),
        }),
        onSubmit: (values) => {
            console.log("values", values)
            // alert(JSON.stringify(values));   
            
            const inputFields = document.querySelectorAll("#add-new-adsress input[type='text']");
            // Create empty inputValues array
            const inputValues = [];
            // Loop through input fields
            for (let i = 0; i < inputFields.length; i++) {
                // Push values of each input field into an array
                inputValues.push({'Address':inputFields[i].value});
            }
            
            const data={...values,addressArr:inputValues}
            alert(JSON.stringify(data))
            formSubmitHandler(data);
        },
    });

    useEffect(() => {
        if (formik?.values?.dob !== "") {
            const ageValue = new Date().getFullYear() - Number(formik?.values?.dob?.split("-")[0])
            console.log("agevale", ageValue)
            setAge(ageValue)
        }
        else {
            setAge(0)
        }

        // let i = 1;
        // document.getElementById('addressAdd').addEventListener('click', function () {
        //     let template = `<input id="item'${i} '" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 
        //     placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 name="addressrr" type="text" value="">`;

        //     let container = document.getElementById('add-new-adsress');
        //     let div = document.createElement('div');
        //     div.innerHTML = template;
        //     container.appendChild(div);

        //     i++;
        // })
        // let scntDiv = document.getElementById("resource");
        // console.log("scntDiv", scntDiv)
        // let i = document.querySelectorAll("#resource p").length + 1;
        // console.log("i", i)
        // var name = document.querySelectorAll("#resource p");
        // document.getElementById("addressAdd").addEventListener('click', function () {
        //     console.log("hello")
        //     let id = document.querySelectorAll('tr #resource input ').length + 1;
        //     document.getElementById("resource")
        //         .insertAdjacentHTML("afterend",
        //             `<td ><input id="item${id}" name="addressArr[]" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300  placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" type="text" value=""><img id="remScnt" alt="[-]"></td>`);
        //     i++;
        //     return false;
        //     // $('<tr><td classname=""><input id="item' + id + '" name="item[]" type="text" value=""><img id="remScnt" alt="[-]"></td></tr>').appendTo(scntDiv); i++; return false;
        // });
        // document.getElementById("remScnt").addEventListener('click',
        //     function () {
        //         if (i > 1) { this.parent().parent().remove(); i--; }
        //         return false;
        //     });
        //  document.getElementById("go").click(function () {
        //     let myArray = []; document.querySelector('input').each(function () { myArray.push(this.value); }); alert(myArray)
        // });

    }, [formik?.values?.dob]);
    const formSubmitHandler = (formData) => {
        console.log("formData", formData)
        const data = { ...formData, id: nanoid(14), age: age }
        dispatch(register(data))
    };
    console.log("formik", formik)
    console.log("formik", formik.values)

    let dialogPopup = useSelector((state) => state.dialogPopup)
    const [open, setOpen] = useState(false)
    // console.log("open", open)
    const closeModal = () => {
        setOpen(false)
    }
    const updateUserData = (userID) => {
        console.log("called=========================", userID)
        setOpen(true)
        setId(userID)
    }
    const deleteUserData = (item) => {
        console.log("item", item)
        dispatch(removeUser(item))
    }
    const multipleAddress = () => {
        let i = 1;
        console.log("called")
        let template = `<input id="item${i}"
        name="addressArr" 
        type="text"
        className="block w-full rounded-md border-0 py-1.5 "
        value=""
    />`
        let container = document.getElementById('add-new-adsress');
        let div = document.createElement('div');
        div.innerHTML = template;
        container.appendChild(div);

        i++;


    }
    // formik.values.age=agelimit
    return (<>

        <div className="flex w-full">
            <div className="w-1/2 bg-lime-300">
                <div className="flex min-h-full flex-1 flex-col justify-center">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img
                            className="mx-auto h-10 w-auto"
                            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                            alt="Your Company"
                        />
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                            Register in to your account
                        </h2>
                    </div>

                    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form onSubmit={formik.handleSubmit} className="space-y-3" >
                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Name
                                </label>
                                <div className="mt-2">
                                    <input
                                        type='text'
                                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 
                                        placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.userName && formik.errors.userName
                                                ? "text-error "
                                                : formik.touched.userName
                                                    ? "text-success"
                                                    : ""
                                            }`}
                                        autoFocus={true}
                                        name="userName"
                                        placeholder="Name"
                                        onChange={(e) => {

                                            let autoFocus =
                                                formik.touched.userName && formik.errors.userName
                                                    ? true
                                                    : false;
                                            autoFocus ? setAutoFocus(0) : setAutoFocus(2);
                                            formik.handleChange(e);
                                        }}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.userName}

                                    />
                                    {formik.touched.userName && formik.errors.userName ? (
                                        <div className="error">*{formik.errors.userName}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="dob" className="block text-sm font-medium leading-6 text-gray-900">
                                    Date of birth
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="dob"
                                        name="dob"
                                        type="date"
                                        autoComplete="dob"

                                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 
                                        placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.dob && formik.errors.dob
                                                ? "text-error "
                                                : formik.touched.dob
                                                    ? "text-success"
                                                    : ""
                                            }`}
                                        placeholder='Enter your DOB'
                                        onChange={(e) => {

                                            let autoFocus =
                                                formik.touched.dob && formik.errors.dob
                                                    ? true
                                                    : false;
                                            autoFocus ? setAutoFocus(0) : setAutoFocus(2);
                                            formik.handleChange(e);
                                        }}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.dob}
                                    />
                                    {formik.touched.dob && formik.errors.dob ? (
                                        <div className="error">*{formik.errors.dob}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="age" className="block text-sm font-medium leading-6 text-gray-900">
                                    Age
                                </label>
                                <div className="mt-2">
                                    <input

                                        id="age"
                                        name="age"
                                        type="number"
                                        autoComplete="current-password"
                                        required
                                        className="block w-full rounded-md border-0 py-1.5 disabled:opacity-50"
                                        value={age}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="phonenumber" className="block text-sm font-medium leading-6 text-gray-900">
                                    Phone number
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="phonenumber"
                                        name="phonenumber"
                                        type="number"
                                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 
                                        placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.phonenumber && formik.errors.phonenumber
                                                ? "text-error "
                                                : formik.touched.phonenumber
                                                    ? "text-success"
                                                    : ""
                                            }`}
                                        placeholder='Enter your phonenumber'
                                        onChange={(e) => {

                                            let autoFocus =
                                                formik.touched.phonenumber && formik.errors.phonenumber
                                                    ? true
                                                    : false;
                                            autoFocus ? setAutoFocus(0) : setAutoFocus(2);
                                            formik.handleChange(e);
                                        }}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.phonenumber}
                                    />
                                    {formik.touched.phonenumber && formik.errors.phonenumber ? (
                                        <div className="error">*{formik.errors.phonenumber}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="addressArr" className="block text-sm font-medium leading-6 text-gray-900">
                                    Address
                                </label>
                                <div className="mt-2" id='add-new-adsress'>

                                    <input
                                        id="item0"
                                        name="addressArr"
                                        type="text"
                                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 
                                        placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.phonenumber && formik.errors.phonenumber
                                                ? "text-error "
                                                : formik.touched.addressArr
                                                    ? "text-success"
                                                    : ""
                                            }`}
                                        placeholder='Enter your address'
                                        onChange={(e) => {

                                            let autoFocus =
                                                formik.touched.addressArr && formik.errors.addressArr
                                                    ? true
                                                    : false;
                                            autoFocus ? setAutoFocus(0) : setAutoFocus(2);
                                            formik.handleChange(e);
                                        }}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.addressArr}
                                    />
                                    {formik.touched.addressArr && formik.errors.addressArr ? (
                                        <div className="error">*{formik.errors.addressArr}</div>
                                    ) : null}


                                    <div className='mt-2' id='addressAdd' onClick={multipleAddress}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>

                                    </div>




                                </div>
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                    Password
                                </label>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 
                                        placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.phonenumber && formik.errors.phonenumber
                                                ? "text-error "
                                                : formik.touched.password
                                                    ? "text-success"
                                                    : ""
                                            }`}
                                        placeholder='Enter your password'
                                        onChange={(e) => {

                                            let autoFocus =
                                                formik.touched.password && formik.errors.password
                                                    ? true
                                                    : false;
                                            autoFocus ? setAutoFocus(0) : setAutoFocus(2);
                                            formik.handleChange(e);
                                        }}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.password}
                                    />
                                    {formik.touched.password && formik.errors.password ? (
                                        <div className="error">*{formik.errors.password}</div>
                                    ) : null}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                    Confirm password
                                </label>
                                <div className="mt-2 flex">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 
                                        placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.phonenumber && formik.errors.phonenumber
                                                ? "text-error "
                                                : formik.touched.confirmPassword
                                                    ? "text-success"
                                                    : ""
                                            }`}
                                        placeholder='Enter your confirm Password'
                                        onChange={(e) => {

                                            let autoFocus =
                                                formik.touched.confirmPassword && formik.errors.confirmPassword
                                                    ? true
                                                    : false;
                                            autoFocus ? setAutoFocus(0) : setAutoFocus(2);
                                            formik.handleChange(e);
                                        }}
                                        onBlur={formik.handleBlur}
                                        value={formik.values.confirmPassword}
                                    />
                                    {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                                        <div className="error">*{formik.errors.confirmPassword}</div>
                                    ) : null}
                                </div>
                            </div>
                            {/* button */}
                            <div className="flex justify-center items-center">
                                <button
                                    type="submit"
                                    className="flex w-1/2 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  bg-lime-950focus-visible:outline-indigo-600"
                                >
                                    Register
                                </button>
                            </div>
                        </form>


                    </div>
                </div>
            </div>
            <div className="w-full  border-8">
                <div className="flex flex-col ">
                    <h1 className="text-2xl inline-block align-middle">User's Data</h1>
                    <div >
                        <div className="inline-block min-w-full">
                            <div className="overflow-hidden">
                                <table className="min-w-full text-center text-sm font-light">
                                    <thead
                                        className="border-b bg-neutral-800 font-medium text-white dark:border-neutral-500 dark:bg-neutral-900">
                                        <tr>
                                            <th scope="col" className=" px-6 py-4">Name</th>
                                            <th scope="col" className=" px-6 py-4">Age</th>
                                            <th scope="col" className=" px-6 py-4">DOB</th>
                                            <th scope="col" className=" px-6 py-4">Phone Number</th>
                                            <th scope="col" className=" px-6 py-4">Address</th>
                                            <th scope="col" className=" px-6 py-4">Action</th>
                                        </tr>
                                    </thead>
                                    {userData.length !== 0 ? (<tbody>
                                        {userData.map((ele) => {
                                            return (<tr className="border-b dark:border-neutral-500" key={ele.id}>
                                                <td className="px-6 py-4 font-medium">{ele.userName}</td>
                                                <td className="whitespace-nowrap  px-6 py-4">{ele.age}</td>
                                                <td className="whitespace-nowrap  px-6 py-4">{ele.dob}</td>
                                                <td className="whitespace-nowrap  px-6 py-4">{ele.phonenumber}</td>
                                                <td className="whitespace-nowrap  px-6 py-4">
                                                    {ele.addressArr.map((el,index)=>{
                                                        return (<tr className="border-b dark:border-neutral-500" key={index}>{index+1} - {el.Address}</tr>)
                                                    })}</td>
                                                <tr className="flex min-h-full flex-1  justify-center">
                                                    <td className="w-1/2 whitespace-nowrap  px-6 py-4" onClick={() => updateUserData(ele.id)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                    </svg>
                                                    </td>
                                                    <td className="w-1/2whitespace-nowrap  px-6 py-4 " onClick={() => deleteUserData(ele.id)}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                    </svg>
                                                    </td>
                                                </tr>
                                            </tr>)
                                        })}
                                    </tbody>) : (<tbody><tr className="border-b dark:border-neutral-500   h-24 bg-lime-950 w-100" >
                                        <td colSpan="6" className='noDataTd'>No user found</td></tr></tbody>
                                    )}

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        {open && <UpdatePopup closeModal={closeModal} id={id} />}
    </>);
}

export default Register;