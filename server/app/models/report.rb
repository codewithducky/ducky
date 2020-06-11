class Report < ApplicationRecord
  belongs_to :snapshot
  belongs_to :machine
end
