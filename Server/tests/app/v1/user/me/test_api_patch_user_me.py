from __init__ import app
import sys
import os
import pytest
import json
from fastapi import status
from fastapi.testclient import TestClient

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root_dir)


client = TestClient(app)

# TODO: Add more tests (for each error case)


def test_api_v1_patch_user_me_200_0(api_v1_user_me):
    """
    Test the PATCH /user/me endpoint with a valid request and expect a 200 OK response.

        :param api_v1_user_me: The fixture for the API client and the necessary data for the request.
        :return: None
        """
    endpoint = api_v1_user_me.copy()

    response = client.patch(
        endpoint['route'],
        headers=endpoint['headers']['patch'],
        data=json.dumps(endpoint['data']['patch'])
    )
    assert response.status_code == status.HTTP_200_OK
