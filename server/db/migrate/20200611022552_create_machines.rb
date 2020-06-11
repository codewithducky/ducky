class CreateMachines < ActiveRecord::Migration[6.0]
  def change
    create_table :machines do |t|
      t.string :uuid

      t.timestamps

      t.references :report, null: true, foreign_key: true
    end

    add_reference :reports, :machine, null: true, foreign_key: true
  end
end
