class API::MachinesController < API::APIController
  def create
    machine = Machine.create!(params.require(:machine).permit(:email))

    render json: { :ok => true, :uuid => machine.uuid }
  end
end
