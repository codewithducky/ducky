class AddEmailToMachine < ActiveRecord::Migration[6.0]
  def change
    add_column :machines, :email, :string
  end
end
