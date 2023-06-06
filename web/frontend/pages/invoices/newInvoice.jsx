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
import {TitleBar, useAuthenticatedFetch, useNavigate} from "@shopify/app-bridge-react";
import React, {useCallback, useState, useReducer, useRef, useEffect, useMemo} from "react";
import {countriesList} from "../../components/CountrySelect.jsx";
import {Controller, useForm, useWatch} from "react-hook-form"
import SearchProduct from "../../components/SearchProduct.jsx"
import NewLineItem from "../../components/NewLineItem.jsx";
import ButtonAddComponent from "../../components/Button.jsx";


export default function ManageCode() {
    const breadcrumbs = [{content: "Home", url: "/"}];
    const fetch = useAuthenticatedFetch()
    const [productMockList, setProductMockList] = useState([])
    const [customerList, setCustomerList] = useState([])
    const [variantList, setVariantList] = useState([])
    const [orders, setOrders] = useState([])

    // const [productsInput,setProductsInput]
    const navigate = useNavigate()

    const handleFetchProduct = useCallback(() => {
        fetch("/api/products").then(data => {
            const response = data.json()
            console.log("response", response)
            response.then(value => {
                console.log("value of products from Shopify", value.products)
            })
        });
    }, []);
    useEffect(() => {
        fetch("/api/productsFromDB").then(data => {
            const response = data.json()
            // console.log("response", response)
            response.then(value => {
                setProductMockList(value)
                console.log("value of products", value)

            })
        });
        fetch("/api/variantsFromDB").then(data => {
            const response = data.json()
            response.then(value => {
                setVariantList(value)
            })
        })
    }, []);

    useEffect(() => {
        fetch("/api/customersFromDB").then(data => {
            const response = data.json()
            response.then(value => {
                // setCustomerList(useMemo(() => value.customers,[]))
                console.log("Value:", value)
                setCustomerList(value)
                console.log("value of customers", value)
            })
        });
    }, []);
    const handleFetchCustomer = useCallback(() => {
        fetch("/api/customers").then(data => {
            const response = data.json()
            response.then(value => {
                console.log("value of customers from Shopify", value.customers)
            })
        });
    }, []);
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
    const taxFieldValue = useWatch({control, name: 'tax'})
    const customerValue = useWatch({control, name: 'customer'})
    const subTotal = useWatch({control, name: 'subTotal'})
    const lineItemFieldValues = useWatch({control,name:`lineItem`})
    const [show, setShow] = useState(false)
    const [components, setComponents] = useState(["Sample Component"])
    const addComponent = useCallback(() => {
        console.log("come here")
        setComponents([...components, "Sample Component"])
        setShow(true)
    }, [components])


    // console.log("breadcrumb", breadcrumbs)

    useEffect(() => {
        customerList.find(p => {
            if (p.customerId === customerValue) {
                setFormValue('customerEmail', p.email)
            }
        })
    }, [customerValue])
    useEffect(() => {
        let temp = 0
        const lineItemPriceSum = lineItemFieldValues?.reduce((sum, line) => {
            sum = sum + (parseFloat(line.price) || 0) * ( parseFloat(line.quantity) || 0);
            return sum;
        }, 0);
        setFormValue('subTotal', lineItemPriceSum)
    }, [lineItemFieldValues])

    useEffect(() => {
        setFormValue('total', (100 + taxFieldValue) * subTotal / 100)
    }, [taxFieldValue, subTotal])

    const addNewLineItem = useCallback(() => {
        navigate("/lineItems/addNewLineItem")
    }, [])

    const addNewCustomer = useCallback(() => {
        navigate("/customers/addNewCustomer")
    }, [])


    const onSubmit = useCallback(async data => {
        console.log("data", data)

        const test = await fetch('/api/invoices', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {"Content-Type": "application/json"},
        })
        console.log("test", test)
        navigate("/invoices/printInvoice")
    }, [])

    useEffect(() => {
        const initialData = {
            tax: 1,
            subTotal: 0,
            total: 0,
            customer: '',
            customerName: '',
            customerCity: '',
            customerZipCode: '',
            companyName: '',
            companyCity: '',
            companyAddress: '',
            customerAddress: '',
            companyEmail: '',
        };
        reset(initialData);
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
                        <Form onSubmit=
                                  {handleSubmit(onSubmit, (errors) => {
                                      console.log(errors);
                                  })}>
                            <FormLayout>
                                <FormLayout.Group>
                                    <Button onClick={handleFetchProduct}>Fetch Products From Shopify</Button>
                                </FormLayout.Group>
                                {/*<FormLayout.Group>*/}
                                {/*    <h2><strong>Please choose the line items</strong></h2>*/}
                                {/*</FormLayout.Group>*/}


                                {components.map((item, index) => (<FormLayout.Group>

                                    <NewLineItem productList={productMockList}
                                                 variantList={variantList}
                                                 register={register}
                                                 handleSubmit={handleSubmit}
                                                 watch={watch}
                                                 setError={setError}
                                                 control={control}
                                                 setValue={setFormValue}
                                                 reset={reset}
                                                 index={index}
                                        // onChange={(val) => onChange(val?.[0])}
                                    />


                                </FormLayout.Group>))}
                                <ButtonAddComponent onClick={addComponent}
                                                    text="Add another Line Item"
                                />
                                <FormLayout.Group>
                                    <Controller
                                        control={control}
                                        {...register('subTotal')}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <TextField
                                                    label="SubTotal"
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
                                        <h2><strong>Enter Your company Information</strong></h2>
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
                                        {...register('companyZipCode', {required: 'You must enter a number'})}
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
                                        {...register('companyAddress', {required: 'You must enter an address'})}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <>
                                                    <TextField
                                                        label="Address"
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
                            </FormLayout>
                            <FormLayout>
                                <br/>
                                <FormLayout.Group>
                                    <Button onClick={handleFetchCustomer}>Fetch Customers From Shopify</Button>
                                </FormLayout.Group>
                                <FormLayout.Group>
                                    <div style={{alignContent: "flex-start", fontWeight: "bold"}}>
                                        <h2><strong>Enter Your Customer Information</strong></h2>
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
                                                            label: p.name,
                                                        }))}
                                                        textFieldLabel="Customer's Name"
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
                                        {...register('customerZipCode', {required: 'You must enter a number'})}
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
                                        {...register('customerAddress', {required: 'You must enter an address'})}
                                        render={({
                                                     field: {onChange, onBlur, value, name, ref},
                                                     fieldState: {invalid, isTouched, isDirty, error},
                                                     formState,
                                                 }) => {
                                            return (
                                                <>
                                                    <TextField
                                                        label="Address"
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
                                    <Button submit={true} primary={true}>Generate Invoice</Button>
                                </FormLayout.Group>
                            </FormLayout>
                        </Form>
                    </LegacyCard>
                </Layout.Section>

                <Layout.Section secondary={true}>
                    <LegacyCard sectioned={true} title={"Create new Products or Add more Customers"}>
                        <Button
                            onClick={addNewLineItem}
                        > Create new Products</Button>
                        <br/>
                        <br/>
                        <Button
                            onClick={addNewCustomer}
                        > Add more Customers</Button>
                    </LegacyCard>
                </Layout.Section>
            </Layout>
        </Page>
    );
}

