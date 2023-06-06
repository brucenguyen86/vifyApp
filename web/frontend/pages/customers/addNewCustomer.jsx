import {Button, Form, FormLayout, Layout, LegacyCard, Page, TextField} from "@shopify/polaris";
import {ProductsCard} from "../../components/index.js";
import {Controller, useForm} from "react-hook-form";
import SearchProduct from "../../components/SearchProduct.jsx";
import React, {useCallback, useEffect, useState} from "react";
import ButtonAddComponent from "../../components/Button.jsx";
import {useAuthenticatedFetch, useNavigate} from "@shopify/app-bridge-react";
import {countriesList} from "../../components/CountrySelect.jsx";

export default function addNewCustomer() {
    const breadcrumbs = [{content: "Home", url: "/"}];
    const fetch = useAuthenticatedFetch()
    const navigate = useNavigate()
    const [show, setShow] = useState(false)


    const {
        register,
        handleSubmit,
        watch,
        setError,
        control,
        setValue: setFormValue,
        reset
    } = useForm({
        criteriaMode: 'all',
    });


    const onSubmit = useCallback(async data => {
        console.log("data", data)
        const test = await fetch("/api/addNewCustomer", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {"Content-Type": "application/json"},
        })
        console.log("test", test)
        alert("Successful")
        navigate("/invoices/newInvoice")


    }, [])
    // useEffect(() => {
    //     // get data from server
    //     const initialData = {
    //         product: '',
    //         price: 0,
    //         tax: 1,
    //         product: '',
    //         subtotal: 0,
    //         total: 0,
    //         description: '',
    //         companyCountry: '',
    //         customer: ''
    //
    //     };
    //
    //     reset(initialData);
    // }, []);

    return (
        <Page
            title="Add a new Customer to your store"
            breadcrumbs={breadcrumbs}
            primaryAction={null}
        >
            <Layout>
                <Layout.Section>
                    <LegacyCard sectioned={true} >
                        <Form onSubmit=
                                  {handleSubmit(onSubmit, (errors) => {
                                      console.log(errors);
                                  })}>
                            <FormLayout>
                                <FormLayout.Group>
                                    <h2><strong>Please enter the information of the new Customer </strong></h2>
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <Controller
                                        control={control}
                                        {...register(`firstName`, {
                                            required: 'You must enter a name'
                                        })}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <>
                                                    <TextField
                                                        label="First Name"
                                                        type="text"
                                                        autoComplete="off"
                                                        value={value}
                                                        onChange={onChange}
                                                    />
                                                    {error ?
                                                        <p style={{color: "red"}}>{error.message}</p> : null}
                                                </>
                                            );
                                        }}>
                                    </Controller>
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <Controller
                                        control={control}
                                        {...register(`lastName`, {
                                            required: 'You must enter a name'
                                        })}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <>
                                                    <TextField
                                                        label="Last Name"
                                                        type="text"
                                                        autoComplete="off"
                                                        value={value}
                                                        onChange={onChange}
                                                    />
                                                    {error ?
                                                        <p style={{color: "red"}}>{error.message}</p> : null}
                                                </>
                                            );
                                        }}>
                                    </Controller>
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <Controller
                                        control={control}
                                        {...register(`email`, {
                                            required: 'You must enter an invalid email'
                                        })}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <>
                                                    <TextField
                                                        label="Email"
                                                        type="email"
                                                        autoComplete="off"
                                                        value={value}
                                                        onChange={onChange}
                                                    />
                                                    {error ?
                                                        <p style={{color: "red"}}>{error.message}</p> : null}
                                                </>
                                            );
                                        }}>
                                    </Controller>
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <Controller
                                        control={control}
                                        {...register(`phone`, {
                                            required: 'You must enter a phone number'
                                        })}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <>
                                                    <TextField
                                                        label="Phone Number"
                                                        type="number"
                                                        autoComplete="off"
                                                        value={value}
                                                        onChange={onChange}
                                                    />
                                                    {error ?
                                                        <p style={{color: "red"}}>{error.message}</p> : null}
                                                </>
                                            );
                                        }}>
                                    </Controller>
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <Controller
                                        control={control}
                                        {...register('country', {required: 'You must select a country'})}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <>
                                                    <SearchProduct
                                                        value={value}
                                                        onChange={(val) => onChange(val?.[0])}
                                                        options={countriesList.map(p => ({
                                                            value: p.code,
                                                            label: p.label,
                                                        }))}
                                                        textFieldLabel="Country"
                                                    />
                                                    {error ?
                                                        <p style={{color: "red"}}>{error.message}</p> : null}
                                                </>
                                            );
                                        }}>
                                    </Controller>
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <Controller
                                        control={control}
                                        {...register(`City`, {
                                            required: 'You must enter a name'
                                        })}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <>
                                                    <TextField
                                                        label="City"
                                                        type="text"
                                                        autoComplete="off"
                                                        value={value}
                                                        onChange={onChange}
                                                    />
                                                    {error ?
                                                        <p style={{color: "red"}}>{error.message}</p> : null}
                                                </>
                                            );
                                        }}>
                                    </Controller>
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <Controller
                                        control={control}
                                        {...register(`zip`, {
                                            required: 'You must enter a  number'
                                        })}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <>
                                                    <TextField
                                                        label="Zipcode"
                                                        type="number"
                                                        autoComplete="off"
                                                        value={value}
                                                        onChange={onChange}
                                                    />
                                                    {error ?
                                                        <p style={{color: "red"}}>{error.message}</p> : null}
                                                </>
                                            );
                                        }}>
                                    </Controller>
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <Controller
                                        control={control}
                                        {...register(`address1`, {
                                            required: 'You must enter an address'
                                        })}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <>
                                                    <TextField
                                                        label="Address"
                                                        type="text"
                                                        autoComplete="off"
                                                        value={value}
                                                        onChange={onChange}
                                                    />
                                                    {error ?
                                                        <p style={{color: "red"}}>{error.message}</p> : null}
                                                </>
                                            );
                                        }}>
                                    </Controller>
                                </FormLayout.Group>

                                <FormLayout.Group>
                                    <Button submit={true} primary={true}>Submit</Button>

                                </FormLayout.Group>

                            </FormLayout>
                        </Form>

                    </LegacyCard>

                </Layout.Section>
                <Layout.Section secondary={true}>
                    <LegacyCard sectioned={true} title={"Demo"}>
                        <Button>Click me</Button>
                    </LegacyCard>

                </Layout.Section>
            </Layout>
        </Page>
    )
}