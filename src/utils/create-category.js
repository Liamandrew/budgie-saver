export const addCategory = (name, image, index=0, categoryTree) => {
  const { categories, subCategories } = categoryTree

  return {
    categories: {
      ...categories,
      [name]: {
        name,
        image,
        index,
        isParent: true,
        subCategoryIds: []
      }
    },
    subCategories
  }
}

export const addSubCategory = (name, parentName, categoryTree) => {
  const { categories, subCategories } = categoryTree
  const parent = categories[parentName]
  parent.subCategoryIds.push(name)

  return {
    categories: {
      ...categories,
      [parentName]: {
        ...parent,
        subCategoryIds: parent.subCategoryIds
      }
    },
    subCategories: {
      ...subCategories,
      [name]: {
        name,
        image: 'ic_subdirectory_arrow_right',
        index: -1,
        isParent: false,
        parentName
      }
    }
  }
}
