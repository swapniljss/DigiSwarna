import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const FormTextField = ({ classes, fieldClass, fullWidth, id, label, disabled, type, name, reference, value, defaultValue, placeholder, autoFocus, onChange, onClick, onKeyUp, required, onBlur, readOnly, autoComplete, style, error, errorMessage, labelClass, MinVal, MaxVal, maxRows, minRows, rows, multiline }) => {

    return (
        <Box component="div" className={`${fieldClass} BBPFormTextField`}>
            {label &&
                <Box component="label" htmlFor={id} className={labelClass || 'BBPLabel'}>
                    {label} {required && <Box component="span">*</Box>}
                </Box>}
            <TextField
                type={type}
                variant="outlined"
                id={id}
                name={name}
                ref={reference}
                value={value == null ? '' : value}
                classes={classes}
                inputProps={{
                    min: 0,
                }}
                disabled={disabled}
                fullWidth={fullWidth}
                defaultValue={defaultValue}
                placeholder={placeholder}
                autoFocus={autoFocus}
                onChange={onChange}
                onClick={onClick}
                onKeyUp={onKeyUp}
                required={required}
                onBlur={onBlur}
                readOnly={readOnly}
                autoComplete={autoComplete}
                style={style}
                error={error}
                multiline={multiline}
                maxRows={maxRows}
                minRows={minRows}
                rows={rows}
                helperText={error === true && errorMessage ? errorMessage || 'Value is not valid' : ''}
            />
        </Box>
    );
};
export default FormTextField;