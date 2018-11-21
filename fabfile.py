from __future__ import unicode_literals
from fabric.api import local


def ssh(service):
    """
    ssh into running service container
    :param service: ['backend', 'frontend', 'proxy', 'db']
    """
    assert service in ['backend', 'frontend', 'proxy', 'db', 'legacy_db'], "%s is unrecognized service"
    local('docker-compose exec %s bash' % service)


def up_recreate():
    """
    Recreate containers even if their configuration and image haven't changed.
    """
    local('docker-compose down && docker-compose up')


def up():
    """
    Create and start containers.
    """
    local('docker-compose up')


def down():
    """
    Stop all containers.
    """
    local('docker-compose down')


def rebuild():
    """
    Re-build docker images for containers.
    """
    local('docker-compose build')


def ps():
    """
    Display all containers.
    """
    local('docker-compose ps')


def stop():
    """
    Stop services.
    """
    local('docker-compose stop')


def managepy(command=''):
    """
    Run specified manage.py command
    """
    cmd = 'docker-compose exec backend python manage.py {}'.format(command)
    local(cmd)


def preview_gunicorn_log():
    cmd = 'docker-compose exec backend tail -f /data/unpp_api/logs/gunicorn_error.log'
    local(cmd)


def fakedata(clean_before=True):
    """
    Create mock data for the django backend.
    """
    cmd = 'docker-compose exec backend python manage.py fakedata'
    if clean_before:
        cmd += ' --clean_before'
    local(cmd)


def reset_db():
    """
    Reset db, migrate and generate fixtures.
    Useful when changing branch with different migrations.
    """
    local('docker-compose exec backend python manage.py reset_db')
    local('docker-compose exec backend python manage.py migrate')
    local('docker-compose exec backend python manage.py loaddata --app common initial.json')
    local('docker-compose exec backend python manage.py loaddata --app agency initial.json')
    fakedata(clean_before=False)


def tests(test_path=''):
    """
    Run unit tests.
    """
    local('docker-compose exec backend python manage.py test {} --parallel --noinput'.format(test_path))


def remove_untagged_images():
    """
    Delete all untagged (<none>) images
    """
    local('docker rmi $(docker images | grep "^<none>" | awk "{print $3}")')


def lint():
    """
    Run python code linter
    """
    local('docker-compose exec backend flake8 ./ --count')


def make_admin():
    """
    Create admin user for the backend
    """
    local('docker-compose exec backend python manage.py createsuperuser')


def clean_pyc():
    """
    Create admin user for the backend
    """
    local('docker-compose exec backend find . -name \'*.pyc\' -delete')


def compose():
    """
    Run docker-compose with reasonable defaults
    """
    local('docker-compose up --build --abort-on-container-exit --remove-orphans')
