import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { PENDING, REQUESTING, SUCCESS, ERROR } from "../../utilities/helper"
import { addCategoryFirestore, getCategoriesStatesFirestore, deleteCategoryFirestore, updateCategoryNameFirestore, setCategoriesStatesFirestore } from '../../services/firebase';

export const name = 'categories'

const initialState = {
    categories: [],
    status: SUCCESS,
}
// remove status, which is local and not for saving in firebase
export const { status, ...initialStateCategoryFirebase } = initialState;

function setNewCategoriesState(state, { payload }) {
    const { categories } = payload;
    state.categories = categories;
}

function addNewCategory(state, { payload }) {
    const { category } = payload;
    state.categories.push(category);
}

function addNewCategories(state, { payload }) {
    const { categories } = payload;
    categories.map( item => state.categories.push(item));
    
}

function delCategory(state, { payload }) {
    const { category } = payload;
    const idx = state.categories.findIndex(element => element.name === category.name);
    state.categories.splice(idx,1);
    
}

function updateCatName(state, { payload }) {
    const { category, newName } = payload;
    const idx = state.categories.findIndex(element => element.name === category.name);
    state.categories[idx].name = newName
    
}

const reducers = {
    // we don't access this reducers object in production, we only use the function within the thrunks ... this is just for testing purposes
    setCategoriesState: setNewCategoriesState,
    addCategory: addNewCategory,
    addCategories: addNewCategories,
    deleteCategory: delCategory,
    updateCategory: updateCatName,
    setStatus: (state, { payload }) => {
        const { value } = payload;
        state.status = value
    }
}

const extraReducers = (builder) => {
    builder
        .addCase(submitNewCategory.pending, (state) => {
            state.status = REQUESTING;
        })
        .addCase(submitNewCategory.fulfilled, (state, action) => {
            state.status = SUCCESS;
        })
        .addCase(submitNewCategory.rejected, (state) => {
            state.status = ERROR
        })
        .addCase(submitNewCategories.pending, (state) => {
            state.status = REQUESTING;
        })
        .addCase(submitNewCategories.fulfilled, (state, action) => {
            state.status = SUCCESS;
        })
        .addCase(submitNewCategories.rejected, (state) => {
            state.status = ERROR
        })
        .addCase(removeCategory.pending, (state) => {
            state.status = REQUESTING;
        })
        .addCase(removeCategory.fulfilled, (state, action) => {
            state.status = SUCCESS;
        })
        .addCase(removeCategory.rejected, (state) => {
            state.status = ERROR
        })
        .addCase(updateCategoryName.pending, (state) => {
            state.status = REQUESTING;
        })
        .addCase(updateCategoryName.fulfilled, (state, action) => {
            state.status = SUCCESS;
        })
        .addCase(updateCategoryName.rejected, (state) => {
            state.status = ERROR
        })
}


export const updateCategoryName = createAsyncThunk(
    "categories/updateCategoryName",
    async (props, {getState, dispatch}) => {
        const {category, newName} = props;
        dispatch(updateCategory({category, newName}))
        const newCategories = getState().categories.categories;
        return setCategoriesStatesFirestore(newCategories)
            .then(() =>  {newCategories})
            .catch(error => console.log(error));

    }
)

export const removeCategory = createAsyncThunk(
    "categories/removeCategory",
    async (category, {getState, dispatch}) => {
        
        dispatch(deleteCategory({category}))
        const newCategories = getState().categories.categories;
        return setCategoriesStatesFirestore(newCategories)
            .then(() =>  {newCategories})
            .catch(error => console.log(error));

    }
)


export const submitNewCategory = createAsyncThunk(
    "categories/submitNewCategory",
    async (category, {getState, dispatch}) => {
        
        dispatch(addCategory({category}))
        const newCategories = getState().categories.categories;
        return setCategoriesStatesFirestore(newCategories)
            .then(() =>  {newCategories})
            .catch(error => console.log(error));

    }
)

export const submitNewCategories = createAsyncThunk(
    "categories/submitNewCategories",
    async (categories, {getState, dispatch}) => {
        
        dispatch(addCategories({categories}))
        const newCategories = getState().categories.categories;
        return setCategoriesStatesFirestore(newCategories)
            .then(() =>  {newCategories})
            .catch(error => console.log(error));

    }
)


const slice = createSlice({
    name,
    initialState,
    reducers,
    extraReducers
})

export const {
    setCategoriesState,
    addCategory,
    addCategories,
    deleteCategory,
    updateCategory,
    setStatus
} = slice.actions

export default slice.reducer