class SnapshotsController < ApplicationController
  def index
    puts params

    render plain: "hi"
  end

  def create
    snapshot = Snapshot.create!(params.permit(files: []))

    puts params

    render plain: "ok"
  end
end
