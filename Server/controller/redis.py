# /app/redis.py

#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Copyright (c) 2024 BNX Technologies LTDA
# This script is protected by copyright laws and cannot be reproduced, distributed,
# or used without written permission of the copyright owner.

import redis

from model.constants import ENV, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USERNAME


class Redis:

    db: int
    host: str
    port: int
    client: redis.Redis

    def __init__(self, db=0, host=REDIS_HOST, port=REDIS_PORT):

        self.db = db
        self.host = host
        self.port = port

        if ENV == 'development':
            self.client = redis.Redis(host=host,
                                      port=port,
                                      db=db)
        else:
            self.client = redis.Redis(host=host,
                                      port=port,
                                      db=db,
                                      username=REDIS_USERNAME,
                                      password=REDIS_PASSWORD)
