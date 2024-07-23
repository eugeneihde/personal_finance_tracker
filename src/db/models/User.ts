import { Model, Column, Table, DataType, HasMany } from 'sequelize-typescript'

@Table({
  tableName: 'users',
  timestamps: false,
})
class User extends Model {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  })
  id!: number

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  displayName!: string

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  username!: string

  @Column({
    type: DataType.ENUM('euro', 'dollar'),
    allowNull: false
  })
  currency!: string

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  password!: string
}

export default User