class User < ActiveRecord::Base
  
  def self.find_or_create_from_oauth(oauth)
    user = User.find_or_create_by(uid: oauth.uid)

    user.uid           = oauth.info.uid
    user.email         = oauth.info.email
    user.first_name    = oauth.info.first_name
    user.last_name     = oauth.credentials.last_name
    user.image         = oauth.credentials.image
    user.save
    
    user
  end
end
