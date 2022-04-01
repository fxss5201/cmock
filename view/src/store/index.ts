import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import { stateModel, mockFileModel } from './../types'

export const storeKey: InjectionKey<Store<stateModel>> = Symbol()

export const store = createStore({
  state() {
    return {
      mocksFiles: []
    }
  },
  getters: {},
  mutations: {
    setMocksFiles(state: stateModel, value: mockFileModel[]) {
      state.mocksFiles = value
    }
  },
  actions: {},
  modules: {},
})

export function useStore() {
  return baseUseStore(storeKey)
}