from flask_wtf import FlaskForm, csrf, recaptcha, CSRFProtect, RecaptchaField
from wtforms import StringField
from wtforms.validators import DataRequired

# when implemented, will contain all form templates for use in the application #

# class MyForm(FlaskForm):
#     name = StringField('name', validators=[DataRequired()])
#     captcha = RecaptchaField()