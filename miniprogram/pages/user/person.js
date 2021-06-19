
const app=getApp();
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   num1:"",
   num2:"",
   num3:"",
   num4:"",
   name:"",
   idcard:""
  },
  sum1() {
    let that = this
    db.collection('order').where({
     medicinal_state:"待发货"
    }).count({
      success: function(res) {
        console.log(res.total)
        that.setData({
        num1:res.total
        })
      },
      fail: console.error
    })
  },
  sum2() {
    let that = this
    db.collection('order').where({
     medicinal_state:"待收货"
    }).count({
      success: function(res) {
        console.log(res.total)
        that.setData({
        num2:res.total
        })
      },
      fail: console.error
    })
  },
  sum3() {
    let that = this
    db.collection('order').where({
     medicinal_state:"已完成"
    }).count({
      success: function(res) {
        console.log(res.total)
        that.setData({
        num3:res.total
        })
      },
      fail: console.error
    })
  },
  sum4() {
    let that = this
    db.collection('order').where({
     medicinal_state:"退款"
    }).count({
      success: function(res) {
        console.log(res.total)
        that.setData({
        num4:res.total
        })
      },
      fail: console.error
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              
            }
          })
        }
      }
  
    })
  
    db.collection('user').get({
     success:function(res){
       console.log('姓名获取成功',res.data[0].name)
      that.setData({
        name:res.data[0].name,
      })
     },
     fail:function(res){
       console.log('姓名获取失败',res)
     }
   })
   
     that.sum1()
     that.sum2()
     that.sum3()
     that.sum4()
     
  },
 onShow:function(){
   let that=this
   that.onLoad()
 },


  address:function(e){
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success () {
              wx.chooseAddress({
                success (res) {
                  console.log("获取地址成功",res)
                }
              })
            }
          })
        }else{
          wx.authorize({
            scope: 'scope.address',
            success () {
              wx.chooseAddress({
                success (res) {
                  console.log(res)
                }
              })
            }
          })
        }
      }
    })
  },
  showAdmin() {
    wx.navigateTo({
      url: '../user/admin_login/login'
    })
  },
  showRecord() {
    wx.navigateTo({
      url:'../record/order'
    })
  },
  showDoctor() {
    wx.navigateTo({
      url: '../user/doctor/doctor_login/doctor_login'
    })
  },
  showJilu() {
    wx.navigateTo({
      url: '../user/jilu/jilu'
    })
  },
  getUser() {
    wx.navigateTo({
      url: '../user/my/my'
    })
  },
  myDoctor() {
    wx.navigateTo({
      url: '../user/my/doctor/doctor'
    })
  },

 
  
})