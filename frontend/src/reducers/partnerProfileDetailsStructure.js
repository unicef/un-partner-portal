const partnerDetailsStructure = {
  identification: {
    basic: {
      alias_name: null,
      acronym: null,
      legal_name: null,
      country_code: null,
      display_type: null,
    },
    registration_hq: {
      created: null,
      country_code: null,
      start_cooperate_date: null,
      have_gov_doc: null,
      register_country: null,
      registration_number: null,
      registration_doc: null,
    },
    registration_country: {
      created: null,
      country_code: null,
      start_cooperate_date: null,
      have_gov_doc: null,
      register_country: null,
      registration_number: null,
      registration_doc: null,
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
      fax: null,
      website: null,
      org_email: null,
      telephone: null,
    },
    authorised_officials: {
      directors: null,
      authorised_officers: null,
    },
    org_head: {
      first_name: null,
      last_name: null,
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
      ethic_fraud: null,
      ethic_fraud_policy: null,
    },
    experiences: null,
    populations_of_concern: {
      population_of_concern: null,
      concern_groups: null,
    },
    country_presence_hq: {
      country_presents: null,
      staff_globally: null,
    },
    security: {
      security_high_risk_locations: null,
      security_high_risk_policy: null,
      security_desc: null,
    },
  },
  fund: {
    budgets: null,
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
    },
    accreditation: {
      collaboration_evidences: null,
    },
    references: {
      collaboration_evidences: null,
    },
  },
  project_impl: {
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
    internal_controls: {
      internal_controls: null,
      experienced_staff: null,
      experienced_staff_desc: null,
      area_policies: null,
    },
    audit: {
      regular_audited: null,
      org_audits: null,
      most_recent_audit_report: null,
      link_report: null,
      major_accountability_issues_highlighted: null,
      comment: null,
      capacity_assessment: null,
      assessments: null,
      assessment_report: null,
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
      other_documents: null,
      org_logo: null,
      confirm_data_updated: null,
    },
  },
};

export default partnerDetailsStructure;
