class CreateMachines < ActiveRecord::Migration[6.0]
  def change
    create_table :machines do |t|
      t.string :uuid

      t.timestamps
    end

    add_reference :snapshots, :machine, null: true, foreign_key: true
  end
end
