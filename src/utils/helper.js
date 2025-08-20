export const ERROR = "ERROR"
export const PENDING = "PENDING"
export const REQUESTING = "REQUESTING"
export const SUCCESS = "SUCCESS"


// helper function which reduces two array to one array and duplicating elements are removed. 
// Attention: only working for elements with element-name 'name'
export const reduceArrayDuplicates = (arr1, arr2) => {
    return arr1.filter((element) => arr2.reduce((acc, item) => {
        if (element.name === item.name)
            return false
        else
            return acc;
    }, true));
}
