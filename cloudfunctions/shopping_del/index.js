// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'medicine-3g6yepgdaa6eaceb'
})
  

const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const ap = cloud.getWXContext()
  try {
    return await db.collection('shopping_cart').where({
      _openid:ap.OPENID,
      medicinal_checked: "true"
    }).remove()
  } catch(e) {
    console.error(e)
  }
}