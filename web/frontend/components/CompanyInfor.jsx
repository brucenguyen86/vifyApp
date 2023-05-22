import React, {useCallback, useState} from "react";
import {
    FormLayout,
    TextField,
    Select,
    DropZone,
    Text, HorizontalStack,
} from "@shopify/polaris";
import "./css/style.css"
export function CompanyInfor() {

    const [newsletter, setNewsletter] = useState(false);
    const [email, setEmail] = useState('');
    const handleEmailChange = useCallback((value) => setEmail(value), []);
    {/* Text field */
    }
    const [textFieldValue, setTextFieldValue] = useState('');

    const handleTextFieldChange = useCallback(
        (value) => setTextFieldValue(value),
        [],
    );
    {/* Email field */
    }
    const [emailAddress, setEmailAddress] = useState('');

    const handleEmailAddress = useCallback(
        (value) => setEmailAddress(value),
        [],
    );
    {/* Company field */
    }
    const [companyName, setCompanyName] = useState('');

    const handleCompanyName = useCallback(
        (value) => setCompanyName(value),
        [],
    );
    {/* Select */
    }

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



        {/* Vertical Stack*/
        }
        const Placeholder = ({
                                 label = '',
                                 height = 'auto',
                                 width = 'auto',
                                 showBorder = false,
                             }) => {
            return (
                <div
                    style={{
                        background: 'var(--p-color-text-info)',
                        padding: '14px var(--p-space-2)',
                        height: height,
                        width: width,
                        borderBlockEnd: showBorder
                            ? '1px dashed var(--p-color-bg-success-subdued)'
                            : 'none',
                    }}
                >
                    <HorizontalStack align="start">
                        <div
                            style={{
                                color: 'var(--p-color-text-on-color)',
                            }}
                        >
                            <Text as="h2" variant="bodyMd" fontWeight="regular">
                                {label}
                            </Text>
                        </div>
                    </HorizontalStack>
                </div>
            );
        };



        return (

                <FormLayout>
                    <FormLayout.Group>

                        <div style={{alignContent: "flex-start", fontWeight: "bold"}}>
                            <h1>Enter Your company Information </h1>
                            <hr/>
                        </div>
                    </FormLayout.Group>



                    <FormLayout.Group>
                        <TextField
                            label="Your company's name: "
                            value={companyName}
                            onChange={handleCompanyName}
                            placeholder="Example: ABC Limited"
                            autoComplete="off"
                        />
                        <TextField
                            label="Email Adress "
                            value={emailAddress}
                            onChange={handleEmailAddress}
                            placeholder="Example: abc@gmai.com"
                            autoComplete="off"
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


                    <FormLayout.Group>
                        <DropZone label="Upload">
                            <DropZone.FileUpload/>
                        </DropZone>
                    </FormLayout.Group>

                    <hr/>

                </FormLayout>
        );
    }
