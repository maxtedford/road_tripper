require 'rails_helper'

RSpec.describe User, type: :model do
  
  let(:valid_attribs) { { uid:        "1",
                          email:      "user@gmail.com",
                          first_name: "user",
                          last_name:  "schmoe",
                          image:      "image_string" } }
  
  context 'registers' do
    it 'is valid' do
      user = User.create(valid_attribs)
      
      expect(user).to be_valid
    end
    
    it 'is invalid without a uid' do
      user = User.create(email:      "user@gmail.com",
                         first_name: "user",
                         last_name:  "schmoe",
                         image:      "image_string")
      
      expect(user).not_to be_valid
    end
    
    it 'is invalid without an email' do
      user = User.create(uid:        "1",
                         first_name: "user",
                         last_name:  "schmoe",
                         image:      "image_string")
      
      expect(user).not_to be_valid
    end
    
    it 'is invalid if an email has already been taken' do
      first_user = User.create(valid_attribs)
      second_user = User.create(uid:        "2",
                                email:      "user@gmail.com",
                                first_name: "user_two",
                                last_name:  "schmoe_two",
                                image:      "image_string_two")
      
      expect(second_user).not_to be_valid
    end
    
    it 'is invalid without a first name' do
      user = User.create(uid:        "1",
                         email:      "user@gmail.com",
                         last_name:  "schmoe",
                         image:      "image_string")
      
      expect(user).not_to be_valid
    end
    
    it 'is invalid without a last name' do
      user = User.create(uid:        "1",
                         email:      "user@gmail.com",
                         first_name: "user",
                         image:      "image_string")
      
      expect(user).not_to be_valid
    end
    
    it 'is invalid without an image' do
      user = User.create(uid:        "1",
                         email:      "user@gmail.com",
                         first_name: "user",
                         last_name:  "schmoe")
      
      expect(user).not_to be_valid
    end
  end
end
