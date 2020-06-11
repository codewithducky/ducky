class API::ReportsController < API::APIController
  def create
    report = Report.create(
      params.require(:report).permit(:snapshot_id, data: ['got', 'expected', 'message'])
    )

    if report.nil?
      render json: {:ok => false} if report.nil?

      return
    end

    render json: {:ok => true, :id => report.id}
  end
end
