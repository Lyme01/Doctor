// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'medicine-3g6yepgdaa6eaceb'
})
// 云函数入口函数
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  return db.collection('order').where({
    medicinal_state:event.state
  }).get()
}