import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import './style.css';

const AutocompleteField = (props) => {
    const { options, required, disabled, onChange, id, readonly, value } = props;

    const { groupByKey, valueKey, mainOptions, labelKey, placeholder } = options;

    const [selectedValue, setSelectedValue] = useState(null);

    const handleAutocomplete = (event, newValue) => {
        setSelectedValue(newValue);
        onChange(newValue && newValue[valueKey]);
    };

    useEffect(() => {
        if (value) {
            const index = mainOptions.findIndex(x => x[valueKey] === value);
            setSelectedValue(mainOptions[index]);
            onChange(mainOptions[index][valueKey]);
        }
    }, [mainOptions, onChange, value, valueKey]);

    return (
        <Box component="div" className={'BBPACFNew'}>
            {groupByKey ?
                <Autocomplete
                    disablePortal
                    id={id}
                    options={mainOptions ? mainOptions : []}
                    groupBy={(option) => option[groupByKey]}
                    getOptionLabel={(option) => option[labelKey]}
                    value={selectedValue}
                    onChange={(event, newValue) => { handleAutocomplete(event, newValue) }}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            disabled={disabled}
                            fullWidth
                            placeholder={placeholder ? placeholder : 'Please select'}
                            error={selectedValue ? false : true}
                            required={required}
                            readOnly={readonly}
                            classes={{
                                root: 'BBPACFNField',
                                input: 'BBPACFNFInput',
                            }}
                        />
                    }
                    classes={{
                        root: 'BBPACFNMain',
                        popper: 'BBPACFNPopper',
                        listbox: 'BBPACFNListbox'
                    }}
                />
                :
                <Autocomplete
                    disablePortal
                    id={id}
                    options={mainOptions ? mainOptions : []}
                    getOptionLabel={(option) => option[labelKey]}
                    value={value ? value : null}
                    onChange={(event, newValue) => { handleAutocomplete(event, newValue) }}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            disabled={disabled}
                            fullWidth
                            placeholder={placeholder ? placeholder : 'Please select'}
                            error={selectedValue ? false : true}
                            required={required}
                            readOnly={readonly}
                            classes={{
                                root: 'BBPACFNField',
                                input: 'BBPACFNFInput',
                            }}
                        />
                    }
                    classes={{
                        root: 'BBPACFNMain',
                    }}
                />
            }
        </Box>
    );
};
export default AutocompleteField;