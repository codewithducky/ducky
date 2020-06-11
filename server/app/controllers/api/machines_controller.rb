class API::MachinesController < API::APIController
  def create
    machine = Machine.create!

    render json: { :ok => true, :uuid => machine.uuid }
  end
end
