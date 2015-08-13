require 'rails_helper'

describe 'the unauthenticated user', type: :feature do
  include Capybara::DSL

  before(:each) do
    Capybara.app = RoadTripper::Application
    stub_omniauth
  end

  context 'logs in and out with google' do
    
    it 'logs in' do
      visit "/"

      expect(page.status_code).to eq(200)

      click_link "Hit the Road!"
      
      expect(current_path).to eq("/dashboard")
      expect(page).to have_content("Welcome, Max!")
      expect(page).to have_link("Logout")
      
      click_link "Logout"
      
      expect(current_path).to eq("/")
      expect(page).to have_link("Hit the Road!")
    end
    
    def stub_omniauth
      OmniAuth.config.test_mode = true
      OmniAuth.config.mock_auth[:google_oauth2] = OmniAuth::AuthHash.new({
          provider: "google_oauth2",
          uid: "1234",
          info: {
            name: "Max Tedford",
            email: "max@max.com",
            first_name: "Max",
            last_name: "Tedford",
            image: "url_stringy",
          }
        })
    end
  end
end
