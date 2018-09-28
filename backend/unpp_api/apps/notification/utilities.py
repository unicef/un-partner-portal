import re

url_regexp = re.compile(
    r'''[^<">]((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)[^< ,"'>]''',
    re.MULTILINE
)


def replace_urls_with_anchor_tags(text):
    output = text
    for item in re.finditer(url_regexp, text):
        result = item.group(0)
        result = result.replace(' ', '')
        output = output.replace(result, '<a href="' + result + '">' + result + '</a>')

    return output
