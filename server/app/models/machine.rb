class Machine < ApplicationRecord
  validates :uuid, uniqueness: true, presence: true

  before_validation do |m|
    if m.uuid.nil?
      m.uuid = SecureRandom.uuid
    end
  end
end
