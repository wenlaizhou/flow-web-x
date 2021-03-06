import http from '../http'
import { emptyObject } from '@/util/agents'
import _ from 'lodash'

const state = {
  items: [],
  updated: {}, // updated agent received
  loaded: _.cloneDeep(emptyObject)
}

const mutations = {
  reload (state, agents) {
    state.items = agents
  },

  add (state, newOrUpdated) {
    for (let agent of state.items) {
      if (agent.id === newOrUpdated.id) {
        Object.assign(agent, newOrUpdated)
        return
      }
    }

    state.items.push(newOrUpdated)
  },

  remove (state, deletedAgent) {
    for (let i = 0; i < state.items.length; i++) {
      if (state.items[i].id === deletedAgent.id) {
        state.items.splice(i, 1)
        return;
      }
    }
  },

  update (state, updatedAgent) {
    state.updated = updatedAgent

    for (let agent of state.items) {
      if (agent.id !== updatedAgent.id) {
        continue
      }

      Object.assign(agent, updatedAgent)
      break
    }
  },

  loaded (state, agent) {
    state.loaded = agent
  }
}

const actions = {
  async createOrUpdate({commit}, {name, tags, token}) {
    await http.post('agents', (agent) => {
      commit('add', agent)
    }, {name: name, tags: tags, token: token})
  },

  async delete({commit}, agent) {
    await http.delete('agents', (agent) => {
     commit('remove', agent)
    }, {token: agent.token})
  },

  async get ({commit}, name) {
    await http.get(`agents/${name}`, (agent) => {
      commit('loaded', agent)
    })
  },

  list ({commit}) {
    http.get('agents', (agents) => {
      commit('reload', agents)
    })
  },

  update ({commit}, agent) {
    commit('update', agent)
  },

  select ({commit}, agent) {
    commit('select', agent)
  }
}

export const Store = {
  namespaced: true,
  state,
  mutations,
  actions
}
