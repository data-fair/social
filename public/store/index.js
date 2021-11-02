import Vue from 'vue'
import Vuex from 'vuex'
import { sessionStoreBuilder } from '@koumoul/sd-vue/src'
import tinycolor from 'tinycolor2'

Vue.use(Vuex)

export default () => {
  return new Vuex.Store({
    modules: {
      dataset: dataset(),
      remoteService: remoteService(),
      application: application(),
      catalog: catalog(),
      session: sessionStoreBuilder()
    },
    state: {
      vocabulary: null,
      vocabularyArray: [],
      vocabularyTags: [],
      vocabularyItems: [],
      licenses: {},
      topics: {},
      publicationSites: {},
      env: {},
      searchQueries: {},
      projections: null,
      propertyTypes,
      breadcrumbsRouteName: null,
      breadcrumbItems: null,
      limits: null
    },
    getters: {
      canAdmin (state, getters) {
        const activeAccount = getters['session/activeAccount']
        if (!activeAccount) return false
        if (activeAccount.type === 'user') return true
        const role = state.session.user.organization.role
        return role === state.env.adminRole
      }
    },
    mutations: {
      setAny (state, params) {
        Object.assign(state, params)
      }
    },
    actions: {}
  })
}
