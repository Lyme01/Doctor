let app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wzStatus: false,
    item: {},
    consultation: false,
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      item: JSON.parse(decodeURIComponent(options.item)),
      userInfo: app.globalData.userInfo
    })
    this.getFollow()

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
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    if (currPage.data.payment == 'ok') {
      if (currPage.data.typeName == '电话问诊') {
        this.setData({
          wzStatus: true
        })
        wx.makePhoneCall({
          phoneNumber: currPage.data.phone
        })
        this.phoneConsultation()
        // .catch((e) => {
        //   console.log(e)
        // })
      } else if (currPage.data.typeName == '图文问诊') {
        console.log('图文问诊')
        this.setData({
          wzStatus: true
        })
        this.showIm()
      }
    }
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
  follow(e) {
    let data = e.currentTarget.dataset.data
    let _ = db.command
    db.collection('follow')
      .add({
        data: {
          doctorId: data._id,
          name: this.data.userInfo.nickName,
          img: this.data.userInfo.avatarUrl
        }
      })
      .then(res => {
        wx.showToast({
          title: '关注成功',
          icon: 'success'
        })
        this.getFollow()
      })

  },
  cancelFollow(e) {
    let _this = this
    let data = e.currentTarget.dataset.data
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
        _this.getFollow()
      }
    })
  },
  getFollow() {
    db.collection('follow')
      .where({
        doctorId: this.data.item._id,
        name: this.data.userInfo.nickName
      })
      .get({
        success: (res => {
          this.setData({
            [`item.follow`]: res.data.length > 0 ? true : false
          })
        })
      })
  },
  showConsultation() {
    this.setData({
      consultation: true
    })
  },
  hideConsultation() {
    this.setData({
      consultation: false
    })
  },
  phoneConsultation(e) {
    let item = e.currentTarget.dataset.item
    db.collection('doctor')
    .doc(this.data.item['_id'])
    .get({
      success: (res) => {
        let data = res.data
        if (data.status == 1) {
          if (data.count == 0) {
            if (this.data.wzStatus) {
           
            } else {
              wx.navigateTo({
                url: `./payment/payment?price=${item.price}&phone=${item.phone}&&typeName=电话问诊`,
              })
          
         
            }
          } else {
            wx.showToast({
              title: '该医师繁忙',
              icon: 'error'
            })
          }
        } else {
          wx.showToast({
            title: '该医师未在线',
            icon: 'error'
          })
        }
      }
    })
    wx.navigateTo({
    
    })
  },
  showIm() {
    db.collection('doctor')
      .doc(this.data.item['_id'])
      .get({
        success: (res) => {
          let data = res.data
          if (data.status == 1) {
            if (data.count == 0) {
              if (this.data.wzStatus) {
                wx.redirectTo({
                  url: `./im/im?item=${encodeURIComponent(JSON.stringify(data))}`,
                })
              } else {
                wx.navigateTo({
                  url: `./payment/payment?price=${this.data.item.price}&typeName=图文问诊`,
                })
              }
            } else {
              wx.showToast({
                title: '该医师繁忙',
                icon: 'error'
              })
            }
          } else {
            wx.showToast({
              title: '该医师未在线',
              icon: 'error'
            })
          }
        }
      })

  }
})