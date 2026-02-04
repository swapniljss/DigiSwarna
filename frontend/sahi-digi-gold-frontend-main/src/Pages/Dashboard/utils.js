import { format, addMonths, addDays } from 'date-fns';

export const getPercentage = (current, last) => {
    if (current > last) {
        return (((current - last) / current * 100));
    } else if (current < last) {
        return (((current - last) / last * 100));
    } else {
        return 0;
    }
}

export const getStatusChartData = (currentData, lastData) => {
    let startDate = addDays(addMonths(new Date(), -1), 1);
    let endDate = new Date();
    let allDates = [];

    const uniqueCDates = Object.values(
        currentData.reduce((acc, item) => {
            acc[item.date] = acc[item.date]
                ? { ...item, currentCount: item.currentCount + acc[item.date].currentCount }
                : item;
            return acc;
        }, {})
    );

    const uniqueLDates = Object.values(
        lastData.reduce((acc, item) => {
            acc[item.date] = acc[item.date]
                ? { ...item, lastCount: item.lastCount + acc[item.date].lastCount }
                : item;
            return acc;
        }, {})
    );
    for (var day = startDate; day <= endDate; day.setDate(day.getDate() + 1)) {
        let newDate = format(day, "yyyy-MM-dd");
        const cIndex = uniqueCDates.findIndex(object => {
            return object.date === newDate;
        });
        const lIndex = uniqueLDates.findIndex(object => {
            return object.date === newDate;
        });
        allDates.push({
            date: newDate,
            currentCount: cIndex !== -1 ? uniqueCDates[cIndex].currentCount : 0,
            lastCount: lIndex !== -1 ? uniqueLDates[lIndex].lastCount : 0
        })
    }

    return allDates;
}

export const dataByStatus = (arr, amtKey, itemKey) => {
    let tempData = [];
    // eslint-disable-next-line 
    arr.map((item) => {
        let tempDate = format(new Date(item._id), "yyyy-MM-dd");
        tempData.push({ date: tempDate, [amtKey]: parseInt(item[itemKey]) });
    });
    return tempData;
}