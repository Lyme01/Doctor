let app = getApp()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: null,
    name: '', //姓名
    idCard: '', //身份证号码
    phone: '', //手机号码
    birthday: '', //出生日期
    sex: 1, //性别
    allergy: false, //过敏史
    liver: false, //肝功能
    kidney: false, //肾功能
    picker1: ['无', '有'],
    picker2: ['正常', '异常'],
    index1: 0,
    index2: 0,
    index3: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      birthday: this.datePureHandle(new Date())
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
    this.getUser()

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
  datePureHandle(date) {
    return date.getFullYear() + '-' + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : date.getMonth + 1) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
  },
  bindName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindIdCard(e) {
    this.setData({
      idCard: e.detail.value
    })
  },
  bindPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindBirthay(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  bindDate(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  bindSex(e) {
    this.setData({
      sex: e.detail.value ? 1 : 0
    })
  },
  bindAllergy(e) {
    this.setData({
      index1: Number(e.detail.value)
    })
  },
  bindLiver(e) {
    this.setData({
      index2: Number(e.detail.value)
    })
  },
  bindKidney(e) {
    this.setData({
      index3: Number(e.detail.value)
    })
  },
  getUser() {
    db.collection('user')
      .where({
        nickName: app.globalData.userInfo.nickName
      })
      .get({
        success: (res => {
          console.log(res)
          this.setData({
            user: res.data.length > 0 ? res.data[0] : null
          })
          if (this.data.user != null) {
            this.setData({
              name: this.data.user.name,
              idCard: this.data.user.idCard,
              phone: this.data.user.phone,
              birthday: this.data.user.birthday,
              sex: this.data.user.sex,
              index1: this.findKey(this.data.picker1, this.data.user.allergy),
              index2: this.findKey(this.data.picker2, this.data.user.liver),
              index3: this.findKey(this.data.picker2, this.data.user.kidney),
            })
            console.log(this.data)
          }
        })
      })
  },
  sub() {
    let status = this.data.user ? true : false
    if (status) {
      db.collection('user')
        .doc(this.data.user._id)
        .update({
          data: {
            name: this.data.name,
            idCard: this.data.idCard,
            phone: this.data.phone,
            birthday: this.data.birthday,
            sex: this.data.sex,
            allergy: this.data.picker1[this.data.index1],
            liver: this.data.picker2[this.data.index2],
            kidney: this.data.picker2[this.data.index3]
          },
          success(res) {
            wx.showToast({
              title: '修改成功',
              icon: 'success'
            })
            this.getUser()
          }
        })
    } else {
      db.collection('user')
        .add({
          data: {
            nickName: app.globalData.userInfo.nickName,
            name: this.data.name,
            idCard: this.data.idCard,
            phone: this.data.phone,
            birthday: this.data.birthday,
            sex: this.data.sex,
            allergy: this.data.picker1[this.data.index1],
            liver: this.data.picker2[this.data.index2],
            kidney: this.data.picker2[this.data.index3]
          }
        })
        .then(res => {
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          })
          this.getUser()
        })
    }
  },
  findKey(obj, value, compare = (a, b) => a === b) {
    return Object.keys(obj).find(k => compare(obj[k], value))
  }
})