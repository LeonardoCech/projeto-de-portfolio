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


def test_api_v1_get_user_me_validate_token_200_0(api_v1_user_me_validate_token):
    """
    Test the GET /user/me/validate/token endpoint with a valid request and expect a 200 OK response.

        :param api_v1_user_me_validate_token: The fixture for the API client and the necessary data for the request.
        :return: None
        """
    endpoint = api_v1_user_me_validate_token.copy()

    response = client.get(
        endpoint['route'],
        headers=endpoint['headers']
    )
    assert response.status_code == status.HTTP_200_OK
