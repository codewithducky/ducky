class ReportsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    @reports = Report.all
  end

  def show
    @report = Report.find(params[:id])
  end

  def create
    report = nil 

    report = Report.create(
      params.require(:report).permit(:snapshot_id, :project_hash, data: ['got', 'expected'])
    )

    if report.nil?
      render json: {:ok => false} if report.nil?

      return
    end

    render json: {:ok => true, :id => report.id}
  end
end
