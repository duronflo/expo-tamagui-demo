import { reduceArrayDuplicates } from './helper'

// workaround for xmlhttprequest during jest runner ....
global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;


jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
const categoryData = require('../../assets/data/categories.json');


describe('Helper - Arrays ', () => {



    test('Helper - Two arrays - pure function which returns a array with removed duplicates which come across within the two arrays', async () => {
        const otherCateogories = [{
            name: 'Handy',
            avatar_icon: 'desktop',
        },
        {
            name: 'Vertrag',
            avatar_icon: 'desktop',
        },
        {
            name: 'Haustiere',
            avatar_icon: 'desktop',
        },
        {
            name: 'Food',
            avatar_icon: 'desktop',
        },
        {
            name: 'Essen',
            avatar_icon: 'desktop',
        },
        {
            name: 'Versicherung',
            avatar_icon: 'desktop',
        },

        ]

        const currentCategories = [{
            name: 'Handy',
            avatar_icon: 'desktop',
        },
        {
            name: 'Vertrag',
            avatar_icon: 'desktop',
        },
        {
            name: 'Versicherung',
            avatar_icon: 'desktop',
        },

        ]




        const reducedArr = reduceArrayDuplicates(otherCateogories, currentCategories)
        expect(reducedArr[0].name).toBe("Haustiere")
        expect(reducedArr[1].name).toBe("Food")
        expect(reducedArr[2].name).toBe("Essen")
    });

});



