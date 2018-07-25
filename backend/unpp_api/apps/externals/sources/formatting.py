def process_row_item(row_item):
    if hasattr(row_item, 'strip'):
        row_item = row_item.strip()
    return row_item


def to_table_format(data_list):
    header = []
    rows = []
    for row in data_list:
        header = row.keys()
        rows.append(list(map(process_row_item, row.values())))
    return header, rows
