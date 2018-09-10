# Development Data

## Creating Test Data

Test fixtures can be created by running:

```
fab fakedata
```

This script creates various user types + CFEIs, etc

## Agency Users

For 3 different agencies usernames \(emails\) follow the format:

```text
agency-<number>-<role>@<agency>.org
```

Number is an integer from 1 to 3 range.

Role is one of:

```text
admin
editor-hq
reader
editor
editor-adv
pam
mft
```

**Not all roles are available for all agencies.**

Available agencies are:

```text
unicef
unhcr
wfp
```

## Partner Users

### Standard

Partner user usernames follow a similar structure:

```text
partner-<number>-<role>@partner.org
```

Number is an integer from **1 to 24** range.

Role is one of

```text
reader
editor
admin
```

### INGO

```text
partner-ingo-<number>-<role>@partner.org
```

Number is an integer from **1 to 6** range.

Roles are the same as standard partner.

### INGO HQs

```text
partner-ingo-hq-<number>-<role>@partner.org
```

Number is an integer from **1 to 2** range. Roles same as above.

