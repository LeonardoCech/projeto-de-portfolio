import re
from time import time
from pydantic import BaseModel, SecretStr, EmailStr, field_serializer
from fastapi import Form
from enum import Enum
from typing_extensions import Annotated, Optional

from model.constants import *


class Services(Enum):

    users_service = 'https://users.minhas-financas-tcc.io'
    smart_trade = 'https://app.minhas-financas-tcc.io'


class MfaTypes(Enum):

    totp = 'TOTP'
    hotp = 'HOTP'


class Roles(Enum):

    admin = 'ADMIN'
    basic = 'BASIC'
    free = 'FREE'


class UserFirebase:

    uid: str
    email: str


class UserModel(BaseModel):

    fullname: str = Form(...)
    email: EmailStr = Form(...)
    password: SecretStr = Form(...)
    role: Roles = Form(default=Roles.free)

    @field_serializer('password', when_used='json')
    def dump_secret(v):
        """
        Decorator that serializes the 'password' field when used in JSON format.

        :param v: The value of the 'password' field.
        :type v: Any

        :return: The secret value of the 'password' field.
        :rtype: Any
        """
        return v.get_secret_value()

    def validate(self):
        """
        Validates the model instance.
        """
        self.validate_fullname()
        self.validate_password()

    def validate_fullname(self):
        """
        Validates the 'fullname' field.
        """

        if not isinstance(self.fullname, str):
            return False, f'Fullname must be a <class \'str\'> instance. Got {type(self.fullname)}'

        v = self.fullname

        if len(v) < USER_MODEL_FULLNAME_LENGTH_MIN:
            return False, f'Fullname must be at least {USER_MODEL_FULLNAME_LENGTH_MIN} characters long. Got {len(v)} characters.'

        if len(v) > USER_MODEL_FULLNAME_LENGTH_MAX:
            return False, f'Fullname must be at most {USER_MODEL_FULLNAME_LENGTH_MAX} characters long. Got {len(v)} characters.'

        return True, 'Valid fullname.'

    def validate_password(self):
        """
        Validates the 'password' field.
        """

        if not isinstance(self.password, SecretStr):
            return False, f'Password must be a <class \'SecretStr\'> instance. Got {type(self.password)}'

        v = self.password.get_secret_value()

        if len(v) < USER_MODEL_PASSWORD_LENGTH_MIN:
            return False, f'Password must be at least {USER_MODEL_PASSWORD_LENGTH_MIN} characters long. Got {len(v)} characters.'

        if len(v) > USER_MODEL_PASSWORD_LENGTH_MAX:
            return False, f'Password must be at most {USER_MODEL_PASSWORD_LENGTH_MAX} characters long. Got {len(v)} characters.'

        if not re.match(USER_MODEL_PASSWORD_REGEX, v):
            return False, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'

        return True, 'Valid password.'

    def validate_email(self):
        """
        Validates the 'email' field.
        """

        if not isinstance(self.email, str):
            return False, f'Email must be a <class \'str\'> instance. Got {type(self.email)}'

        v = self.email

        if not re.match(USER_MODEL_EMAIL_REGEX, v):
            return False, 'Email must be a valid email address.'

        return True, 'Valid email.'


class UserCredentials(BaseModel):

    password: SecretStr = Form(...)

    @field_serializer('password', when_used='json')
    def dump_secret(v):
        """
        Decorator that serializes the 'password' field when used in JSON format.

        :param v: The value of the 'password' field.
        :type v: Any

        :return: The secret value of the 'password' field.
        :rtype: Any
        """
        return v.get_secret_value()

    def validate(self):
        """
        Validates the model instance.
        """
        self.validate_password()

    def validate_password(self):
        """
        Validates the 'password' field.
        """

        if not isinstance(self.password, SecretStr):
            return False, f'Password must be a <class \'SecretStr\'> instance. Got {type(self.password)}'

        v = self.password.get_secret_value()

        if len(v) < USER_MODEL_PASSWORD_LENGTH_MIN:
            return False, f'Password must be at least {USER_MODEL_PASSWORD_LENGTH_MIN} characters long. Got {len(v)} characters.'

        if len(v) > USER_MODEL_PASSWORD_LENGTH_MAX:
            return False, f'Password must be at most {USER_MODEL_PASSWORD_LENGTH_MAX} characters long. Got {len(v)} characters.'

        if not re.match(USER_MODEL_PASSWORD_REGEX, v):
            return False, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'

        return True, 'Valid password.'


class UserSettingsModel(BaseModel):

    fullname: Optional[str] = None


class SessionPostForm:
    def __init__(
        self,
        *,
        username: Annotated[EmailStr, Form()],
        password: Annotated[SecretStr, Form()]
    ):
        """
        Initializes a new instance of the class.

        Args:
            username (EmailStr): The email for the instance.
            password (SecretStr): The password for the instance.

        Returns:
            None
        """

        self.username = username
        self.password = password


class UserCredentialsPatchForm:
    def __init__(
        self,
        *,
        password: Annotated[SecretStr, Form()]
    ):
        """
        Initializes a new instance of the class.

        Args:
            password (SecretStr): The password for the instance.

        Returns:
            None
        """

        self.password = password


class UserCreatePostForm:
    def __init__(
        self,
        *,
        username: Annotated[EmailStr, Form()],
        password: Annotated[SecretStr, Form()],
        fullname: Annotated[str, Form()]
    ):
        """
        Initializes a new instance of the class.

        Args:
            username (EmailStr): The email for the instance.
            password (SecretStr): The password for the instance.
            fullname (str): The fullname for the instance.

        Returns:
            None
        """

        self.username = username
        self.password = password
        self.fullname = fullname


    email: EmailStr
    hasExchangeAccount: bool
    selectedProfile: str
    hasUsedBot: bool
    userExchanges: list[str]

    def model_dump(self):
        return {
            'email': self.email,
            'hasExchangeAccount': self.hasExchangeAccount,
            'selectedProfile': self.selectedProfile,
            'hasUsedBot': self.hasUsedBot,
            'userExchanges': self.userExchanges
        }
    

class InsightModel(BaseModel):

    message: str