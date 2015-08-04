require 'rails_helper'

describe 'the unauthenticated user', type: :feature do
  
  before(:each) do
    visit root_path
  end
  
  context 'visits the root page' do

    it 'renders the root page' do
      expect(page).to have_http_status(:ok)
    end

    it 'displays the welcome message' do
      expect(page).to have_content("RoadTripper")
      expect(page).to have_content("Helping you discover the best your road trip has to offer")
      expect(page).to have_link("Get Started!")
    end
    
    it 'redirects to the login page when user clicks the button' do
      click_link "Get Started!"
      
      expect(current_path).to eq(login_path)
    end
  end
end
