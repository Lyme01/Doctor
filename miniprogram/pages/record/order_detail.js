// pages/record/order_detail.js
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   order:{},
   isshow:false,
   state:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      let that=this
      db.collection('order').doc(options.id).get({
        success:function(res){
          console.log('订单获取成功',res)   
          that.setData({
            order:res.data,
            state:res.data.medicinal_state,
          })
         
        },fail:function(res){
        console.log('订单获取失败',res)
        }
      }) 
      
    
  },

   
 
  shuohuo(e){
  console.log(e.currentTarget.dataset.id)
  wx.showModal({
    title: '确定收货',
    success (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        console.log(e.currentTarget.dataset.id)
        db.collection('order').doc(e.currentTarget.dataset.id).update({
          data:{
            medicinal_state:"已完成"
          },success:function(res){
            wx.showToast({
              title: '收货成功',
            })
            wx.navigateTo({
              url: '../record/order?currentTab=已完成',
            })

          },fail:function(res){
             console.log("失败")
          }
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
        wx.showToast({
          title: '你已取消',
        })
      }
    }
  })
},
tuikuan(e){
  console.log(e.currentTarget.dataset.id)
  wx.showModal({
    title: '确定退款',
    success (res) {
      if (res.confirm) {
        console.log('用户点击确定')
        console.log(e.currentTarget.dataset.id)
        db.collection('order').doc(e.currentTarget.dataset.id).update({
          data:{
            medicinal_state:"退款"
          },success:function(res){
            wx.showToast({
              title: '退款成功',
            })
            wx.navigateTo({
              url: '../record/order?currentTab=退款',
            })

          },fail:function(res){
             console.log("失败")
             
          }
        })
      } else if (res.cancel) {
        console.log('用户点击取消')
        wx.showToast({
          title: '你已取消',
        })
      }
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