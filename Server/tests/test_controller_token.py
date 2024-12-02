# tests/test_controller_token.py

import unittest, sys, os, pytest

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root_dir)

from controller.token import *


@pytest.mark.order(1)
class TestControllerToken(unittest.TestCase):


    def test_validate_token(self):
        pass