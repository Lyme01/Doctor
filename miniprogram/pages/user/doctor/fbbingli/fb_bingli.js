// pages/user/doctor/fb_bingli/fb_bingli.js
const db=wx.cloud.database()
Page({
  data: {
    date: '1990-09-01',

  },

  onLoad: function (options) {
    console.log(options)

  },
  submit:function(e){
    let that = this
    console.log(e)
    if(e.detail.value.name!==""&&e.detail.value.idcard!==""&&e.detail.value.number!==""&&e.detail.value.date!==""&&e.detail.value.age!==""&&e.detail.value.record!==""&&e.detail.value.doctor_name!==""){
      db.collection('list').add({
        data:{
          name:e.detail.value.name,
          number:e.detail.value.number,
          idcard:e.detail.value.idcard,
          date:e.detail.value.date,
          sex:e.detail.value.sex,
          age:e.detail.value.age,
          record:e.detail.value.record,
          doctor_name:e.detail.value. doctor_name
              
        },success:function(res){
          wx.showToast({
            title: '提交成功',
          })
        
        }
      })
    }else{
      wx.showToast({
        title: '你还有未填信息',
        icon:"none"
      })
    }
  },
  bindDate(e) {
    this.setData({
     date: e.detail.value
    })
  },

})