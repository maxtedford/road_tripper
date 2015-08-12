require 'rails_helper'

describe 'the unauthenticated user', type: :feature do
  include Capybara::DSL

  before(:each) do
    Capybara.app = RoadTripper::Application
    stub_omniauth
  end

  context 'logs in with google' do
    
    it 'logs in' do
      visit "/"

      assert_equal 200, page.status_code

      click_link "Hit the Road!"
      assert_equal "/dashboard", current_path
      assert page.has_content?("Welcome, Max!")
      assert page.has_link?("Logout")
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
