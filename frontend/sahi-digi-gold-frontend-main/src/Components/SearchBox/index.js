import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Tooltip from '@mui/material/Tooltip';
import useDebounce from '../../Utils/useDebounce';
import './style.css';

const SearchBox = ({ onSearchChange, disabled, placeholder, searchTooltip }) => {

    const [searchValue, setSearchValue] = useState('');

    const doSearch = useCallback(str => {
        onSearchChange && onSearchChange(str);
    }, [onSearchChange]);

    const doSave = useDebounce(doSearch, 500);

    const handleSearchInput = useCallback(value => {
        setSearchValue(value);
        doSave(value);
    }, [doSave]);


    return (
        <Box component='div' className={`BBPSearchMain`}>
            <Box component='div' className={`BBPSearchBox ${searchValue.length > 0 ? 'BBPSBSStart' : ''}`}>
                <SearchIcon />
                <input type='text' className={'BBPSBInput'} onChange={(e) => { handleSearchInput(e.target.value) }} value={searchValue} disabled={disabled} placeholder={placeholder || 'Search'} />
                {searchValue.length > 0 && <IconButton className={'BBPSBClose'} onClick={() => { handleSearchInput('') }}> <CloseIcon fontSize='inherit' /> </IconButton>}
            </Box>
            {searchTooltip ?
                <Tooltip
                    placement="top"
                    classes={{
                        popper: 'BBPTPopper',
                        tooltip: 'BBPTooltip'
                    }}
                    title={searchTooltip}
                >
                    <IconButton size="small" className="BBPDTIBIcon">
                        <HelpOutlineIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
                : ''}
        </Box>
    );
};

export default SearchBox;
