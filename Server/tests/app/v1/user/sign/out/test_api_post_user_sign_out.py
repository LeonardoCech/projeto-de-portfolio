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


@pytest.mark.order(-1)
def test_api_v1_post_user_sign_out_200_0(api_v1_user_sign_out):
    """
        Test the POST /user/sign/out endpoint with a valid request and expect a 200 OK response.

        :param api_v1_user_sign_out: The fixture for the API client and the necessary data for the request.
        :return: None
        """
    endpoint = api_v1_user_sign_out.copy()

    response = client.post(
        endpoint['route'],
        headers=endpoint['headers'],
        data=endpoint['data']
    )
    assert response.status_code == status.HTTP_200_OK
