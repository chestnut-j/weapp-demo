export default {
  pages: [
    'pages/package-main/index'
  ],
  subPackages:[
    {
      root: 'pages/package-2048',
      pages: [
        'index'
      ]
    }
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
