import {FormLayout, Layout, TextField} from "@shopify/polaris";
import {Controller, useForm, useWatch} from "react-hook-form";
import SearchProduct from "./SearchProduct.jsx";
import React, {useEffect, useState} from "react";

export default function NewLineItem (props){
    const {
        productList: productList,
        variantList: variantList,
        register: register,
        handleSubmit: handleSubmit,
        watch: watch,
        setError: setError,
        control: control,
        setValue: setValue,
        reset: reset,
        index: index,
        onChange: onChange

    } = props
    let qtyFieldValue = useWatch({control, name: `lineItem.${index}.quantity`});

    // eval ('let '+ 'productValue'+index + '= ' +'useWatch({control, name: `product${index}`})')
    let productValue = useWatch({control, name: `lineItem.${index}.id`})
    let variantFieldValue = useWatch({control, name: `lineItem.${index}.variantId`})
    const [newVariantList,setNewVariantList] = useState([])
    const [show,setShow] = useState(false)


    useEffect(() => {
        variantList.find(p => {
            if (p.variantId === variantFieldValue) {
                setValue(`lineItem.${index}.subTotal`, parseFloat(p.price) * parseFloat(qtyFieldValue))
            }
        })
    }, [variantFieldValue, qtyFieldValue])


    useEffect(() => {
        productList.find((p) => {
            if (p.productId === productValue) {
                setValue(`lineItem.${index}.description`, p.productDescription)
            }
        })
    }, [productValue])

    useEffect(() => {
        variantList.find((p) => {
            if (p.variantId === variantFieldValue) {
                console.log("price2",p.price)
                setValue(`lineItem.${index}.price`, p.price)
            }
        })
    }, [variantFieldValue])
    useEffect(() => {
        let array =[]
        variantList.find((p) => {
            if(p.productId === productValue){
                array.push(p)
            }
            setNewVariantList(array)
        })
    }, [productValue])

    return(

    <FormLayout>
        <FormLayout.Group>
            <h2><strong>Please choose the line items</strong> </h2>
        </FormLayout.Group>
    <FormLayout.Group>
        <Controller
            control={control}
            {...register(`lineItem.${index}.id`, {required: 'You must select a product'})}
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
                            options={productList.map(p => ({
                                value: p.productId,
                                label: p.productTitle
                            }))}

                            textFieldLabel = "Choose a line Item"
                        />
                        {error ? <p style={{color: "red"}}>{error.message}</p> : null}
                    </>
                );
            }}>
        </Controller>
    </FormLayout.Group>
    <FormLayout.Group>
        <Controller
            control={control}
            {...register(`lineItem.${index}.description`)}
            render={({
                         field: {onChange, onBlur, value, name, ref},
                         fieldState: {invalid, isTouched, isDirty, error},
                         formState,
                     }) => {
                return (
                    <TextField
                        label="Description"
                        value={value}
                        autoComplete="off"
                        onChange={onChange}
                    />
                );
            }}>
        </Controller>

    </FormLayout.Group>
        <FormLayout.Group>
            <Controller
                control={control}
                {...register(`lineItem.${index}.variantId`, {required: 'You must select a variant'})}
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
                                options={newVariantList.map(p => ({
                                    value: p.variantId,
                                    label: p.variantTitle
                                }))}

                                textFieldLabel="Choose a variant"
                            />
                            {error ? <p style={{color: "red"}}>{error.message}</p> : null}
                        </>
                    );
                }}>
            </Controller>
        </FormLayout.Group>
    <FormLayout.Group>
        <Controller
            control={control}
            {...register(`lineItem.${index}.price`)}
            render={({
                         field: {onChange, onBlur, value, name, ref},
                         fieldState: {invalid, isTouched, isDirty, error},
                         formState,
                     }) => {
                return (
                    <TextField
                        label="Price"
                        value={value}
                        prefix="$"
                        autoComplete="off"
                        onChange={onChange}
                    />
                );
            }}>
        </Controller>
        <Controller
            control={control}
            {...register(`lineItem.${index}.quantity`, {
                required: 'You must enter a number', min: {
                    value: 0,
                    message: 'The value must be greater than 0'
                }, max: {
                    value: 100,
                    message: 'The value must be under 100'
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
                            label="Quantity"
                            type="number"
                            prefix="item(s)"
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
                {...register(`lineItem.${index}.subTotal`)}
                render={({
                             field: {onChange, onBlur, value, name, ref},
                             fieldState: {invalid, isTouched, isDirty, error},
                             formState,
                         }) => {
                    return (
                        <TextField
                            label="Total of This Line Item"
                            value={value}
                            prefix="$"
                            autoComplete="off"
                            onChange={onChange}
                        />
                    );
                }}>
            </Controller>
        </FormLayout.Group>

    </FormLayout>
    )
}