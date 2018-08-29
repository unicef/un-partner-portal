from model_utils import Choices


# It's basically a list of countries, with a few minor exceptions.
# We have a few business areas like Palestine and maybe Syria Cross-Border
BUSINESS_AREAS = Choices(
    ('cambodia', 'Cambodia - 0660'),
    ('china', 'China - 0860'),
    ('dprk', 'DP Republic of Korea - 5150'),
    ('eapro_thailand', 'EAPRO, Thailand - 420R'),  # Regional Office
    ('fiji', 'Fiji (Pacific Islands) - 1430'),  # Multi-Country Business Area
    ('indonesia', 'Indonesia - 2070'),
    ('laos', 'Lao People\'s Dem Rep. - 2460'),
    ('malaysia', 'Malaysia - 2700'),
    ('mongolia', 'Mongolia - 2880'),
    ('myanmar', 'Myanmar - 0600'),
    ('papua_new_guinea', 'Papua New Guinea - 6490'),
    ('philippines', 'Philippines - 3420'),
    ('thailand', 'Thailand - 4200'),
    ('timor_leste', 'Timor-Leste - 7060'),
    ('vietnam', 'Vietnam - 5200'),
    ('albania', 'Albania - 0090'),
    ('armenia', 'Armenia - 0260'),
    ('azerbaijan', 'Azerbaijan - 0310'),
    ('belarus', 'Belarus - 0630'),
    ('bosnia_and_herzegovina', 'Bosnia and Herzegovina - 0530'),
    ('bulgaria', 'Bulgaria - 0570'),
    ('ecaro_switzerland', 'ECARO, Switzerland - 575R'),  # Regional Office
    ('georgia', 'Georgia - 1600'),
    ('kazakhstan', 'Kazakhstan - 2390'),
    ('kosovo', 'Kosovo - 8971'),
    ('macedonia', 'Macedonia - 2660'),
    ('moldova', 'Moldova - 5640'),
    ('uzbekistan', 'Rep of Uzbekistan - 4630'),
    ('turkmenistan', 'Rep. of Turkmenistan - 4360'),
    ('kyrgyzstan', 'Republic of Kyrgyzstan - 2450'),
    ('romania', 'Romania - 3660'),
    ('serbia', 'Serbia - 8970'),
    ('turkey', 'Turkey - 4350'),
    ('ukraine', 'Ukraine - 4410'),
    ('angola', 'Angola - 6810'),
    ('botswana', 'Botswana - 0520'),
    ('burundi', 'Burundi - 0610'),
    ('comoros', 'Comoros - 6620'),
    ('eritrea', 'Eritrea - 1420'),
    ('esaro_kenya', 'ESARO, Kenya - 240R'),  # Regional Office
    ('ethiopia', 'Ethiopia - 1410'),
    ('kenya', 'Kenya - 2400'),
    ('lesotho', 'Lesotho - 2520'),
    ('madagascar', 'Madagascar - 2670'),
    ('namibia', 'Namibia - 6980'),
    ('mozambique', 'Republic of Mozambique - 6890'),
    ('rwanda', 'Rwanda - 3750'),
    ('somalia', 'Somalia - 3920'),
    ('south_africa', 'South Africa - 3930'),
    ('south_sudan', 'South Sudan - 4040'),
    ('swaziland', 'Swaziland - 4030'),
    ('uganda', 'Uganda - 4380'),
    ('tanzania', 'United Rep. of Tanzania - 4550'),
    ('zambia', 'Zambia - 4980'),
    ('zimbabwe', 'Zimbabwe - 6260'),
    ('argentina', 'Argentina - 0240'),
    ('barbados', 'Barbados - 0420'),  # Multi-Country Business Area
    ('belize', 'Belize - 6110'),
    ('bolivia', 'Bolivia - 0510'),
    ('brazil', 'Brazil - 0540'),
    ('chile', 'Chile - 0840'),
    ('colombia', 'Colombia - 0930'),
    ('costa_rica', 'Costa Rica - 1020'),
    ('dominican_republic', 'Dominican Republic - 1260'),
    ('ecuador', 'Ecuador - 1350'),
    ('el_salvador', 'El Salvador - 1380'),
    ('guatemala', 'Guatemala - 1680'),
    ('guyana', 'Guyana - 1800'),
    ('haiti', 'Haiti - 1830'),
    ('honduras', 'Honduras - 1860'),
    ('jamaica', 'Jamaica - 2280'),
    ('lacro_panama', 'LACRO, Panama - 333R'),  # Regional Office
    ('mexico', 'Mexico - 2850'),
    ('nicaragua', 'Nicaragua - 3120'),
    ('panama', 'Panama - 3330'),
    ('paraguay', 'Paraguay - 3360'),
    ('peru', 'Peru - 3390'),
    ('uruguay', 'Uruguay - 4620'),
    ('venezuela', 'Venezuela - 4710'),
    ('algeria', 'Algeria - 0120'),
    ('djibouti', 'Djibouti - 6690'),
    ('egypt', 'Egypt - 4500'),
    ('iran', 'Iran - 2100'),
    ('iraq', 'Iraq - 2130'),
    ('jordan', 'Jordan - 2340'),
    ('lebanon', 'Lebanon - 2490'),
    ('libya', 'Libya - 2580'),
    ('mena_jordan', 'MENA, Jordan - 234R'),  # Regional Office
    ('morocco', 'Morocco - 2910'),
    ('palestine', 'Palestine, State of - 7050'),
    ('saudi_arabia', 'Saudi Arabia - 3780'),
    ('sudan', 'Sudan - 4020'),
    ('syria', 'Syria - 4140'),
    ('yemen', 'Yemen - 4920'),
    ('afghanistan', 'Afghanistan - 0060'),
    ('bangladesh', 'Bangladesh - 5070'),
    ('bhutan', 'Bhutan - 0490'),
    ('india', 'India - 2040'),
    ('maldives', 'Maldives - 2740'),
    ('nepal', 'Nepal - 2970'),
    ('pakistan', 'Pakistan - 3300'),
    ('rosa_nepal', 'ROSA, Nepal - 297R'),  # Regional Office
    ('sri_lanka', 'Sri Lanka - 0780'),
    ('benin', 'Benin - 1170'),
    ('burkina_faso', 'Burkina Faso - 4590'),
    ('central_african_republic', 'Central African Republic - 0750'),
    ('chad', 'Chad - 0810'),
    ('congo', 'Congo - 3380'),
    ('ivory_coast', 'Cote D\'Ivoire - 2250'),
    ('congo', 'Democratic Republic of Congo - 0990'),
    ('equatorial_guinea', 'Equatorial Guinea - 1390'),
    ('gabon', 'Gabon - 1530'),
    ('gambia', 'Gambia - 1560'),
    ('ghana', 'Ghana - 1620'),
    ('guinea', 'Guinea - 1770'),
    ('guinea_bissau', 'Guinea Bissau - 6850'),
    ('liberia', 'Liberia - 2550'),
    ('mali', 'Mali - 2760'),
    ('mauritania', 'Mauritania - 2820'),
    ('niger', 'Niger - 3180'),
    ('nigeria', 'Nigeria - 3210'),
    ('cameroon', 'Republic of Cameroon - 0690'),
    ('sao_tome_principe', 'Sao Tome & Principe - 6830'),
    ('senegal', 'Senegal - 3810'),
    ('sierra_leone', 'Sierra Leone - 3900'),
    ('togo', 'Togo - 4230'),
    ('wcaro_senegal', 'WCARO, Senegal - 381R'),  # Regional Office
)


BUSINESS_AREA_TO_CODE = {
    ba: display.split()[-1] for ba, display in BUSINESS_AREAS
}
