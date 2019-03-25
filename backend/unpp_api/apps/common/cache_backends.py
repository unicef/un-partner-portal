from django.core.cache.backends.locmem import LocMemCache


class DummyRedisCache(LocMemCache):
    """
    Basic support for custom redis backend features, so can be used as dev replacement
    """

    def delete_pattern(self, pattern):
        return self.clear()

    def keys(self, pattern=None):
        if pattern:
            return {k: v for k, v in self._cache.keys() if k.startswith(pattern[:-1])}
        return self._cache.keys()
