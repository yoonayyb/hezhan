import { getUserInfo } from '@/api/index'

function isEmptyObj (v) {
  const arr = Object.keys(v)
  if (arr.length > 0) {
    return false
  }
  return true
}
const DefultOrgId = {
  computed: {
    userInfo () {
      return this.$store.state.user.userInfo
    }
  },
  methods: {
    getOrgId () {
      return new Promise((resolve, reject) => {
        if (!isEmptyObj(this.userInfo)) {
          resolve(this.userInfo.OrgID)
        } else {
          getUserInfo().then(({ data }) => {
            const userInfo = data.data
            resolve(userInfo.OrgID)
          }).catch(err => {
            reject(err)
          })
        }
      })
    }

  }
}
export default DefultOrgId
