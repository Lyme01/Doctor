// pages/user/doctor/doctor_login/doctor_login.js
let app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    console.log('隐藏')
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
  bindName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindPassword(e) {
    this.setData({
      password: e.detail.value
    })
  },
  login() {
    let _this = this
    db.collection('doctor').where({
        name: this.data.name,
        password:this.data.password
      })
      .get({
        success: (res) => {
          let data = res.data
          if (data.length > 0) {
            wx.redirectTo({
              // url: `../im/im?item=${encodeURIComponent(JSON.stringify(data[0]))}`,
               url: `../doctor?name=${this.data.name}`,
            })
          } else { 
            wx.showToast({
              title: '姓名或密码不对',
              icon: 'error'
            })
          }

          console.log(res.data)
        }
      })
  }
})