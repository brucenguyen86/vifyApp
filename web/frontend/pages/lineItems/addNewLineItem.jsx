import {Button, Form, FormLayout, Layout, LegacyCard, Page, TextField} from "@shopify/polaris";
import {ProductsCard} from "../../components/index.js";
import {Controller, useForm} from "react-hook-form";
import React, {useCallback, useEffect, useState} from "react";
import ButtonAddComponent from "../../components/Button.jsx";
import {useAuthenticatedFetch, useNavigate} from "@shopify/app-bridge-react";

export default function addNewLineItem() {
    const breadcrumbs = [{content: "Home", url: "/"}];
    const [components, setComponents] = useState(["Sample Component"])
    const navigate = useNavigate()
    const [numberOfVariant, setNumberOfVariant] = useState(1)
    const fetch = useAuthenticatedFetch()
    const [show, setShow] = useState(false)
    const addComponent = useCallback(() => {
        console.log("come here")
        setComponents([...components, "Sample Component"])
        // setShow(true)
        setNumberOfVariant(numberOfVariant + 1)

    }, [components])


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

    useEffect(() => {
        setFormValue('numberOfVariant', numberOfVariant)
    }, [numberOfVariant])

    const onSubmit = useCallback(async data => {
        console.log("data", data)
        const test = await fetch("/api/addNewLineItem", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {"Content-Type": "application/json"},
        })
        console.log("test", test)
        alert("Successful")
        navigate("/invoices/newInvoice")

    }, [])


    return (
        <Page
            title="Add a new Line Item to your store"
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
                                    <h2><strong>Please enter the information of the new line item </strong></h2>
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <Controller
                                        control={control}
                                        {...register(`title`, {
                                            required: 'You must enter a Line Item Title'
                                        })}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <>
                                                    <TextField
                                                        label="Line Item"
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
                                        {...register(`description`, {
                                            required: 'You must enter the description'
                                        })}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <>
                                                    <TextField
                                                        label="Description"
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
                                        {...register(`imageUrl`, {
                                            required: 'You must enter an URL of the Image'
                                        })}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <>
                                                    <TextField
                                                        label="Image"
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

                                    {components.map((item, i) => (
                                        <div>
                                            <Controller
                                                control={control}
                                                {...register(`variant.${i}.options`, {
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
                                                                label="Variant"
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
                                            <Controller
                                                control={control}
                                                {...register(`variant.${i}.price`, {
                                                    required: 'You must enter a number', min: {
                                                        value: 0,
                                                        message: 'The value must be greater than 0'
                                                    }
                                                })}
                                                render={({
                                                             field: {onChange, onBlur, value, name, ref},
                                                             fieldState: {invalid, isTouched, isDirty, error},
                                                             formState,
                                                         }) => {
                                                    return (
                                                        <>
                                                            <TextField
                                                                label="Variant Price"
                                                                type="number"
                                                                prefix="$"
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

                                        </div>
                                    ))}


                                </FormLayout.Group>

                                <FormLayout.Group>
                                    <ButtonAddComponent onClick={addComponent}
                                                        text="Add another variant"
                                    />

                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <Button submit={true} primary={true}>Submit</Button>

                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <Controller
                                        control={control}
                                        {...register(`numberOfVariant`)}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <>
                                                    {show && <TextField
                                                        label="Number of Variant"
                                                        type="number"
                                                        autoComplete="off"
                                                        value={value}
                                                        onChange={onChange}
                                                        labelHidden={true}
                                                    />}
                                                </>
                                            );
                                        }}>
                                    </Controller>
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