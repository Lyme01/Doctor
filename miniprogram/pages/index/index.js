let app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xindex: 0,
    items: [{
        value: '0',
        name: '儿科'
      },
      {
        value: '1',
        name: '妇科'
      },
      {
        value: '2',
        name: '外科'
      },
      {
        value: '3',
        name: '内科'
      }
    ],
    doctorList: []
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
    this.getDoctorList(this.data.items[this.data.xindex].name)
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
  getDoctorList(type) {
    db.collection('doctor')
      .where({
        type: type
      })
      .get({
        success: (res) => {
          this.setData({
            doctorList: res.data
          })
        }
      })
  },
  choice(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      xindex: index
    })
    let typeName = this.data.items[index].name
    this.getDoctorList(typeName)
  },
  showDetails(e) {
    let data = e.currentTarget.dataset.data
    wx.navigateTo({
      url: `../index/details/details?item=${encodeURIComponent(JSON.stringify(data))}`
    })
  },
  showAll() {
    wx.navigateTo({
      url: `./all/all`
    })
  }
})