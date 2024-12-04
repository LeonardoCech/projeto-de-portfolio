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
        '''
        test_class = 'Model UserModel'
        test_name = 'Validate Email Not String'

        self.user.email = 123
        result, msg = self.user.validate_email()
        
        if UNITTESTS_SHOW_LOGS:
            print(unittest_log(test_class, test_name, not result, msg))
        
        self.assertFalse(result)    
