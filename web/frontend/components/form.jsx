import React, {useCallback, useState} from "react";
import {
    Button,
    Form,
     Layout, AlphaCard
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

                    <AlphaCard padding={"2"} background={"bg-subdued"}>

                        <Form onSubmit={handleSubmit}>
                            <CompanyInfor />
                            <CustomerInvoice />

                            <Button submit>Submit</Button>
                        </Form>

                    </AlphaCard>



        );
    }

