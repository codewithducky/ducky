class CreateReports < ActiveRecord::Migration[6.0]
  def change
    create_table :reports do |t|
      t.string :project_hash
      t.json :data

      t.timestamps
    end
  end
end
