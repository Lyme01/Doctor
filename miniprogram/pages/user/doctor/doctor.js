let app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
       name:'李四'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.name)
    let that = this
    that.setData({
     name:options.name
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
  showrecord(){

    wx.redirectTo({
      url: '../doctor/fbbingli/fb_bingli?name=${this.data.name}'
    })
  },
  
  login() {
    let _this = this
    db.collection('doctor').where({
        name: this.data.name
      })
      .get({
        success: (res) => {
          let data = res.data
          if (data.length > 0) {
            wx.redirectTo({
              url: `../doctor/im/im?item=${encodeURIComponent(JSON.stringify(data[0]))}`,
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