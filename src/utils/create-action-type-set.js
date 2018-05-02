export const createActionTypeSet = (action) => ({
  PENDING: `${action}_PENDING`,
  SUCCESS: `${action}_SUCCESS`,
  ERROR: `${action}_ERROR`
})
