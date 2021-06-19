// pages/user/bingli/bingli_detail.js
const db=wx.cloud.database()
const _=db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
   name:"",
   idcard:"",
   number:"",
   date:"",
   sex:"",
   age:"",
   suggess:"",
   doctor_name:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    console.log(options.id)
    db.collection('list').doc(options.id).get({
      success:function(res){
        console.log('信息获取成功',res)
        that.setData({
          name:res.data.name,
          doctor_name:res.data.doctor_name,
          age:res.data.age,
          idcard:res.data.idcard,
          date:res.data.date,
          sex:res.data.sex,
          number:res.data.number,
          suggess:res.data.record
        })
      },fail:function(res){
        console.log('信息获取失败',res)
      }
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
    this.onLoad
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

  }
})