import docker
import os
import shutil
import uuid

from docker.errors import APIError, ContainerError, ImageNotFound

print(__file__)
# get current directory
CURRENT_DIR = os.path.dirname(os.path.relpath(__file__))
IMAGE_NAME = 'yuqi/executor' #use the image name you created

client = docker.from_env()

# store the code in tmp folder

TEMP_BUILD_DIR="%s/tmp/" % CURRENT_DIR
# latest is the latest version of docker image
CONTAINER_NAME="%s:latest" % IMAGE_NAME

SOURCE_FILE_NAMES = {
    'java':'Example.java',
    'python':'example.py'
}

BINARY_NAMES = {
    'java':'Example',
    'python':'example.py'
}

BUILD_COMMANDS = {
    'java':'javac',
    'python':'python3'
}

EXECUTE_COMMANDS = {
    'java':'java',
    'python':'python3'
}

# load docker image to execute code
def load_image():
    try:
        client.images.get(IMAGE_NAME)
        print("Image exists locally")
    except ImageNotFound:
        # if we don't have local copy of the image, loading from docker hub
        print("Image not found locally, loading from docker hub")
        client.images.pull(IMAGE_NAME)
    except APIError:
        print("can't connect to docker")
        return

def make_dir(dir):
    try:
        os.mkdir(dir)
    except OSError:
        print("cant't create directory")
        return

def build_and_run(code,lang):
    # result we want
    result = {'build':None,'run':None,'error':None}
    # use the uuid to create unique file name for user code
    source_file_parent_dir_name = uuid.uuid4()
    source_file_host_dir = '%s/%s' % (TEMP_BUILD_DIR,source_file_parent_dir_name)
    source_file_guest_dir = '/test/%s' % source_file_parent_dir_name
    make_dir(source_file_host_dir)
    # write code in the source_file_host_dir
    with open('%s/%s'%(source_file_host_dir,SOURCE_FILE_NAMES[lang]),'w') as source_file:
        source_file.write(code)
        # build code
        try:
            client.container.run(
                image = IMAGE_NAME,
                # run this command to build the code
                command = '%s %s' %( BUILD_COMMANDS[lang], SOURCE_FILE_NAMES[lang] ),
                # bind the host dir and guest dir, 'rw' = read and write permission of guest dir
                # docker can access host dir (host dir in app is shared to docker via guest dir )
                volumns = { source_file_host_dir: { 'bind' : source_file_guest_dir, 'mode': 'rw'} },
                working_dir = source_file_guest_dir
            )
            print('source built')
            result['build']='OK'
        except ContainerError as e:
            #  fail to build, get the error message from container
            result['error'] = str(e.stderr,'utf-8')
            # remove host dir
            shutil.rmtree(source_file_host_dir)
            return result

        # execute code
        try:
            log = client.container.run(
                image = IMAGE_NAME,
                command = '%s %s' %( EXECUTE_COMMANDS[lang], BINARY_NAMES[lang] ),
                volumns = { source_file_host_dir: { 'bind' : source_file_guest_dir, 'mode': 'rw'} },
                working_dir = source_file_guest_dir
            )
            log = str(log,'utf-8')
            result['run'] = log
        except ContainerError as e:
            result['error'] = str(e.stderr,'utf-8')
            shutil.rmtree(source_file_host_dir)
            return result

        # after build and run, clean up dir
        shutil.rmtree(source_file_host_dir)
        return result
