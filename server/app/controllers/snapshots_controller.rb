class SnapshotsController < ApplicationController
  skip_before_action :verify_authenticity_token

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
