class Api::SnapshotsController < Api::ApiController
  def create
    snapshot = Snapshot.create!(params.permit(files: []))
    print(snapshot.inspect)

    render json: {:ok => false} unless snapshot

    render json: {:ok => true, :id => snapshot.id}
  end
end
