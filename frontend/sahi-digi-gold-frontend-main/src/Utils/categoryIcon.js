import React from 'react';
import HeartIcon from '../Components/Icons/HeartIcon';
import HealthIcon from '../Components/Icons/HealthIcon';
import VehicleIcon from '../Components/Icons/VehicleIcon';
import HomeLoanIcon from '../Components/Icons/HomeLoanIcon';
import PersonalIcon from '../Components/Icons/PersonalIcon';
import GoldIcon from '../Components/Icons/GoldIcon';
import ElectricityIcon from '../Components/Icons/ElectricityIcon';
import BroadbandIcon from '../Components/Icons/BroadbandIcon';
import MobilePostpaidIcon from '../Components/Icons/MobilePostpaidIcon';
import WaterIcon from '../Components/Icons/WaterIcon';
import GasPipelineIcon from '../Components/Icons/GasPipelineIcon';
import EducationIcon from '../Components/Icons/EducationIcon';
import GasCylinderIcon from '../Components/Icons/GasCylinderIcon';
import LandlineIcon from '../Components/Icons/LandlineIcon';
import DataCardIcon from '../Components/Icons/DataCardIcon';
import SubscriptionIcon from '../Components/Icons/SubscriptionIcon';
import RecurringDepositIcon from '../Components/Icons/SubscriptionIcon';
import HousingSocietyIcon from '../Components/Icons/HousingSocietyIcon';
import HospitalsIcon from '../Components/Icons/HospitalsIcon';
import ClubsAssociationIcon from '../Components/Icons/ClubsAssociationIcon';
import MunicipalTaxIcon from '../Components/Icons/MunicipalTaxIcon';
import CreditCardIcon from '../Components/Icons/CreditCardIcon';
import MobileRechargeIcon from '../Components/Icons/MobileRechargeIcon';
import FastagIcon from '../Components/Icons/FastagIcon';
import DTHIcon from '../Components/Icons/DTHIcon';
import CableTVIcon from '../Components/Icons/CableTVIcon';

export const CategoryIcon = (icon) => {
    switch (icon) {
        case 'life':
            return <HeartIcon />;
        case 'health':
            return <HealthIcon />;
        case 'vehicle':
            return <VehicleIcon />;
        case 'home':
            return <HomeLoanIcon />;
        case 'personal':
            return <PersonalIcon />;
        case 'gold':
            return <GoldIcon />;
        case 'electricity':
            return <ElectricityIcon />;
        case 'broadband':
            return <BroadbandIcon />;
        case 'mobile_postpaid':
            return <MobilePostpaidIcon />;
        case 'water':
            return <WaterIcon />;
        case 'gas_pipeline':
            return <GasPipelineIcon />;
        case 'education':
            return <EducationIcon />;
        case 'gas_cylinder':
            return <GasCylinderIcon />;
        case 'landline':
            return <LandlineIcon />;
        case 'datacard':
            return <DataCardIcon />;
        case 'cable_tv':
            return <CableTVIcon />;
        case 'subscription':
            return <SubscriptionIcon />;
        case 'housing_society':
            return <HousingSocietyIcon />;
        case 'hospitals':
            return <HospitalsIcon />;
        case 'clubs_&_associations':
            return <ClubsAssociationIcon />;
        case 'municipal_tax':
            return <MunicipalTaxIcon />;
        case 'credit_card':
            return <CreditCardIcon />;
        case 'recurring_deposit':
            return <RecurringDepositIcon />;
        case 'mobile_recharge':
            return <MobileRechargeIcon />;
        case 'fastag':
            return <FastagIcon />;
        case 'dth':
            return <DTHIcon />;
        default:
    }
}