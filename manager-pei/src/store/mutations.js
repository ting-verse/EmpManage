import storage from '../utils/storage'

export default {
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
    storage.setItem('userInfo', userInfo)
  },
  clearUserInfo(state) {
    state.userInfo = null
    storage.clearItem('userInfo')
  }
}