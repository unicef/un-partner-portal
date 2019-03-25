import os
import tempfile

from mapbox import Static
from mapbox.errors import ValidationError
from rest_framework import status

from common.models import Point

mapbox_service = Static(access_token=os.getenv('MAP_BOX_KEY'))
DEFAULT_ZOOM_LEVEL = 5


def render_point_to_image_file(point: Point, **kwargs):
    file_path = os.path.join(
        tempfile.gettempdir(), f'RENDERED_MAP_FOR_POINT-{point.pk}-{point.lon}-{point.lat}.png'
    )

    if os.path.isfile(file_path):
        return file_path

    point_data = {
        'type': 'Feature',
        'properties': {
            'name': point.admin_level_1.name
        },
        'geometry': {
            'type': 'Point',
            'coordinates': [
                float(point.lon),
                float(point.lat),
            ]
        }
    }

    kwargs.setdefault('z', DEFAULT_ZOOM_LEVEL)
    kwargs.setdefault('lat', float(point.lat))
    kwargs.setdefault('lon', float(point.lon))

    try:
        response = mapbox_service.image(
            'mapbox.streets',
            features=[point_data],
            **kwargs
        )
    except ValidationError:
        return None

    if not response.status_code == status.HTTP_200_OK:
        return None

    with open(file_path, 'wb') as output:
        output.write(response.content)

    return file_path
