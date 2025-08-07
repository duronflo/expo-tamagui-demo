export function createCategoryMap(data, categories, defaultCurrencyCode, getExchangeRateCallback) {

    const allCategories = data.map(item => item.category);
    // delete duplicates
    const categoryList = allCategories.filter((item, index) => allCategories.indexOf(item) === index);
    return categoryList.map(element => {
        return ({
            category: element,
            data: data.filter(item => item.category === element),
            totalAmount: data.filter(item => item.category === element).reduce((acc, currentValue) =>
                defaultCurrencyCode === currentValue.currencyCode ? acc + currentValue.amount : acc + currentValue.amount * getExchangeRateCallback(currentValue.currencyCode, defaultCurrencyCode), 0),
            avatar_icon: categories.find(e => e.name == element)?.avatar_icon,
            icon_type: categories.find(e => e.name == element)?.icon_type,
            avatar_background: categories.find(e => e.name == element)?.avatar_background
        })
    }).sort((a, b) => {
        if (a.totalAmount < b.totalAmount) {
            return -1;
        }
        if (a.totalAmount > b.totalAmount) {
            return 1;
        }

        // names must be equal
        return 0;
    })
}

export function createEmotionMap(data, emotions, defaultCurrencyCode, getExchangeRateCallback) {
    const allEmotions = data.map(item => item.emotion);
    // delete duplicates
    const emotionList = allEmotions.filter((item, index) => allEmotions.indexOf(item) === index)

    return emotionList.map(element => {
        return ({
            emotion: element,
            data: data.filter(item => item.emotion === element),
            totalAmount: data.filter(item => item.emotion === element).reduce((acc, currentValue) =>
                defaultCurrencyCode === currentValue.currencyCode ? acc + currentValue.amount : acc + currentValue.amount * getExchangeRateCallback(currentValue.currencyCode, defaultCurrencyCode), 0),
            name: emotions.find(e => e.emotion == element)?.name,
            avatar_icon: emotions.find(e => e.emotion == element)?.avatar_icon,
            icon_type: emotions.find(e => e.emotion == element)?.icon_type,
            avatar_background: emotions.find(e => e.emotion == element)?.avatar_background

        })

    }).sort((a, b) => {
        if (a.emotion < b.emotion) {
            return -1;
        }
        if (a.emotion > b.emotion) {
            return 1;
        }

        // names must be equal
        return 0;
    })
}

export function createDateMap(data, defaultCurrencyCode, getExchangeRateCallback) {
    const allDates = data.map(item => item.date);
    // delete duplicates
    const dateList = allDates.filter((item, index) => allDates.indexOf(item) === index);

    return dateList.map(element => {
        return ({
            date: element,
            data: data.filter(item => item.date === element),
            totalAmount: data.filter(item => item.date === element).reduce((acc, currentValue) =>
                defaultCurrencyCode === currentValue.currencyCode ? acc + currentValue.amount : acc + currentValue.amount * getExchangeRateCallback(currentValue.currencyCode, defaultCurrencyCode), 0),
        })

    }).sort((a, b) => {

        const aDate = new Date(a.date).toISOString();
        const bDate = new Date(b.date).toISOString();

        if (aDate > bDate) {
            return -1;
        }
        if (aDate < bDate) {
            return 1;
        }

        // names must be equal
        return 0;
    })
}