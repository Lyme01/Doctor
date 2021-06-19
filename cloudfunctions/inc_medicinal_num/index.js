const cloud = require('wx-server-sdk')

cloud.init({
  env:'medicine-3g6yepgdaa6eaceb'
})
const db = cloud.database()
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  return db.collection('medicinal').doc(event.medicinal_id).update({
    data: {
      num: _.inc(1)
    }
  })
}