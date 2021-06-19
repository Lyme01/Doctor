// pages/medicinal/pay.js
const util = require('../../utils/util.js')
const  db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    medicinal:[],
    money:0,
    name:"",
    phone_number:"",
    address:"",
    beizhu:""
  },
  // 备注
  beizhu:function(e){
    let that = this
    console.log(e)
    that.setData({
      beizhu:e.detail.value
    })
  },
  // 结算
  pay:function(e){
    let that = this
    wx.showLoading({
      title: '支付中...'
    })
    setTimeout(() => {
      wx.showToast({
        title: '支付成功',
        success: () => {

          var DATE = util.formatDate(new Date());
          if(that.data.name!==""&&that.data.address!==""&&that.data.phone_number!==""){
            db.collection('order').add({
                  data:{
                    name:that.data.name,
                    phone_number:that.data.phone_number,
                    address:that.data.address,
                    beizhu:that.data.beizhu,
                    money:that.data.money,
                    medicinal:that.data.medicinal,
                    time:DATE,
                    medicinal_state:"待发货"
                  },success:function(res){
                    console.log('下单成功',res)
                    wx.cloud.callFunction({
                      name:"medicinal_del",
                      data:{
                      },
                      success:function(res){
                        console.log('购物车删除成功',res)
                        for(var i= 0;i<that.data.medicinal.length;i++){
                          wx.cloud.callFunction({
                            name:"inc_medicinal_num",
                            data:{
                              medicinal_id:that.data.medicinal[i].medicinal_id
                            },success:function(res){
                              console.log('商品销量自加成功',res)
                            }
                          })
                        }
                        wx.switchTab({
                          url: '../shopping_cart/shopping_cart',
                        })
                      },fail:function(res){
                        console.log('购物车删除失败',res)
                      }
                    })
                  },fail:function(res){
                    console.log('下单失败',res)
                  }
                })
          }else{
            wx.showToast({
              title: '地址信息有误',
              icon:"none"
            })
          }
        }
      })
    }, 2500)
  },
  // 选择地址
  address:function(e){
    let that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success () {
              wx.chooseAddress({
                success (res) {
                  console.log(res)
                  that.setData({
                    name:res.userName,
                    phone_number:res.telNumber,
                    address:res.provinceName+res.cityName+res.countyName+res.detailInfo
                  })
                }
              })
            }
          })
        }else{
          wx.openSetting({
            success (res) {
              console.log(res.authSetting)
            }
          })
        }
      }
    })
  },
  // 计算金额
  money_sum() {
    let that = this
    let money_sum = 0
    for(var x = 0;x<that.data.medicinal.length;x++){
      money_sum=money_sum+(that.data.medicinal[x].medicinal_num*that.data.medicinal[x].medicinal_price)
    }
    that.setData({
      money:money_sum
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    db.collection('shopping_cart').where({
      medicinal_checked:"true"
    }).get({
      success:function(res){
        console.log('获取商品成功',res)
        that.setData({
          medicinal:res.data
        })
        that.money_sum()
      },fail:function(res){
        console.log('获取商品失败',res)
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