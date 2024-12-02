# tests/test_model_firebase_user.py

import unittest, sys, os, pytest

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root_dir)

from model.constants import *
from model.models import UserModel

from tests.utils import unittest_log

from pydantic import SecretStr

@pytest.mark.order(1)
class TestModelUserModel(unittest.TestCase):

    user = UserModel(
        fullname = '',
        email = 'test@we-bronx.io',
        password = SecretStr(''),
        oauthmfa = False
    )

    # Password Tests

    def test_dump_secret(self):
        '''
        This function is used on the 'validate_password' function, so it MUST be tested first.
        '''
        test_class = 'Model UserModel'
        test_name = 'Dump Secret'

        password = 'P@$$W0RD'
        secretStr = SecretStr(password)
        result = UserModel.dump_secret(secretStr)
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, True, 'dump_secret test passed'))
        
        self.assertEqual(result, password, 'wrong password after dump (pydantic.SecretStr to str)')


    
    def test_validate_password_correct(self):
        '''
        Testing a valid password
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Password Correct'

        self.user.password = SecretStr('Corr3c7_P@$$W0RD')
        result, msg = self.user.validate_password()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, result, msg))
        
        self.assertTrue(result)

    def test_validate_password_too_short(self):
        '''
        Testing a too short password
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Password Too Short'

        self.user.password = SecretStr('Corr3c7')
        result, msg = self.user.validate_password()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, not result, msg))
        
        self.assertFalse(result)

    def test_validate_password_too_long(self):
        '''
        Testing a too long password
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Password Too Long'

        self.user.password = SecretStr('Corr3c7_P@$$W0RD_1234567890123456')
        result, msg = self.user.validate_password()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, not result, msg))
            
        self.assertFalse(result)
        
    def test_validate_password_not_secretstr(self):
        '''
        Testing a not str password
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Password Not SecretStr'

        self.user.password = 'Corr3c7_P@$$W0RD'
        result, msg = self.user.validate_password()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, not result, msg))
        
        self.assertFalse(result)

    def test_validate_password_empty(self):
        '''
        Testing an empty password
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Password Empty'

        self.user.password = SecretStr('')
        result, msg = self.user.validate_password()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, not result, msg))
        
        self.assertFalse(result)

    def test_validate_password_not_set(self):
        '''
        Testing a not set password
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Password Not Set'

        self.user.password = None
        result, msg = self.user.validate_password()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, not result, msg))
        
        self.assertFalse(result)

    def test_validate_password_match_regex(self):
        '''
        Testing Password Regex
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Password Regex'

        self.user.password = SecretStr('Corr3c7_P@$$W0RD')
        result, msg = self.user.validate_password()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, result, msg))
        
        self.assertTrue(result)

    def test_validate_password_dont_match_regex_lowercase(self):
        '''
        Testing Password that Don\'t Match Regex (no lowercase characters)
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Password that Don\'t Match Regex (no lowercase characters)'

        self.user.password = SecretStr('CORR3C7_P@$$W0RD')
        result, msg = self.user.validate_password()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, not result, msg))
        
        self.assertFalse(result)

    def test_validate_password_dont_match_regex_uppercase(self):
        '''
        Testing Password that Don\'t Match Regex (no uppercase characters)
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Password that Don\'t Match Regex (no uppercase characters)'

        self.user.password = SecretStr('corr3c7_p@$$w0rd')
        result, msg = self.user.validate_password()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, not result, msg))
        
        self.assertFalse(result)

    def test_validate_password_dont_match_regex_number(self):
        '''
        Testing Password that Don\'t Match Regex (no number characters)
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Password that Don\'t Match Regex (no number characters)'

        self.user.password = SecretStr('CorrEcT_P@$$WORD')
        result, msg = self.user.validate_password()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, not result, msg))
        
        self.assertFalse(result)

    def test_validate_password_dont_match_regex_specialchar(self):
        '''
        Testing Password that Don\'t Match Regex (no special characters)
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Password that Don\'t Match Regex (no special characters)'

        self.user.password = SecretStr('Corr3c7 PASSW0RD')
        result, msg = self.user.validate_password()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, not result, msg))
        
        self.assertFalse(result)



    def test_validate_fullname(self):
        '''
        Testing a valid fullname
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Fullname'

        self.user.fullname = 'Test'
        result, msg = self.user.validate_fullname()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, result, msg))
        
        self.assertTrue(result)
    

    def test_validate_fullname_too_short(self):
        '''
        Testing a too short fullname
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Fullname Too Short'

        self.user.fullname = 'Tes'
        result, msg = self.user.validate_fullname()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, not result, msg))
        
        self.assertFalse(result)
        

    def test_validate_fullname_too_long(self):
        '''
        Testing a too long fullname
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Fullname Too Long'

        self.user.fullname = 'Teste Name With 34 Characters Long'
        result, msg = self.user.validate_fullname()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, not result, msg))
        
        self.assertFalse(result)


    def test_validate_fullname_not_str(self):
        '''
        Testing a fullname that is not a string
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Fullname Not String'

        self.user.fullname = 123
        result, msg = self.user.validate_fullname()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, not result, msg))
        
        self.assertFalse(result)
    

    def test_validate_fullname_empty(self):
        '''
        Testing an empty fullname
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Fullname Empty'

        self.user.fullname = ''
        result, msg = self.user.validate_fullname()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, not result, msg))
        
        self.assertFalse(result)
    
    def test_validate_fullname_none(self):
        '''
        Testing a fullname that is None
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Fullname None'

        self.user.fullname = None
        result, msg = self.user.validate_fullname()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, not result, msg))
        
        self.assertFalse(result)

    def test_validate_email_correct(self):
        '''
        Testing a valid email
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Email Correct'

        self.user.email = 'test@we-bronx.io'
        result, msg = self.user.validate_email()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, result, msg))
        
        self.assertTrue(result)

    def test_validate_email_invalid(self):
        '''
        Testing an invalid email
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Email Invalid'

        self.user.email = 'testwe-bronx'
        result, msg = self.user.validate_email()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, not result, msg))
        
        self.assertFalse(result)

    def test_validate_email_none(self):
        '''
        Testing an email that is None
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Email None'

        self.user.email = None
        result, msg = self.user.validate_email()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, not result, msg))
        
        self.assertFalse(result)

    def test_validate_email_not_str(self):
        '''
        Testing an email that is not a string
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Email Not String'

        self.user.email = 123
        result, msg = self.user.validate_email()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, not result, msg))
        
        self.assertFalse(result)    
