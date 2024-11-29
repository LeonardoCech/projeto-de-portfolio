
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


def test_api_v1_get_news_200_0(api_v1_news):
    """
    Test the GET /user/{email} endpoint with a valid request and expect a 400 OK response.

    :param api_v1_news: The fixture for the API client and the necessary data for the request.
    :return: None
    """
    endpoint = api_v1_news.copy()

    response = client.get(
        endpoint['route'],
        headers=endpoint['headers']['get']
    )
    assert response.status_code == status.HTTP_200_OK

# def test_api_v1_get_news_400_0(api_v1_news):
#     """
#     Test the GET /user/{email} endpoint with a valid request and expect a 400 OK response.

#     :param api_v1_news: The fixture for the API client and the necessary data for the request.
#     :return: None
#     """
#     endpoint = api_v1_news.copy()

#     response = client.get(
#         endpoint['route'],
#         headers=endpoint['headers']['get']
#     )
#     assert response.status_code == status.HTTP_400_ERROR

# def test_api_v1_get_news_500_0(api_v1_news):
#     """
#     Test the GET /user/{email} endpoint with a valid request and expect a 400 OK response.

#     :param api_v1_news: The fixture for the API client and the necessary data for the request.
#     :return: None
#     """
#     endpoint = api_v1_news.copy()

#     response = client.get(
#         endpoint['route'],
#         headers=endpoint['headers']['get']
#     )
#     assert response.status_code == status.HTTP_500_ERROR