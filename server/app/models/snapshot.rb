class Snapshot < ApplicationRecord
  validates :project, presence: true

  has_many_attached :files

  belongs_to :machine
end
