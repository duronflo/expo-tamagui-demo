import { createCategoryMap, createDateMap, createEmotionMap } from "../utilities";
// import { getExchaneRate} from '../../currencies/hooks'

const expenses = require('../../../../assets/data/sampleExpenses.json');

const categories = require('../../../../assets/data/categories.json');
const emotions = require('../../../../assets/data/emotions.json');

// TODO: We need to investigate here how to continue with testcases ... Either refactor to more atomic functions or including the firebase overhead into this ....

describe('Utitility -testing expenses function', () => {
    beforeAll(done => {
        done()
    });
    afterAll(done => {
        done()
    });

    test('Do some simple test case', async () => {
        const var1 = 1;

        //createCategoryMap(expenses, categories, 'EUR', )

        expect(var1).toBe(1)
    });
 
});

