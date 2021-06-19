let app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
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
    this.getList()
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
  getList() {
    db.collection('follow').where({
      name: app.globalData.userInfo.nickName
    }).get({
      success: (res) => {
        let datas = res.data
        let ids = []
        datas.forEach(value => {
          ids.push(value.doctorId)
        })
        db.collection('doctor')
          .where({
            _id: db.command.in(ids)
          })
          .get({
            success: (res) => {
              this.setData({
                list: res.data
              })
            }
          })

      }
    })
  },
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },

  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
    })
  },
  showDetails(e) {
    let id = e.currentTarget.dataset.id
    db.collection('doctor').doc(id)
      .get({
        success: (res) => {
          wx.navigateTo({
            url: `../../../index/details/details?item=${encodeURIComponent(JSON.stringify(res.data))}`
          })
        }
      })

  },
  cancelFollow(e) {
    let _this = this
    let data = e.currentTarget.dataset.data
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: 'cancelFollow',
      data: {
        doctorId: data._id,
        name: this.data.userInfo.nickName
      },
      success(res) {
        wx.showToast({
          title: '取消关注成功!',
          icon: 'success'
        })
        _this.getList()
      }
    })
  },
})