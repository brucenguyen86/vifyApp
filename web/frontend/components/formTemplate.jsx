import React, {useState} from "react";
import {Button, Form, FormLayout, Label, TextField} from "@shopify/polaris";
export function MyForm () {
    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values => ({...values, [name]: value}))
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(inputs);
    }

    return (
        <Form onSubmit={handleSubmit}>
                <FormLayout.Group>
                    <TextField
                        label="UserName "
                        value={inputs.username || ""}
                        onChange={handleChange}
                        placeholder="Example: ABC Limited"
                        autoComplete="off"
                    />
                    <TextField
                        label="Your age "
                        value={inputs.age || ""}
                        onChange={handleChange}
                        placeholder="Example: 18"
                        autoComplete="off"
                    />
                </FormLayout.Group>
            <Button submit={true}>Submit </Button>
        </Form>
    )
}