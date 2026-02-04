import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import BillPayIcon from '../../Assets/Images/billpay.svg';


export default function BillPaymentsIcon(props) {
    return (
        <SvgIcon {...props} viewBox="0 0 24 24" fontSize="inherit" style={{ backgroundImage: "url(" + BillPayIcon + ")" }}>
        </SvgIcon>
    );
}