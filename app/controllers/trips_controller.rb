class TripsController < ApplicationController
  
  def new
    @trip = GoogleDirections.new(params[:origin], params[:destination])
    redirect_to dashboard_path
  end
end
