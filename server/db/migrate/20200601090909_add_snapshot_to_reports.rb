class AddSnapshotToReports < ActiveRecord::Migration[6.0]
  def change
    add_reference :reports, :snapshot, null: true, foreign_key: true
  end
end
