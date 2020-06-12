class Report < ApplicationRecord
  belongs_to :snapshot

  def previous
    if snapshot.previous.nil?
      return
    end

    @previous ||= Report.find_by(snapshot: snapshot.previous)
  end

  def next
    if snapshot.next.nil?
      return
    end

    @next ||= Report.find_by(snapshot: snapshot.next)
  end
end
