# tests/test_controller_token.py

"""
Copyright (c) 2024 BNX Technologies LTDA
This script is protected by copyright laws and cannot be reproduced, distributed,
or used without written permission of the copyright owner.
"""

import unittest, sys, os, pytest

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root_dir)

from controller.token import *


@pytest.mark.order(1)
class TestControllerToken(unittest.TestCase):


    def test_validate_token(self):
        pass