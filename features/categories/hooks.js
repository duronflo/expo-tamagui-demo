import { useDispatch, useSelector } from 'react-redux'
import {submitNewCategory, submitNewCategories, setCategoriesState, removeCategory, updateCategoryName} from './categorySlice'

export const useCategories = () => {
    const dispatch = useDispatch();
    const categories = useSelector(state => state.categories.categories)
    const status = useSelector(state => state.categories.status)

    return {
        addCategory: async (category) => dispatch(submitNewCategory(category)),
        updateCategoryName: async(props) => dispatch(updateCategoryName(props)),
        removeCategory: async (category) => dispatch(removeCategory(category)),
        addCategories: async (newCategoryArray) => dispatch(submitNewCategories(newCategoryArray)),
        setCategoriesState: (categories) => dispatch(setCategoriesState(categories)),
        categories: categories,
        status: status
    }
}