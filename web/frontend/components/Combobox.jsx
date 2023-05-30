import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Combobox,
    Icon,
    Listbox,
    VerticalStack,
    LegacyStack,
    Tag,
} from '@shopify/polaris';
import { SearchMinor, SelectMinor } from '@shopify/polaris-icons';

export default function Autocomplete(props) {
    const {
        options: propOptions,
        value: propValue,
        label,
        placeholder,
        textField = {},
        onChange: onComboboxChange,
        selectedRender: SelectedRender,
        ...rest
    } = props;
    const { prefix, suffix } = textField;

    const defaultValues = useMemo(() => {
        if (!propValue) {
            return [];
        }

        if (!Array.isArray(propValue)) {
            return [propValue];
        }

        return propValue;
    }, [propValue]);

    const [selectedValues, setSelectedValues] = useState(defaultValues);
    const [searchValue, setSearchValue] = useState('');
    const [options, setOptions] = useState(propOptions);

    const selectedOptions = useMemo(() => {
        return options.filter((op) => selectedValues.includes(op.value));
    }, [selectedValues, options]);

    useEffect(() => {
        setOptions(propOptions);
    }, [propOptions]);

    useEffect(() => {
        setSelectedValues(defaultValues);
    }, [defaultValues]);

    const updateSearchValue = useCallback(
        (value) => {
            setSearchValue(value);

            if (value === '') {
                setOptions(propOptions);
                return;
            }

            const filterRegex = new RegExp(value, 'i');
            const resultOptions = propOptions.filter((option) =>
                option.label.match(filterRegex),
            );
            setOptions(resultOptions);
        },
        [propOptions],
    );

    useEffect(() => {
        if (!rest.allowMultiple && selectedValues) {
            const option = propOptions.find((op) =>
                selectedValues?.[0]?.match(op.value),
            );
            updateSearchValue(option?.label || '');
        }
    }, [propOptions]);

    const updateSelection = useCallback(
        (selected) => {
            let newSelected;

            if (rest.allowMultiple) {
                if (selectedValues.includes(selected)) {
                    newSelected = selectedValues.filter((option) => option !== selected);
                } else {
                    newSelected = [...selectedValues, selected];
                }
                updateSearchValue('');
            } else {
                newSelected = [selected];
                const matchedOption = options.find((option) => {
                    return option.value.match(selected);
                });
                updateSearchValue(matchedOption?.label || '');
            }

            if (propValue === undefined) {
                setSelectedValues(newSelected);
            }

            if (onComboboxChange) {
                onComboboxChange(props.allowMultiple ? newSelected : newSelected?.[0]);
            }
        },
        [options, selectedValues, updateSearchValue],
    );

    const removeTag = useCallback(
        (tag) => {
            const options = [...selectedValues];
            options.splice(options.indexOf(tag), 1);
            setSelectedValues(options);
            if (onComboboxChange) {
                onComboboxChange(options);
            }
        },
        [selectedValues],
    );

    const optionsMarkup =
        options.length > 0 ? (
            <Listbox onSelect={updateSelection}>
                {options.map((option) => {
                    const { label, value } = option;

                    return (
                        <Listbox.Option
                            key={`${value}`}
                            value={value}
                            selected={selectedValues.includes(value)}
                            accessibilityLabel={label}
                        >
                            {label}
                        </Listbox.Option>
                    );
                })}
            </Listbox>
        ) : null;

    const tagsMarkup = props.allowMultiple ? (
        <VerticalStack>
            <LegacyStack>
                {selectedOptions.map((option) => (
                    <Tag
                        key={`option-${option.value}`}
                        onRemove={() => removeTag(option.value)}
                    >
                        {option.label}
                    </Tag>
                ))}
            </LegacyStack>
        </VerticalStack>
    ) : null;

    const tagsContent = useMemo(() => {
        return SelectedRender ? (
            <SelectedRender selected={selectedOptions} removeSelected={removeTag} />
        ) : (
            tagsMarkup
        );
    }, [selectedOptions, removeTag]);

    return (
        <>
            <Combobox
                {...rest}
                activator={
                    <Combobox.TextField
                        prefix={
                            prefix !== undefined ? prefix : <Icon source={SearchMinor} />
                        }
                        suffix={
                            suffix !== undefined ? suffix : <Icon source={SelectMinor} />
                        }
                        onChange={updateSearchValue}
                        label={label}
                        labelHidden
                        value={searchValue}
                        placeholder={placeholder}
                        autoComplete="nope"
                    />
                }
            >
                {optionsMarkup}
            </Combobox>
            {tagsContent}
        </>
    );
}
