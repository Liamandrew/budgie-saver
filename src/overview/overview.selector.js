import { createSelector } from 'reselect'
import { overviewPeriods } from './index'

/*
 * Utility Selectors
 */
export const getGraphColumnPadding = (period) => overviewPeriods[period].graphColumnPadding

export const getGraphLabelFormat = (period) => overviewPeriods[period].graphLabelFormat

export const getGraphReportPeriod = (state) => state.overview.reportPeriod

export const getHasLoadedData = (state) => state.overview.hasLoadedData

export const getOverviewError = (state) => state.overview.error

export const getReportPeriod = (state) => state.overview.reportPeriod

export const getReportPeriodStartDate = (state) => state.overview.reportPeriodStartDate

export const getReportSubPeriod = (period) => overviewPeriods[period].reportSubPeriod
