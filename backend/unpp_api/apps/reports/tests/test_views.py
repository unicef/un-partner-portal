import itertools

from datetime import date
from django.urls import reverse

from agency.models import Agency
from agency.roles import AgencyRole
from common.consts import CFEI_STATUSES, FLAG_TYPES, FLAG_CATEGORIES, PARTNER_TYPES
from common.factories import PartnerFactory, OpenEOIFactory, DirectEOIFactory, PartnerVerificationFactory, \
    PartnerFlagFactory
from common.tests.base import BaseAPITestCase
from partner.models import Partner
from project.models import EOI
from reports.filters import VerificationChoices
from review.models import PartnerVerification


class TestPartnerProfileReportAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED
    initial_factories = []

    def test_list(self):
        PartnerFactory.create_batch(20)
        partners = Partner.objects.all()
        list_url = reverse('reports:partner-information')
        list_response = self.client.get(list_url)
        self.assertResponseStatusIs(list_response)
        self.assertEqual(list_response.data['count'], partners.count())

        for country_code in partners.values_list('country_code').distinct():
            list_response = self.client.get(list_url + f'?country_code={country_code}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], partners.filter(country_code=country_code).count())

        for display_type in partners.values_list('display_type').distinct():
            list_response = self.client.get(list_url + f'?display_type={display_type}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], partners.filter(display_type=display_type).count())

        for registered_to_operate_in_country in (True, False):
            list_response = self.client.get(list_url + f'?registered={registered_to_operate_in_country}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], partners.filter(
                profile__registered_to_operate_in_country=registered_to_operate_in_country
            ).count())

        for agency in Agency.objects.all():
            list_response = self.client.get(list_url + f'?collabs={agency.id}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], partners.filter(
                collaborations_partnership__agency=agency
            ).count())

        spec_options = set(map(
            frozenset, itertools.permutations(partners.values_list('experiences__specialization__id', flat=True), 2)
        ))

        for ids in spec_options:
            list_response = self.client.get(list_url + f'?specializations={",".join(map(str, ids))}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], partners.filter(
                experiences__specialization__in=ids
            ).distinct().count())

        for has_experience in (True, False, None):
            list_response = self.client.get(list_url + f'?has_experience={str(has_experience)}')
            self.assertResponseStatusIs(list_response)

            partners = Partner.objects.all()
            if has_experience:
                partners = partners.exclude(collaborations_partnership=None)
            elif has_experience is False:
                partners = partners.filter(collaborations_partnership=None)

            self.assertEqual(list_response.data['count'], partners.count())

        for org_types in itertools.permutations(PARTNER_TYPES._db_values, 2):
            list_response = self.client.get(list_url + f'?display_types={",".join(org_types)}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(
                list_response.data['count'], partners.filter(display_type__in=org_types).count()
            )


class TestProjectReportAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED
    initial_factories = []

    def test_list(self):
        PartnerFactory.create_batch(50)
        OpenEOIFactory.create_batch(20, is_published=True, agency=self.user.agency)
        DirectEOIFactory.create_batch(20, is_published=True, agency=self.user.agency)

        projects = EOI.objects.all()
        list_url = reverse('reports:projects')
        list_response = self.client.get(list_url)
        self.assertResponseStatusIs(list_response)
        self.assertEqual(list_response.data['count'], projects.count())

        for country_code in set(projects.values_list('locations__admin_level_1__country_code', flat=True)):
            list_response = self.client.get(list_url + f'?country_code={country_code}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], projects.filter(
                locations__admin_level_1__country_code=country_code
            ).count())

        for location in set(projects.values_list('locations__admin_level_1', flat=True)):
            list_response = self.client.get(list_url + f'?locations={location}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], projects.filter(
                locations__admin_level_1=location
            ).count())

        for agency in set(projects.values_list('agency', flat=True)):
            list_response = self.client.get(list_url + f'?agency={agency}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], projects.filter(agency=agency).count())

        for display_type in set(projects.values_list('display_type', flat=True)):
            list_response = self.client.get(list_url + f'?display_type={display_type}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], projects.filter(display_type=display_type).count())

        list_response = self.client.get(list_url + f'?status={CFEI_STATUSES.open}')
        self.assertResponseStatusIs(list_response)
        self.assertEqual(list_response.data['count'], 40)

        spec_options = set(map(
            frozenset, itertools.permutations(projects.values_list('specializations__id', flat=True), 2)
        ))

        for ids in spec_options:
            list_response = self.client.get(list_url + f'?specializations={",".join(map(str, ids))}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], projects.filter(
                specializations__in=ids
            ).distinct().count())

        list_response = self.client.get(list_url + f'?posted_year={date.today().year}')
        self.assertResponseStatusIs(list_response)
        self.assertEqual(list_response.data['count'], 40)


class TestVerificationsAndObservationsReportAPIView(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED
    initial_factories = []

    def test_list(self):
        PartnerFactory.create_batch(40)
        partners = Partner.objects.all()
        list_url = reverse('reports:verifications-observations')
        list_response = self.client.get(list_url)
        self.assertResponseStatusIs(list_response)
        self.assertEqual(list_response.data['count'], partners.count())

        for country_code in partners.values_list('country_code').distinct():
            list_response = self.client.get(list_url + f'?country_code={country_code}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], partners.filter(country_code=country_code).count())

        for display_type in partners.values_list('display_type').distinct():
            list_response = self.client.get(list_url + f'?display_type={display_type}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], partners.filter(display_type=display_type).count())

        list_response = self.client.get(list_url + f'?is_verified={VerificationChoices.PENDING}')
        self.assertResponseStatusIs(list_response)
        self.assertEqual(list_response.data['count'], partners.count())

        for partner in partners:
            PartnerVerificationFactory(partner=partner, is_verified=True)
        list_response = self.client.get(list_url + f'?is_verified={VerificationChoices.VERIFIED}')
        self.assertResponseStatusIs(list_response)
        self.assertEqual(list_response.data['count'], partners.count())

        PartnerVerification.objects.all().update(is_verified=False)
        list_response = self.client.get(list_url + f'?is_verified={VerificationChoices.UNVERIFIED}')
        self.assertResponseStatusIs(list_response)
        self.assertEqual(list_response.data['count'], partners.count())

        list_response = self.client.get(list_url + f'?verification_year={2010}')
        self.assertResponseStatusIs(list_response)
        self.assertEqual(list_response.data['count'], 0)

        list_response = self.client.get(list_url + f'?verification_year={date.today().year}')
        self.assertResponseStatusIs(list_response)
        self.assertEqual(list_response.data['count'], partners.count())

        for flag_type in FLAG_TYPES._db_values:
            list_response = self.client.get(list_url + f'?flag={flag_type}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], partners.filter(flags__flag_type=flag_type).count())

        PartnerFlagFactory.create_batch(60)
        for flag_category in FLAG_CATEGORIES._db_values:
            list_response = self.client.get(list_url + f'?flag_category={flag_category}')
            self.assertResponseStatusIs(list_response)
            self.assertEqual(list_response.data['count'], partners.filter(flags__category=flag_category).count())


class TestBasicExportAPIViews(BaseAPITestCase):

    user_type = BaseAPITestCase.USER_AGENCY
    agency_role = AgencyRole.EDITOR_ADVANCED
    initial_factories = []

    def test_profile_report(self):
        PartnerFactory.create_batch(40)
        url = reverse('reports:partner-profile-export-xlsx')
        response = self.client.get(url)
        self.assertResponseStatusIs(response)
        self.assertEqual(response['Content-Type'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    def test_contact_report(self):
        PartnerFactory.create_batch(40)
        url = reverse('reports:partner-contact-export-xlsx')
        response = self.client.get(url)
        self.assertResponseStatusIs(response)
        self.assertEqual(response['Content-Type'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    def test_mapping_report(self):
        PartnerFactory.create_batch(40)
        url = reverse('reports:partner-mapping-export-xlsx')
        response = self.client.get(url)
        self.assertResponseStatusIs(response)
        self.assertEqual(response['Content-Type'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    def test_project_report(self):
        OpenEOIFactory.create_batch(20)
        DirectEOIFactory.create_batch(20)
        url = reverse('reports:projects-details-export-xlsx')
        response = self.client.get(url)
        self.assertResponseStatusIs(response)
        self.assertEqual(response['Content-Type'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')

    def test_verifications_observations_report(self):
        PartnerFactory.create_batch(40)
        PartnerVerificationFactory.create_batch(40)
        PartnerFlagFactory.create_batch(80)
        url = reverse('reports:verifications-observations-export-xlsx')
        response = self.client.get(url)
        self.assertResponseStatusIs(response)
        self.assertEqual(response['Content-Type'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
