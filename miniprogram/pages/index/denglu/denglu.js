const app = getApp()
Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userInfo: "",
        isHide: true
    },

    onLoad: function () {
    },

    bindGetUserInfo: function (e) {
        wx.getUserProfile({
            desc: '获取用户基本信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                app.globalData.userInfo = res.userInfo
                this.setData({
                    isHide: false,
                });
                wx.switchTab({
                    url: "../../index/index"
                })
            },
            fail: (res) => {
                wx.showToast({
                    title: '取消授权',
                    icon: 'none'
                })
            }
        })
    }
})