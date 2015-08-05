class User < ActiveRecord::Base
  validates :uid,
    presence: true
  validates :email,
    presence: true,
    uniqueness: true
  validates :first_name,
    presence: true
  validates :last_name,
    presence: true
  validates :image,
    presence: true
  
  def self.find_or_create_from_oauth(oauth)
    user = User.find_or_create_by(uid: oauth.uid)

    user.uid           = oauth.uid
    user.email         = oauth.info.email
    user.first_name    = oauth.info.first_name
    user.last_name     = oauth.info.last_name
    user.image         = oauth.info.image
    user.save
    
    user
  end
end
