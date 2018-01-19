const partnerDetailsStructure = {
  completion: {
    identification_is_complete: null,
    contact_is_complete: null,
    mandatemission_complete: null,
    funding_complete: null,
    collaboration_complete: null,
    proj_impl_is_complete: null,
    other_info_is_complete: null,
  },
  identification: {
    basic: {
      alias_name: null,
      acronym: null,
      legal_name: null,
      former_legal_name: null,
      country_code: null,
      display_type: null,
    },
    registration: {
      hq: null,
      created: null,
      country_code: null,
      start_cooperate_date: null,
      have_gov_doc: null,
      registration_to_operate_in_country: null,
      gov_doc: null,
      year_establishment: null,
      registration_number: null,
      registration_doc: null,
      registration_date: null,
      registration_comment: null,
    },
  },
  mailing: {
    address: {
      mailing_type: null,
      po_box: null,
      street: null,
      city: null,
      country: null,
      zip_code: null,
      mailing_fax: null,
      website: null,
      org_email: null,
      mailing_telephone: null,
    },
    authorised_officials: {
      have_board_directors: null,
      have_authorised_officers: null,
      directors: null,
      authorised_officers: null,
    },
    org_head: {
      fullname: null,
      job_title: null,
      telephone: null,
      fax: null,
      mobile: null,
      email: null,
    },
    connectivity: {
      connectivity: null,
      connectivity_excuse: null,
    },
    working_languages: {
      working_languages: null,
      working_languages_other: null,
    },
  },
  mandate_mission: {
    background: {
      background_and_rationale: null,
      mandate_and_mission: null,
    },
    governance: {
      governance_structure: null,
      governance_hq: null,
      governance_organigram: null,
    },
    ethics: {
      ethic_safeguard: null,
      ethic_safeguard_policy: null,
      ethic_safeguard_comment: null,
      ethic_fraud: null,
      ethic_fraud_policy: null,
      ethic_fraud_comment: null,
    },
    experience: {
      experiences: null,
    },
    populations_of_concern: {
      population_of_concern: null,
      concern_groups: null,
    },
    country_presence: {
      country_presence: null,
      staff_globally: null,
      staff_in_country: null,
      engagement_operate_desc: null,
      location_field_offices: null,
    },
    security: {
      security_high_risk_locations: null,
      security_high_risk_policy: null,
      security_desc: null,
    },
  },
  fund: {
    budgets: {
      budgets: null,
      hq_budgets: null,
    },
    major_donors: {
      source_core_funding: null,
      main_donors_list: null,
      major_donors: null,
    },
  },
  collaboration: {
    history: {
      collaborations_partnership: null,
      collaborations_partnership_others: null,
      partnership_collaborate_institution: null,
      partnership_collaborate_institution_desc: null,
      any_partnered_with_un: null,
    },
    accreditation: {
      accreditations: null,
      any_accreditation: null,
    },
    reference: {
      references: null,
      any_reference: null,
    },
    collaboration_evidences: null,
  },
  project_impl: {
    banking_information: {
      have_bank_account: null,
      have_separate_bank_account: null,
      explain: null,
    },
    program_management: {
      have_management_approach: null,
      management_approach_desc: null,
      have_system_monitoring: null,
      system_monitoring_desc: null,
      have_feedback_mechanism: null,
      feedback_mechanism_desc: null,
    },
    financial_controls: {
      org_acc_system: null,
      method_acc: null,
      have_system_track: null,
      financial_control_system_desc: null,
    },
    internal_control: {
      internal_controls: null,
      experienced_staff: null,
      experienced_staff_desc: null,
      area_policies: null,
    },
    audit: {
      regular_audited: null,
      regular_audited_comment: null,
      audit_reports: null,
      major_accountability_issues_highlighted: null,
      comment: null,
      regular_capacity_assessments: null,
      capacity_assessments: null,
    },
    report: {
      key_result: null,
      publish_annual_reports: null,
      last_report: null,
      report: null,
      link_report: null,
    },
  },
  other_info: {
    info: {
      info_to_share: null,
      other_doc_1: null,
      other_doc_2: null,
      other_doc_3: null,
      org_logo: null,
      confirm_data_updated: null,
    },
  },
};

export default partnerDetailsStructure;
