class API::SnapshotsController < API::APIController
  def create
    snapshot = Snapshot.create!(params.permit(files: []))

    render json: {:ok => false} unless snapshot

    render json: {:ok => true, :id => snapshot.id}
  end
end
