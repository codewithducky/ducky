class API::SnapshotsController < API::APIController
  def create
    snapshot = Snapshot.new(params.permit(:project, files: []))
    snapshot.machine = Machine.find_by(uuid: params['uuid'])

    snapshot.save!

    if snapshot.nil?
      render json: {:ok => false}

      return
    end

    render json: {:ok => true, :id => snapshot.id}
  end
end
