export default {
  watch: {
    id (newval) {
      this.emrID = newval
      this.getData()
    }
  }
}
