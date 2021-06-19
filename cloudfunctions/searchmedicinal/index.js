// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init(
  {
    env:'medicine-3g6yepgdaa6eaceb'
  }
)
const db=cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
   const{
     key
   }=event;
  return  db.collection('medicinal').where({
     name:db.RegExp({
       regexp:key,
       options:'1'
     })
  }).get()
  .then(res=>{
    console.log('success',res)
    return{
      code:200,
      data:res.data
    }
  })
  .catch(err=>{
    console.log('fail'.err)
    return{
      code:201,
      errMsg:err.errMsg
    }
  })
}