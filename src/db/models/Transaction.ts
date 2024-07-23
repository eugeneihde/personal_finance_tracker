import { Model, Column, Table, DataType, ForeignKey } from 'sequelize-typescript'
import User from './User'

@Table({
  tableName: 'transactions',
  timestamps: false
})
class Transaction extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  })
  id!: number

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  user_id!: number

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  title!: string

  @Column({
    type: DataType.DATE,
    allowNull: false
  })
  date!: Date

  @Column({
    type: DataType.FLOAT,
    allowNull: false
  })
  amount!: number

  @Column({
    type: DataType.ENUM('income', 'expense'),
    allowNull: false
  })
  type!: string
}

export default Transaction