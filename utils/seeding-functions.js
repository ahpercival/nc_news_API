
const convertTimeStamp = (array) => {
    if (!array.length) return []

    const result = array.reduce((acc, val) => {
        const newObj = { ...val }
        newObj.created_at = new Date(newObj.created_at)
        acc.push(newObj)
        return acc
    }, [])

    return result

}

const createRef = (array, desiredKey, desiredVal) => {
    if (!array.length) return {}

    const lookUpObject = array.reduce((acc, val) => {

        if (desiredKey === undefined && desiredVal === undefined) {
            acc[val.name] = val.phoneNumber
        } else {
            acc[val[desiredKey]] = val[desiredVal]
        }

        return acc

    }, {})

    return lookUpObject
};

const renameKeys = (dataArray, keyToChange, newKey) => {
    if (!dataArray.length) return []

    return dataArray.map(item => {

        const { [keyToChange]: value, ...restOfStuff } = item
        return { [newKey]: value, ...restOfStuff }

    })

};

const formatPairs = (array, lookupObject) => {
    if (!array.length) return []

    return array.map(item => {
        item.article_id = lookupObject[item.article_id]
        return item
    })
};

module.exports = { convertTimeStamp, createRef, renameKeys, formatPairs }