---
description: >-
  Deployment process requires various environment variables to be configured for
  different services
---

# Environment

### Backend

| Variable Name | Description |
| :--- | :--- |
| ENV | either `dev` for local development, to enable various debugging features, or `production / staging` |
| SECRET\_KEY | Django's secret key - [more information](https://docs.djangoproject.com/en/1.11/ref/settings/#secret-key) |
| POSTGRES\_DB | name of postgres database to connect to |
| POSTGRES\_USER | username to use for database connection |
| POSTGRES\_PASSWORD | password to use for database connection |
| POSTGRES\_HOST | database hostname |
| POSTGRES\_SSL\_MODE | optionally set to `on`, to require SSL mode |
| DJANGO\_ALLOWED\_HOST | hostname application will be served on - [more information](https://docs.djangoproject.com/en/1.11/ref/settings/#allowed-hosts) |
| EMAIL\_HOST | SMTP server address |
| EMAIL\_PORT | SMTP server port |
| EMAIL\_HOST\_USER | SMTP user |
| EMAIL\_HOST\_PASSWORD | SMTP user password |
| EMAIL\_USE\_TLS | optionally set to `true`, to require TSL |
| UNHCR\_API\_HOST | hostname of UNHCR API for ERP integration |
| UNHCR\_API\_USERNAME | _self-explanatory_ |
| UNHCR\_API\_PASSWORD | _self-explanatory_ |
| UNICEF\_PARTNER\_DETAILS\_URL | UNICEF partner details service URL |
| UNICEF\_API\_USERNAME | _self-explanatory_ |
| UNICEF\_API\_PASSWORD | _self-explanatory_ |
| WFP\_API\_HOST | hostname of WFP API for ERP integration |
| WFP\_API\_TOKEN | _self-explanatory_ |
| UNPP\_FRONTEND\_HOST | hostname of where the frontend is located |
| ALERTS\_EMAIL | \(_optional_\) email where Django error reports will be sent |
| MAP\_BOX\_KEY | [Mapbox](https://www.mapbox.com/) API key |

### Frontend

| Variable Name | Description |
| :--- | :--- |
| MAP\_BOX\_KEY | [Mapbox](https://www.mapbox.com/) API key |

### Proxy

| Variable Name | Description |
| :--- | :--- |
| DJANGO\_APPLICATION\_SERVICE\_HOST | service / host where backend is located |
| FRONTEND\_SERVICE\_HOST | service / host where frontend is located |



