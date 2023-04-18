from flask import Flask, render_template, redirect, flash, get_flashed_messages, url_for, request
from model import *
from flask_migrate import Migrate

import secrets
from functools import wraps
from sqlalchemy import update
import pytz
from datetime import datetime, timedelta, timezone







app = Flask(__name__)

# establishes setting and configurations needed for the running of the site#

app.secret_key = secrets.token_hex(16)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///HealthAdviceGroupDatabase.db"



db.init_app(app)
migrate = Migrate(app, db)
login.login_view = "login"
login.init_app(app)



# only for development, used for resetting or creating the database if needed #
# if a database needs to be reset, uncomment drop all, create all, then run once and visit the page #
# Then end script, and re-comment out the code instructions (the database is stored in the 'instance' file #


def database_reset():
 with app.app_context():
    #db.drop_all()
    #db.create_all()
    data = UserAccounts.query.all()
    for i in data:
        print(i.username)
        print(i.password_hash)

database_reset()

@app.route("/")
def base():
    return render_template("dashboard_template.html")

@app.route("/login", methods=['GET', 'POST'])
def login():
    if request.method == "GET":
        return render_template("login.html")
    if request.method == "POST":
        with app.app_context():
             username = request.form["username"]
             user_data = UserAccounts.query.filter_by(username=username).first()
             if user_data is None or not user_data.check_password(user_password=request.form["password"]):
                return render_template('login.html')
             login_user(user_data)
             return redirect(url_for('dashboard'))





@app.route("/register", methods=['GET', 'POST'])
def register():
    if request.method == "GET":
        return render_template("register.html")
    if request.method == "POST":
       with app.app_context():
            username = request.form["username"]
            email = request.form["email"]
            user_password = request.form["password"]
            confirm_password = request.form["confirm_password"]
            username_presense_check = UserAccounts.query.filter_by(username=username).first()
            email_presense_check = UserAccounts.query.filter_by(username=email).first()
            if username_presense_check is not None or email_presense_check is not None:
                flash("email or username is already in use")
                return render_template('register.html')
            # checks no other accounts with same details exist #
            # set of if checks to verify password security #
            if user_password != confirm_password:
                return render_template('register.html')
            # adds user to db, but with confirmed and staff set to false #
            user = UserAccounts(username=username, email=email)
            user.set_password(user_password)
            db.session.add(user)
            db.session.commit()
            # adds user to the database, then logs then in (verified = false), #
            # and generates a token, and redirects for email confirmation #
            login_user(user)
            return redirect(url_for('base'))


# logs the user out #

@app.route("/logout")
def logout():
    logout(current_user)
    return redirect(url_for('base'))


@app.route("/weather")
def weather():
    return render_template("v1weatherforecast.html")

def hour_rounder(time):
    return (time.replace(second=0, microsecond=0, minute=0, hour=time.hour)+timedelta(hours=time.minute//30))

@app.route("/tracker", methods=['GET', 'POST'])
@login_required
def tracker():
    if request.method == "GET":
        with app.app_context():
            user_table_data = Logs.query.filter_by(made_by=current_user.id)
            return render_template("healthtracker.html", data=user_table_data, user_name=current_user.username)
    if request.method == "POST":
        with app.app_context():
          tracker_data = request.get_json()
          print(tracker_data)
          symptoms = tracker_data['symptomRating']
          description = tracker_data['loggerDescription']
          air_quality = tracker_data['loggerQuality']
          pollen_level = tracker_data['loggerPollen']
          api_data = tracker_data['API_Data']
          print(api_data)
          now = datetime.now()
          rounded_time = (hour_rounder(now))
          iso_format = rounded_time.isoformat(timespec='minutes')
          #current_api_index =
          new_entry = Logs(made_by=current_user.id, symptom_rating=symptoms, air_quality=air_quality, pollen_level=pollen_level, user_description=description)
          db.session.add(new_entry)
          db.session.commit()
          return redirect(url_for('tracker'))


@app.route("/tracker", methods=['GET', 'POST'])
@login_required
def tracker():
    if request.method == "GET":
        with app.app_context():
            user_table_data = Logs.query.filter_by(made_by=current_user.id)
            return render_template("healthtracker.html", data=user_table_data, user_name=current_user.username)
    if request.method == "POST":
        with app.app_context():
          tracker_data = request.get_json()
          print(tracker_data)
          symptoms = tracker_data['symptomRating']
          description = tracker_data['loggerDescription']
          air_quality = tracker_data['loggerQuality']
          pollen_level = tracker_data['loggerPollen']
          api_data = tracker_data['API_Data']
          print(api_data)
          now = datetime.now()
          rounded_time = (hour_rounder(now))
          iso_format = rounded_time.isoformat(timespec='minutes')
          #current_api_index =
          new_entry = Logs(made_by=current_user.id, symptom_rating=symptoms, air_quality=air_quality, pollen_level=pollen_level, user_description=description)
          db.session.add(new_entry)
          db.session.commit()
          return redirect(url_for('tracker'))

# @app.route("/tracker", methods=['POST', 'GET'])
# @login_required
# def tracker():
#     if request.method == 'GET':
#         user_table_data = Logs.query.filter_by(made_by=current_user.id)
#         return render_template("healthtrackerv1.html", Logs=user_table_data, user_name=current_user.username)
#     if request.method == 'POST':
#         logger_data = request.get_json()
#         with app.app_context():
#             symptoms = logger_data['symptoms']
#             description = logger_data['loggerDescription']
#             api_data = logger_data['api']
#             now = datetime.now()
#             rounded_time = (hour_rounder(now))
#             iso_date = rounded_time.isoformat(timespec='minutes')
#             current_api_index = (api_data['hourly']['time'].index(iso_date))
#             N02 = (api_data['hourly']['nitrogen_dioxide'][current_api_index])
#             alder = (api_data['hourly']['alder_pollen'][current_api_index])
#             new_entry = Logs(made_by=current_user.id, symptom_rating=symptoms, air_quality=N02, pollen_level=alder, user_description=description)
#             db.session.add(new_entry)
#             db.session.commit()
#             return redirect(url_for('tracker'))
#     return render_template('healthtrackerv1.html')

@app.route("/createlog", methods=['GET', 'POST'])
@login_required
def createlog():
    if request.method == "GET":
     return render_template("createhealthlog.html")
    if request.method == "POST":
        return render_template("createhealthlog.html")



if __name__ == '__main__':
    app.run(debug=True)


