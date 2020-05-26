import { isTest } from '@/utils/request'

const state = {
  isTest: isTest,
  userName: "admin",
  // operCode: "34DFFDB8F5044CA892C5FB94D23948A9",
  operCode: "98EAEF948B52F1EAE053470D7C843E12",
  roleCode: "A5A715872A6B26A1E053470D7C843F24",
  orgCode: "B54B7B788AB34FC0BD47FACE98CFDCD3",
  orgName: "佛山分公司",
  empSms: ""
};

const mutations = {
  setUser: (state, obj) => {
    Object.keys(obj).map(key => {
      state[key] = obj[key]
    })
  }
};

export default {
  state,
  mutations
};


