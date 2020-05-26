var store = {
  model: {
    modelCode: '',
    verifyType: '',
    bigClassifyCode: '',
    smallClassifyCode: ''
  },
  setModel(model) {
    if (model.constructor && model.constructor === Object) {
      this.model = model
    }
  }
}

export {
  store
}