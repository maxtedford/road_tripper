class TripsController < ApplicationController
  
  def new
    gon.origin      = params[:origin]
    gon.destination = params[:destination]
    redirect_to dashboard_path
  end
end
