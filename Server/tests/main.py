# tests/main.py

"""
Copyright (c) 2024 BNX Technologies LTDA
This script is protected by copyright laws and cannot be reproduced, distributed,
or used without written permission of the copyright owner.
"""

import unittest, sys, os

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root_dir)

if __name__ == '__main__':
    unittest.main()
