var store = {
  dataSources: [
    {
      name: '数据计划数据源',
      code: '123',
      url: 'http://123.com',
      account: 'root',
      password: 'root',
      dbName: 'data'
    }
  ],
  setDataSources (dataSource) {
    if (Array.isArray(dataSource)) {
      this.dataSources = dataSource;
    }
  }
}

export default store