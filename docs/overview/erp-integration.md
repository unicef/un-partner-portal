# ERP Integration



## **Overview**

This feature allows for CSOs to view data on cash disbursed to their organization \(with varying level of disaggregation\) by the participating agencies for a period of up to 5 years. Additionally, it allows for UN agencies enter the CSOs vendor number and partner IDs.

Only CSOs who have partnered with at least one of the participating agencies will have cash disbursement information displayed.

## **UN View**

* To access the cash disbursement information users must click on partner in the left navigation bar. Once a partner is selected from the list, there will be an additional tab labelled ‘cash transfers’
* For cash disbursement information to be displayed and viewable to both the UN and CSOs, UN users must first enter the vendor number for the CSO. UNHCR users will have to additionally add the partner ID.
* Each agency user will be limited to adding and/or deleting vendor numbers for their own organization
* Users are limited to adding one vendor number per organization per location. This means an NGO will only have one vendor number, an INGO will have one vendor number per country office.
* When an agency user enters a vendor number and selects submit, the system should require the user to confirm or cancel the number entered.
* Agency users are limited to entering vendor numbers for their location. This means that UNPP will push \(1\) the vendor number and \(2\) country to the ERP system to return a result. Therefore, if the CSO is in Singapore, and a user enters a vendor number for a CSO in Thailand, the system should return an error to the user.
* If there is a match between the vendor number and location \(country\), the system will display the financial disbursement information to that CSO.
* The information displayed for UNICEF, WFP and UNHCR will be as follows:
* **UNICEF:**
  * Total cash transferred to the CSO every year for the past five years, with current year at the top. UNPP will use a base year of 2015.
  * For INGO HQs, a list of all country profiles enabled in UNPP and total funds disbursed by country for the past five years, with current year at the top. UNPP will use a base year of 2015.
* **WFP:**
  * Total cash transferred to the CSO every year for the past five years, with current year at the top. UNPP will use a base year of 2015.
  * For INGO HQs, a list of all country profiles enabled in UNPP and total funds disbursed by country for the past five years, with current year at the top. UNPP will use a base year of 2015.
* **UNHCR:**
  * Cash disbursed to the CSO for the past five years with current year at the top. UNPP will use a base year of 2015
  * Cash information disaggregated by CFEI ID \(if in UNHCR’s ERP system\), project name, project budget, installments made, agreements audited, qualified agreements.
  * For INGO HQs, a list of all country profiles enabled in UNPP and cash information disaggregated by CFEI ID \(if in UNHCR’s ERP system\) project name, project budget, installments made, agreements audited, qualified agreements.
  * If the CSO was migrated from UNHCR PP, a link/button that opens in a new page that directs the user to the UNHCR PP
* An agency user can delete the vendor number and enter a new vendor number for their agency.

#### Who has permissions:

* All agency users can view cash disbursement information to the CSO irrespective of agency and country
* For UNICEF & WFP; basic editor, advanced editor and HQ editor can add/delete vendor numbers
* For UNHCR: HQ editor can add vendor numbers

## CSO View

* The dashboard for CSOs as in the MVP is presently full and it would not be possible to insert the financial data without taking away item\(s\) from the dashboard. As all the items on the dashboard are presently agreed to in the BRD, it is suggested that a new navigation be built for the financial data. This is reflected in the image below

![C:\Users\nlivan\AppData\Local\Microsoft\Windows\INetCache\Content.Word\ERP.PNG](https://lh4.googleusercontent.com/KeXVXeI6uuMw3noZrJWGekJr4tqFZ5IYyJCK0s20cIp94BoIrdiTrza-AjroYzbvEQ4WXt_lCV5L9t8QrqTj2qosCfoZsuBRjQ5Xysw2KA2AzET1wBYZ7duQLgu81xwO5QLta6yuI6eenXe0Zg)

* CSOs who navigate to this page will view the following information if they have received funding from the UN for partnership activities:
* **UNICEF**:
  * Total cash transferred to the CSO every year for the past five years, with current year at the top. UNPP will use a base year of 2015.
  * For INGO HQs, a list of all country profiles enabled in UNPP and total funds disbursed by country for the past five years, with current year at the top. UNPP will use a base year of 2015.
* **WFP**:
  * Total cash transferred to the CSO every year for the past five years, with current year at the top. UNPP will use a base year of 2015.
  * For INGO HQs, a list of all country profiles enabled in UNPP and total funds disbursed by country for the past five years, with current year at the top. UNPP will use a base year of 2015.
* **UNHCR:**
  * Cash disbursed to the CSO for the past five years with current year at the top. UNPP will use a base year of 2015
  * Cash information disaggregated by CFEI ID \(if in UNHCR’s ERP system\) project name, project budget, installments made, agreements audited, qualified agreements.
  * For INGO HQs, a list of all country profiles enabled in UNPP and cash information disaggregated by CFEI ID \(if in UNHCR’s ERP system\) project name, project budget, installments made, agreements audited, qualified agreements.
  * If the CSO was migrated from UNHCR PP, a link/button that opens in a new page that directs the user to the UNHCR PP
* CSO users only have view permissions on this data

#### Who has permissions:

* All CSO users
* For INGOs, HQ users can view for all countries, INGO COs can only view for their own country

