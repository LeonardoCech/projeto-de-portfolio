from __init__ import app
import sys
import os
import pytest
from fastapi import status
from fastapi.testclient import TestClient

from tests.utils import delete_test_user

root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(root_dir)


client = TestClient(app)

# TODO: Add more tests (for each error case)


@pytest.mark.order(2)
@pytest.mark.dependency(depends=['TestModelUserModel'])
def test_api_v1_post_user_sign_up_200_0(api_v1_user_sign_up):
    """
        Test the endpoint for user signup with a HTTP 200 response.

        Parameters:
        - api_v1_user_sign_up: A fixture that provides the user signup API endpoint.

        Returns:
        - None

        Notes:
        - This test marks the order as 1 using the pytest.mark.order decorator.
        - It creates a copy of the api_v1_user_sign_up fixture.
        - It deletes any existing test user using the delete_test_user function.
        - It asserts that the deletion was successful.
        - It makes a POST request to the user signup endpoint with the provided headers and data.
        - It asserts that the response status code is HTTP 200 OK.
        """
    endpoint = api_v1_user_sign_up.copy()

    delete_success, _ = delete_test_user()
    assert delete_success

    response = client.post(
        endpoint['route'],
        headers=endpoint['headers'],
        data=endpoint['data']
    )
    assert response.status_code == status.HTTP_200_OK
