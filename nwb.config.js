module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactContextMenu',
      externals: {
        react: 'React'
      }
    }
  }
}
