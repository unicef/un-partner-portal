# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AgencyAgency(models.Model):
    name = models.CharField(max_length=510)

    class Meta:
        managed = False
        db_table = 'agency_agency'


class AgencyAgencymember(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    office_id = models.IntegerField()
    user_id = models.IntegerField()
    telephone = models.CharField(max_length=510, blank=True, null=True)
    role = models.TextField()

    class Meta:
        managed = False
        db_table = 'agency_agencymember'


class AgencyAgencyoffice(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    agency_id = models.IntegerField()
    country = models.CharField(max_length=4)

    class Meta:
        managed = False
        db_table = 'agency_agencyoffice'


class AgencyAgencyprofile(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    eoi_template = models.CharField(max_length=200)
    agency_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'agency_agencyprofile'


class AgencyOtheragency(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    name = models.CharField(max_length=510)

    class Meta:
        managed = False
        db_table = 'agency_otheragency'


class PartnerPartner(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    legal_name = models.CharField(max_length=510)
    display_type = models.CharField(max_length=6)
    country_code = models.CharField(max_length=4)
    is_active = models.BooleanField()
    hq_id = models.IntegerField(blank=True, null=True)
    country_presence = models.TextField(blank=True, null=True)
    staff_globally = models.CharField(max_length=6, blank=True, null=True)
    engagement_operate_desc = models.TextField(blank=True, null=True)
    staff_in_country = models.CharField(max_length=6, blank=True, null=True)
    location_of_office_id = models.IntegerField(blank=True, null=True)
    more_office_in_country = models.NullBooleanField()
    is_locked = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'partner_partner'


class PartnerPartnerLocationFieldOffices(models.Model):
    partner_id = models.IntegerField()
    point_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'partner_partner_location_field_offices'


class PartnerPartnerauditassessment(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    regular_audited = models.NullBooleanField()
    major_accountability_issues_highlighted = models.NullBooleanField()
    comment = models.TextField(blank=True, null=True)
    partner_id = models.IntegerField()
    regular_audited_comment = models.TextField(blank=True, null=True)
    regular_capacity_assessments = models.NullBooleanField()

    class Meta:
        managed = False
        db_table = 'partner_partnerauditassessment'


class PartnerPartnerauditreport(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    org_audit = models.CharField(max_length=6, blank=True, null=True)
    link_report = models.CharField(max_length=400, blank=True, null=True)
    partner_id = models.IntegerField()
    most_recent_audit_report_id = models.IntegerField(blank=True, null=True)
    created_by_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'partner_partnerauditreport'


class PartnerPartnerauthorisedofficer(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    job_title = models.CharField(max_length=510, blank=True, null=True)
    telephone = models.CharField(max_length=510, blank=True, null=True)
    fax = models.CharField(max_length=510, blank=True, null=True)
    email = models.CharField(max_length=510, blank=True, null=True)
    partner_id = models.IntegerField()
    created_by_id = models.IntegerField(blank=True, null=True)
    fullname = models.CharField(max_length=1024, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'partner_partnerauthorisedofficer'


class PartnerPartnerbudget(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    year = models.SmallIntegerField()
    budget = models.CharField(max_length=6, blank=True, null=True)
    partner_id = models.IntegerField()
    created_by_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'partner_partnerbudget'


class PartnerPartnercapacityassessment(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    assessment_type = models.TextField(blank=True, null=True)
    report_url = models.CharField(max_length=400, blank=True, null=True)
    created_by_id = models.IntegerField(blank=True, null=True)
    partner_id = models.IntegerField()
    report_file_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'partner_partnercapacityassessment'


class PartnerPartnercollaborationevidence(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    mode = models.CharField(max_length=6, blank=True, null=True)
    organization_name = models.CharField(max_length=400, blank=True, null=True)
    date_received = models.DateTimeField(blank=True, null=True)
    evidence_file_id = models.IntegerField(blank=True, null=True)
    created_by_id = models.IntegerField()
    partner_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'partner_partnercollaborationevidence'


class PartnerPartnercollaborationpartnership(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    description = models.CharField(max_length=5120, blank=True, null=True)
    partner_number = models.CharField(max_length=400, blank=True, null=True)
    agency_id = models.IntegerField(blank=True, null=True)
    created_by_id = models.IntegerField()
    partner_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'partner_partnercollaborationpartnership'


class PartnerPartnerdirector(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    job_title = models.CharField(max_length=510, blank=True, null=True)
    authorized = models.NullBooleanField()
    partner_id = models.IntegerField()
    created_by_id = models.IntegerField(blank=True, null=True)
    fullname = models.CharField(max_length=1024, blank=True, null=True)
    email = models.CharField(max_length=510, blank=True, null=True)
    fax = models.CharField(max_length=510, blank=True, null=True)
    telephone = models.CharField(max_length=510, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'partner_partnerdirector'


class PartnerPartnerexperience(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    years = models.CharField(max_length=6, blank=True, null=True)
    partner_id = models.IntegerField()
    specialization_id = models.IntegerField(blank=True, null=True)
    created_by_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'partner_partnerexperience'


class PartnerPartnerfunding(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    source_core_funding = models.CharField(max_length=5120)
    major_donors = models.CharField(max_length=255, blank=True, null=True)
    main_donors_list = models.CharField(max_length=5120, blank=True, null=True)
    partner_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'partner_partnerfunding'


class PartnerPartnerheadorganization(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    email = models.CharField(max_length=510, blank=True, null=True)
    job_title = models.CharField(max_length=510, blank=True, null=True)
    telephone = models.CharField(max_length=510, blank=True, null=True)
    fax = models.CharField(max_length=510, blank=True, null=True)
    mobile = models.CharField(max_length=510, blank=True, null=True)
    partner_id = models.IntegerField(blank=True, null=True)
    fullname = models.CharField(max_length=1024, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'partner_partnerheadorganization'


class PartnerPartnerinternalcontrol(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    functional_responsibility = models.CharField(max_length=6)
    segregation_duties = models.NullBooleanField()
    comment = models.TextField(blank=True, null=True)
    partner_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'partner_partnerinternalcontrol'


class PartnerPartnermailingaddress(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    mailing_type = models.CharField(max_length=6)
    street = models.CharField(max_length=400, blank=True, null=True)
    po_box = models.CharField(max_length=400, blank=True, null=True)
    city = models.CharField(max_length=400, blank=True, null=True)
    country = models.CharField(max_length=4, blank=True, null=True)
    zip_code = models.CharField(max_length=400, blank=True, null=True)
    telephone = models.CharField(max_length=510, blank=True, null=True)
    fax = models.CharField(max_length=510, blank=True, null=True)
    website = models.CharField(max_length=400, blank=True, null=True)
    org_email = models.CharField(max_length=508, blank=True, null=True)
    partner_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'partner_partnermailingaddress'


class PartnerPartnermandatemission(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    background_and_rationale = models.TextField(blank=True, null=True)
    mandate_and_mission = models.TextField(blank=True, null=True)
    governance_structure = models.TextField(blank=True, null=True)
    governance_hq = models.TextField(blank=True, null=True)
    governance_organigram_id = models.IntegerField(blank=True, null=True)
    ethic_safeguard = models.NullBooleanField()
    ethic_safeguard_policy_id = models.IntegerField(blank=True, null=True)
    ethic_fraud = models.NullBooleanField()
    ethic_fraud_policy_id = models.IntegerField(blank=True, null=True)
    population_of_concern = models.NullBooleanField()
    concern_groups = models.CharField(max_length=255, blank=True, null=True)
    security_high_risk_locations = models.NullBooleanField()
    security_high_risk_policy = models.NullBooleanField()
    security_desc = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    partner_id = models.IntegerField()
    ethic_fraud_comment = models.TextField(blank=True, null=True)
    ethic_safeguard_comment = models.TextField(blank=True, null=True)
    partnership_with_institutions = models.NullBooleanField()

    class Meta:
        managed = False
        db_table = 'partner_partnermandatemission'


class PartnerPartnermember(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    title = models.CharField(max_length=510)
    role = models.TextField()
    partner_id = models.IntegerField()
    user_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'partner_partnermember'


class PartnerPartnerotherinfo(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    info_to_share = models.TextField(blank=True, null=True)
    org_logo_id = models.IntegerField(blank=True, null=True)
    confirm_data_updated = models.NullBooleanField()
    partner_id = models.IntegerField()
    other_doc_1_id = models.IntegerField(blank=True, null=True)
    other_doc_2_id = models.IntegerField(blank=True, null=True)
    other_doc_3_id = models.IntegerField(blank=True, null=True)
    created_by_id = models.IntegerField(blank=True, null=True)
    org_logo_thumbnail = models.CharField(max_length=200, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'partner_partnerotherinfo'


class PartnerPartnerpolicyarea(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    area = models.CharField(max_length=6)
    document_policies = models.NullBooleanField()
    partner_id = models.IntegerField()
    created_by_id = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'partner_partnerpolicyarea'


class PartnerPartnerprofile(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    alias_name = models.CharField(max_length=510, blank=True, null=True)
    legal_name_change = models.NullBooleanField()
    former_legal_name = models.CharField(max_length=510, blank=True, null=True)
    working_languages = models.TextField(blank=True, null=True)
    working_languages_other = models.CharField(max_length=200, blank=True, null=True)
    registration_date = models.DateField(blank=True, null=True)
    have_gov_doc = models.NullBooleanField()
    registration_doc_id = models.IntegerField(blank=True, null=True)
    have_management_approach = models.NullBooleanField()
    management_approach_desc = models.TextField(blank=True, null=True)
    have_system_monitoring = models.NullBooleanField()
    system_monitoring_desc = models.TextField(blank=True, null=True)
    have_feedback_mechanism = models.NullBooleanField()
    org_acc_system = models.CharField(max_length=6)
    method_acc = models.CharField(max_length=6)
    have_system_track = models.NullBooleanField()
    financial_control_system_desc = models.TextField(blank=True, null=True)
    partner_id = models.IntegerField()
    connectivity = models.NullBooleanField()
    connectivity_excuse = models.CharField(max_length=5120, blank=True, null=True)
    experienced_staff = models.NullBooleanField()
    experienced_staff_desc = models.TextField(blank=True, null=True)
    feedback_mechanism_desc = models.TextField(blank=True, null=True)
    acronym = models.CharField(max_length=400, blank=True, null=True)
    partnership_collaborate_institution = models.NullBooleanField()
    partnership_collaborate_institution_desc = models.CharField(max_length=5120, blank=True, null=True)
    explain = models.TextField(blank=True, null=True)
    gov_doc_id = models.IntegerField(blank=True, null=True)
    have_bank_account = models.NullBooleanField()
    have_board_directors = models.NullBooleanField()
    have_separate_bank_account = models.NullBooleanField()
    registration_comment = models.TextField(blank=True, null=True)
    registration_number = models.CharField(max_length=510, blank=True, null=True)
    registration_to_operate_in_country = models.NullBooleanField()
    year_establishment = models.SmallIntegerField(blank=True, null=True)
    have_authorised_officers = models.NullBooleanField()
    any_accreditation = models.NullBooleanField()
    any_partnered_with_un = models.NullBooleanField()
    any_reference = models.NullBooleanField()

    class Meta:
        managed = False
        db_table = 'partner_partnerprofile'


class PartnerPartnerreporting(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    key_result = models.TextField(blank=True, null=True)
    publish_annual_reports = models.NullBooleanField()
    last_report = models.DateTimeField(blank=True, null=True)
    report_id = models.IntegerField(blank=True, null=True)
    link_report = models.CharField(max_length=400, blank=True, null=True)
    partner_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'partner_partnerreporting'


class PartnerPartnerreview(models.Model):
    created = models.DateTimeField()
    modified = models.DateTimeField()
    display_type = models.CharField(max_length=6)
    performance_pm = models.CharField(max_length=6)
    performance_financial = models.CharField(max_length=6)
    performance_com_eng = models.CharField(max_length=6)
    ethical_concerns = models.NullBooleanField()
    does_recommend = models.NullBooleanField()
    comment = models.TextField()
    agency_id = models.IntegerField()
    eoi_id = models.IntegerField()
    partner_id = models.IntegerField()
    reviewer_id = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'partner_partnerreview'


class PartnerPartnerVendorNumber(models.Model):

    created = models.DateTimeField()
    modified = models.DateTimeField()
    partner_id = models.IntegerField()
    number = models.TextField(max_length=1024)

    class Meta:
        managed = False
        db_table = 'externals_partnervendornumber'


class PartnerUser(models.Model):

    UserID = models.IntegerField(primary_key=True)
    Username = models.EmailField()
    Role = models.TextField()
    ValidFrom = models.DateTimeField()
    ProfileID = models.IntegerField()
    FirstName = models.TextField()
    LastName = models.TextField()

    class Meta:
        managed = False
        db_table = 'User'


class UNHCRUser(models.Model):

    SharePointGroupName = models.TextField()
    DisplayName = models.TextField()
    Email = models.TextField(primary_key=True)
    UNPP_Role = models.TextField()
    Country_Code = models.TextField()

    class Meta:
        managed = False
        db_table = 'UNHCR_Users'


class CommonFile(models.Model):

    created = models.DateTimeField()
    modified = models.DateTimeField()
    file_field = models.TextField()

    class Meta:
        managed = False
        db_table = 'common_commonfile'
