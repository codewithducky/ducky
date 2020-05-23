class SnapshotsController < ApplicationController
  def index
    @snapshots = Snapshot.all
  end

  def show
    @snapshot = Snapshot.find(params[:id])
  end

  def create
    snapshot = Snapshot.create!(params.permit(files: []))

    puts params

    render plain: "ok"
  end
end
