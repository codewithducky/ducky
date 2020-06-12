class SnapshotsController < ApplicationController
  def index
    @snapshots = Snapshot.all.order(created_at: :desc)
  end

  def show
    @snapshot = Snapshot.find(params[:id])
  end
end
