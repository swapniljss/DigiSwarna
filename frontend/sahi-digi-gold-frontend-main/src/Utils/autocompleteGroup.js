/**
 * let group = ['name|type', '_id|newid'];
 *
 * ******* */
export const reformatedOption = (options, group) => {
    let tempArray = [];
    if (options && options.length > 0 && options.length > 0) {
        for (let i = 0; i < options.length; i++) {
            for (let j = 0; j < options[i]['sub_cats'].length; j++) {
                let tempObj = options[i]['sub_cats'][j];
                for (let k = 0; k < group.length; k++) {
                    let splitArr = group[k].split('|');
                    if (options[i][splitArr[0]]) {
                        tempObj[splitArr[1]] = options[i][splitArr[0]];
                    }
                }
                tempArray.push(tempObj);
            }
        }
    }
    return tempArray;
}