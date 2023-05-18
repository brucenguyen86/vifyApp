import {useCallback, useState} from "react";
import {Button, Checkbox, Form, FormLayout, TextField, Select, Layout} from "@shopify/polaris";
import {getCommentNodeContent} from "jsdom/lib/jsdom/living/domparsing/parse5-adapter-serialization.js";


export function CompanyInforForm() {
    const [newsletter, setNewsletter] = useState(false);
    const [email, setEmail] = useState('');

    const handleSubmit = useCallback(() => {
        setEmail('');
        setNewsletter(false);
    }, []);

    const handleNewsLetterChange = useCallback(
        (value) => setNewsletter(value),
        [],
    );

    const handleEmailChange = useCallback((value) => setEmail(value), []);
    {/* Text field */
    }
    const [textFieldValue, setTextFieldValue] = useState('');

    const handleTextFieldChange = useCallback(
        (value) => setTextFieldValue(value),
        [],
    );
    {/* Select */}


        const [selected, setSelected] = useState('today');

        const handleSelectChange = useCallback(
            (value) => setSelected(value),
            [],
        );

        const options = [
            {label: 'Today', value: 'today'},
            {label: 'Yesterday', value: 'yesterday'},
            {label: 'Last 7 days', value: 'lastWeek'},
        ];


        return (
            <Layout>
            <Form onSubmit={handleSubmit}>
                <FormLayout.Group>
                    <div style={{alignContent: "flex-start" , fontWeight:"bold"}}>
                        <h1>Enter Your company Information </h1>
                    </div>
                </FormLayout.Group>
                <FormLayout>
                    <TextField
                        value={email}
                        onChange={handleEmailChange}
                        label="Email"
                        type="email"
                        autoComplete="email"
                        helpText={
                            <span> By entering your email, you agree to receive marketing emails from Shopify. </span>
                        }
                    />
                    <FormLayout.Group>
                        <TextField
                            label="Your company's name: "
                            value={textFieldValue}
                            onChange={handleTextFieldChange}
                            placeholder="Example: ABC Limited"
                            autoComplete="off"
                        />
                        <TextField
                            label="Email Adress "
                            value={textFieldValue}
                            onChange={handleTextFieldChange}
                            placeholder="Example: abc@gmai.com"
                            autoComplete="off"
                            helpText={
                                <span> By entering your email, you agree to receive marketing emails from Shopify. </span>
                            }
                        />
                    </FormLayout.Group>

                    <FormLayout.Group>
                        <TextField
                            label="Your company's address: "
                            value={textFieldValue}
                            onChange={handleTextFieldChange}
                            placeholder="Example: 123 Highland Street"
                            autoComplete="off"
                        />
                    </FormLayout.Group>

                    <FormLayout.Group>
                        <TextField
                            label="City:  "
                            value={textFieldValue}
                            onChange={handleTextFieldChange}
                            placeholder="Example: Brisbane"
                            autoComplete="off"
                        />
                        <TextField
                            label="Zip Code "
                            value={textFieldValue}
                            onChange={handleTextFieldChange}
                            placeholder="Example: 400120"
                            autoComplete="off"
                        />
                    </FormLayout.Group>

                    <FormLayout.Group>
                        <Select
                            label="Country"
                            options={options}
                            onChange={handleSelectChange}
                            value={selected}
                        />
                        <Select
                            label="State / Province"
                            options={options}
                            onChange={handleSelectChange}
                            value={selected}
                        />
                    </FormLayout.Group>

                    <Button submit>Submit</Button>
                </FormLayout>
            </Form>
            </Layout>
        );
    }
