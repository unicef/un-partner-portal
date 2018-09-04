
class LegacyDatabaseRouter(object):

    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'legacy':
            return 'legacy'
        return None

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'legacy':
            return 'legacy'
        return None

    def allow_relation(self, obj1, obj2, **hints):
        if obj1._meta.app_label == 'legacy' and obj2._meta.app_label == 'legacy':
            return True
        elif 'legacy' not in {obj1._meta.app_label, obj2._meta.app_label}:
            return None

        return False

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label == 'legacy' or db == 'legacy':
            # Don't migrate external DB
            return False
