// pages/admin/drugs_update.js
const db=wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ypfenlei:[],
    img:[],
    name:"",
    price:"",
    detail:"",
    id:"",
    medicinal:[]
  },
  // 添加相片
  add_img:function(e){
    let that=this
    wx.chooseImage({
      count: 1,
      sizeType:['original', 'compressed'],
      sourceType:['album', 'camera'],
      success (res) {
        var timestamp =Date.parse(new Date())
        timestamp=timestamp/1000
        console.log('当前时间戳为',timestamp)
       // tempFilePath可以作为img标签的src属性显示图片
       const tempFilePaths = res.tempFilePaths
       console.log(tempFilePaths)
       wx.cloud.uploadFile({
         cloudPath:'img/'+'medicinal/'+timestamp+'.png',
         filePath:tempFilePaths[0],
         success:function(res){
           console.log(res.fileID)
           that.setData({
             img:that.data.img.concat(res.fileID)
           })
         },fail:function(res){
 
         }
       })
     }
    })
   },
 
  //  删除相片
   detele:function(e){
    let that=this
    console.log(that.data.img)
    console.log(e.currentTarget.dataset.id)
    var id= e.currentTarget.dataset.id
    var img= that.data.img
    img.splice(id,1)
    that.setData({
      img:img
    })
    wx.cloud.deleteFile({
    fileList:[e.currentTarget.dataset.src],
    success(res){
      console.log(res.fileList)
    },fail(err){
 
    }
    })
    console.log(that.data.img)
   },
  //  提交商品信息
  submit:function(e){
   let that=this
   console.log(e)
   if(e.detail.value.name!==""&&e.detail.value.price!==""&&e.detail.value.fenlei!==""&&e.detail.value.detail!==""&&that.data.img.length!==0){
     db.collection('medicinal').doc(that.data.id).update({
       data:{
         name:e.detail.value.name,
         name:e.detail.value.name,
         price:e.detail.value.price,
         fenlei:e.detail.value.fenlei,
         detail:e.detail.value.detail,
         src:that.data.img,
         num:0,
       },success:function(res){
        wx.showToast({
          title: '提交成功',
        })
        wx.redirectTo({
          url: '../manage/drugs_gl',
        })
       }
     })
   }else{
     wx.showToast({
       title: '你还有信息未填写',
     })
   }
  },
  // 删除商品
  delete_medicinal:function(e){
    let that = this
    db.collection('medicinal').doc(that.data.id).remove({
      success: function(res) {
        console.log('删除成功',res.data)
        wx.cloud.deleteFile({
          fileList: that.data.img,
          success: res => {
            // handle success
            console.log(res.fileList)
          },
          fail: err => {
            // handle error
          },
        })
        wx.redirectTo({
          url: '../manage/drugs_gl',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      id:options.id
    })
    db.collection('ypfenlei').get({
      success:function(res){
        console.log('分类获取成功',res)
        that.setData({
          ypfenlei:res.data
        })
      },fail:function(res){
        console.log('分类获取失败',res)
      }
    })
    db.collection('medicinal').doc(options.id).get({
      success:function(res){
        console.log('信息获取成功',res)
        that.setData({
          name:res.data.name,
          price:res.data.price,
          detail:res.data.detail,
          img:res.data.src
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