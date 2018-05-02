import {
  addCategory,
  addSubCategory,
} from '../utils'

export var incomesCategory = {
  categories: {},
  subCategories: {},
}
var index = 0

const employment = 'Employment'
incomesCategory = addCategory(employment, 'ic_work', index++, incomesCategory)
incomesCategory = addSubCategory('Salary and/or Wage', employment, incomesCategory)
incomesCategory = addSubCategory('Bonus', employment, incomesCategory)
incomesCategory = addSubCategory('Allowance', employment, incomesCategory)
incomesCategory = addSubCategory('Tips', employment, incomesCategory)
incomesCategory = addSubCategory('Fringe Benefit', employment, incomesCategory)

const investment = 'Investment'
incomesCategory = addCategory(investment, 'ic_trending_up', index++, incomesCategory)
incomesCategory = addSubCategory('Dividend', investment, incomesCategory)
incomesCategory = addSubCategory('Capital Gain', investment, incomesCategory)
incomesCategory = addSubCategory('Interest', investment, incomesCategory)
incomesCategory = addSubCategory('Options', investment, incomesCategory)
incomesCategory = addSubCategory('Distributions', investment, incomesCategory)
incomesCategory = addSubCategory('Rental', investment, incomesCategory)

const business = 'Business'
incomesCategory = addCategory(business, 'ic_business', index++, incomesCategory)

const government = 'Government'
incomesCategory = addCategory(government, 'ic_group_work', index++, incomesCategory)
incomesCategory = addSubCategory('Benefits and Assistance', government, incomesCategory)
incomesCategory = addSubCategory('Rebate', government, incomesCategory)

const other = 'Other'
incomesCategory = addCategory(other, 'ic_panorama_fish_eye', index++, incomesCategory)

const none = 'None'
incomesCategory = addCategory(none, 'ic_filter_none', index++, incomesCategory)
