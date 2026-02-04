import axios from "axios";
import { intersection } from 'lodash';
import roles from '../Config/roles';
import { Buffer } from 'buffer';

/**
 * Array With Length
 * @param {arr} Array
 *
 * ******* */
export function isArrayWithLength(arr) {
    return (Array.isArray(arr) && arr.length)
}

/**
 * get Allowed Routes
 * @param {routes} Array
 *
 * ******* */
export function getAllowedRoutes(routes) {
    return routes.filter(({ permission }) => {
        if (!permission) return true;
        else if (!isArrayWithLength(permission)) return true;
        else return intersection(permission, roles).length;
    });
}

/**
 * Create Unique key of length
 * @param {Number} length
 *
 * ******* */
export const makeId = (length = 8) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

/**
 * Unique Array 
 * @param {arr} Array
 * @param {keyProps} Keys
 *
 * ******* */
export const uniqueArray = (arr, keyProps) => {
    return Object.values(arr.reduce((uniqueMap, entry) => {
        const key = keyProps.map(k => entry[k]).join('|');
        if (!(key in uniqueMap)) uniqueMap[key] = entry;
        return uniqueMap;
    }, {}));
}


/**
 * Fetch Ip Address 
 *
 * ******* */
export const fetchIp = async () => {
    let url = `https://api.ipify.org/?format=json`;
    let options = { method: 'GET', url };
    let ipData = await axios(options).then(response => response.data);
    return ipData.ip;
}

/**
 * Convert Provider Field Value Array into String val1|val2|val3|.. 
 ** @param {values} Array 
 * ******* */
export const inputValueString = (values) => {
    let tempString = '';

    Object.entries(values).map(([key, value], index) => {
        if (index === 0) {
            return tempString += value;
        } else {
            return tempString += '|' + value;
        }
    })
    return tempString;
}

/**
 * Get File By Data Url
 ** @param {dataUrl} base64 url
 ** @param {filename} filename
 * ******* */
export const dataUrlToFile = (dataUrl, filename) => {
    const arr = dataUrl.split(',');
    if (arr.length < 2) { return undefined; }
    const mimeArr = arr[0].match(/:(.*?);/);
    if (!mimeArr || mimeArr.length < 2) { return undefined; }
    const mime = mimeArr[1];
    const buff = Buffer.from(arr[1], 'base64');
    return new File([buff], filename, { type: mime });
}

/**
 * Array Equals
 ** @param {a} array
 ** @param {b} array
 * ******* */
export const arrayEquals = (a, b) => {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}
