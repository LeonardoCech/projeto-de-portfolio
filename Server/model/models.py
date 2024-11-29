import re
from time import time
from pydantic import BaseModel, Field, SecretStr, EmailStr, field_serializer
from fastapi import Form
from enum import Enum
from typing_extensions import Annotated, Optional

from model.constants import *


class AllocationTypes(Enum):
    balance = 'balance'
    percentage = 'percentage'


class Services(Enum):

    users_service = 'https://users.we-bronx.io'
    smart_trade = 'https://app.we-bronx.io'


class MfaTypes(Enum):

    totp = 'TOTP'
    hotp = 'HOTP'


class Roles(Enum):

    admin = 'ADMIN'
    basic = 'BASIC'
    free = 'FREE'


class NewsPeriods(Enum):

    day = 'day'
    week = 'week'
    month = 'month'


class PresetModel(BaseModel):

    id: str
    type: str

    def model_dump(self):
        return {
            'id': self.id,
            'type': self.type
        }


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


class SymbolAllocationModel(BaseModel):

    '''
    Symbol allocation model.

    `symbol`: Cryptocurrency symbol
    `type`: defines how to allocate balance to operate
    `allocation`: value to operate with
    `has_enough`: if False, operate with available balance, even if balance is less than allocation
    '''

    symbol: str
    type: AllocationTypes
    allocation: float
    has_enough: bool = False


    def model_dump(self):
        return {
            'symbol': self.symbol,
            'type': self.type.value,
            'allocation': self.allocation,
            'has_enough': self.has_enough
        }


class SymbolAllocationLimitedModel(BaseModel):

    '''
    Symbol allocation limited model.

    `type`: defines how to allocate balance to operate
    `allocation`: value to operate with
    `has_enough`: if False, operate with available balance, even if balance is less than allocation
    '''

    type: AllocationTypes
    allocation: float
    has_enough: bool = False


    def model_dump(self):
        return {
            'type': self.type.value,
            'allocation': self.allocation,
            'has_enough': self.has_enough
        }


class AtsPairPatchForm(BaseModel):

    pair_id: int
    enabled: Optional[bool] = False
    create_order: Optional[bool] = False
    base: Optional[SymbolAllocationLimitedModel] = None
    quote: Optional[SymbolAllocationLimitedModel] = None


    def model_dump(self):
        return {
            'pair_id': self.pair_id,
            'enabled': self.enabled,
            'base': self.base.model_dump() if self.base is not None else None,
            'quote': self.quote.model_dump() if self.quote is not None else None
        }


class AtsPairPostForm(BaseModel):

    exchange_slug: str
    base: SymbolAllocationModel
    quote: SymbolAllocationModel
    preset: PresetModel
    timeframe: str

    def model_dump(self):
        return {
            'exchange_slug': self.exchange_slug,
            'base': self.base.model_dump(),
            'quote': self.quote.model_dump(),
            'preset': self.preset.model_dump(),
            'timeframe': self.timeframe
        }


class ExchangeOHLCVQueryPostForm:
    def __init__(
        self,
        *,
        symbol: Annotated[str, Form()] = 'BTC/USDT',
        timeframe: Annotated[Optional[str], Form()] = '1h',
        limit: Annotated[Optional[int], Form()] = 100,
        since: Annotated[Optional[int], Form()] = round((time() - 3600 * 24) * 1000),
        until: Annotated[Optional[int], Form()] = None,
        list_of_dict: Annotated[Optional[bool], Form()] = True
    ):
        """
        Initializes a new instance of the class.

        Args:
            symbol (str): The symbol for the instance.
            timeframe (str): The timeframe for the instance.
            limit (int): The limit for the instance.
            since (Optional[int], optional): The since for the instance. Defaults to one day ago.
            until (Optional[int], optional): The until for the instance.
            list_of_dict (Optional[bool], optional): True if the result must be a list of dict,
                False if it must be a list of list. Defaults to True.

        Returns:
            None
        """

        self.symbol = symbol
        self.timeframe = timeframe
        self.limit = limit
        self.since = since
        self.until = until
        self.list_of_dict = list_of_dict


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


class ExchangeConnectionsPostForm:
    def __init__(
        self,
        *,
        exchange_slug: Annotated[str, Form()],
        api_key: Annotated[SecretStr, Form()],
        secret: Annotated[SecretStr, Form()],
        password: Annotated[Optional[SecretStr], Form()] = None
    ):
        """
        Initializes a new instance of the class.

        Args:
            exchange_slug (str): The exchange name for the instance.
            api_key (SecretStr): The API key for the instance. Defaults to None.
            secret (SecretStr): The secret for the instance. Defaults to None.
            password (Optional[SecretStr], optional): The password for the instance. Defaults to None.

        Returns:
            None
        """

        self.exchange_slug = exchange_slug
        self.api_key = api_key
        self.secret = secret
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


class NewsQueryPeriods(Enum):
    today = 'today'
    week = 'week'
    month = 'month'
    year = 'year'
    all = 'all'
    query = 'query'


class ATSModes(Enum):

    default = 'default'
    simulation = 'simulation'

class ATSTypes(Enum):

    default = 'default'
    users = 'users'

class ATSReportModes(Enum):

    backtest = 'backtest'
    default = 'default'

class Sides(Enum):

    buy = 'buy'
    sell = 'sell'

class ATSSimulationBalancePostForm(BaseModel):

    value: float
    currency: str = 'USDT'

    def model_dump(self):
        return {
            'value': self.value,
            'currency': self.currency
        }
    

class PortfolioPostForm(BaseModel):

    assets: list[str]


class PortfolioAssetKind(Enum):

    available = 'available'
    monitored = 'monitored'


class WaitlistPostForm(BaseModel):

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