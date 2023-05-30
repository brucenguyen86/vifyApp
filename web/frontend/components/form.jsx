import React, {useCallback, useState} from "react";
import {
    Button,
    Form,
    AlphaCard,
    FormLayout,
    TextField,
    Select,
    DropZone,
    LegacyCard,
    LegacyStack,
    Thumbnail,
    Icon,
    Layout,
    ContextualSaveBar
} from "@shopify/polaris";
import {CustomerInvoice} from "./CustomerInvoice.jsx";
import {ResourcePicker, useNavigate} from "@shopify/app-bridge-react";
/* Import the useAuthenticatedFetch hook included in the Node app template */
import { useAuthenticatedFetch } from "../hooks";

/* Import custom hooks for forms */
import { useForm, useField, notEmptyString } from "@shopify/react-form";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import {isValidEmailAddress} from "jsdom/lib/jsdom/living/helpers/form-controls.js";
// import {isNumber} from
import {AlertMinor, ImageMajor} from "@shopify/polaris-icons";


export function InvoiceForm({ Product: InitialProduct }) {
    // Initial the values of Products
    const [selectedProduct, setSelectedProduct] = useState(InitialProduct);
    const [showResourcePicker, setShowResourcePicker] = useState(false);
    // const [__selectedProduct, setSelectedProduct] = useState(Product?.id);
    const navigate = useNavigate();
    const fetch = useAuthenticatedFetch();

    // Each time we submit, we will write data to our database
    const onSubmit = useCallback(
        (body) => {
            (async () => {
                const parsedBody = body;
                parsedBody.destination = parsedBody.destination[0];
                const ProductID = selectedProduct?.id;
                /* construct the appropriate URL to send the API request to based on whether the Product is new or being updated */
                const url = ProductID ? `/api/products/${ProductID}` : "/api/products";
                /* a condition to select the appropriate HTTP method: PATCH to update a QR code or POST to insert a new QR code */
                const method = ProductID ? "PATCH" : "POST";
                /* use (authenticated) fetch from App Bridge to send the request to the API and, if successful, clear the form to reset the ContextualSaveBar and parse the response JSON */
                const response = await fetch(url, {
                    method,
                    body: JSON.stringify(parsedBody),
                    headers: {"Content-Type": "application/json"},
                });
                if (response.ok) {
                    makeClean();
                    const Product = await response.json();
                    /* if this is a new QR code, then save the QR code and navigate to the edit page; this behavior is the standard when saving resources in the Shopify admin */
                    if (!ProductID) {
                        navigate(`/products/${ProductID.id}`);
                        /* if this is a QR code update, update the QR code state in this component */
                    } else {
                        setSelectedProduct(selectedProduct);
                    }
                }
            })();
            return {status: "success"};
        },
        [selectedProduct, setSelectedProduct]
    );

    /*
   Sets up the form state with the useForm hook.

   Accepts a "fields" object that sets up each individual field with a default value and validation rules.

   Returns a "fields" object that is destructured to access each of the fields individually, so they can be used in other parts of the component.

   Returns helpers to manage form state, as well as component state that is based on form state.
 */
    const {
        fields: {
            productId,

            // companyName,
            // companyAddress,
            // companyEmail,
            // companyCity,
            // companyZipCode,

        },
        dirty,
        reset,
        submitting,
        submit,
        makeClean,
    } = useForm({
        fields: {
            // companyName: useField(
            //     {
            //         value: {companyName},
            //         validates: [notEmptyString("Please name your QR code")],
            //     }),
            // companyAddress: useField({
            //     value: {companyAddress},
            //     validates: [notEmptyString("Please enter your company's address")],
            // }),
            // companyEmail: useField({
            //     value: {companyEmail},
            //     validates: [isValidEmailAddress]
            // }),
            // companyCity: useField({
            //     value: {companyCity},
            //     validates: [notEmptyString("Please enter your Company City")]
            // }),
            // companyZipCode: useField({
            //     value: {companyZipCode},
            //     validates: [notEmptyString("Please enter your Company Zip Code")]
            // }),
            productId: useField(
                {
                    value: selectedProduct?.id,
                    validates: [notEmptyString("Please select a product")],
                }),

        },
        onSubmit,
    });

    const ProductURL = selectedProduct
        ? new URL(`/products/${selectedProduct.id}/image`, location.toString()).toString()
        : null;


    /*
        These variables are used to display product images, and will be populated when image URLs can be retrieved from the Admin.
      */

    const handleProductChange = useCallback(({selection}) => {
        setSelectedProduct({
            title: selection[0].title,
            images: selection[0].images,
            handle: selection[0].handle
        });
        selectedProduct.onChange(selection[0].id);


        setShowResourcePicker(false);
    }, []);

    /* This function is called when a user clicks "select product" or cancel the ProductPicker.
    It switches between a show and hide state
     */
    const toggleResourcePicker = useCallback(
        () => setShowResourcePicker(!showResourcePicker), [showResourcePicker]
    );

    /* This array is used in a select filed in the form to manage discount options
    it will be extended when the frontend is connected to the backend and the array is populated with discount data from the store
    for now, it contains only the default value*/

    const shopData = null;
    const isLoadingShopData = true;
    /*  This function runs when a user clicks the "Go to destination" button
    it uses data from the App Bridge context as well as form state to construct
    destination URLs using the URL helpers you created */
    // const goToDestination = useCallback(
    //     () => {
    //         if (!__selectedProduct) return;
    //         const data = {
    //             shopUrl: shopData?.shop.url,
    //             productHandle: handle.value || __selectedProduct.handle,
    //             variantId: variantId.value,
    //         };
    //
    //     }
    // )

    /* These variables are used to display product images, and will be populated when image URLs can be retrieved from the Admin*/
    const imageSrc = selectedProduct?.image?.edges?.[0]?.node?.url;
    const originalImageSrc = selectedProduct?.images?.[0]?.originalSrc;
    const altText = selectedProduct?.images?.[0]?.altText || selectedProduct?.title;


    return (
// Company Infor :
        <Layout>
            <Layout.Section>

                <Form onSubmit={onSubmit} >
                    <ContextualSaveBar
                        saveAction={{
                            label: "Save",
                            onAction: submit,
                            loading: submitting,
                            disabled: submitting,
                        }}
                        discardAction={{
                            label: "Discard",
                            onAction: reset,
                            loading: submitting,
                            disabled: submitting,
                        }}
                        visible={dirty}
                        fullWidth
                    />
                    {/*<FormLayout>*/}
                        {/*<FormLayout.Group>*/}

                        {/*    <div style={{alignContent: "flex-start", fontWeight: "bold"}}>*/}
                        {/*        <h1>Enter Your company Information </h1>*/}
                        {/*        <hr/>*/}
                        {/*    </div>*/}
                        {/*</FormLayout.Group>*/}

                        {/*<FormLayout.Group>*/}
                        {/*    <TextField*/}
                        {/*        label="Your company's name: "*/}
                        {/*        value={companyName}*/}
                        {/*        // onChange={handleCompanyName}*/}
                        {/*        placeholder="Example: ABC Limited"*/}
                        {/*        autoComplete="off"*/}
                        {/*    />*/}
                        {/*    <TextField*/}
                        {/*        label="Email Adress "*/}
                        {/*        value={emailAddress}*/}
                        {/*        // onChange={handleEmailAddress}*/}
                        {/*        placeholder="Example: abc@gmai.com"*/}
                        {/*        autoComplete="off"*/}
                        {/*    />*/}
                        {/*</FormLayout.Group>*/}

                        {/*<FormLayout.Group>*/}
                        {/*    <TextField*/}
                        {/*        label="Your company's address: "*/}
                        {/*        value={companyAdress}*/}
                        {/*        // onChange={handleCompanyAddress}*/}
                        {/*        placeholder="Example: 123 Highland Street"*/}
                        {/*        autoComplete="off"*/}
                        {/*    />*/}
                        {/*</FormLayout.Group>*/}

                        {/*<FormLayout.Group>*/}
                        {/*    <TextField*/}
                        {/*        label="City:  "*/}
                        {/*        // value={cityValue}*/}
                        {/*        // onChange={handleCityValue}*/}
                        {/*        placeholder="Example: Brisbane"*/}
                        {/*        autoComplete="off"*/}
                        {/*    />*/}
                        {/*    <TextField*/}
                        {/*        label="Zip Code "*/}
                        {/*        value={zipCodeValue}*/}
                        {/*        // onChange={handleZipCodeValue}*/}
                        {/*        placeholder="Example: 400120"*/}
                        {/*        autoComplete="off"*/}
                        {/*    />*/}
                        {/*</FormLayout.Group>*/}

                        {/*<FormLayout.Group>*/}
                        {/*    <Select*/}
                        {/*        label="Country"*/}
                        {/*        options={options}*/}
                        {/*        // onChange={handleCountry}*/}
                        {/*        value={selected}*/}
                        {/*    />*/}
                        {/*    <Select*/}
                        {/*        label="State / Province"*/}
                        {/*        options={options}*/}
                        {/*        // onChange={handleSate}*/}
                        {/*        value={selected}*/}
                        {/*    />*/}
                        {/*</FormLayout.Group>*/}


                    {/*    <FormLayout.Group>*/}
                    {/*        <DropZone label="Upload">*/}
                    {/*            <DropZone.FileUpload/>*/}
                    {/*        </DropZone>*/}
                    {/*    </FormLayout.Group>*/}

                    {/*    <hr/>*/}

                    {/*</FormLayout>*/}
                    {/*<CustomerInvoice/>*/}
                    {/*Company infor Ended*/}
                    {/*Billing :*/}
                    <FormLayout>
                        <FormLayout.Group>
                            PRODUCT LIST:

                        </FormLayout.Group>

                        <LegacyCard
                            title={"Product"}
                            actions={[
                                {
                                    content: selectedProduct.id
                                        ? "Change product"
                                        : "Select product",
                                    onAction: toggleResourcePicker,
                                },
                            ]}
                        >
                            <LegacyCard.Section>
                                {showResourcePicker && (
                                    <ResourcePicker
                                        resourceType="Product"
                                        open={true}
                                        showVariants={false}
                                        selectMultiple={false}
                                        onCancel={toggleResourcePicker}
                                        onSelection={handleProductChange}
                                    />
                                )}
                                {productId.value ? (
                                    <LegacyStack alignment={"center"}>
                                        {imageSrc || originalImageSrc ? (
                                            <Thumbnail source={imageSrc || originalImageSrc} alt={altText}
                                            />

                                        ) : (
                                            <Thumbnail source={ImageMajor} alt={altText} color={"base"} size={"small"}/>
                                        )}
                                    </LegacyStack>
                                ) : (
                                    <LegacyStack vertical={true} spacing={"extraTight"}>
                                        <Button onClick={toggleResourcePicker}>
                                            select Product
                                        </Button>
                                        {productId.error && (
                                            <LegacyStack spacing={"tight"}>
                                                <Icon source={AlertMinor} color={"critical"}/>
                                                <p>{productId.error}</p>
                                            </LegacyStack>
                                        )}
                                    </LegacyStack>
                                )}
                                <p>{selectedProduct.title}</p>

                            </LegacyCard.Section>
                        </LegacyCard>


                    </FormLayout>
                    {/*Billing Ended*/}

                </Form>


            </Layout.Section>
        </Layout>
        )
}






