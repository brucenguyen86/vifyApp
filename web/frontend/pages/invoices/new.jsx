import {
    DropZone,
    FormLayout,
    Layout,
    LegacyCard,
    LegacyStack,
    Page,
    Select,
    TextField,
    Button,
    Form

} from "@shopify/polaris";
import {TitleBar, useAuthenticatedFetch} from "@shopify/app-bridge-react";
import React, {useCallback, useState, useReducer, useRef, useEffect, useMemo} from "react";
import {countriesList} from "../../components/CountrySelect.jsx";
import {Controller, useForm, useWatch} from "react-hook-form"
import SearchProduct from "../../components/SearchProduct.jsx"


export default function ManageCode() {
    const breadcrumbs = [{content: "Home", url: "/"}];
    const fetch = useAuthenticatedFetch()
    const [productMockList, setProductMockList] = useState([])
    const [customerList, setCustomerList] = useState([])
// //
//     Promise.all([
//         fetch("/api/products").then(value => value.json()),
//         fetch("/api/customers").then(value => value.json())
//     ]).then((allResponse) => {
//         const response1 = allResponse[0]
//         const response2 = allResponse[1]
//         console.log(response1,response2)
//     }).catch(e => console.log(e))
// //
    useEffect(() => {
        fetch("/api/products").then(data => {
            const response = data.json()
            // console.log("response", response)
            response.then(value => {
                // setProductMockList( useMemo(() => value.products,[]))
                setProductMockList(value.products)
                console.log("value of products", value.products)

            })
        });
    }, []);
    useEffect(() => {
        fetch("/api/customers").then(data => {
            const response = data.json()
            console.log("response", response)
            response.then(value => {
                // setCustomerList(useMemo(() => value.customers,[]))
                setCustomerList(value.customers)
                console.log("value of customers", value.customers)
            })
        });
    }, []);


    // const productMockList =
    //     [
    //         {title: 'a pencil', id: 'Verynice', description: 'A good Product', price: 100},
    //         {title: 'a book', id: 'Verynice1', description: 'A terrible thing', price: 101},
    //         {title: 'a table', id: 'Verynice2', description: 'good stuff', price: 102},
    //         {title: 'a abc', id: 'Verynice3', description: 'Perfect', price: 103},
    //         {title: 'a teacher', id: 'Verynice4', description: 'smelly', price: 104},
    //         {title: 'a student', id: 'Verynice5', description: 'from VN', price: 105}
    //     ];
    const customerMockList =
        [
            {id: '123', name: 'Bruce', email: 'hung@gmail.com'},
            {id: 'a123', name: 'Henry', email: 'tam@gmail.com'},
            {id: 'd123', name: 'Alex', email: 'tuyet@gmail.com'},
            {id: 'e123', name: 'Peter', email: 'pede@gmail.com'},
            {id: 'd12', name: 'John', email: 'kerry@gmail.com'},
            {id: 'f123', name: 'Terry', email: 'tom@gmail.com'},
        ];
    const options1 = [
        {label: 'A pencil', value: 'pencil'},
        {label: 'A Book', value: 'book'},
        {label: 'A Table', value: 'table'},]
    // Products example database

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: {errors},
        control,
        setValue: setFormValue,
        reset
    } = useForm({
        criteriaMode: 'all',
    });
    const qtyFieldValue = useWatch({control, name: 'quantity'});
    const taxFieldValue = useWatch({control, name: 'tax'})
    const productValue = useWatch({control, name: 'product'})
    const customerValue = useWatch({control, name: 'customer'})
    const subTotal = useWatch({control,name: 'subtotal'})

    console.log("breadcrumb", breadcrumbs)

    useEffect(() => {
        customerList.find(p => {
            if (p.customerId === customerValue) {
                setFormValue('customerEmail', p.email)
            }
        })
    })
    useEffect(() => {
        productMockList.find(
            p => {
                if (p.id === productValue) {
                    p.variants.map(val => {
                        setFormValue('subtotal', val.price * qtyFieldValue)
                    })
                }
            })
    }, [productValue, qtyFieldValue])

    useEffect(() => {
        setFormValue('total', (100-taxFieldValue) * subTotal/100 )
    }, [taxFieldValue, subTotal])


    useEffect(() => {
        productMockList.find((p) => {
            if (p.id === productValue) {
                setFormValue('description', p.description)
            }
        })
    }, [productValue])
    useEffect(() => {
        productMockList.find((p) => {
            if (p.id === productValue) {
                p.variants.map(val => {
                    setFormValue('price', val.price)
                })

            }
        })
    }, [productValue])

    const onSubmit = data => {
        // send data to server to store
        console.log(data)
    }

    useEffect(() => {
        // get data from server
        const mockData = {
            quantity: 1,
            price: 0,
            tax: 1,
            product: '',
            subtotal: 0,
            total: 0,
            description: '',
            companyCountry: '',
            customer: ''

        };

        reset(mockData);
    }, []);

    return (
        <Page>
            <TitleBar
                title="Generate new Invoice"
                breadcrumbs={breadcrumbs}
                primaryAction={null}
            />
            <Layout>
                <Layout.Section>
                    <LegacyCard sectioned={true}>
                        <Form onSubmit={handleSubmit(onSubmit, (errors) => {
                            console.log(errors);
                        })}>
                            <FormLayout>
                                <FormLayout.Group>
                                    <h4>Please choose the line items </h4>
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <Controller
                                        control={control}
                                        {...register('product', {required: 'You must select a product'})}
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
                                                        options={productMockList.map(p => ({
                                                            value: p.id,
                                                            label: p.title
                                                        }))}
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
                                        {...register('description')}
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
                                <FormLayout.Group condensed={true}>
                                    <Controller
                                        control={control}
                                        {...register('price')}
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
                                        {...register('quantity', {
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
                                <br/>
                                <FormLayout.Group>
                                    <Controller
                                        control={control}
                                        {...register('subtotal')}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <TextField
                                                    label="Subtotal"
                                                    value={value}
                                                    prefix="$"
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
                                        {...register('tax', {
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
                                                        label="Tax"
                                                        type="number"
                                                        prefix="%"
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

                                    {/*{errors.taxValue && (*/}
                                    {/*    <p style={{color: "red"}}>You must enter the Tax Value and it must be from 0 to*/}
                                    {/*        99</p>*/}
                                    {/*)}*/}
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <Controller
                                        control={control}
                                        {...register('total')}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <TextField
                                                    label="Total"
                                                    prefix="$"
                                                    value={value}
                                                    autoComplete="off"
                                                    onChange={onChange}
                                                />
                                            );
                                        }}>
                                    </Controller>
                                </FormLayout.Group>

                                <FormLayout.Group>
                                    <div style={{alignContent: "flex-start", fontWeight: "bold"}}>
                                        <h4>Enter Your company Information </h4>
                                        <hr/>
                                    </div>
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <Controller
                                        control={control}
                                        {...register('companyName', {required: 'You must enter a number'})}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <>
                                                    <TextField
                                                        label="Company's Name"
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
                                        {...register('companyEmail', {required: 'You must enter an Email'})}
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
                                                        autoComplete="email"
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
                                        {...register('companyCity', {required: 'You must enter a name'})}
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
                                    <Controller
                                        control={control}
                                        {...register('zipCode', {required: 'You must enter a number'})}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <>
                                                    <TextField
                                                        label="Zip code"
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
                                        {...register('companyCountry', {required: 'You must select a name'})}
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
                                                            label: p.label
                                                        }))}
                                                    />
                                                    {error ?
                                                        <p style={{color: "red"}}>{error.message}</p> : null}
                                                </>
                                            );
                                        }}>
                                    </Controller>
                                    {/*<Controller*/}
                                    {/*    control={control}*/}
                                    {/*    {...register("companyCountry")}*/}
                                    {/*    render={({field}) => (*/}
                                    {/*        <SearchProduct*/}
                                    {/*            value={field.value}*/}
                                    {/*            onChange={(val) => field.onChange(val?.[0])}*/}
                                    {/*            options={countriesList.map((p) => ({ value: p.code, label: p.label }))}*/}
                                    {/*        />*/}
                                    {/*    )}*/}
                                    {/*/>*/}
                                </FormLayout.Group>

                                <FormLayout.Group>
                                    <DropZone label="Upload">
                                        <DropZone.FileUpload/>
                                    </DropZone>
                                </FormLayout.Group>
                                <hr/>
                            </FormLayout>
                            {/*Customer*/}
                            <FormLayout>
                                <FormLayout.Group>
                                    <div style={{alignContent: "flex-start", fontWeight: "bold"}}>
                                        <h4>Enter Your Customer Information </h4>
                                        <hr/>
                                    </div>
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <Controller
                                        control={control}
                                        {...register('customer', {required: 'You must select a customer'})}
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
                                                        options={customerList.map(p => ({
                                                            value: p.customerId,
                                                            label: p.name
                                                        }))}
                                                    />
                                                    {error ?
                                                        <p style={{color: "red"}}>{error.message}</p> : null}
                                                </>
                                            );
                                        }}>
                                    </Controller>
                                    <Controller
                                        control={control}
                                        {...register('customerEmail', {required: 'You must enter an Email'})}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <>
                                                    <TextField
                                                        label="Email"
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
                                <FormLayout.Group condensed={true}>
                                    <Controller
                                        control={control}
                                        {...register('customerCity', {required: 'You must enter a name'})}
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
                                    <Controller
                                        control={control}
                                        {...register('customerZipcode', {required: 'You must enter a number'})}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <>
                                                    <TextField
                                                        label="Zip code"
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
                                <FormLayout.Group condensed={true}>
                                    <Controller
                                        control={control}
                                        {...register('customerCountry', {required: 'You must select a name'})}
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
                                                            label: p.label
                                                        }))}
                                                    />
                                                    {error ?
                                                        <p style={{color: "red"}}>{error.message}</p> : null}
                                                </>
                                            );
                                        }}>
                                    </Controller>
                                    <Controller
                                        control={control}
                                        {...register('customerCity', {required: 'You must enter a number'})}
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
                                    <Button submit={true} primary={true}>Generate Invoice</Button>
                                </FormLayout.Group>
                            </FormLayout>
                        </Form>
                    </LegacyCard>
                </Layout.Section>

                <Layout.Section secondary={true}>
                    <LegacyCard sectioned={true}>
                        <Button> Click me</Button>
                    </LegacyCard>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

