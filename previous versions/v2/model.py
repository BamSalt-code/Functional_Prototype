from flask_sqlalchemy import SQLAlchemy, query
import flask_login
from flask_login import UserMixin, login_user, logout_user, LoginManager, login_required, user_logged_in, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from sqlalchemy import func, update


db = SQLAlchemy()
login = flask_login.LoginManager()


class UserAccounts(UserMixin, db.Model):
    __tablename__ = "User Accounts"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String())
    registered_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), nullable=False)
    date_of_birth = db.Column(db.Date())
    def set_password(self, user_password):
        self.password_hash = generate_password_hash(user_password)

    def check_password(self, user_password):
        return check_password_hash(self.password_hash, user_password)

# functions for login system, such as loading users and setting/checking passwords #

@login.user_loader
def load_user(id):
    return UserAccounts.query.get(int(id))





