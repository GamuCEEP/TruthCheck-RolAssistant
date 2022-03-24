import { orm } from '/dependencies.ts'
const dt = orm.DataTypes

class Actor extends orm.Model {
  static table = 'Actors'
  static timestamps = true
  static fields = {
    _id: {
      type: dt.
      primaryKey: true,
    },
    name: 
  }
}