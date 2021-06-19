//app.js
App({
  onLaunch: function () {
    let _this = this
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'medicine-3g6yepgdaa6eaceb',
        traceUser: true,
      })
    }
    // 获取系统状态栏信息
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let capsule = wx.getMenuButtonBoundingClientRect();
        if (capsule) {
          this.globalData.Custom = capsule;
          this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
        } else {
          this.globalData.CustomBar = e.statusBarHeight + 50;
        }
      }
    })
    wx.showToast({
      title: '请授权登录！',
      icon: 'none',
      duration: 1500,
      success: function () {
        setTimeout(function () {
          wx.reLaunch({
            url: 'denglu/denglu',
          })
        }, 1500);
      }
    })

  },
  globalData: {
    userInfo: null
  },
  canIUse: {
    getUserInfo: wx.canIUse('button.open-type.getUserInfo'),
    liveplayer: wx.canIUse('live-player'),
    textselectable: wx.canIUse('text.selectable'),
    contact: wx.canIUse('button.open-type.contact'),
    openBluetoothAdapter: wx.canIUse('openBluetoothAdapter'),
    getSystemInfoSync: wx.canIUse('getSystemInfoSync.return.screenWidth'),
    getSystemInfo: wx.canIUse('getSystemInfo.success.screenWidth'),
    showToast: wx.canIUse('showToast.object.image'),
    CompassChange: wx.canIUse('onCompassChange.callback.direction'),
    Request: wx.canIUse('request.object')
  }
})