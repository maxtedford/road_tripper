class SessionsController < ApplicationController
if Rails.env != "development"
  force_ssl only: [:create]
end
  
  def create
    @user = User.find_or_create_from_oauth(oauth)
    if @user
      session[:user_id] = @user.id
      redirect_to dashboard_path
    else
      redirect_to root_path
    end
  end
  
  def destroy
    session.destroy
    redirect_to root_path
  end

  private
  
  def oauth
    request.env["omniauth.auth"]
  end
end
