const images = {
  ic_accessibility: require('../assets/images/ic_accessibility.png'),
  ic_account_balance: require('../assets/images/ic_account_balance.png'),
  ic_add: require('../assets/images/ic_add.png'),
  ic_attach_money: require('../assets/images/ic_attach_money_36pt.png'),
  ic_business: require('../assets/images/ic_business.png'),
  ic_credit_card: require('../assets/images/ic_credit_card_36pt.png'),
  ic_equalizer: require('../assets/images/ic_equalizer_36pt.png'),
  ic_favorite_border: require('../assets/images/ic_favorite_border.png'),
  ic_filter_none: require('../assets/images/ic_filter_none.png'),
  ic_flight_takeoff: require('../assets/images/ic_flight_takeoff.png'),
  ic_group_work: require('../assets/images/ic_group_work.png'),
  ic_home: require('../assets/images/ic_home.png'),
  ic_lightbulb_outline: require('../assets/images/ic_lightbulb_outline.png'),
  ic_local_dining: require('../assets/images/ic_local_dining.png'),
  ic_local_hospital: require('../assets/images/ic_local_hospital.png'),
  ic_panorama_fish_eye: require('../assets/images/ic_panorama_fish_eye.png'),
  ic_school: require('../assets/images/ic_school.png'),
  ic_store: require('../assets/images/ic_store.png'),
  ic_subdirectory_arrow_right: require('../assets/images/ic_subdirectory_arrow_right.png'),
  ic_theaters: require('../assets/images/ic_theaters.png'),
  ic_toys: require('../assets/images/ic_toys.png'),
  ic_trending_up: require('../assets/images/ic_trending_up.png'),
  ic_work: require('../assets/images/ic_work.png'),
}

export const getImage = (image) => {
  return images[image]
}
