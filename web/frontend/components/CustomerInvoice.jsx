import React, {useCallback, useState} from "react";
import {
    FormLayout,
    TextField,
    Select,

} from "@shopify/polaris";
export function CustomerInvoice(){
    {/* Text field */
    }
    const [textFieldValue, setTextFieldValue] = useState('');

    const handleTextFieldChange = useCallback(
        (value) => setTextFieldValue(value),
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

    return(
        <FormLayout>
            <FormLayout.Group>
                <div style={{alignContent: "flex-start", fontWeight: "bold"}}>
                    <h1>Enter Your Customer Information </h1>
                    <hr/>
                </div>
            </FormLayout.Group>
            <FormLayout.Group>
                <TextField
                    label="Your Customer's name: "
                    value={textFieldValue}
                    onChange={handleTextFieldChange}
                    placeholder="Example: Bruce Nguyen"
                    autoComplete="off"
                />
                <TextField
                    label="Your customer's Email "
                    value={textFieldValue}
                    onChange={handleTextFieldChange}
                    placeholder="Example: abc@gmai.com"
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

        </FormLayout>
    )
}