export default {
  methods: {
    isDelete (row, index) {
      if (row.IsApproval === '0') {
        return true
      }
      return false
    }
  }
}
