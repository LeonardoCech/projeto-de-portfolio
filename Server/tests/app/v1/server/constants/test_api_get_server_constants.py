from __init__ import app
import sys
import os
import pytest
from fastapi import status
from fastapi.testclient import TestClient

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root_dir)


client = TestClient(app)


@pytest.mark.dependency(depends=['TestModelUserModel'])
def test_api_v1_get_server_constants_200_0(api_v1_server_constants):
    """
    Test the GET /server/constants endpoint with a valid request and expect a 200 OK response.

        :param api_v1_server_contants: The fixture for the API client and the necessary data for the request.
        :return: None
        """
    endpoint = api_v1_server_constants.copy()

    response = client.get(
        endpoint['route'],
        headers=endpoint['headers'])

    assert response.status_code == status.HTTP_200_OK
