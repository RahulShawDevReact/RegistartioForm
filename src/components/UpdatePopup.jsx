import { Fragment, useRef, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'

import { useSelector, useDispatch } from 'react-redux'
import { updateDialogPopup, updateUser } from "../features/register/registerSlice.js"
import { useFormik } from "formik";
import * as Yup from "yup";

export default function UpdatePopup({ closeModal, id }) {

    const dialogPopup = useSelector((state) => state.dialogPopup)
    const usersData = useSelector((state) => state.userData)
    console.log("user", usersData)
    const userIndex = usersData.findIndex((user) => user.id === id);
    console.log("index", userIndex)
    // state.users.splice(index, 1, action.payload);
    const dataToUpdate = usersData[userIndex]
    const [age, setAge] = useState(dataToUpdate.age);
    console.log("data", dataToUpdate)
    console.log("dilogboxIn Update", dialogPopup)
    const dispatch = useDispatch()
    const [open, setOpen] = useState(true)
    const cancelButtonRef = useRef(null)
    const [autoFocus, setAutoFocus] = useState(1);

    const cancel = () => {
        console.log("called cancel")
        closeModal()
    }
    const [displayAddress, setDisplayAddress] = useState([""])
    const formik = useFormik({
        initialValues: dataToUpdate,
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
            console.log("display", displayAddress)
            const updatedData = { ...values, age: age, addressArr: displayAddress }

            saveChanges(updatedData);
        },
    });
    const saveChanges = (values) => {
        console.log("values======================", values)
        closeModal()
        dispatch(updateUser(values))
    }
    const handleAddress=(e,index)=>{
        console.log("e",e)
        displayAddress[index]=e.target.value
        
        console.log("display============",displayAddress)
        console.log("arr",formik.values.addressArr)
    }
    useEffect(() => {
        if (formik?.values?.dob !== "") {
            const ageValue = new Date().getFullYear() - Number(formik?.values?.dob?.split("-")[0])
            console.log("agevale", ageValue)
            setAge(ageValue)
        }
        else {
            setAge(0)
        }
        setDisplayAddress(formik?.values?.addressArr)
    }, [formik?.values?.dob]);
    return (

        <Dialog as="div" open={open} className="relative z-10 backdrop" initialFocus={cancelButtonRef} onClose={cancel}>

            <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">

                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-stone-400 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="flex min-h-full flex-1 flex-col justify-center">
                            <div className="sm:mx-auto sm:w-full sm:max-w-sm">

                                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                                    Update
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
                                        <div className="mt-2">
                                            {displayAddress.map((ele, index) => {
                                                return <input
                                                    id={`address${index+1}`}
                                                    key={`address${index+1}`}
                                                    name="addressArr"
                                                    type="text"
                                                    className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 
                                        placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${formik.touched.addressArr && formik.errors.addressArr
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
                                                        handleAddress(e,index)
                                                        
                                                    }}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.addressArr[index].Address}
                                                />
                                                {
                                                    formik.touched.addressArr && formik.errors.addressArr ? (
                                                        <div className="error">*{formik.errors.addressArr}</div>
                                                    ) : null
                                                }
                                            })}
                                        </div>
                                    </div>
                                    <div className="bg-stone-400 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={cancel}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-gray-900  ring-gray-300 hover:bg-green-500 sm:mt-0 sm:w-auto"
                                            ref={cancelButtonRef}
                                        >
                                            Save Changes
                                        </button>
                                    </div>

                                </form>


                            </div>

                        </div>

                    </Dialog.Panel>

                </div>
            </div>
        </Dialog>

    )
}
