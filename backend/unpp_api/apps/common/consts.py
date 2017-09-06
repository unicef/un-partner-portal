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
    ('CBO', 'cbo', 'Community Based Organization (CBO) '),
    ('NGO', 'national', 'National NGO'),
    ('Int', 'international', 'International NGO (INGO)'),
    ('Aca', 'academic', 'Academic Institution'),
    ('RCC', 'red_cross', 'Red Cross/Red Crescent Movement'),
)

EOI_TYPES = Choices(
    ('Ope', 'open', 'Open'),
    ('Dir', 'direct', 'Direct'),
)

APPLICATION_STATUSES = Choices(
    ('Pen', 'pending', 'Pending'),
    ('Pre', 'preselected', 'Preselected'),
    ('Rej', 'rejected', 'Rejected'),
)

SCALE_TYPES = Choices(
    ('Low', 'low', '1-3'),
    ('Std', 'standard', '1-10'),
    ('Hig', 'high', '1-100'),
)

MEMBER_ROLES = Choices(
    ('Adm', 'admin', 'Administrator'),
    ('Edi', 'editor', 'Editor'),
    ('Rea', 'reader', 'Reader'),
)

POWER_MEMBER_ROLES = {
    MEMBER_ROLES.admin: 0,
    MEMBER_ROLES.editor: -1,
    MEMBER_ROLES.reader: -2,
}

MEMBER_STATUSES = Choices(
    ('Act', 'active', 'Active'),
    ('Dea', 'deactivated', 'Deactivated'),
    ('Inv', 'invited', 'Invited'),
)

EOI_STATUSES = Choices(
    ('Ope', 'open', 'Open'),
    ('Clo', 'closed', 'Closed/Under Review'),
    ('Com', 'completed', 'Completed'),
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
    ('Bil', 'bilateral', 'Bilateral Agency/Multilateral Agency/Development Banks'),
    ('NGO', 'non_gov', 'International Non Governmental Organizations'),
    ('Oth', 'other', 'Other'),
)

WORKING_LAGNUAGES_CHOICES = Choices(
    ('Ara', 'arabic', 'Arabic'),
    ('Chi', 'chinese', 'Chinese'),
    ('Eng', 'english', 'English'),
    ('Fre', 'french', 'French'),
    ('Rus', 'russian', 'Russian'),
    ('Spa', 'spanish', 'Spanish'),
    ('Oth', 'other', 'Other'),
)

CONCERN_GROUP_CHOICES = Choices(
    ('Ref', 'Refugees', 'Refugees'),
    ('Ast', 'Asylum', 'Asylum seekers '),
    ('Int', 'internally', 'Internally displaced persons'),
    ('Sta', 'stateless', 'Stateless'),
    ('Ret', 'returning', 'Returning'),
    ('Hos', 'host_country', 'Host Country'),
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
    ('Oth', 'other', 'Other'),
)

ACCEPTED_DECLINED = Choices(
    ('Acc', 'accepted', 'Accepted'),
    ('Dec', 'declined', 'Declined'),
)

DIRECT_SELECTION_SOURCE = Choices(
    ('CSO', 'cso', 'CSO-Initiated'),
    ('UNI', 'un', 'UN-Initiated'),
)
