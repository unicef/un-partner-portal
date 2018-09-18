import sys


class AgencyWrapper:

    __name = None
    __model_instance = None

    def __init__(self, arg):
        self.__name = arg

    def __getattr__(self, name):
        return getattr(self.model_instance, name)

    @property
    def model_instance(self):
        # Under normal app workload agency models remain the same throughout,
        # this is a workaround for them being deleted in between tests
        if not self.__model_instance or 'test' in sys.argv:
            from agency.models import Agency
            self.__model_instance = Agency.objects.get_or_create(name=self.__name)[0]
        return self.__model_instance


UNICEF = AgencyWrapper('UNICEF')
WFP = AgencyWrapper('WFP')
UNHCR = AgencyWrapper('UNHCR')

AGENCIES = [
    UNICEF, WFP, UNHCR
]
