class AddProjectToSnapshot < ActiveRecord::Migration[6.0]
  def up
    add_column :snapshots, :project, :string

    execute "UPDATE snapshots SET project = 'test'"
  end

  def down
    remove_column :snapshots, :project
  end
end
