from __future__ import unicode_literals

from model_utils import Choices


SATISFACTION_SCALES = Choices(
    ('Not', 'not', 'not satisfactory'),
    ('Sat', 'satisfactory', 'satisfactory'),
    ('Hig', 'highly', 'Highly satisfactory'),
)

PARTNER_REVIEW_TYPES = Choices(
    # TODO GET ALL!!! right now not specified !!!
    ('EX1', 'example1', 'Example 1'),
    ('EX2', 'example2', 'Example 2'),
    ('EX3', 'example3', 'Example 3'),
)

PARTNER_TYPES = Choices(
    ('CBO', 'cbo', 'Community Based Organization (CBO)'),
    ('NGO', 'national', 'National NGO'),
    ('Int', 'international', 'International NGO (INGO)'),
    ('Aca', 'academic', 'Academic Institution'),
    ('RCC', 'red_cross', 'Red Cross/Red Crescent Movement'),
)

CFEI_TYPES = Choices(
    ('Ope', 'open', 'Open Selection'),
    ('Dir', 'direct', 'Direct Selection / Retention'),
)

APPLICATION_STATUSES = Choices(
    ('Pen', 'pending', 'Pending'),
    ('Pre', 'preselected', 'Preselected'),
    ('Rej', 'rejected', 'Rejected'),
)

CFEI_STATUSES = Choices(
    ('Dra', 'draft', 'Draft'),
    ('Sen', 'sent', 'Sent'),
    ('Ope', 'open', 'Published'),
    ('Clo', 'closed', 'Closed/Under Review'),
    ('Com', 'completed', 'Finalized'),
)

COLLABORATION_EVIDENCE_MODES = Choices(
    ('Acc', 'accreditation', 'Accreditation'),
    ('Ref', 'reference', 'Reference'),
)

METHOD_ACC_ADOPTED_CHOICES = Choices(
    ('Cas', 'cash', 'Cash'),
    ('Acc', 'accrual', 'Accrual'),
)

FINANCIAL_CONTROL_SYSTEM_CHOICES = Choices(
    ('Com', 'computerized', 'Computerized accounting system'),
    ('Pap', 'paper', 'Paper-based accounting system'),
    ('NoS', 'no_system', 'No accounting system'),
)

FUNCTIONAL_RESPONSIBILITY_CHOICES = Choices(
    ('Pro', 'procurement', 'Procurement'),
    ('AET', 'authorization', 'Authorization to execute a transaction'),
    ('RoT', 'recording', 'Recording of a transaction'),
    ('Pay', 'payment', 'Payment approvals'),
    ('CoA', 'custody', 'Custody of assets involved in a transaction'),
    ('Ban', 'bank', 'Bank reconciliation'),
)

PARTNER_DONORS_CHOICES = Choices(
    ('Ind', 'Individuals', 'Individuals'),
    ('TaF', 'trusts', 'Trusts and foundations'),
    ('Pri', 'private', 'Private companies and corporations'),
    ('Gov', 'gov', 'Government'),
    ('UNA', 'united_agency', 'United Nations Agency'),
    ('Bil', 'bilateral', 'Bilateral Agency/Multilateral/Development Banks'),
    ('NGO', 'non_gov', 'International Non Governmental Organizations'),
    ('Oth', 'other', 'Other'),
)

WORKING_LANGUAGES_CHOICES = Choices(
    ('Ara', 'arabic', 'Arabic'),
    ('Chi', 'chinese', 'Chinese'),
    ('Eng', 'english', 'English'),
    ('Fre', 'french', 'French'),
    ('Rus', 'russian', 'Russian'),
    ('Spa', 'spanish', 'Spanish'),
    ('Oth', 'other', 'Other'),
)

AUDIT_TYPES = Choices(
    ('Int', 'internal', 'Internal audit'),
    ('Fin', 'financial', 'Financial statement audit'),
    ('Don', 'donor', 'Donor audit'),
)

FORMAL_CAPACITY_ASSESSMENT = Choices(
    ('HAC', 'hact', 'HACT micro-assessment'),
    ('OCH', 'ocha', 'OCHA CBPF (Country-Based Pooled Fund) capacity assessment'),
    ('UNH', 'unhcr', 'UNHCR procurement pre-qualification assessment'),
    ('DFI', 'dfid', 'DFID pre-grant due diligence assessment'),
    ('EUE', 'eu_echo', 'EU/ECHO Framework Partnership Agreement (FPA) assessment'),
    ('Oth', 'other', 'Other formal capacity assessment'),
)

MAILING_TYPES = Choices(
    ('Str', 'street', 'Street Address'),
    ('POB', 'box', 'PO Box'),
)

YEARS_OF_EXP_CHOICES = Choices(
    ('YE1', 'less_1', 'Less than 1 year'),
    ('YE2', 'years15', '1-5 years'),
    ('YE3', 'years510', '5-10 years'),
    ('YE4', 'more_10', '10+ years'),
)

CONCERN_CHOICES = Choices(
    ('Ref', 'refugees', 'Refugees'),
    ('Asy', 'asylum seekers', 'Asylum seekers'),
    ('IDP', 'internally_displaced', 'Internally displaced persons'),
    ('Sta', 'stateless', 'Stateless'),
    ('Ret', 'returning', 'Returning'),
    ('Hos', 'host', 'Host Country'),
)

STAFF_GLOBALLY_CHOICES = Choices(
    ('SG1', 'to50', '1 to 10'),
    ('SG2', 'to100', '11 to 25'),
    ('SG3', 'to200', '26 to 50'),
    ('SG4', 'to500', '51 to 100'),
    ('SG5', 'to1000', '101 to 250'),
    ('SG6', 'to5000', '251 to 500'),
    ('SG7', 'more5000', 'more than 500'),
)

POLICY_AREA_CHOICES = Choices(
    ('Hum', 'human', 'Human Resources'),
    ('Pro', 'procurement', 'Procurement'),
    ('Ass', 'asset', 'Asset and Inventory Management'),
)

ORG_AUDIT_CHOICES = Choices(
    ('Int', 'internal', 'Internal audit'),
    ('Fin', 'financial', 'Financial statement audit'),
    ('Don', 'donor', 'Donor audit'),
)

AUDIT_ASSESSMENT_CHOICES = Choices(
    ('HAC', 'micro', 'HACT micro-assessment'),
    ('OCH', 'ocha', 'OCHA CBPF (Country-Based Pooled Fund) capacity assessment'),
    ('UNH', 'unhcr', 'UNHCR procurement pre-qualification assessment '),
    ('DFI', 'dfid', 'DFID pre-grant due diligence assessment'),
    ('EUE', 'euecho', 'EU/ECHO Framework Partnership Agreement (FPA) assessment'),
    ('Oth', 'other', 'Other formal capacity assessment'),
)

SELECTION_CRITERIA_CHOICES = Choices(
    ('SEE', 'sector', 'Sector expertise and experience'),
    ('Pro', 'project_management', 'Project management'),
    ('LEP', 'local', 'Local experience and presence'),
    ('Con', 'contribution', 'Contribution of resource'),
    ('Cos', 'cost', 'Cost effectiveness'),
    ('Exp', 'experience', 'Experience working with UN'),
    ('Rel', 'relevance', 'Relevance of proposal to achieving expected results'),
    ('Cla', 'clarity', 'Clarity of activities and expected results'),
    ('Inn', 'innovative', 'Innovative approach'),
    ('Sus', 'sustainability', 'Sustainability of intervention'),
    ('Rea', 'realistic', 'Realistic timelines and plans'),
    ('ASC', 'access', 'Access/security considerations'),
    ('Oth', 'other', 'Other'),
)

JUSTIFICATION_FOR_DIRECT_SELECTION = Choices(
    ('Kno', 'known', 'Known expertise'),
    ('Loc', 'local', 'Local presence'),
    ('Inn', 'innovative', 'Innovative approach'),
    ('TCC', 'time', 'Time constraints/criticality of response'),
    ('Imp', 'importance', 'Importance of strengthening national civil society engagement'),
    ('Ret', 'retention', 'Partner retention'),
    ('Oth', 'other', 'Other'),
)

ACCEPTED_DECLINED = Choices(
    ('Acc', 'accepted', 'Accepted'),
    ('Dec', 'declined', 'Declined'),
)

DIRECT_SELECTION_SOURCE = Choices(
    ('UCN', 'ucn', 'Unsolicited Concept Note'),
    ('UNI', 'un', 'UN-Initiated'),
)

COMMON_COMPLETED_REASON = Choices(
    ('cancelled', 'Finalized - Cancelled'),
)

COMPLETED_REASON = Choices(
    ('partners', 'Finalized - Partner accepted'),
    ('no_candidate', 'Finalized - No successful applicant'),
) + COMMON_COMPLETED_REASON

UNHCR_EXCLUSIVE_DSR_COMPLETION_OPTIONS = Choices(
    ('accepted_retention', 'Finalized - Partner accepted retention. Maintain decision for:'),
)

OTHER_AGENCIES_DSR_COMPLETION_OPTIONS = Choices(
    ('accepted', 'Finalized - Partner accepted direct selection'),
)

ALL_COMPLETED_REASONS = (
    COMPLETED_REASON + UNHCR_EXCLUSIVE_DSR_COMPLETION_OPTIONS + OTHER_AGENCIES_DSR_COMPLETION_OPTIONS
)

ALL_DSR_COMPLETED_REASONS = (
    UNHCR_EXCLUSIVE_DSR_COMPLETION_OPTIONS + OTHER_AGENCIES_DSR_COMPLETION_OPTIONS + COMMON_COMPLETED_REASON
)

UNHCR_DSR_COMPLETED_REASONS = UNHCR_EXCLUSIVE_DSR_COMPLETION_OPTIONS + COMMON_COMPLETED_REASON

OTHER_AGENCIES_DSR_COMPLETED_REASONS = OTHER_AGENCIES_DSR_COMPLETION_OPTIONS + COMMON_COMPLETED_REASON

BUDGET_CHOICES = Choices(
    ('B01', 'less', "Less than $500,000"),
    ('B02', '_2', "$500,001 to $2,000,000"),
    ('B03', '_10', "$2,000,001 to $10,000,000"),
    ('B04', '_100', "$10,000,001 to $100,000,000"),
    ('B05', '_1m', "$100,000,001 to $1,000,000,000"),
    ('B06', 'more', "More than $1,000,000,000"),
)

FLAG_TYPES = Choices(
    ('FL1_Obs', 'observation', 'Observation'),
    ('FL2_Yel', 'yellow', 'Yellow Flag'),
    ('FL3_Esc', 'escalated', 'Escalated Flag'),
    ('FL4_Red', 'red', 'Red Flag'),
)

USER_CREATED_FLAG_CATEGORIES = Choices(
    ('C01_reputational_ethical', 'Reputational / Ethical'),
    ('C02_financial', 'Financial'),
    ('C03_operational', 'Operational'),
    ('C04_compliance', 'Compliance'),
    ('C05_sex_abuse', 'Sexual exploitation and abuse'),
    ('C06_safeguarding_violation', 'Safeguarding violation'),
    ('C99_other', 'Other'),  # So it's sorted as last
)

INTERNAL_FLAG_CATEGORIES = Choices(
    ('sanctions_match', 'Sanctions List Match'),
)

FLAG_CATEGORIES = USER_CREATED_FLAG_CATEGORIES + INTERNAL_FLAG_CATEGORIES

SANCTION_LIST_TYPES = Choices(
    ('Ent', 'entity', 'Sanctioned Entity'),
    ('Ind', 'individual', 'Sanctioned Individual'),
)

SANCTION_MATCH_TYPES = Choices(
    ('Usr', 'user', 'User Match'),
    ('Brd', 'board', 'Board Match'),
    ('Org', 'organization', 'Organization Name Match'),
)

EXTENDED_APPLICATION_STATUSES = Choices(
    ('Dra', 'draft', 'Draft'),
    ('Rev', 'review', 'Application Under Review'),
    ('Uns', 'unsuccessful', 'Application Unsuccessful'),
    ('Suc', 'successful', 'Application Successful'),
    ('Acc', 'accepted', 'Selection Accepted'),
    ('Dec', 'declined', 'Selection Declined'),
    ('Ret', 'retracted', 'Selection Retracted'),
)

DSR_FINALIZE_RETENTION_CHOICES = Choices(
    ('R_1YR', 'one year'),
    ('R_2YR', 'second year'),
    ('R_3YR', 'a third year'),
    ('R_4YR', 'a fourth year'),
)

NOTIFICATION_FREQUENCY_CHOICES = Choices(
    ('', 'disabled', 'Disabled'),
    ('daily', 'daily', 'Daily'),
    ('weekly', 'weekly', 'Weekly'),
    ('biweekly', 'biweekly', 'Every Two Weeks'),
)
