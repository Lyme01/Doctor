// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'medicine-3g6yepgdaa6eaceb',
})
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    return db.collection('follow').where({
      doctorId: event.doctorId,
      name: event.name
    }).remove()
  } catch (e) {
    console.error(e)
  }
}