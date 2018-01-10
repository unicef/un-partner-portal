from django.contrib.auth import get_user_model
from django.test import TestCase

from agency.filters import AgencyUserFilter
from agency.models import AgencyOffice, Agency, AgencyMember


class AgencyUserFilterTestCase(TestCase):

    def test(self):
        user = get_user_model()(
            fullname='james'
        )
        user.save()

        agency = Agency(name='ABC')
        agency.save()

        office = AgencyOffice(
            name='office',
            agency=agency
        )
        office.save()

        member = AgencyMember(
            user=user,
            office=office
        )
        member.save()

        f = AgencyUserFilter(
            {'name': '123'},
            get_user_model().objects.all()
        )
        self.assertEqual(f.qs.count(), 0)

        f = AgencyUserFilter(
            {'name': 'Jame'},
            get_user_model().objects.all()
        )
        self.assertEqual(f.qs.count(), 1)

        f = AgencyUserFilter(
            {'office_name': '123'},
            get_user_model().objects.all()
        )
        self.assertEqual(f.qs.count(), 0)

        f = AgencyUserFilter(
            {'office_name': 'OFF'},
            get_user_model().objects.all()
        )
        self.assertEqual(f.qs.count(), 1)
