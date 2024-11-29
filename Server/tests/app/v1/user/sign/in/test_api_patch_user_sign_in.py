from tests.conftest import ValueStorage
from __init__ import app
import sys
import os
import pytest
from fastapi import status
from fastapi.testclient import TestClient

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root_dir)


client = TestClient(app)

# TODO: Add more tests (for each error case)


@pytest.mark.order(6)
def test_api_v1_patch_user_sign_in_200_0(api_v1_user_sign_in):
    """
        Test the PATCH /user/sign/in endpoint with a valid request and expect a 200 OK response.

        :param api_v1_user_sign_in: The fixture for the API client and the necessary data for the request.
        :return: None
        """
    endpoint = api_v1_user_sign_in.copy()

    response = client.patch(
        endpoint['route'],
        headers=endpoint['headers']['patch'],
        data=endpoint['data']['patch']
    )
    assert response.status_code == status.HTTP_200_OK
