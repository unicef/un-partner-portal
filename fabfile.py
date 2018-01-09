from __future__ import unicode_literals
from fabric.api import local


def ssh(service):
    """
    ssh into running service container
    :param service: ['backend', 'frontend', 'proxy', 'db']
    """
    assert service in ['backend', 'frontend', 'proxy', 'db'], "%s is unrecognized service"
    if service == 'frontend':
        local('docker-compose exec frontend ash')
    else:
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


def fakedata(quantity=50, clean_before=True):
    """
    Load example data from fakedata management command.
    """
    cmd = 'docker-compose exec backend python manage.py fakedata %d' % (int(quantity))
    if clean_before:
        cmd += ' --clean_before'
    local(cmd)


def reset_db():
    """
    Reset db, migrate and generate fixtures.
    Useful when changing branch with different migration.
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
    local('docker-compose exec backend python manage.py test {} --noinput'.format(test_path))


def remove_untagged_images():
    """
    Delete all untagged (<none>) images
    """
    local('docker rmi $(docker images | grep "^<none>" | awk "{print $3}")')


def pep8():
    """
    Run python code linter
    """
    local('docker-compose exec backend flake8 ./ --count')


def cloud_login():
    """
    Login into docker cloud services
    """
    local('docker login')


def cloud_setup(namespace):
    """
    Set docker cloud namespace
    """
    local('export DOCKERCLOUD_NAMESPACE={}'.format(namespace))


def cloud_list():
    """
    List docker cloud containers
    """
    local('docker-cloud container ps')


def cloud_ssh(container_uuid):
    """
    SSH into a cloud container
    """
    local('docker-cloud container exec {} /bin/bash'.format(container_uuid))
