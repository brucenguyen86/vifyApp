import {Autocomplete, Icon} from '@shopify/polaris';
import {SearchMinor} from '@shopify/polaris-icons';
import {useState, useCallback, useMemo, useEffect} from 'react';
export default function AutocompleteExample(props) {

    const {
        options: propOptions,
        value: propValue, // used for default value setting
        onChange: onChange,
        textFieldLabel: fieldLabel
    } = props;

    // Default Values are propValue
    const defaultValues = useMemo(() => {
        if (!propValue) {
            return [];
        }
        if (!Array.isArray(propValue)) {
            return [propValue];
        }
        return propValue;
    }, [propValue]);


    const deselectedOptions = useMemo(() => propOptions,[propOptions])

    const [selectedOptions, setSelectedOptions] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState(deselectedOptions);

    useEffect(() => {
        setOptions(propOptions);
    }, [propOptions]);

    useEffect(() => {
        setSelectedOptions(defaultValues);
    }, [defaultValues]);


    const updateText = useCallback(
        (value) => {
            setInputValue(value);

            if (value === '') {
                setOptions(deselectedOptions);
                return;
            }

            const filterRegex = new RegExp(value, 'i');
            const resultOptions = deselectedOptions.filter((option) =>
                option.label.match(filterRegex),
            );
            setOptions(resultOptions);
        },
        [deselectedOptions],
    );

    const updateSelection = useCallback(
        (selected) => {
            const selectedValue = selected.map((selectedItem) => {
                const matchedOption = options.find((option) => {
                    return option.value.match(selectedItem);
                });
                return matchedOption && matchedOption.label;
            });

            setSelectedOptions(selected);
            onChange(selected)
            setInputValue(selectedValue[0] || '');
        },
        [options],
    );

    const textField = (
        <Autocomplete.TextField
            onChange={updateText}
            label={fieldLabel}
            value={inputValue}
            prefix={<Icon source={SearchMinor} color="base" />}
            placeholder={fieldLabel}
            autoComplete="off"
        />
    );

    return (
            <Autocomplete
                options={options}
                selected={selectedOptions}
                onSelect={updateSelection}
                textField={textField}
            />
    );
}
