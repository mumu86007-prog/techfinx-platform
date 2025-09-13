import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../store'
import { setSelectedCategory } from '../../store/slices/accountsSlice'

const CategoryTabs = () => {
  const dispatch = useDispatch()
  const { categories, selectedCategory } = useSelector((state: RootState) => state.accounts)

  const handleCategoryChange = (category: string) => {
    dispatch(setSelectedCategory(category))
  }

  return (
    <div className="bg-surface border-b border-border">
      <div className="container-custom py-4">
        <div className="flex space-x-2 overflow-x-auto scrollbar-thin pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`tag-category whitespace-nowrap ${
                selectedCategory === category ? 'active' : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoryTabs
