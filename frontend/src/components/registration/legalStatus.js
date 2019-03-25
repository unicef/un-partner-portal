import React from "react";
import { formValueSelector } from "redux-form";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Grid from "material-ui/Grid";
import YearFieldForm from "../forms/yearFieldForm";
import TextFieldForm from "../forms/textFieldForm";
import RadioForm from "../forms/radioForm";
import { visibleIfYes, visibleIfNo, BOOL_VAL } from "../../helpers/formHelper";
import { PLACEHOLDERS } from "../../helpers/constants";
import FileForm from "../forms/fileForm";
import DatePickerForm from "../forms/datePickerForm";
import GridColumn from "../common/grid/gridColumn";
import GridRow from "../common/grid/gridRow";

const messages = {
  yearOfEstablishment: "Year of establishment in country of origin",
  selectYear: "Select year",
  registrationCountry:
    "Is organization registered to operate in the country of origin?",
  date: "Registration Date",
  number: "Registration number (If applicable)",
  document: "Please upload Registration Document",
  comment: "Comment",
  name: "Name of registering authority",
  expireDate: "Expiration Date",
  govDocTooltip:
    "Governing document: is a formal document with information about the structure " +
    "and governance of an organization, outlining the purposes of the organization and how it will " +
    "be run. A governing document may come in the form of a trust deed, constitution, memorandum " +
    "and articles of association, or another formal, legal document.",
  haveGovDoc: "Does the Organization have a Governing Document?",
  governingDoc: "Please upload Governing Document",
  haveRefLetter:
    "Does the organization have a letter of reference from a donor agency, government authority or community association?",
  referenceLetter: "Please upload letter of reference",
  nameOfRefferer: "Name of referring organization",
  received: "Date Received"
};

const BasicInformation = props => {
  const { isRegistered, hasGovDoc, hasRefLetter } = props;
  return (
    <GridColumn>
      <YearFieldForm
        fieldName="json.partner_profile.year_establishment"
        label={messages.yearOfEstablishment}
        placeholder={messages.selectYear}
      />

      <RadioForm
        fieldName="json.partner_profile.registered_to_operate_in_country"
        label={messages.registrationCountry}
        values={BOOL_VAL}
      />

      {visibleIfYes(isRegistered) && (
        <GridColumn>
          <FileForm
            fieldName="json.registration_document.document"
            formName="registration"
            sectionName="registration_document"
            localUpload
            label={messages.document}
          />
          <TextFieldForm
            label={messages.name}
            fieldName="json.registration_document.issuing_authority"
            placeholder={PLACEHOLDERS.provide}
          />

          <GridRow>
            <DatePickerForm
              fieldName="json.registration_document.issue_date"
              label={messages.date}
              placeholder={PLACEHOLDERS.provide}
            />

            <TextFieldForm
              label={messages.number}
              fieldName="json.registration_document.registration_number"
              optional
              placeholder={PLACEHOLDERS.provide}
            />
          </GridRow>
          <DatePickerForm
            fieldName="json.registration_document.expiry_date"
            label={messages.expireDate}
            optional
            placeholder={PLACEHOLDERS.provide}
          />
        </GridColumn>
      )}
      {visibleIfNo(isRegistered) && (
        <TextFieldForm
          label={messages.comment}
          fieldName="json.partner_profile.missing_registration_document_comment"
          textFieldProps={{
            multiline: true,
            InputProps: {
              inputProps: {
                maxLength: "500"
              }
            }
          }}
        />
      )}
      <RadioForm
        fieldName="json.partner_profile.have_governing_document"
        label={messages.haveGovDoc}
        values={BOOL_VAL}
      />
      {visibleIfYes(hasGovDoc) && (
        <FileForm
          fieldName="json.governing_document.document"
          formName="registration"
          sectionName="governing_document"
          localUpload
          label={messages.governingDoc}
          infoText={messages.govDocTooltip}
        />
      )}
      {visibleIfNo(hasGovDoc) && (
        <TextFieldForm
          label={messages.comment}
          fieldName="json.partner_profile.missing_governing_document_comment"
          textFieldProps={{
            multiline: true,
            InputProps: {
              inputProps: {
                maxLength: "500"
              }
            }
          }}
        />
      )}

      <RadioForm
        fieldName="json.partner_profile.have_ref_letter"
        label={messages.haveRefLetter}
        values={BOOL_VAL}
      />

      {visibleIfYes(hasRefLetter) && (
        <GridRow>
          <TextFieldForm
            label={messages.nameOfRefferer}
            fieldName="json.recommendation_document.organization_name"
            placeholder={PLACEHOLDERS.provide}
          />
          <DatePickerForm
            fieldName="json.recommendation_document.date_received"
            label={messages.received}
          />
          <FileForm
            fieldName="json.recommendation_document.evidence_file"
            formName="registration"
            sectionName="recommendation_document"
            localUpload
            label={messages.referenceLetter}
          />
        </GridRow>
      )}
    </GridColumn>
  );
};

BasicInformation.propTypes = {
  isRegistered: PropTypes.bool,
  hasGovDoc: PropTypes.bool,
  hasRefLetter: PropTypes.bool
};

const selector = formValueSelector("registration");
const connectedBasicInformation = connect(state => ({
  isRegistered: selector(
    state,
    "json.partner_profile.registered_to_operate_in_country"
  ),
  hasGovDoc: selector(state, "json.partner_profile.have_governing_document"),
  hasRefLetter: selector(state, "json.partner_profile.have_ref_letter")
}))(BasicInformation);

export default connectedBasicInformation;
