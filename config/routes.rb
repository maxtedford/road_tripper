Rails.application.routes.draw do
  
  get '/dashboard', as: :dashboard, to: 'dashboard#show'
  get '/auth/google_oauth2', as: :login
  get '/auth/google_oauth2/callback', to: 'sessions#create', constraints: { protocol: "https" }
  get '/logout', as: :logout, to: 'sessions#destroy'
  
  root 'welcome#index'
end
