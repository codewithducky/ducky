class ReportsController < ApplicationController
  def index
    @reports = Report.all.order(created_at: :desc)
  end

  def show
    @report = Report.find(params[:id])
  end

  def update
    @report = Report.find(params[:id])
    @report.update(comment: params[:report][:comment])
  end
end
