class Snapshot < ApplicationRecord
  validates :project, presence: true

  has_many_attached :files

  belongs_to :machine

  def previous
    @previous ||= Snapshot
      .where(machine_id: machine_id, project: project)
      .where("created_at < ?", created_at)
      .order(created_at: :asc)
      .last

    @previous
  end

  def next
    @next ||= Snapshot
      .where(machine_id: machine_id, project: project)
      .where("created_at > ?", created_at)
      .order(created_at: :asc)
      .first

    @next
  end
end
