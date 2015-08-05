class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :uid
      t.string :email
      t.string :first_name
      t.string :last_name
      t.string :image

      t.timestamps null: false
    end
  end
end
