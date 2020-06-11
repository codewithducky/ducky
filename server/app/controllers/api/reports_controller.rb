class API::ReportsController < API::APIController
  def create
    report = Report.new(
      params.require(:report).permit(:snapshot_id, data: ['got', 'expected', 'message'])
    )

    report.machine = Machine.find_by(uuid: params['uuid'])

    report.save!

    if report.nil?
      render json: {:ok => false} if report.nil?

      return
    end

    render json: {:ok => true, :id => report.id}
  end
end
