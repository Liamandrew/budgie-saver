import {
  addCategory,
  addSubCategory,
} from '../utils'

export var expensesCategory = {
  categories: {},
  subCategories: {}
}
var index = 0

const education = 'Education'
expensesCategory = addCategory(education, 'ic_school', index++, expensesCategory)
expensesCategory = addSubCategory('Student Loan', education, expensesCategory)
expensesCategory = addSubCategory('Tuition', education, expensesCategory)
expensesCategory = addSubCategory('Text Books & Supplies', education, expensesCategory)

const entertainment = 'Entertainment'
expensesCategory = addCategory(entertainment, 'ic_theaters', index++, expensesCategory)
expensesCategory = addSubCategory('Arts', entertainment, expensesCategory)
expensesCategory = addSubCategory('Books', entertainment, expensesCategory)
expensesCategory = addSubCategory('Games', entertainment, expensesCategory)
expensesCategory = addSubCategory('Movies & DVDs', entertainment, expensesCategory)
expensesCategory = addSubCategory('Music', entertainment, expensesCategory)
expensesCategory = addSubCategory('Subscription Services', entertainment, expensesCategory)

const food = 'Food & Dining'
expensesCategory = addCategory(food, 'ic_local_dining', index++, expensesCategory)
expensesCategory = addSubCategory('Alcohol', food, expensesCategory)
expensesCategory = addSubCategory('Coffee', food, expensesCategory)
expensesCategory = addSubCategory('Groceries', food, expensesCategory)
expensesCategory = addSubCategory('Restuarants & Dining', food, expensesCategory)

const home = 'Home'
expensesCategory = addCategory(home, 'ic_home', index++, expensesCategory)
expensesCategory = addSubCategory('Furniture', home, expensesCategory)
expensesCategory = addSubCategory('Home Insurance', home, expensesCategory)
expensesCategory = addSubCategory('Mortgage', home, expensesCategory)
expensesCategory = addSubCategory('Property Maintenance', home, expensesCategory)
expensesCategory = addSubCategory('Rent', home, expensesCategory)

const family = 'Family'
expensesCategory = addCategory(family, 'ic_favorite_border', index++, expensesCategory)
expensesCategory = addSubCategory('Childcare', family, expensesCategory)
expensesCategory = addSubCategory('School Fees', family, expensesCategory)

const financial = 'Financial'
expensesCategory = addCategory(financial, 'ic_account_balance', index++, expensesCategory)
expensesCategory = addSubCategory('Fees', financial, expensesCategory)
expensesCategory = addSubCategory('Taxes', financial, expensesCategory)

const medical = 'Medical'
expensesCategory = addCategory(medical, 'ic_local_hospital', index++, expensesCategory)
expensesCategory = addSubCategory('Health Insurance', medical, expensesCategory)
expensesCategory = addSubCategory('Medication', medical, expensesCategory)
expensesCategory = addSubCategory('Primary Care', medical, expensesCategory)
expensesCategory = addSubCategory('Dental Care', medical, expensesCategory)

const misc = 'Miscellaneous'
expensesCategory = addCategory(misc, 'ic_toys', index++, expensesCategory)
expensesCategory = addSubCategory('Charity & Donations', misc, expensesCategory)
expensesCategory = addSubCategory('Gifts', misc, expensesCategory)
expensesCategory = addSubCategory('Pet Care', misc, expensesCategory)

const personal = 'Personal'
expensesCategory = addCategory(personal, 'ic_accessibility', index++, expensesCategory)
expensesCategory = addSubCategory('Dry Cleaning', personal, expensesCategory)
expensesCategory = addSubCategory('Gym Membership', personal, expensesCategory)
expensesCategory = addSubCategory('Life Insurance', personal, expensesCategory)
expensesCategory = addSubCategory('Haircuts', personal, expensesCategory)

const transport = 'Transport & Travel'
expensesCategory = addCategory(transport, 'ic_flight_takeoff', index++, expensesCategory)
expensesCategory = addSubCategory('Air Fare', transport, expensesCategory)
expensesCategory = addSubCategory('Bus Fare', transport, expensesCategory)
expensesCategory = addSubCategory('Car Rental', transport, expensesCategory)
expensesCategory = addSubCategory('Hotel', transport, expensesCategory)
expensesCategory = addSubCategory('Parking Fee', transport, expensesCategory)
expensesCategory = addSubCategory('Petrol', transport, expensesCategory)
expensesCategory = addSubCategory('Taxi Fare', transport, expensesCategory)
expensesCategory = addSubCategory('Train Fare', transport, expensesCategory)
expensesCategory = addSubCategory('Vehicle Maintenance', transport, expensesCategory)

const utilities = 'Utilities'
expensesCategory = addCategory(utilities, 'ic_lightbulb_outline', index++, expensesCategory)
expensesCategory = addSubCategory('Electricity', utilities, expensesCategory)
expensesCategory = addSubCategory('Gas', utilities, expensesCategory)
expensesCategory = addSubCategory('Internet', utilities, expensesCategory)
expensesCategory = addSubCategory('Phone Bill', utilities, expensesCategory)
expensesCategory = addSubCategory('Water', utilities, expensesCategory)

const none = 'None'
expensesCategory = addCategory(none, 'ic_filter_none', index++, expensesCategory)
