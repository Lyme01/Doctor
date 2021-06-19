const app = getApp();
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    money: 0,
    typeName: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      money: options.price,
      phone: options.phone,
      typeName: options.typeName
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  ok() {
    let pages = getCurrentPages()
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      payment: 'ok',
      typeName: this.data.typeName,
      phone: this.data.phone
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  cancel() {
    wx.navigateBack({
      delta: 1,
    })
  },
  payment() {
    let _this = this
    wx.showLoading({
      title: '支付中...'
    })
    setTimeout(() => {
      wx.showToast({
        title: '支付成功',
        success: () => {
          this.ok()
        }
      })
    }, 2500)

  }
})