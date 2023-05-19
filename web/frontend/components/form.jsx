import React, {useCallback, useState} from "react";
import {
    Button,
    Form,
    FormLayout,
    TextField,
    Select,
    DropZone,
    VerticalStack,
    Text, HorizontalStack, Layout
} from "@shopify/polaris";
import {CustomerInvoice} from "./CustomerInvoice.jsx";
import {CompanyInfor} from "./CompanyInfor.jsx";


export function FormInfor() {

    const [newsletter, setNewsletter] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = useCallback(() => {
        setEmail('');
        setNewsletter(false);
    }, []);



        return (

            <Form onSubmit={handleSubmit}>
                <Layout>

                    <Layout.Section oneHalf={true}>
                        <CompanyInfor />
                    </Layout.Section>
                    <Layout.Section oneHalf={true}>
                        <CustomerInvoice />
                    </Layout.Section>

                </Layout>


                <Button submit>Submit</Button>

            </Form>
        );
    }

