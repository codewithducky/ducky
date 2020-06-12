class AddCommentToReport < ActiveRecord::Migration[6.0]
  def change
    add_column :reports, :comment, :string
  end
end
